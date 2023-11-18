import React, { useState, MouseEvent } from 'react';
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
  return <Input className="my-4" color="primary" variant="flat" {...props} />;
}

function MyColorInput(props: InputProps) {
  return (
    <Input
      className="my-4"
      type="color"
      labelPlacement="outside-left"
      style={{ width: '3ex', height: '3ex' }}
      {...props}
    />
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
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set(['']));

  const [firstname, setFirstname] = useState(personData.firstname);
  const [lastname, setLastname] = useState(personData.lastname);
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

  const handleSave = (_: MouseEvent<HTMLButtonElement>) => {
    submit(
      {
        firstname: firstname,
        lastname: lastname,
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
    openFrontPage();
  };

  return (
    <div className="bg-white w-full h-full p-4 overflow-y-auto">
      <h1>{t('Edit Profile Information')}</h1>

      {/*<MyInput label={t('Title')} />*/}
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
      {/*<MyInput label={t('Company name')} />*/}

      <Accordion
        variant="light"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={(selected: 'all' | Set<Key>) =>
          setSelectedKeys(
            selected === 'all' ? new Set(['social-media']) : selected,
          )
        }
      >
        <AccordionItem title={t('Contact')} key={'contact'}>
          <MyInput value={email} onValueChange={setEmail} label={t('Email')} />
          <MyInput value={phone} onValueChange={setPhone} label={t('Phone')} />
          <Textarea
            value={address}
            onValueChange={setAddress}
            className="my-4"
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
          {/*<MyInput label={t('Xing')} />*/}
          {/*<MyInput label={t('X (Twitter)')} />*/}
          {/*<MyInput label={t('Mastodon')} />*/}
          {/*<MyInput label={t('Facebook')} />*/}

          {/*<MyInput label={t('Instagram')} />*/}
          {/*<MyInput label={t('WhatsApp')} />*/}
          {/*<MyInput label={t('Telegram')} />*/}
          {/*<MyInput label={t('Signal')} />*/}
          {/*<MyInput label={t('Twitch')} />*/}
          {/*<MyInput label={t('Discord')} />*/}
          {/*<MyInput label={t('Medium')} />*/}
        </AccordionItem>
        <AccordionItem title={t('Other')} key={'other'}>
          <MyInput
            value={birthday}
            onValueChange={setBirthday}
            className="my-4"
            label={t('Birthday')}
            type="date"
            labelPlacement="outside-left"
          />
          <Textarea
            value={notes}
            onValueChange={setNotes}
            className="my-4"
            color="primary"
            variant="flat"
            label={t('Notes')}
          />
        </AccordionItem>
        <AccordionItem title={t('Theming')} key={'theming'}>
          <Autocomplete
            selectedKey={themeSelectedName}
            onSelectionChange={setThemeSelectedName}
            className="my-4"
            label={t('Layout Template')}
          >
            <AutocompleteItem key="default" value="default" color="primary">
              Default
            </AutocompleteItem>
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
