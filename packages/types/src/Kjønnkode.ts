import stringEnum from './tsUtils';

export const KjønnkodeEnum = stringEnum({
  KVINNE: 'K',
  MANN: 'M',
  UDEFINERT: '-',
});
type Kjønnkode = typeof KjønnkodeEnum[keyof typeof KjønnkodeEnum];

export default Kjønnkode;
