import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import { createSelector } from 'reselect';
import { Normaltekst } from 'nav-frontend-typografi';

import { getKodeverknavnFn, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import { InputField } from '@fpsak-frontend/form';
import {
  Image, Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';
import {
  DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import hourglassImg from '@fpsak-frontend/assets/images/hourglass.svg';
import endretUrl from '@fpsak-frontend/assets/images/endret_felt.svg';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';


import { createVisningsnavnForAktivitet } from '../util/visningsnavnHelper';
import NaturalytelsePanel from './NaturalytelsePanel';

import styles from './FastsettInntektTidsbegrenset.less';

const formName = 'BeregningForm';
const formPrefix = 'inntektField';
const {
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
} = aksjonspunktCodes;

function harPeriodeArbeidsforholdAvsluttet(periode) {
  return periode.periodeAarsaker !== null && periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET);
}

const harAksjonspunktForFastsettBgTidsbegrensetAT = (gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter !== undefined && gjeldendeAksjonspunkter !== null
  && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD);

const finnAksjonspunktForFastsettBgTidsbegrensetAT = (gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.find((ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD);

// Kombinerer perioder mellom avsluttede arbeidsforhold
const finnPerioderMedAvsluttetArbeidsforhold = (allePerioder) => {
  const perioderMellomSluttdatoForArbeidsforhold = [];
  let k = 0;
  while (k < allePerioder.length) {
    const nyPeriode = allePerioder[k];
    k += 1;
    while (k < allePerioder.length && !harPeriodeArbeidsforholdAvsluttet(allePerioder[k])) {
      k += 1;
    }
    nyPeriode.beregningsgrunnlagPeriodeTom = allePerioder[k - 1].beregningsgrunnlagPeriodeTom;
    perioderMellomSluttdatoForArbeidsforhold.push(nyPeriode);
  }
  return perioderMellomSluttdatoForArbeidsforhold;
};

// Lager en liste med FormattedMessages som skal brukes som overskrifter i tabellen
export const getTableHeaderData = createSelector(
  [(state, ownProps) => ownProps.allePerioder,
    (state, ownProps) => ownProps.aksjonspunkter],
  (allePerioder, gjeldendeAksjonspunkter) => {
    const relevantePerioder = finnPerioderMedAvsluttetArbeidsforhold(allePerioder);
    const headers = [];
    headers.push(<FormattedMessage
      id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsgiver"
      key="ArbeidsgiverTitle"
    />);
    if (harAksjonspunktForFastsettBgTidsbegrensetAT(gjeldendeAksjonspunkter)) {
      // Vi ønsker å gi saksbehandler mulighet til å endre på første inntekt og må legge til denne overskriften
      headers.push(<FormattedMessage
        id="Beregningsgrunnlag.AarsinntektPanel.Inntekt"
        key="forstePeriodeInntekt"
      />);
    }
    const copyOfList = relevantePerioder.slice(0);
    copyOfList.forEach((periode) => {
      headers.push(<FormattedMessage
        id="Beregningsgrunnlag.AarsinntektPanel.FastsattInntektPeriode"
        key={`${periode.beregningsgrunnlagPeriodeFom}Title`}
        values={{
          fom: moment(periode.beregningsgrunnlagPeriodeFom).format(DDMMYYYY_DATE_FORMAT),
          tom: periode.beregningsgrunnlagPeriodeTom ? moment(periode.beregningsgrunnlagPeriodeTom).format(DDMMYYYY_DATE_FORMAT) : '',
        }}
      />);
    });
    return headers;
  },
);

const findArbeidstakerAndeler = (periode) => periode.beregningsgrunnlagPrStatusOgAndel
  .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);

const createArbeidsforholdMapKey = (arbeidsforhold) => `${arbeidsforhold.arbeidsgiverNavn}${arbeidsforhold.arbeidsforholdId}`;

// Finner beregnetPrAar for alle andeler, basert på data fra den første perioden
const createBeregnetInntektForAlleAndeler = (perioder) => {
  const mapMedInnteker = {};
  const arbeidstakerAndeler = perioder[0].beregningsgrunnlagPrStatusOgAndel.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
  arbeidstakerAndeler.forEach((andel) => {
    mapMedInnteker[createArbeidsforholdMapKey(andel.arbeidsforhold)] = formatCurrencyNoKr(andel.beregnetPrAar);
  });
  return mapMedInnteker;
};

// Dette er objektet hver key i mappen vil ha en liste med
const createMapValueObject = () => ({
  erTidsbegrenset: true,
  isEditable: false,
  tabellInnhold: '',
  inputfieldKey: '',
});

// Initialiserer arbeidsforholdet mappet med data som skal vises uansett hva slags data vi har.
// Dette innebærer at første kolonne i raden skal inneholde andelsnavn og andre kolonne skal inneholde beregnetPrAar.
// Vi antar at alle andeler ligger i alle perioder, henter derfor kun ut andeler fra den første perioden.
const initializeMap = (perioder, getKodeverknavn) => {
  const inntektMap = createBeregnetInntektForAlleAndeler(perioder);
  const alleAndeler = findArbeidstakerAndeler(perioder[0]);
  const mapMedAndeler = {};
  alleAndeler.forEach((andel) => {
    const andelMapNavn = createArbeidsforholdMapKey(andel.arbeidsforhold);
    const mapValueMedAndelNavn = createMapValueObject();
    mapValueMedAndelNavn.tabellInnhold = createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn);
    mapValueMedAndelNavn.erTidsbegrenset = andel.erTidsbegrensetArbeidsforhold !== undefined ? andel.erTidsbegrensetArbeidsforhold : false;
    const mapValueMedBeregnetForstePeriode = createMapValueObject();
    mapValueMedBeregnetForstePeriode.erTidsbegrenset = false;
    mapValueMedBeregnetForstePeriode.tabellInnhold = inntektMap[andelMapNavn];
    mapMedAndeler[andelMapNavn] = [mapValueMedAndelNavn, mapValueMedBeregnetForstePeriode];
  });
  return mapMedAndeler;
};

// Nøkkelen til et inputfield konstrueres utifra navnet på andelen og perioden den er i samt en fast prefix
export const createInputFieldKey = (andel, periode) => {
  if (!andel.arbeidsforhold) {
    return undefined;
  }
  return `${formPrefix}_${andel.arbeidsforhold.arbeidsforholdId}_${andel.andelsnr}_${periode.beregningsgrunnlagPeriodeFom}`; // eslint-disable-line
};
// Denne mappen skal inneholde all data som trengs for å kontruere tabellen med kortvarige arbeidsforhold.
// Vi trenger å gi hvert inputfield et unikt, reproduserbart navn som kan brukes til å sette andelen i perioden til
// sin respektive overstyrte sum. Dette navnet navnet bør være basert på:
// 1. Navn på arbeidsforhold
// 2. Id på arbeidsforhold
// 3. Fom og tom på perioden arbeidsforholdet er en del av
// Vi må også ta vare på om arbeidsforholdet er tidsbegrenset eller ikke for å kunne vise dette i GUI.

export const createTableData = createSelector(
  [(state, ownProps) => ownProps.allePerioder,
    (state, ownProps) => ownProps.alleKodeverk,
    (state, ownProps) => ownProps.aksjonspunkter],
  (allePerioder, alleKodeverk, aksjonspunkter) => {
    const harAktueltAksjonspunkt = harAksjonspunktForFastsettBgTidsbegrensetAT(aksjonspunkter);
    // Vi er ikke interessert i perioder som oppstår grunnet naturalytelse
    const relevantePerioder = finnPerioderMedAvsluttetArbeidsforhold(allePerioder);
    const kopiAvPerioder = relevantePerioder.slice(0);
    const arbeidsforholdPeriodeMap = initializeMap(kopiAvPerioder, getKodeverknavnFn(alleKodeverk, kodeverkTyper));
    if (!harAktueltAksjonspunkt) {
      // Vi trenger ikke vise første periode mer enn en gang når vi ikke har aksjonspunktet, da hopper vi over den her
      kopiAvPerioder.shift();
    }
    // Etter å ha initialiser mappet med faste bokser kan vi fjerne første element fra lista, da
    // denne ikke skal være en av de redigerbare feltene i tabellen, og det er disse vi skal lage nå
    kopiAvPerioder.forEach((periode) => {
      const arbeidstakerAndeler = findArbeidstakerAndeler(periode);
      arbeidstakerAndeler.forEach((andel) => {
        const mapKey = createArbeidsforholdMapKey(andel.arbeidsforhold);
        const mapValue = arbeidsforholdPeriodeMap[mapKey];
        const newMapValue = createMapValueObject();
        if (harAktueltAksjonspunkt) {
          newMapValue.tabellInnhold = andel.overstyrtPrAar !== undefined && andel.overstyrtPrAar !== null ? formatCurrencyNoKr(andel.overstyrtPrAar) : '';
          newMapValue.erTidsbegrenset = false;
          newMapValue.isEditable = true;
          newMapValue.inputfieldKey = createInputFieldKey(andel, periode);
        } else {
          newMapValue.tabellInnhold = formatCurrencyNoKr(andel.beregnetPrAar);
          newMapValue.erTidsbegrenset = false;
          newMapValue.isEditable = false;
          newMapValue.inputfieldKey = createInputFieldKey(andel, periode);
        }
        mapValue.push(newMapValue);
        arbeidsforholdPeriodeMap[mapKey] = mapValue;
      });
    });
    return {
      arbeidsforholdPeriodeMap,
    };
  },
);

// Konstruerer oppsummeringsraden i tabellen
const createSummaryTableRow = (listOfBruttoPrPeriode) => (
  <TableRow key="bruttoPrPeriodeRad">
    <TableColumn key="bruttoTittel">
      <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.SumArbeidsinntekt" />
    </TableColumn>
    {listOfBruttoPrPeriode.map((element) => (
      <TableColumn key={element.periode}>
        <Normaltekst>{formatCurrencyNoKr(element.brutto)}</Normaltekst>
      </TableColumn>
    ))}
  </TableRow>
);

// Konstruerer radene i tabellen
const createTableRows = (tableData, readOnly, isAksjonspunktClosed, listOfBruttoPrPeriode, intl) => {
  const rows = [];
  Object.keys(tableData).forEach((val) => {
    const list = tableData[val];
    rows.push(
      <TableRow key={val}>
        {list.map((element) => {
          if (!element.isEditable) {
            return (
              <TableColumn key={`${val}_${element.tabellInnhold}_${element.inputfieldKey}`}>
                <div className={styles.posRel}>
                  <Normaltekst>{element.tabellInnhold}</Normaltekst>
                  {element.erTidsbegrenset
                && (
                <div className={styles.absoluteField}>
                  <Image
                    src={hourglassImg}
                    title={intl.formatMessage({ id: 'Beregningsgrunnlag.AarsinntektPanel.TidsbegrensetHjelpetekst' })}
                  />
                </div>
                )}
                </div>
              </TableColumn>
            );
          }
          return (
            <TableColumn key={`columnKey_${element.inputfieldKey}`} className={styles.inntektField}>
              {element.isEditable
            && (
            <div className={(isAksjonspunktClosed && readOnly) ? styles.adjustedField : undefined}>
              <InputField
                name={element.inputfieldKey}
                validate={[required]}
                readOnly={readOnly}
                parse={parseCurrencyInput}
                bredde="S"
              />
            </div>
            )}
            </TableColumn>
          );
        })}
      </TableRow>,
    );
  });
  rows.push(createSummaryTableRow(listOfBruttoPrPeriode));
  return rows;
};

/**
 * FastsettInntektTidsbegrenset
 *
 * Presentasjonskomponent. Viser beregningsgrunnlagstabellen for tidsbegrensede arbeidsforhold.
 * Ved aksjonspunkt vil tabellen ha en kolonne med input felter med en rad per
 * arbeidsgiver og en kolonne per periode som skal fastsettes.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer arbeidstaker som er tidsbegrenset.
 */
const FastsettInntektTidsbegrenset = ({
  intl,
  tableData,
  readOnly,
  isAksjonspunktClosed,
  bruttoPrPeriodeList,
  allePerioder,
  tableHeaderData,
}) => {
  if (readOnly && isAksjonspunktClosed) {
    tableHeaderData.push(<Image
      src={endretUrl}
      title={intl.formatMessage({ id: 'Behandling.EditedField' })}
    />);
  }
  return (
    <div className={styles.inntektTablePanel}>
      <Table
        headerTextCodes={tableHeaderData}
        noHover
        allowFormattedHeader
        classNameTable={styles.inntektTable}
      >
        {createTableRows(tableData.arbeidsforholdPeriodeMap, readOnly, isAksjonspunktClosed, bruttoPrPeriodeList, intl)}
      </Table>
      <NaturalytelsePanel
        allePerioder={allePerioder}
      />
    </div>
  );
};

FastsettInntektTidsbegrenset.propTypes = {
  intl: PropTypes.shape().isRequired,
  tableData: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool,
  bruttoPrPeriodeList: PropTypes.arrayOf(PropTypes.shape()),
  allePerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tableHeaderData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

FastsettInntektTidsbegrenset.defaultProps = {
  isAksjonspunktClosed: false,
  bruttoPrPeriodeList: undefined,
};

const getOppsummertBruttoInntektUtenAP = (allePerioder) => {
  const bruttoPrPeriodeList = [];
  const relevantePerioder = finnPerioderMedAvsluttetArbeidsforhold(allePerioder);

  relevantePerioder.forEach((periode) => {
    const totalBeregnetSumATAndeler = periode.beregningsgrunnlagPrStatusOgAndel
      .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
      .map((andel) => andel.beregnetPrAar)
      .reduce((a, b) => a + b);

    bruttoPrPeriodeList.push({
      brutto: totalBeregnetSumATAndeler,
      periode: `${periode.beregningsgrunnlagPeriodeFom}_${periode.beregningsgrunnlagPeriodeTom}`,
    });
  });
  return bruttoPrPeriodeList;
};


export const getIsAksjonspunktClosed = createSelector(
  [(state, ownProps) => ownProps.aksjonspunkter],
  (gjeldendeAksjonspunkter) => {
    const aksjonspunkt = finnAksjonspunktForFastsettBgTidsbegrensetAT(gjeldendeAksjonspunkter);
    return aksjonspunkt ? !isAksjonspunktOpen(aksjonspunkt.status.kode) : false;
  },
);

const mapStateToProps = (state, ownProps) => {
  const {
    allePerioder, aksjonspunkter,
    behandlingId, behandlingVersjon,
  } = ownProps;
  let bruttoPrPeriodeList = [];
  if (!harAksjonspunktForFastsettBgTidsbegrensetAT(aksjonspunkter)) {
    bruttoPrPeriodeList = getOppsummertBruttoInntektUtenAP(allePerioder);
  } else {
    const relevantePerioder = finnPerioderMedAvsluttetArbeidsforhold(allePerioder);
    const forstePeriodeATInntekt = relevantePerioder[0].beregningsgrunnlagPrStatusOgAndel
      .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER).map((andel) => andel.beregnetPrAar);
    const forstePeriodeInntekt = forstePeriodeATInntekt.reduce((a, b) => a + b);
    bruttoPrPeriodeList.push({
      brutto: forstePeriodeInntekt,
      periode:
          `beregnetInntekt_${relevantePerioder[0].beregningsgrunnlagPeriodeFom}_${relevantePerioder[0].beregningsgrunnlagPeriodeTom}`,
    });
    relevantePerioder.forEach((periode) => {
      const arbeidstakerAndeler = periode.beregningsgrunnlagPrStatusOgAndel
        .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
      const bruttoPrAndelForPeriode = arbeidstakerAndeler.map((andel) => {
        const inputFieldKey = createInputFieldKey(andel, periode);

        const fastsattInntekt = behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(
          state, [inputFieldKey],
        );
        return (fastsattInntekt === undefined || fastsattInntekt === '') ? 0 : removeSpacesFromNumber(fastsattInntekt);
      });
      const samletBruttoForPeriode = bruttoPrAndelForPeriode.reduce((a, b) => a + b);
      bruttoPrPeriodeList.push({
        brutto: samletBruttoForPeriode,
        periode: `${periode.beregningsgrunnlagPeriodeFom}_${periode.beregningsgrunnlagPeriodeTom}`,
      });
    });
  }
  return {
    tableData: createTableData(state, ownProps),
    tableHeaderData: getTableHeaderData(state, ownProps),
    isAksjonspunktClosed: getIsAksjonspunktClosed(state, ownProps),
    bruttoPrPeriodeList,
  };
};

FastsettInntektTidsbegrenset.buildInitialValues = (allePerioder) => {
  const initialValues = {};
  const relevantePerioder = finnPerioderMedAvsluttetArbeidsforhold(allePerioder);
  relevantePerioder.forEach((periode) => {
    const arbeidstakerAndeler = periode.beregningsgrunnlagPrStatusOgAndel
      .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
    arbeidstakerAndeler.forEach((andel) => {
      initialValues[createInputFieldKey(andel, periode)] = andel.overstyrtPrAar !== undefined ? formatCurrencyNoKr(andel.overstyrtPrAar) : '';
    });
  });
  return initialValues;
};

FastsettInntektTidsbegrenset.transformValues = (values, perioder) => {
  const fastsattePerioder = [];
  const relevantePerioder = finnPerioderMedAvsluttetArbeidsforhold(perioder);
  relevantePerioder.forEach((periode) => {
    const arbeidstakerAndeler = periode.beregningsgrunnlagPrStatusOgAndel
      .filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
    const fastsatteTidsbegrensedeAndeler = [];
    arbeidstakerAndeler.forEach((andel) => {
      const overstyrtInntekt = removeSpacesFromNumber(values[createInputFieldKey(andel, periode)]);
      fastsatteTidsbegrensedeAndeler.push({
        andelsnr: andel.andelsnr,
        bruttoFastsattInntekt: overstyrtInntekt,
      });
    });
    fastsattePerioder.push({
      periodeFom: periode.beregningsgrunnlagPeriodeFom,
      periodeTom: periode.beregningsgrunnlagPeriodeTom,
      fastsatteTidsbegrensedeAndeler,
    });
  });
  return fastsattePerioder;
};

export default connect(mapStateToProps)(injectIntl(FastsettInntektTidsbegrenset));
