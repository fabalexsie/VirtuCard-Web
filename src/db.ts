import { Person, Template } from '../frontend/src/utils/data';
import { connectToFileDB } from './db-connector';

type DBType = {
  persons: {
    [key: string]: {
      data: Person;
      editpw: string;
    };
  };
  templates: {
    [key: string]: {
      data: Template;
      editpw: string;
    };
  };
};

const DB = connectToFileDB<DBType>();

export function createEmptyPerson(personId: string, editpw: string) {
  const newPerson: Person = {
    firstname: '',
    lastname: '',
    theme: {
      selectedName: 'default',
      primaryColor: '#80ffdb',
      secondaryColor: '#5390d9',
      accentColor: '#7400B8',
    },
  };
  DB.persons[personId] = { data: newPerson, editpw };
  return Promise.resolve(newPerson);
}

export async function updatePerson(
  personId: string,
  editpw: string,
  person: Person,
): Promise<boolean> {
  if (
    person && // Person is not empty
    (!DB.persons[personId] || // Person not existing ->, will be created
      DB.persons[personId].editpw === editpw) // editpw is correct
  ) {
    DB.persons[personId] = { data: person, editpw };
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}

export function getPerson(personId: string) {
  const personFound = DB.persons[personId];
  if (personFound) {
    return personFound.data;
  } else {
    return null;
  }
}

export function createNewDefaultTemplate(templateId: string, editpw: string) {
  const newTemplate: Template = {
    name: templateId,
    template: [
      '<h1>Hello <%= firstname %></h1>',
      '<% if (birthday) { %> birthday <%= birthday %><% } %>!',
      '<p>Some more text</p>',
      '<div>',
      '  <a href="https://<%= website %>">Website (<%= website %>)</a>',
      '  <a href="<%= linkedin %>">LinkedIn</a>',
      '</div>',
    ].join('\n'),
  };
  DB.templates[templateId] = { data: newTemplate, editpw };
  return Promise.resolve(newTemplate);
}

export async function updateTemplate(
  templateId: string,
  editpw: string,
  template: Template,
): Promise<boolean> {
  if (
    template && // Template is not empty
    (!DB.templates[templateId] || // template not existing -> will be created with pw
      DB.templates[templateId].editpw === editpw) // template exists -> check that editpw is correct
  ) {
    DB.templates[templateId] = { data: template, editpw };
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}

export function getTemplate(templateId: string) {
  const templateFound = DB.templates[templateId];
  if (templateFound) {
    return templateFound.data;
  } else {
    return null;
  }
}

export function getTemplateNames() {
  return Object.keys(DB.templates);
}
