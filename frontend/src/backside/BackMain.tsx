import React, { useState } from 'react';
import { Key } from '@react-types/shared';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  InputProps,
  Textarea,
} from '@nextui-org/react';

function MyInput(props: InputProps) {
  return <Input className="my-4" color="primary" variant="flat" {...props} />;
}

export function BackMain() {
  const { t } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set(['']));

  return (
    <div className="bg-white w-full h-full p-4 overflow-y-auto">
      <h1>{t('Edit Profile Information')}</h1>

      {/*<MyInput label={t('Title')} />*/}
      <MyInput label={t('First name')} isRequired />
      <MyInput label={t('Last name')} isRequired />
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
          <MyInput label={t('Email')} />
          <MyInput label={t('Phone')} />
          <Textarea
            className="my-4"
            color="primary"
            variant="flat"
            label={t('Address')}
          />
        </AccordionItem>
        <AccordionItem title={t('Linked Websites')} key={'social-media'}>
          <MyInput label={t('Website')} startContent={'https://'} />
          <MyInput label={t('LinkedIn')} startContent={'linkedin.com/in/'} />
          <MyInput label={t('GitHub')} startContent={'github.com/'} />
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
      </Accordion>

      <Button className="mt-2 mb-4" color="secondary">
        Speichern
      </Button>
    </div>
  );
}
