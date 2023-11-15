import { Person } from './data';
import { downloadAsFile } from './util';
import vCard from 'vcf';

export function downloadVcf(personData: Person) {
  // TODO: add more fields to the vCard (vcf)
  let card = new vCard();
  card.add('fn', personData.firstname);
  for (const email of [personData.email]) {
    if (email) card.add('email', email);
  }
  for (const phone of [personData.phone]) {
    if (phone) card.add('tel', phone, { type: 'work' });
  }
  // n, org, title, photo, tel, adr
  downloadAsFile(
    `${personData.firstname}.vcf`,
    card.toString(),
    vCard.mimeType,
  );
}
