import { Person } from '../frontend/src/utils/data';
import { connectToFileDB } from './db-connector';

type DBType = {
  persons: {
    [key: string]: {
      data: Person;
      editpw: string;
    };
  };
};

const DB = connectToFileDB<DBType>();

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
    return {
      firstname: 'Test',
      lastname: 'User',
      theme: {
        selectedName: 'default',
        primaryColor: '#80ffdb',
        secondaryColor: '#5390d9',
        accentColor: '#7400B8',
      },
    };
  }
}
