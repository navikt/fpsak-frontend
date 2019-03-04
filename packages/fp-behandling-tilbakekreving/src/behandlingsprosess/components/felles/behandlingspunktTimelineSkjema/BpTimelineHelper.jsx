import foreldelseCodes from '../../foreldelse/foreldelseCodes';

const godkjentKlassenavn = 'godkjentPeriode';
const avvistKlassenavn = 'avvistPeriode';

export const getPeriodFeilutbetaling = (dagligUtbetalinger) => {
  let totatFeilutbetaling = 0;
  dagligUtbetalinger.forEach((dagligUtbetaling) => {
    totatFeilutbetaling += dagligUtbetaling.utbetaltBeløp;
  });

  return totatFeilutbetaling;
};

export const getResultType = item => (item.periodeResultatType ? item.periodeResultatType : item.foreldelseVurderingType);
export const getStatusPeriode = (resultatType) => {
  if (resultatType.kode === foreldelseCodes.FORELDET) {
    return avvistKlassenavn;
  }

  if (resultatType.kode === foreldelseCodes.MANUELL_BEHANDLING) {
    return 'undefined';
  }
  return godkjentKlassenavn;
};

export const addClassNameGroupIdToPerioder = (tilbakekrevingPerioder) => {
  const perioderMedClassName = [];

  tilbakekrevingPerioder.forEach((item, index) => {
    const periodMedClassName = {
      ...item,
      id: index + 1,
      foreldet: item.foreldelseVurderingType.kode,
      className: getStatusPeriode(getResultType(item)),
      hovedsoker: true,
      group: 1,
      feilutbetaling: getPeriodFeilutbetaling(item.dagligUtbetalinger),
    };
    perioderMedClassName.push(periodMedClassName);
  });
  return perioderMedClassName;
};
