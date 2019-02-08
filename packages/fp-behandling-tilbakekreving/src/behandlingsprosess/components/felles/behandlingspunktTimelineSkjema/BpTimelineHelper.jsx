import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';

const godkjentKlassenavn = 'godkjentPeriode';
const avvistKlassenavn = 'avvistPeriode';

export const getStatusPeriode = (resultatType) => {
  if (resultatType.kode === periodeResultatType.INNVILGET) {
    return godkjentKlassenavn;
  }
  if (resultatType.kode === periodeResultatType.MANUELL_BEHANDLING) {
    return 'undefined';
  }
  return avvistKlassenavn;
};

export const addClassNameGroupIdToPerioder = (tilbakekrevingPerioder) => {
  const perioderMedClassName = [];

  tilbakekrevingPerioder.forEach((item, index) => {
    const periodMedClassName = {
      ...item,
      id: index + 1,
      className: getStatusPeriode(item.periodeResultatType),
      hovedsoker: true,
      group: 1,
    };
    perioderMedClassName.push(periodMedClassName);
  });
  return perioderMedClassName;
};
