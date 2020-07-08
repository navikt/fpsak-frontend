import React, { Component } from 'react';
import { change as reduxChange } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { createSelector } from 'reselect';
import {
  getBehandlingFormName,
  RadioGroupField, RadioOption, DatepickerField,
} from '@fpsak-frontend/form';
import { required, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import opptjeningAktivitetTyper from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';

import {
  Table, TableRow, TableColumn, PeriodLabel, EditedIcon, DateLabel,
} from '@fpsak-frontend/shared-components';
import { createVisningsnavnForAktivitet } from '../ArbeidsforholdHelper';
import beregningAktivitetPropType from './beregningAktivitetPropType';

import styles from './vurderAktiviteterTabell.less';

/**
 * Lager en unik aktivitet-ID prefiks basert på idType for en aktivitet. Man prøver å legge på
 * aktivitet.arbeidsforholdId, om den finnes.
 *
 * @param {*} aktivitet
 * @param {*} idType er enten arbeidsgiverId eller aktørIdString for en aktivitet
 */
const aktivitetFieldIdPrefiks = (aktivitet, idType) => {
  if (aktivitet.arbeidsforholdId) {
    return idType + aktivitet.arbeidsforholdId;
  }
  return idType;
};

/**
 * Felles suffiks som legges bak prefiks ved generering av aktivitetFieldIDer
 *
 * @param aktivitetPrefiks
 * @param aktivitet
 * @returns aktivitetFieldId
 */
const appendAktivitetFieldIdSuffiks = (aktivitetPrefiks, aktivitet) => aktivitetPrefiks + aktivitet.fom.replace('.', '');

/**
 * Oppretter en unik ID for en aktivitet. Denne IDen brukes for å identifisere aktiviteter, slik at man f.eks kan
 * gjøre oppslag på disse. IDen består av en prefiks som genereres ift om det finnes en arbeidsgiverId
 * eller en aktørIdString (eller ingen).
 *
 * Det legges til slutt på en felles "suffiks" på alle genererte prefikser
 *
 * @param {*} aktivitet
 */
export const lagAktivitetFieldId = (aktivitet) => {
  if (aktivitet.arbeidsgiverId || aktivitet.aktørIdString) {
    const aktivitetPrefiks = aktivitetFieldIdPrefiks(aktivitet, aktivitet.arbeidsgiverId ? aktivitet.arbeidsgiverId : aktivitet.aktørIdString);
    return appendAktivitetFieldIdSuffiks(aktivitetPrefiks, aktivitet);
  }
  return appendAktivitetFieldIdSuffiks(aktivitet.arbeidsforholdType.kode, aktivitet);
};

/**
 * Avgjør om en en aktivitet er valgbar i forhold til skjæringstidspunkt eller ift om ingen aktiviteter er i bruk
 * (og ingen øvrige betingelser som f.eks overstyring)
 *
 * @param {*} erSkjæringstidpunktLikEllerFørTom true hvis t.o.m dato for aktiviteten er lik eller etter s.t.p
 * @param {*} ingenAktiviterErBrukt true hvis ingen aktiviteter er brukt
 * @returns true hvis aktivitet er valgbar (uavhengig av overstyring)
 */
const erAktivitetValgbar = (erSkjæringstidpunktLikEllerFørTom, ingenAktiviterErBrukt) => erSkjæringstidpunktLikEllerFørTom || ingenAktiviterErBrukt;

/**
 * Denne metoden avgjør om en aktivitet skal kunne vurderes - eller ikke. Dvs om det skal kunne velges
 * om den kan benyttes eller ikke (brukes for å avgjøre om radiobuttons for en aktivitet er synlig)
 *
 * @param {*} aktivitet - aktivitet som skal vurderes brukt
 * @param {*} skalOverstyre - om overstyring er aktivert
 * @param {*} harAksjonspunkt - om behandlingen har et aksjonspunkt for avklaringen av aktiviteter
 * @param {*} erSkjæringstidpunktLikEllerFørTom - om et gjeldende skjæringstidspunkt er lik eller før t.o.m dato
 * @param {*} ingenAktiviterErBrukt - true hvis alle aktiviteter er satt til "Ikke benytt"
 */
export const skalVurdereAktivitet = (aktivitet, skalOverstyre, harAksjonspunkt, erSkjæringstidpunktLikEllerFørTom, ingenAktiviterErBrukt) => {
  if (!skalOverstyre && !harAksjonspunkt) {
    return false;
  }
  if (aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP) {
    return false;
  }
  if (skalOverstyre && erAktivitetValgbar(erSkjæringstidpunktLikEllerFørTom, ingenAktiviterErBrukt)) {
    return true;
  }
  return false;
};

const isSameOrBefore = (dato1, dato2) => moment(dato1).isSameOrBefore(moment(dato2));

const lagTableRow = (
  readOnly,
  isAksjonspunktClosed,
  aktivitet,
  alleKodeverk,
  erOverstyrt,
  harAksjonspunkt,
  tomDatoForAktivitetGruppe,
  valgtSkjæringstidspunkt,
  ingenAktiviterErBrukt,
) => {
  const erValgtSkjæringstidspunktLikEllerFørTomDato = isSameOrBefore(valgtSkjæringstidspunkt, tomDatoForAktivitetGruppe);
  return (
    <TableRow key={lagAktivitetFieldId(aktivitet)}>
      <TableColumn>
        <Normaltekst>
          {createVisningsnavnForAktivitet(aktivitet, alleKodeverk)}
        </Normaltekst>
      </TableColumn>
      <TableColumn className={styles.rowalign}>
        {!erOverstyrt
      && (
      <Normaltekst>
        <PeriodLabel dateStringFom={aktivitet.fom} dateStringTom={aktivitet.tom} />
      </Normaltekst>
      )}
        {erOverstyrt
      && (
        <>
          <DateLabel dateString={aktivitet.fom} />
          <DatepickerField
            name={`${lagAktivitetFieldId(aktivitet)}.tom`}
            validate={[required]}
            readOnly={readOnly}
          />
        </>

      )}
      </TableColumn>
      <TableColumn className={styles.radioMiddle}>
        <RadioGroupField
          name={`${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
          readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt,
            erValgtSkjæringstidspunktLikEllerFørTomDato, ingenAktiviterErBrukt)}
        >
          {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.bruk`} value />]}
        </RadioGroupField>
      </TableColumn>
      <TableColumn className={styles.radioMiddle}>
        <RadioGroupField
          name={`${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
          readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt,
            erValgtSkjæringstidspunktLikEllerFørTomDato, ingenAktiviterErBrukt)}
        >
          {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.ikkeBruk`} value={false} />]}
        </RadioGroupField>
      </TableColumn>
      {isAksjonspunktClosed && readOnly
      && (
      <TableColumn>
        {skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt,
          erValgtSkjæringstidspunktLikEllerFørTomDato, ingenAktiviterErBrukt)
          && <EditedIcon />}
      </TableColumn>
      )}
    </TableRow>
  );
};

