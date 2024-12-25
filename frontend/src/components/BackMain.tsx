import React, { useState, MouseEvent, useEffect } from 'react';
import { Key } from '@react-types/shared';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  InputProps,
  Textarea,
} from '@nextui-org/react';
import { useSubmit } from 'react-router-dom';
import { Person } from '../utils/data';

function MyInput(props: InputProps) {
  return (
    <Input
      className="my-4 w-auto mx-1"
      color="primary"
      variant="flat"
      {...props}
    />
  );
}

function MyColorInput(props: InputProps) {
  return (
    <Input
      className="my-4 w-auto mx-1"
      type="color"
      labelPlacement="outside-left"
      style={{ width: '3ex', height: '3ex' }}
      {...props}
    />
  );
}

function MyFileInput({
  filename,
  filedata,
  setFilename,
  setFileData,
}: {
  filename?: string;
  filedata?: string;
  setFilename: (filename: string) => void;
  setFileData: (fileData: string) => void;
}) {
  const removePhoto = () => {
    setFilename('');
    setFileData('');
  };
  return (
    <div className="flex w-full items-center justify-between space-x-4 p-2 border-2 hover:border-gray-400 rounded-xl transition-colors duration-300">
      {filedata && (
        <div className="flex-shrink-0 w-10 h-10 relative group">
          <img
            className="w-full h-full rounded-full object-cover"
            src={filedata}
            alt={filename}
          />
          <div
            className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 rounded-full invisible group-hover:visible flex flex-row justify-center items-center cursor-pointer"
            onClick={removePhoto}
          >
            <img className="w-2/3" src="/delete.svg" alt="delete" />
          </div>
        </div>
      )}
      <input
        type="file"
        onChange={(ev) => {
          const file = ev.target.files?.item(0);
          if (file) {
            setFilename(file.name);
            const reader = new FileReader();
            reader.onload = () => {
              setFileData(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
      />
    </div>
  );
}

export function BackMain({
  openFrontPage,
  personData,
}: {
  openFrontPage: () => void;
  personData: Person;
}) {
  const { t } = useTranslation();
  let submit = useSubmit();
  const [selectedAccordionKeys, setSelectedAccordionKeys] = useState<Set<Key>>(
    new Set(['']),
  );
  const [availableThemes, setAvailableThemes] = useState<string[]>(['default']);

  const [firstname, setFirstname] = useState(personData.firstname);
  const [lastname, setLastname] = useState(personData.lastname);
  const [position, setPosition] = useState(personData.position);
  const [portraitFilename, setPortraitFilename] = useState(
    personData.portraitFilename,
  );
  const [portraitData, setPortraitData] = useState(personData.portraitData);
  const [email, setEmail] = useState(personData.email);
  const [phone, setPhone] = useState(personData.phone);
  const [address, setAddress] = useState(personData.address);
  const [website, setWebsite] = useState(personData.website);
  const [linkedin, setLinkedin] = useState(personData.linkedin);
  const [github, setGithub] = useState(personData.github);
  const [birthday, setBirthday] = useState(personData.birthday);
  const [notes, setNotes] = useState(personData.notes);
  const [themeSelectedName, setThemeSelectedName] = useState<Key>(
    personData.theme.selectedName,
  );
  const [themePrimaryColor, setThemePrimaryColor] = useState(
    personData.theme.primaryColor,
  );
  const [themeSecondaryColor, setThemeSecondaryColor] = useState(
    personData.theme.secondaryColor,
  );
  const [themeAccentColor, setThemeAccentColor] = useState(
    personData.theme.accentColor,
  );

  useEffect(() => {
    fetch(`/api/t/`).then(async (res) => {
      if (200 <= res.status && res.status < 300) {
        setAvailableThemes(await res.json());
      } else
        throw new Error(`No success status code (200)\n${await res.text()}`);
    });
  }, []);

  const handleSave = (_: MouseEvent<HTMLButtonElement>) => {
    submit(
      {
        firstname: firstname,
        lastname: lastname,
        position: position || '',
        portraitFilename: portraitFilename || '',
        portraitData: portraitData || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
        website: website || '',
        linkedin: linkedin || '',
        github: github || '',
        birthday: birthday || '',
        notes: notes || '',
        theme: {
          selectedName: themeSelectedName,
          primaryColor: themePrimaryColor,
          secondaryColor: themeSecondaryColor,
          accentColor: themeAccentColor,
        },
      },
      { method: 'PUT', encType: 'application/json' },
    );
    // close all sections
    setSelectedAccordionKeys(new Set(['']));
    openFrontPage();
  };

  return (
    <div className="bg-white w-full h-full text-center p-4 overflow-y-auto touch-pan-y">
      <h1>{t('Edit Profile Information')}</h1>

      <MyInput
        value={firstname}
        onValueChange={setFirstname}
        label={t('First name')}
        isRequired
      />
      <MyInput
        value={lastname}
        onValueChange={setLastname}
        label={t('Last name')}
        isRequired
      />

      <Accordion
        variant="light"
        selectionMode="multiple"
        selectedKeys={selectedAccordionKeys}
        onSelectionChange={(selected: 'all' | Set<Key>) =>
          setSelectedAccordionKeys(
            selected === 'all' ? new Set(['social-media']) : selected,
          )
        }
      >
        <AccordionItem title={t('About me')} key={'about-me'}>
          <MyFileInput
            filename={portraitFilename}
            filedata={portraitData}
            setFilename={setPortraitFilename}
            setFileData={setPortraitData}
          />
          <MyInput
            value={position}
            onValueChange={setPosition}
            label={t('Position')}
          />
        </AccordionItem>
        <AccordionItem title={t('Contact')} key={'contact'}>
          <MyInput value={email} onValueChange={setEmail} label={t('Email')} />
          <MyInput value={phone} onValueChange={setPhone} label={t('Phone')} />
          <Textarea
            value={address}
            onValueChange={setAddress}
            className="my-4  w-auto mx-1"
            color="primary"
            variant="flat"
            label={t('Address')}
          />
        </AccordionItem>
        <AccordionItem title={t('Linked Websites')} key={'social-media'}>
          <MyInput
            value={website}
            onValueChange={setWebsite}
            label={t('Website')}
            startContent={'https://'}
          />
          <MyInput
            value={linkedin}
            onValueChange={setLinkedin}
            label={t('LinkedIn')}
            startContent={'linkedin.com/in/'}
          />
          <MyInput
            value={github}
            onValueChange={setGithub}
            label={t('GitHub')}
            startContent={'github.com/'}
          />
        </AccordionItem>
        <AccordionItem title={t('Other')} key={'other'}>
          <MyInput
            value={birthday}
            onValueChange={setBirthday}
            label={t('Birthday')}
            type="date"
            labelPlacement="outside-left"
          />
          <Textarea
            value={notes}
            onValueChange={setNotes}
            className="my-4 w-auto mx-1"
            color="primary"
            variant="flat"
            label={t('Notes')}
          />
        </AccordionItem>
        <AccordionItem title={t('Theming')} key={'theming'}>
          <Autocomplete
            selectedKey={themeSelectedName}
            onSelectionChange={setThemeSelectedName}
            className="my-4 w-auto mx-1"
            label={t('Layout Template')}
          >
            {availableThemes.map((theme) => (
              <AutocompleteItem key={theme} value={theme} color="primary">
                {theme}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <MyColorInput
            label={t('Primary color')}
            value={themePrimaryColor}
            onValueChange={setThemePrimaryColor}
          />
          <MyColorInput
            label={t('Secondary color')}
            value={themeSecondaryColor}
            onValueChange={setThemeSecondaryColor}
          />
          <MyColorInput
            label={t('Accent color')}
            value={themeAccentColor}
            onValueChange={setThemeAccentColor}
          />
        </AccordionItem>
      </Accordion>

      <Button
        className="mt-2 mb-4"
        color="secondary"
        type="submit"
        onClick={handleSave}
      >
        Speichern
      </Button>
    </div>
  );
}
