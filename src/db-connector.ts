import fs from 'fs';
import path from 'path';

const dbFolder = 'db';
const allowedCollections = ['persons', 'templates'].map((c) => toValidFile(c));
const acceptNotDefinedValuesInTempDB = false;

const tempDB: { [key: string | symbol]: object } = {};

export function connectToFileDB<T extends { persons: object }>(): T {
  return new Proxy({} as T, {
    get: (target, prop) => {
      if (allowedCollections.includes(toValidFile(prop))) {
        return folderToObject(toValidFile(prop));
      } else if (acceptNotDefinedValuesInTempDB) {
        if (!(prop in tempDB)) {
          tempDB[prop] = {};
        }
        return tempDB[prop];
      } else {
        throw new Error(`Property not allowed in FileDB: ${toValidFile(prop)}`);
      }
    },
    has: (target, prop) => {
      if (allowedCollections.includes(toValidFile(prop))) {
        return true;
      }
      return prop in target;
    },
  });
}

function folderToObject(folderName: string) {
  if (!fs.existsSync(path.join(dbFolder, folderName))) {
    fs.mkdirSync(path.join(dbFolder, folderName));
  }

  const files = fs.readdirSync(path.join(dbFolder, folderName));

  return new Proxy(
    {},
    {
      has: (target, prop) => {
        return files.includes(toValidFile(prop, '.json'));
      },
      get: (target, prop) => {
        if (files.includes(toValidFile(prop, '.json'))) {
          return JSON.parse(
            fs.readFileSync(
              path.join(dbFolder, folderName, toValidFile(prop, '.json')),
              'utf8',
            ),
          );
        } else {
          return undefined;
        }
      },
      set: (target, prop, value) => {
        fs.writeFileSync(
          path.join(dbFolder, folderName, toValidFile(prop, '.json')),
          JSON.stringify(value),
        );
        return true;
      },
    },
  );
}

function toValidFile(name: string | symbol, extension?: string) {
  if (extension) {
    return name.toString().replace(/[^a-z0-9-]/gi, '_') + extension;
  } else {
    return name.toString().replace(/[^a-z0-9-]/gi, '_');
  }
}