const getHeaderTextCodes = () => ([
  'VurderAktiviteterTabell.Header.Aktivitet',
  'VurderAktiviteterTabell.Header.Periode',
  'VurderAktiviteterTabell.Header.Benytt',
  'VurderAktiviteterTabell.Header.IkkeBenytt',
]
);

const finnHeading = (aktiviteter, erOverstyrt, skjaeringstidspunkt) => {
  if (erOverstyrt) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.Overstyrt.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
    );
  }
  const harAAP = aktiviteter.some((a) => a.arbeidsforholdType && a.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP);

  const harVentelonnVartpenger = aktiviteter.some((aktivitet) => aktivitet.arbeidsforholdType
    && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.VENTELØNN_VARTPENGER);
  if (harAAP) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.FullAAPKombinert.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
    );
  }
  if (harVentelonnVartpenger) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.VentelonnVartpenger.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
    );
  }
  return null;
};

/**
 * VurderAktiviteterTabell
 *
 * Presentasjonskomponent.. Inneholder tabeller for avklaring av skjæringstidspunkt
 */
export class VurderAktiviteterTabell extends Component {
  componentDidUpdate() {
    const {
      behandlingFormName, reduxChange: reduxFieldChange, aktiviteter,
      valgtSkjæringstidspunkt, tomDatoForAktivitetGruppe, ingenAktiviterErBrukt,
    } = this.props;

    const erValgtSkjæringstidspunktLikEllerFørTomDato = isSameOrBefore(valgtSkjæringstidspunkt, tomDatoForAktivitetGruppe);
    if (!erAktivitetValgbar(erValgtSkjæringstidspunktLikEllerFørTomDato, ingenAktiviterErBrukt)) {
      aktiviteter.map((a) => `${lagAktivitetFieldId(a)}.skalBrukes`)
        .forEach((fieldName) => {
          reduxFieldChange(behandlingFormName, fieldName, true);
        });
    }
  }

  render() {
    const {
      readOnly,
      isAksjonspunktClosed,
      aktiviteter,
      alleKodeverk,
      erOverstyrt,
      harAksjonspunkt,
      tomDatoForAktivitetGruppe,
      ingenAktiviterErBrukt,
      valgtSkjæringstidspunkt,
    } = this.props;

    return (
      <>
        <Element>
          {finnHeading(aktiviteter, erOverstyrt, tomDatoForAktivitetGruppe)}
        </Element>
        <Table headerTextCodes={getHeaderTextCodes()} noHover>
          {aktiviteter.map((aktivitet) => (
            lagTableRow(readOnly, isAksjonspunktClosed, aktivitet, alleKodeverk, erOverstyrt,
              harAksjonspunkt, tomDatoForAktivitetGruppe, valgtSkjæringstidspunkt, ingenAktiviterErBrukt)
          ))}
        </Table>
      </>
    );
  }
}

