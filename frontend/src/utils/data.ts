export type Person = {
  firstname: string;
  lastname: string;
  position?: string;
  portraitFilename?: string;
  portraitData?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  birthday?: string;
  notes?: string;
  theme: {
    selectedName: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
};

export type Template = {
  name: string;
  template: string;
};

export type NewPersonResponse = {
  personId: string;
  editpw: string;
};

export type NewTemplateResponse = {
  templateId: string;
  editpw: string;
};

export type Config = {
  newPersonsAllowed: boolean;
  newTemplatesAllowed: boolean;
};
