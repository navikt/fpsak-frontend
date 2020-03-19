import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeInfo, AlertStripeFeil } from 'nav-frontend-alertstriper';

import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer, AvsnittSkiller,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField, behandlingForm } from '@fpsak-frontend/form';
import {
  hasValidDate, hasValidText, maxLength, required, requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaSubmitButton } from '@fpsak-frontend/fakta-felles';

import TilretteleggingArbeidsforholdSection from './tilrettelegging/TilretteleggingArbeidsforholdSection';
import { finnDekningsgradForDelvisTilrettelegging } from './tilrettelegging/TilretteleggingFieldArray';
import arbeidsforholdPropType from '../propTypes/arbeidsforholdPropType';
import iayArbeidsforholdPropType from '../propTypes/iayArbeidsforholdPropType';

import styles from './fodselOgTilretteleggingFaktaForm.less';

const FODSEL_TILRETTELEGGING_FORM = 'FodselOgTilretteleggingForm';
const maxLength1500 = maxLength(1500);
const EMPTY_LIST = [];
const getAksjonspunkt = (aksjonspunkter) => aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FODSELTILRETTELEGGING)[0].begrunnelse;

const utledFormSectionName = (arbeidsforhold) => {
  let navn = arbeidsforhold.arbeidsgiverNavn.replace(new RegExp(/\./, 'g'), '_');
  if (arbeidsforhold.arbeidsgiverIdent) {
    navn += arbeidsforhold.arbeidsgiverIdent;
  }
  if (arbeidsforhold.internArbeidsforholdReferanse) {
    navn += arbeidsforhold.internArbeidsforholdReferanse;
  }
  return navn;
};

const erInnenforIntervall = (tilretteleggingBehovFom, fomDato, tomDato) => {
  const dato = moment(tilretteleggingBehovFom);
  return !(dato.isBefore(moment(fomDato)) || dato.isAfter(moment(tomDato)));
};

const skalViseInfoAlert = (iayArbeidsforhold, tilretteleggingArbeidsforhold) => !tilretteleggingArbeidsforhold
  .filter((ta) => ta.arbeidsgiverIdent)
  .every((ta) => iayArbeidsforhold.some((ia) => ta.arbeidsgiverIdent === ia.arbeidsgiverIdentifikator
    && erInnenforIntervall(ta.tilretteleggingBehovFom, ia.fomDato, ia.tomDato)));

/**
 * Svangerskapspenger
 * Presentasjonskomponent - viser tillrettlegging før svangerskapspenger
 */
