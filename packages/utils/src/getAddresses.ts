import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import landkoder from '@fpsak-frontend/kodeverk/src/landkoder';

// TODO (TOR) Flytt ut av util-folder (lag selector)

/**
 * personUtils
 *
 * Utils klasse med diverse støttefunksjoner til person komponentene
 */

const emptyIfnull = (text) => (text == null ? '' : text);

const constructAddress = (
  adresse = '',
  postnummer = '',
  poststed = '',
  land = '',
) => `${emptyIfnull(adresse)}, ${emptyIfnull(postnummer)} ${emptyIfnull(poststed)} ${emptyIfnull(land)}`;

const getAddresses = (addresses = []) => addresses.reduce((acc, address) => {
  if (address.adresseType.kode === opplysningAdresseType.UKJENT) {
    return {
      ...acc,
      [opplysningAdresseType.BOSTEDSADRESSE]: 'UKJENT',
    };
  }

  const currentAddress = [address.adresselinje1, address.adresselinje2, address.adresselinje3]
    .filter((linje) => !!linje)
    .join(', ');
  if (!currentAddress) {
    return acc;
  }

  const country = address.land !== landkoder.NORGE ? address.land : undefined;
  return {
    ...acc,
    [address.adresseType.kode]: constructAddress(
      currentAddress,
      address.postNummer,
      address.poststed,
      country,
    ).trim(),
  };
}, {});

export default getAddresses;
