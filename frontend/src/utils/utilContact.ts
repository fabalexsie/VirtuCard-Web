import { Person } from './data';
import { downloadAsFile } from './util';
import vCard from 'vcf';

export function downloadVcf(personData: Person) {
  let card = new vCard();

  // Name
  card.add('n', `${personData.lastname};${personData.firstname};;;`);

  // Fullname
  card.add('fn', `${personData.firstname} ${personData.lastname}`);

  // Title
  if (personData.position) card.add('title', personData.position);

  // Tel
  if (personData.phone) card.add('tel', personData.phone, { type: 'work' });

  // Email
  if (personData.email) card.add('email', personData.email, { type: 'work' });

  // Address
  if (personData.address) card.add('adr', personData.address, { type: 'work' });

  // Website
  if (personData.website)
    card.add('url', `https://${personData.website}`, { type: 'work' });

  // LinkedIn
  if (personData.linkedin)
    card.add('url', `https://linkedin.com/in/${personData.linkedin}`, {
      type: 'linkedin',
    });
  // GitHub
  if (personData.github)
    card.add('url', `https://github.com/${personData.github}`, {
      type: 'github',
    });

  // Notes
  if (personData.notes) card.add('note', personData.notes);

  // Photo
  if (personData.portraitData) card.add('photo', personData.portraitData);

  downloadAsFile(
    `${personData.lastname}_${personData.firstname}.vcf`,
    card.toString(),
    vCard.mimeType,
  );
}