export const FodselOgTilretteleggingFaktaForm = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  hasOpenAksjonspunkter,
  fødselsdato,
  submittable,
  arbeidsforhold,
  iayArbeidsforhold,
  erOverstyrer,
  ...formProps
}) => {
  const visInfoAlert = useMemo(() => skalViseInfoAlert(iayArbeidsforhold, arbeidsforhold), [behandlingVersjon]);

  return (
    <form onSubmit={formProps.handleSubmit}>
      <FlexContainer fluid wrap>
        <FlexRow>
          <FlexColumn>
            <DatepickerField
              name="termindato"
              label={{ id: 'FodselOgTilretteleggingFaktaForm.Termindato' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
          </FlexColumn>
          { fødselsdato && (
          <FlexColumn>
            <DatepickerField
              name="fødselsdato"
              label={{ id: 'FodselOgTilretteleggingFaktaForm.Fodselsdato' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
          </FlexColumn>
          )}
        </FlexRow>
        <VerticalSpacer sixteenPx />
        <FlexRow>
          <FlexColumn>
            <VerticalSpacer eightPx />
            <Normaltekst className={styles.arbeidsforholdTittel}>
              <FormattedMessage id="FodselOgTilretteleggingFaktaForm.ArbeidsforholdDetErSoktTilretteleggingFor" />
            </Normaltekst>
          </FlexColumn>
        </FlexRow>
        {visInfoAlert && (
          <FlexRow>
            <FlexColumn className={styles.fullBredde}>
              <VerticalSpacer eightPx />
              <AlertStripeInfo className={styles.info}>
                <FormattedMessage id="FodselOgTilretteleggingFaktaForm.UndersokNarmere" />
              </AlertStripeInfo>
            </FlexColumn>
          </FlexRow>
        )}
        <FlexRow>
          {formProps.error && (
            <FlexColumn className={styles.fullBredde}>
              <VerticalSpacer sixteenPx />
              <AlertStripeFeil>
                <FormattedMessage id={formProps.error} />
              </AlertStripeFeil>
            </FlexColumn>
          )}
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            {arbeidsforhold.map((a, index) => {
              const af = iayArbeidsforhold.find((iaya) => iaya.arbeidsgiverIdentifikator === a.arbeidsgiverIdent);
              return (
                <React.Fragment key={utledFormSectionName(a)}>
                  <VerticalSpacer sixteenPx />
                  <AvsnittSkiller />
                  <VerticalSpacer twentyPx />
                  <TilretteleggingArbeidsforholdSection
                    key={utledFormSectionName(a)}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    readOnly={readOnly}
                    arbeidsforhold={a}
                    formSectionName={utledFormSectionName(a)}
                    erOverstyrer={erOverstyrer}
                    changeField={formProps.change}
                    stillingsprosentArbeidsforhold={af ? af.stillingsprosent : undefined}
                  />
                  {index === arbeidsforhold.length - 1 && (
                    <AvsnittSkiller />
                  )}
                </React.Fragment>
              );
            })}
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer sixteenPx />
        <FlexRow>
          <FlexColumn className={styles.halvBredde}>
            <VerticalSpacer eightPx />
            <TextAreaField
              name="begrunnelse"
              label={{ id: 'FodselOgTilretteleggingFaktaForm.BegrunnEndringene' }}
              validate={[requiredIfNotPristine, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
            />
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer twentyPx />
        <FlexRow>
          <FlexColumn>
            <FaktaSubmitButton
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              formName={FODSEL_TILRETTELEGGING_FORM}
              isSubmittable={submittable && !formProps.error}
              isReadOnly={readOnly}
              hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </form>
  );
};

FodselOgTilretteleggingFaktaForm.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  fødselsdato: PropTypes.string,
  submittable: PropTypes.bool.isRequired,
  arbeidsforhold: PropTypes.arrayOf(arbeidsforholdPropType).isRequired,
  iayArbeidsforhold: PropTypes.arrayOf(iayArbeidsforholdPropType).isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
};

FodselOgTilretteleggingFaktaForm.defaultProps = {
  fødselsdato: '',
};

const finnOverstyrtUtbetalingsgrad = (type, stillingsprosent, stillingsprosentArbeidsforhold, overstyrtUtbetalingsgrad, oldOverstyrtUtbetalingsgrad) => {
  if (oldOverstyrtUtbetalingsgrad || type.kode === tilretteleggingType.HEL_TILRETTELEGGING) {
    return overstyrtUtbetalingsgrad;
  }

  let erLikOverstyrtVerdi = type.kode === tilretteleggingType.INGEN_TILRETTELEGGING && parseFloat(overstyrtUtbetalingsgrad) === 100;
  if (type.kode === tilretteleggingType.DELVIS_TILRETTELEGGING) {
    erLikOverstyrtVerdi = parseFloat(overstyrtUtbetalingsgrad) === parseFloat(finnDekningsgradForDelvisTilrettelegging(
      stillingsprosent, stillingsprosentArbeidsforhold,
    ));
  }

  if (erLikOverstyrtVerdi) {
    return undefined;
  }
  return overstyrtUtbetalingsgrad;
};

const transformValues = (values, iayArbeidsforhold, arbeidsforhold) => ([{
  kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
  ...values,
  bekreftetSvpArbeidsforholdList: arbeidsforhold.map((a) => {
    const value = values[utledFormSectionName(a)];
    const af = iayArbeidsforhold.find((iaya) => iaya.arbeidsgiverIdentifikator === a.arbeidsgiverIdent);
    const stillingsprosentArbeidsforhold = af ? af.stillingsprosent : undefined;
    return {
      ...value,
      tilretteleggingDatoer: value.tilretteleggingDatoer.map((t) => ({
        fom: t.fom,
        type: t.type,
        stillingsprosent: t.stillingsprosent,
        overstyrtUtbetalingsgrad: finnOverstyrtUtbetalingsgrad(t.type, t.stillingsprosent, stillingsprosentArbeidsforhold,
          t.overstyrtUtbetalingsgrad, t.oldOverstyrtUtbetalingsgrad),
      })),
    };
  }),
}]);

const finnAntallDatoerMappedByDato = (datoer) => datoer.reduce((acc, dato) => ({
  ...acc,
  [dato]: (acc[dato] || 0) + 1,
}), {});

export const validateForm = (values, arbeidsforhold) => {
  let errors = {};
  if (Object.keys(values).length === 0) {
    return errors;
  }
  const formSectionNames = arbeidsforhold.map((a) => utledFormSectionName(a));
  const validerArbeidsforholdList = formSectionNames.map((name) => values[name]);
  const ingenTilretteleggingSkalBrukes = validerArbeidsforholdList.every((a) => (a.skalBrukes === false));
  if (ingenTilretteleggingSkalBrukes) {
    // eslint-disable-next-line no-underscore-dangle
    errors._error = 'FodselOgTilretteleggingFaktaForm.MinstEnTilretteleggingMåBrukes';
  }

  const { termindato } = values;
  Object.keys(values)
    .filter((key) => formSectionNames.includes(key))
    .filter((key) => values[key].skalBrukes)
    .forEach((key) => {
      if (!moment(termindato).isAfter(moment(values[key].tilretteleggingBehovFom))) {
        errors[key] = {
          tilretteleggingBehovFom: [{ id: 'FodselOgTilretteleggingFaktaForm.TermindatoForDato' }],
        };
        errors = {
          ...errors,
          termindato: [{ id: 'FodselOgTilretteleggingFaktaForm.TermindatoForDato' }],
        };
      }
    });

  Object.keys(values)
    .filter((key) => formSectionNames.includes(key))
    .forEach((key) => {
      const td = values[key].tilretteleggingDatoer;
      const antallMappedByDato = finnAntallDatoerMappedByDato(td.map((d) => d.fom));
      const harDuplikat = Object.keys(antallMappedByDato).some((k) => antallMappedByDato[k] > 1);
      if (harDuplikat) {
        const tilretteleggingDatoerErrors = td
          .reduce((acc, t) => (antallMappedByDato[t.fom] > 1
            ? acc.concat({ fom: [{ id: 'FodselOgTilretteleggingFaktaForm.DuplikateDatoer' }] }) : acc.concat({})), []);
        errors[key] = {
          tilretteleggingDatoer: tilretteleggingDatoerErrors,
        };
      }
    });

  return errors;
};

const getArbeidsforhold = createSelector([
  (ownProps) => ownProps.svangerskapspengerTilrettelegging], (tilrettelegging) => {
  const arbeidsforhold = tilrettelegging ? tilrettelegging.arbeidsforholdListe : [];
  if (arbeidsforhold === undefined || arbeidsforhold === null) {
    return EMPTY_LIST;
  }
  arbeidsforhold.sort((a, b) => a.arbeidsgiverNavn.localeCompare(b.arbeidsgiverNavn));
  return arbeidsforhold;
});

const utledUtbetalingsgrad = (tilretteleggingsdato, stillingsprosentArbeidsforhold) => {
  if (tilretteleggingsdato.type.kode === tilretteleggingType.HEL_TILRETTELEGGING) {
    return null;
  }
  if (tilretteleggingsdato.overstyrtUtbetalingsgrad) {
    return tilretteleggingsdato.overstyrtUtbetalingsgrad;
  }
  return tilretteleggingsdato.type.kode === tilretteleggingType.INGEN_TILRETTELEGGING ? 100
    : finnDekningsgradForDelvisTilrettelegging(tilretteleggingsdato.stillingsprosent, stillingsprosentArbeidsforhold);
};

const getInitialArbeidsforholdValues = createSelector([
  (ownProps) => ownProps.svangerskapspengerTilrettelegging,
  (ownProps) => ownProps.iayArbeidsforhold,
], (tilrettelegging, iayArbeidsforhold) => {
  const arbeidsforhold = tilrettelegging ? tilrettelegging.arbeidsforholdListe : [];
  if (arbeidsforhold === undefined || arbeidsforhold === null) {
    return EMPTY_LIST;
  }
  const arbeidsforholdValues = [];
  arbeidsforhold.forEach((a) => {
    const af = iayArbeidsforhold.find((iaya) => iaya.arbeidsgiverIdentifikator === a.arbeidsgiverIdent);
    arbeidsforholdValues[utledFormSectionName(a)] = {
      ...a,
      tilretteleggingDatoer: a.tilretteleggingDatoer.map((tilretteleggingsdato) => ({
        ...tilretteleggingsdato,
        oldOverstyrtUtbetalingsgrad: tilretteleggingsdato.overstyrtUtbetalingsgrad,
        overstyrtUtbetalingsgrad: utledUtbetalingsgrad(tilretteleggingsdato, af.stillingsprosent),
      })),
    };
  });
  return arbeidsforholdValues;
});

const getFødselsdato = createSelector([
  (ownProps) => ownProps.svangerskapspengerTilrettelegging,
], (tilrettelegging) => (tilrettelegging ? tilrettelegging.fødselsdato : ''));

const getInitialValues = createSelector(
  [(ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.svangerskapspengerTilrettelegging,
    getInitialArbeidsforholdValues,
    getFødselsdato],
  (aksjonspunkter, tilrettelegging, arbeidsforholdValues, fødselsdato) => ({
    termindato: tilrettelegging ? tilrettelegging.termindato : '',
    fødselsdato,
    begrunnelse: getAksjonspunkt(aksjonspunkter),
    ...arbeidsforholdValues,
  }),
);

const getOnSubmit = createSelector([
  (ownProps) => ownProps.submitCallback,
  (ownProps) => ownProps.iayArbeidsforhold,
  getArbeidsforhold,
],
(submitCallback, iayArbeidsforhold, arbeidsforhold) => (values) => submitCallback(transformValues(values, iayArbeidsforhold, arbeidsforhold)));

const getValidate = createSelector([getArbeidsforhold], (arbeidsforhold) => (values) => validateForm(values, arbeidsforhold));

const mapStateToProps = (state, ownProps) => ({
  initialValues: getInitialValues(ownProps),
  fødselsdato: getFødselsdato(ownProps),
  arbeidsforhold: getArbeidsforhold(ownProps),
  validate: getValidate(ownProps),
  onSubmit: getOnSubmit(ownProps),
});

export default connect(mapStateToProps)(behandlingForm({
  form: FODSEL_TILRETTELEGGING_FORM,
})(FodselOgTilretteleggingFaktaForm));
