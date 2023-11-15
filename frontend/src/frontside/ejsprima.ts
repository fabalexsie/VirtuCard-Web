// Thanks to skirtle: https://stackoverflow.com/a/46272001

// Begin 'ejsprima'
import * as esprima from 'esprima';

type BoolObj = { [k: string]: boolean };
type TScope = {
  lets: any;
  reads: any;
  vars: any;
  writes: any;
  globalReads?: string[];
  globalWrites?: string[];
};
type TScopeFull = {
  lets: any;
  reads: any;
  vars: any;
  writes: any;
  globalReads: string[];
  globalWrites: string[];
};

// Simple EJS compiler that throws away the HTML sections and just retains the JavaScript code
function compile(template: string) {
  // Extract the tags
  var tags = template.match(/(<%(?!%)[\s\S]*?[^%]%>)/g) || [];

  return tags
    .map(function (tag) {
      var parse = tag.match(/^(<%[=\-_#]?)([\s\S]*?)([-_]?%>)$/);

      if (!parse || parse.length <= 3) {
        throw new Error('Matching failure');
      }

      switch (parse[1]) {
        case '<%=':
        case '<%-':
          return ';(' + parse[2] + ');';
        case '<%#':
          return '';
        case '<%':
        case '<%_':
          return parse[2];
      }

      throw new Error('Assertion failure');
    })
    .join('\n');
}

// Pull out the identifiers for all 'global' reads and writes
function extractGlobals(tpl: string | esprima.Program) {
  var ast: esprima.Program;

  if (typeof tpl === 'string') {
    ast = esprima.parseScript(tpl);
  } else {
    ast = tpl;
  }

  // Uncomment this line to dump out the AST
  //console .log(JSON.stringify(ast, null, 2));

  var refs: TScopeFull[] = processAst(ast);

  var reads: BoolObj = {};
  var writes: BoolObj = {};

  refs.forEach(function (ref) {
    ref.globalReads.forEach(function (key) {
      reads[key] = true;
    });
  });

  refs.forEach(function (ref) {
    ref.globalWrites.forEach(function (key) {
      writes[key] = true;
    });
  });

  return {
    reads: Object.keys(reads),
    writes: Object.keys(writes),
  };
}

function processAst(astProgram: esprima.Program): TScopeFull[] {
  var baseScope: TScope = {
    lets: Object.create(null),
    reads: Object.create(null),
    writes: Object.create(null),

    vars: Object.assign(Object.create(null), {
      // These are all local to the rendering function
      arguments: true,
      escapeFn: true,
      include: true,
      rethrow: true,
    }),
  };

  var scopes = [baseScope];

  processNode(astProgram, baseScope);

  return scopes.map(function (scope: TScope): TScopeFull {
    scope.globalReads = Object.keys(scope.reads).filter(function (key) {
      return !scope.vars[key] && !scope.lets[key];
    });

    scope.globalWrites = Object.keys(scope.writes).filter(function (key) {
      return !scope.vars[key] && !scope.lets[key];
    });

    // Flatten out the prototype chain - none of this is actually used by extractGlobals so we could just skip it
    var allVars = Object.keys(scope.vars).concat(Object.keys(scope.lets)),
      vars: BoolObj = {},
      lets: BoolObj = {};

    // An identifier can either be a var or a let not both... need to ensure inheritance sees the right one by
    // setting the alternative to false, blocking any inherited value
    for (var key in scope.lets) {
      if (hasOwn(scope.lets)) {
        scope.vars[key] = false;
      }
    }

    for (key in scope.vars) {
      if (hasOwn(scope.vars)) {
        scope.lets[key] = false;
      }
    }

    for (key in scope.lets) {
      if (scope.lets[key]) {
        lets[key] = true;
      }
    }

    for (key in scope.vars) {
      if (scope.vars[key]) {
        vars[key] = true;
      }
    }

    scope.lets = Object.keys(lets);
    scope.vars = Object.keys(vars);
    scope.reads = Object.keys(scope.reads);

    return {
      ...scope,
      globalReads: scope.globalReads,
      globalWrites: scope.globalWrites,
    };

    function hasOwn(obj: BoolObj) {
      return obj[key] && Object.prototype.hasOwnProperty.call(obj, key);
    }
  });

  function processNode(obj: any, scope: TScope) {
    if (!obj) {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach(function (o) {
        processNode(o, scope);
      });

      return;
    }

    switch (obj.type) {
      case 'Identifier':
        scope.reads[obj.name] = true;
        return;

      case 'VariableDeclaration':
        obj.declarations.forEach(function (declaration: any) {
          // Separate scopes for var and let/const
          processLValue(
            declaration.id,
            scope,
            obj.kind === 'var' ? scope.vars : scope.lets,
          );
          processNode(declaration.init, scope);
        });

        return;

      case 'AssignmentExpression':
        processLValue(obj.left, scope, scope.writes);

        if (obj.operator !== '=') {
          processLValue(obj.left, scope, scope.reads);
        }

        processNode(obj.right, scope);

        return;

      case 'UpdateExpression':
        processLValue(obj.argument, scope, scope.reads);
        processLValue(obj.argument, scope, scope.writes);

        return;

      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        var newScope: TScope = {
          lets: Object.create(scope.lets),
          reads: Object.create(null),
          vars: Object.create(scope.vars),
          writes: Object.create(null),
        };

        scopes.push(newScope);

        obj.params.forEach(function (param: any) {
          processLValue(param, newScope, newScope.vars);
        });

        if (obj.id) {
          // For a Declaration the name is accessible outside, for an Expression it is only available inside
          if (obj.type === 'FunctionDeclaration') {
            scope.vars[obj.id.name] = true;
          } else {
            newScope.vars[obj.id.name] = true;
          }
        }

        processNode(obj.body, newScope);

        return;

      case 'BlockStatement':
      case 'CatchClause':
      case 'ForInStatement':
      case 'ForOfStatement':
      case 'ForStatement':
        // Create a new block scope
        scope = {
          lets: Object.create(scope.lets),
          reads: Object.create(null),
          vars: scope.vars,
          writes: Object.create(null),
        };

        scopes.push(scope);

        if (obj.type === 'CatchClause') {
          processLValue(obj.param, scope, scope.lets);
          processNode(obj.body, scope);

          return;
        }

        break; // Don't return
    }

    Object.keys(obj).forEach(function (key) {
      var value = obj[key];

      // Labels for break/continue
      if (key === 'label') {
        return;
      }

      if (key === 'left') {
        if (obj.type === 'ForInStatement' || obj.type === 'ForOfStatement') {
          if (obj.left.type !== 'VariableDeclaration') {
            processLValue(obj.left, scope, scope.writes);
            return;
          }
        }
      }

      if (obj.computed === false) {
        // MemberExpression, ClassExpression & Property
        if (key === 'property' || key === 'key') {
          return;
        }
      }

      if (value && typeof value === 'object') {
        processNode(value, scope);
      }
    });
  }

  // An l-value is something that can appear on the left of an = operator. It could be a simple identifier, as in
  // `var a = 7;`, or something more complicated, like a destructuring. There's a big difference between how we handle
  // `var a = 7;` and `a = 7;` and the 'target' is used to control which of these two scenarios we are in.
  function processLValue(obj: any, scope: TScope, target: any) {
    nextLValueNode(obj);

    function nextLValueNode(obj: any) {
      switch (obj.type) {
        case 'Identifier':
          target[obj.name] = true;
          break;

        case 'ObjectPattern':
          obj.properties.forEach(function (property: any) {
            if (property.computed) {
              processNode(property.key, scope);
            }

            nextLValueNode(property.value);
          });
          break;

        case 'ArrayPattern':
          obj.elements.forEach(function (element: any) {
            nextLValueNode(element);
          });
          break;

        case 'RestElement':
          nextLValueNode(obj.argument);
          break;

        case 'AssignmentPattern':
          nextLValueNode(obj.left);
          processNode(obj.right, scope);
          break;

        case 'MemberExpression':
          processNode(obj, scope);
          break;

        default:
          throw new Error('Unknown type: ' + obj.type);
      }
    }
  }
}

export function extractUsedVarsFromTemplate(template: string) {
  let jsCode = compile(template);
  return extractGlobals(jsCode);
}
