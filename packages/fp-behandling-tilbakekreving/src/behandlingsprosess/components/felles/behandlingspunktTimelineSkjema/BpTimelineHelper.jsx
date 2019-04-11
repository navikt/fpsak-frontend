import moment from 'moment';
import foreldelseCodes from '../../../foreldelseCodes';

export const GODKJENT_CLASSNAME = 'godkjentPeriode';
export const AVVIST_CLASSNAME = 'avvistPeriode';

export const getStatusPeriode = (vurderingTypeKode) => {
  if (vurderingTypeKode === foreldelseCodes.FORELDET) {
    return AVVIST_CLASSNAME;
  }

  if (vurderingTypeKode === foreldelseCodes.MANUELL_BEHANDLING) {
    return 'undefined';
  }
  return GODKJENT_CLASSNAME;
};

export const addClassNameGroupIdToPerioder = (tilbakekrevingPerioder) => {
  const perioderMedClassName = [];

  tilbakekrevingPerioder.forEach((item, index) => {
    const periodMedClassName = {
      ...item,
      id: index + 1,
      foreldet: item.foreldelseVurderingType.kode,
      className: getStatusPeriode(item.foreldelseVurderingType.kode),
      hovedsoker: true,
      group: 1,
      feilutbetaling: item.belop,
    };
    perioderMedClassName.push(periodMedClassName);
  });
  return perioderMedClassName.sort((a, b) => moment(a.fom) - moment(b.fom));
};
