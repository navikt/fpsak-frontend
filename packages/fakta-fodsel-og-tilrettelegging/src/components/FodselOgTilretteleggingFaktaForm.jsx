import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeInfo, AlertStripeFeil } from 'nav-frontend-alertstriper';

import {
  ElementWrapper, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidDate, hasValidText, maxLength, required, requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm, FaktaSubmitButton } from '@fpsak-frontend/fp-felles';

import TilretteleggingArbeidsforholdSection from './tilrettelegging/TilretteleggingArbeidsforholdSection';
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
      </FlexContainer>
      <FlexContainer>
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
          <FlexColumn className={styles.fullBredde}>
            {formProps.error && (
              <>
                <VerticalSpacer sixteenPx />
                <AlertStripeFeil>
                  <FormattedMessage id={formProps.error} />
                </AlertStripeFeil>
              </>
            )}
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn className={styles.fullBredde}>
            { arbeidsforhold.map((a) => (
              <TilretteleggingArbeidsforholdSection
                key={utledFormSectionName(a)}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                readOnly={readOnly}
                arbeidsforhold={a}
                formSectionName={utledFormSectionName(a)}
              />
            ))}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <FlexContainer>
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
      </FlexContainer>
      <FlexContainer fluid wrap>
        <FlexRow>
          <FlexColumn>
            <ElementWrapper>
              <VerticalSpacer twentyPx />
              <FaktaSubmitButton
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                formName={FODSEL_TILRETTELEGGING_FORM}
                isSubmittable={submittable && !formProps.error}
                isReadOnly={readOnly}
                hasOpenAksjonspunkter={hasOpenAksjonspunkter}
              />
            </ElementWrapper>
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
};

FodselOgTilretteleggingFaktaForm.defaultProps = {
  fødselsdato: '',
};

const transformValues = (values, arbeidsforhold) => {
  const bekreftetSvpArbeidsforholdList = [];
  arbeidsforhold.forEach((a) => { bekreftetSvpArbeidsforholdList.push(values[utledFormSectionName(a)]); });
  return ([{
    kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
    ...values,
    bekreftetSvpArbeidsforholdList,
  }]);
};

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

const getInitialArbeidsforholdValues = createSelector([
  (ownProps) => ownProps.svangerskapspengerTilrettelegging,
], (tilrettelegging) => {
  const arbeidsforhold = tilrettelegging ? tilrettelegging.arbeidsforholdListe : [];
  if (arbeidsforhold === undefined || arbeidsforhold === null) {
    return EMPTY_LIST;
  }
  const arbeidsforholdValues = [];
  arbeidsforhold.forEach((a) => { arbeidsforholdValues[utledFormSectionName(a)] = { ...a }; });
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

const getOnSubmit = createSelector([(ownProps) => ownProps.submitCallback, getArbeidsforhold],
  (submitCallback, arbeidsforhold) => (values) => submitCallback(transformValues(values, arbeidsforhold)));

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
