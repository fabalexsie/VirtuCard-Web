import { downloadAsFile } from './util';
import vCard from 'vcf';

type Contact = {
  firstname: string;
  emailList: string[];
  phoneList: Phone[];
};

type Phone = {
  no: string;
  type: 'work' | 'home' | 'work,voice' | 'home,voice' | string;
};

export function downloadVcf(contact: Contact) {
  let card = new vCard();
  card.add('fn', contact.firstname);
  for (const email of contact.emailList) {
    card.add('email', email);
  }
  for (const phone of contact.phoneList) {
    card.add('tel', phone.no, { type: phone.type });
  }
  // n, org, title, photo, tel, adr
  downloadAsFile(`${contact.firstname}.vcf`, card.toString(), vCard.mimeType);
}
