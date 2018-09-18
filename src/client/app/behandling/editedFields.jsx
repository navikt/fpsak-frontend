import soknadType from 'kodeverk/soknadType';
import { diff } from 'utils/objectUtils';

const hasValue = value => value !== null && value !== undefined;

const isNotEqual = (soknadValue, familiehendelseValue) => hasValue(familiehendelseValue) && soknadValue !== familiehendelseValue;

const getIsUtstedtDatoEdited = (soknad, familiehendelse) => isNotEqual(soknad.utstedtdato, familiehendelse.utstedtdato);

const getIsTerminDatoEdited = (soknad, familiehendelse) => isNotEqual(soknad.termindato, familiehendelse.termindato);

const getIsAntallBarnEdited = (soknad, familiehendelse) => isNotEqual(soknad.antallBarn, familiehendelse.antallBarnTermin);

const getIsVilkarTypeEdited = familiehendelse => hasValue(familiehendelse.vilkarType);

const getIsAdopsjonFodelsedatoerEdited = (soknad, familiehendelse) => diff(soknad.adopsjonFodelsedatoer, familiehendelse.adopsjonFodelsedatoer);

const getIsOmsorgsovertakelseDatoEdited = (soknad, familiehendelse) => isNotEqual(soknad.omsorgsovertakelseDato, familiehendelse.omsorgsovertakelseDato);

const getIsBarnetsAnkomstTilNorgeDatoEdited = (
  soknad, familiehendelse,
) => isNotEqual(soknad.barnetsAnkomstTilNorgeDato, familiehendelse.barnetsAnkomstTilNorgeDato);

const getIsAntallBarnOmsorgOgForeldreansvarEdited = (soknad, familiehendelse) => isNotEqual(soknad.antallBarn, familiehendelse.antallBarnTilBeregning);

const getIsFodselsdatoerEdited = (soknad, personopplysning) => {
  const soknadFodselsdatoer = soknad.soknadType.kode === soknadType.FODSEL
    ? soknad.fodselsdatoer
    : soknad.adopsjonFodelsedatoer;

  const barn = personopplysning.barnSoktFor;

  const fodselsdatoerEdited = Object.keys(soknadFodselsdatoer)
    .filter(nummer => barn.some(b => `${b.nummer}` === nummer))
    .map(nummer => [nummer, barn.find(b => `${b.nummer}` === nummer)])
    .map(([nummer, funnetBarn]) => ({ [nummer]: funnetBarn.fodselsdato !== soknadFodselsdatoer[nummer] }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  return fodselsdatoerEdited;
};

const getIsEktefellesBarnEdited = familiehendelse => hasValue(familiehendelse.ektefellesBarn);

const getIsMannAdoptererAleneEdited = familiehendelse => hasValue(familiehendelse.mannAdoptererAlene);

const getIsDokumentasjonForeliggerEdited = familiehendelse => hasValue(familiehendelse.dokumentasjonForeligger);

const isFieldEdited = (soknad = {}, familiehendelse = {}, personopplysning = {}) => ({
  termindato: getIsTerminDatoEdited(soknad, familiehendelse),
  antallBarn: getIsAntallBarnEdited(soknad, familiehendelse),
  utstedtdato: getIsUtstedtDatoEdited(soknad, familiehendelse),
  adopsjonFodelsedatoer: getIsAdopsjonFodelsedatoerEdited(soknad, familiehendelse),
  omsorgsovertakelseDato: getIsOmsorgsovertakelseDatoEdited(soknad, familiehendelse),
  barnetsAnkomstTilNorgeDato: getIsBarnetsAnkomstTilNorgeDatoEdited(soknad, familiehendelse),
  antallBarnOmsorgOgForeldreansvar: getIsAntallBarnOmsorgOgForeldreansvarEdited(soknad, familiehendelse),
  fodselsdatoer: getIsFodselsdatoerEdited(soknad, personopplysning),
  vilkarType: getIsVilkarTypeEdited(familiehendelse),
  ektefellesBarn: getIsEktefellesBarnEdited(familiehendelse),
  mannAdoptererAlene: getIsMannAdoptererAleneEdited(familiehendelse),
  dokumentasjonForeligger: getIsDokumentasjonForeliggerEdited(familiehendelse),
});

export default isFieldEdited;
