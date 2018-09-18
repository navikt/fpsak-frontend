import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import historikkBegrunnelseTypeCodes from 'kodeverk/historikkBegrunnelseTypeCodes';
import historikkResultatTypeCodes from 'kodeverk/historikkResultatTypeCodes';
import historikkAarsakTypeCodes from 'kodeverk/historikkAarsakTypeCodes';
import historikkEndretFeltVerdiTypeCodes from 'kodeverk/historikkEndretFeltVerdiTypeCodes';
import historikkEndretFeltTypeCodes from 'kodeverk/historikkEndretFeltTypeCodes';
import historikkOpplysningTypeCodes from 'kodeverk/historikkOpplysningTypeCodes';
import historikkSoeknadsperiodeTypeCodes from 'kodeverk/historikkSoeknadsperiodeTypeCodes';
import skjermlenkeCodes from 'kodeverk/skjermlenkeCodes';

export const findIdForOpplysningCode = (opplysning) => {
  if (!opplysning) {
    return null;
  }
  const typeKode = opplysning.opplysningType.kode;
  const opplysningCode = historikkOpplysningTypeCodes[typeKode];
  if (!opplysningCode) {
    return (`OpplysningTypeCode ${typeKode} finnes ikke-LEGG DET INN`);
  }
  return opplysningCode.feltId;
};

export const findIdForSoeknadsperiodeCode = (soeknadsperiode) => {
  if (!soeknadsperiode) {
    return null;
  }
  const typeKode = soeknadsperiode.soeknadsperiodeType.kode;
  const soeknadsperiodeCode = historikkSoeknadsperiodeTypeCodes[typeKode];
  if (!soeknadsperiodeCode) {
    return (`SoeknadsperiodeTypeCode ${typeKode} finnes ikke-LEGG DET INN`);
  }
  return soeknadsperiodeCode.feltId;
};

export const findAarsakText = (aarsak, intl) => {
  if (!aarsak) {
    return null;
  }
  const aarsakCode = historikkAarsakTypeCodes[aarsak];
  if (!aarsakCode) {
    return (`AarsakTypeCode ${aarsak} finnes ikke-LEGG DET INN`);
  }
  const fieldId = aarsakCode.feltId;
  return intl.formatMessage({ id: fieldId });
};

export const findResultatText = (resultat, intl) => {
  if (!resultat) {
    return null;
  }
  const resultatCode = historikkResultatTypeCodes[resultat];
  if (!resultatCode) {
    return (`ResultatTypeCode ${resultat} finnes ikke-LEGG DET INN`);
  }
  const fieldId = resultatCode.feltId;
  return intl.formatMessage({ id: fieldId });
};

export const findBegrunnelseTekst = (begrunnelse, intl) => {
  const begrunnelseType = historikkBegrunnelseTypeCodes[begrunnelse];
  if (!begrunnelseType) {
    return decodeHtmlEntity(begrunnelse);
  }
  return intl.formatMessage({ id: begrunnelseType.feltId });
};

export const findHendelseText = (hendelse) => {
  if (!hendelse) {
    return undefined;
  }
  if (hendelse.verdi === null) {
    return hendelse.navn.navn;
  }
  return `${hendelse.navn.navn} ${hendelse.verdi}`;
};

const convertToBoolean = verdi => (verdi === true ? 'Ja' : 'Nei');

export const findEndretFeltVerdi = (endretFelt, verdi, intl) => {
  if (verdi === null) {
    return null;
  }
  if (typeof (verdi) === 'boolean') {
    return convertToBoolean(verdi);
  }
  if (endretFelt.klTilVerdi !== null) {
    const verdiCode = historikkEndretFeltVerdiTypeCodes[verdi];
    if (!verdiCode) {
      return (`EndretFeltVerdiTypeCode ${verdi} finnes ikke-LEGG DET INN`);
    }
    return intl.formatMessage({ id: verdiCode.verdiId });
  }
  return verdi;
};

export const findEndretFeltNavn = (endretFelt, intl) => {
  const { formatHTMLMessage } = intl;
  const navnCode = endretFelt.endretFeltNavn.kode;
  const endretFeltNavnType = historikkEndretFeltTypeCodes[navnCode];
  if (!endretFeltNavnType) {
    return (`EndretFeltTypeCode ${navnCode} finnes ikke-LEGG DET INN`);
  }
  const fieldId = endretFeltNavnType.feltId;
  return endretFelt.navnVerdi !== null ? formatHTMLMessage({ id: fieldId }, { value: endretFelt.navnVerdi }) : formatHTMLMessage({ id: fieldId });
};

export const findSkjermlenkeText = (skjermlenke, intl) => {
  const skermlenkeCode = skjermlenke.kode;
  const skjermlenkeType = skjermlenkeCodes[skermlenkeCode];
  if (!skjermlenkeType) {
    return (`SkjermlenkeCode ${skermlenkeCode} finnes ikke-LEGG DET INN`);
  }
  return intl.formatMessage({ id: skjermlenkeType.skjermlenkeId });
};