VurderAktiviteterTabell.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  aktiviteter: PropTypes.arrayOf(beregningAktivitetPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  harAksjonspunkt: PropTypes.bool.isRequired,
  tomDatoForAktivitetGruppe: PropTypes.string.isRequired,
  valgtSkjæringstidspunkt: PropTypes.string.isRequired,
  ingenAktiviterErBrukt: PropTypes.bool.isRequired,
  behandlingFormName: PropTypes.string.isRequired,
  reduxChange: PropTypes.func.isRequired,
};

VurderAktiviteterTabell.validate = (values, aktiviteter) => {
  const errors = {};
  let harError = false;
  aktiviteter
    .forEach((aktivitet) => {
      const fieldId = lagAktivitetFieldId(aktivitet);
      const e = required(values[fieldId].skalBrukes);
      if (e) {
        errors[fieldId] = { skalBrukes: e };
        harError = true;
      }
    });
  if (harError) {
    return errors;
  }
  return null;
};

VurderAktiviteterTabell.transformValues = (values, aktiviteter, valgtSkjæringstidspunkt, tomDatoForAktivitetGruppe) => {
  const erValgtSkjæringstidspunktLikEllerFørTomDato = isSameOrBefore(valgtSkjæringstidspunkt, tomDatoForAktivitetGruppe);
  return aktiviteter
    .filter((aktivitet) => values[lagAktivitetFieldId(aktivitet)].skalBrukes === false || values[lagAktivitetFieldId(aktivitet)].tom != null)
    .map((aktivitet) => ({
      oppdragsgiverOrg: aktivitet.aktørIdString ? null : aktivitet.arbeidsgiverId,
      arbeidsforholdRef: aktivitet.arbeidsforholdId,
      fom: aktivitet.fom,
      tom: values[lagAktivitetFieldId(aktivitet)].tom != null ? values[lagAktivitetFieldId(aktivitet)].tom : aktivitet.tom,
      opptjeningAktivitetType: aktivitet.arbeidsforholdType ? aktivitet.arbeidsforholdType.kode : null,
      arbeidsgiverIdentifikator: aktivitet.aktørIdString ? aktivitet.aktørIdString : null,
      skalBrukes: erValgtSkjæringstidspunktLikEllerFørTomDato ? values[lagAktivitetFieldId(aktivitet)].skalBrukes : true,
    }));
};

VurderAktiviteterTabell.hasValueChangedFromInitial = (aktiviteter, values, initialValues) => {
  const changedAktiviteter = aktiviteter.map(lagAktivitetFieldId).find((fieldId) => {
    if (values[fieldId] && initialValues[fieldId]) {
      if (values[fieldId].skalBrukes !== initialValues[fieldId].skalBrukes) {
        return true;
      }
    }
    return false;
  });
  return changedAktiviteter !== undefined;
};

const skalBrukesPretufylling = (aktivitet, erOverstyrt, harAksjonspunkt, erTomLikEllerFørSkjæringstidpunkt) => {
  if (skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt, erTomLikEllerFørSkjæringstidpunkt, false)) {
    return aktivitet.skalBrukes;
  }
  return aktivitet.skalBrukes === true || aktivitet.skalBrukes === null || aktivitet.skalBrukes === undefined;
};

const mapToInitialValues = (aktivitet, alleKodeverk, erOverstyrt, harAksjonspunkt, erTomLikEllerFørSkjæringstidpunkt) => ({
  beregningAktivitetNavn: createVisningsnavnForAktivitet(aktivitet, alleKodeverk),
  fom: aktivitet.fom,
  tom: aktivitet.tom,
  skalBrukes: skalBrukesPretufylling(aktivitet, erOverstyrt, harAksjonspunkt, erTomLikEllerFørSkjæringstidpunkt),
});

VurderAktiviteterTabell.buildInitialValues = (aktiviteter, alleKodeverk, erOverstyrt, harAksjonspunkt,
  erTomLikEllerFørSkjæringstidpunkt) => {
  if (!aktiviteter) {
    return {};
  }
  const initialValues = {};
  aktiviteter.forEach((aktivitet) => {
    initialValues[lagAktivitetFieldId(aktivitet)] = mapToInitialValues(aktivitet, alleKodeverk, erOverstyrt, harAksjonspunkt,
      erTomLikEllerFørSkjæringstidpunkt);
  });
  return initialValues;
};

const getCompleteFormName = createSelector(
  [(ownProps) => ownProps.formNameAvklarAktiviteter,
    (ownProps) => ownProps.behandlingId,
    (ownProps) => ownProps.behandlingVersjon],
  (formNameAvklarAktiviteter, behandlingId, versjon) => getBehandlingFormName(behandlingId, versjon, formNameAvklarAktiviteter),
);

const mapStateToProps = (state, ownProps) => ({
  behandlingFormName: getCompleteFormName(ownProps),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxChange,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(VurderAktiviteterTabell);
