import moment from 'moment';

import foreldelseVurderingType from 'behandlingTilbakekreving/src/kodeverk/foreldelseVurderingType';

export const GODKJENT_CLASSNAME = 'godkjentPeriode';
export const AVVIST_CLASSNAME = 'avvistPeriode';

export const getStatusPeriode = (vurderingTypeKode) => {
  if (vurderingTypeKode === foreldelseVurderingType.FORELDET) {
    return AVVIST_CLASSNAME;
  }

  if (vurderingTypeKode === foreldelseVurderingType.UDEFINERT) {
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
