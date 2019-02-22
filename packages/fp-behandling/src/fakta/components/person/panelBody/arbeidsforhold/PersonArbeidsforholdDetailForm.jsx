import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import BehandlingFormFieldCleaner from 'behandlingFpsak/src/BehandlingFormFieldCleaner';
import {
  behandlingForm, behandlingFormValueSelector, isBehandlingFormDirty, getBehandlingFormValues, getBehandlingFormInitialValues,
}
  from 'behandlingFpsak/src/behandlingForm';
import { hasValidText, maxLength, required } from '@fpsak-frontend/utils';
import {
  InputField, RadioGroupField, RadioOption, TextAreaField,
} from '@fpsak-frontend/form';
import {
  ElementWrapper, VerticalSpacer, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import handlingTyper from '@fpsak-frontend/kodeverk/src/handlingTyper';
import PersonAksjonspunktText from './PersonAksjonspunktText';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';
import ArbeidsforholdAktivTomDatoPickerPanel from './ArbeidsforholdAktivTomDatoPickerPanel';

// ----------------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------------

export const PERSON_ARBEIDSFORHOLD_DETAIL_FORM = 'PersonArbeidsforholdDetailForm';

// TODO (TOR) Bør heller senda med boolsk indikator fra backend enn å ha hardkoda streng her
const AA_REGISTERET = 'aa-registeret';
const maxLength400 = maxLength(400);

// ----------------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------------

const isKildeAaRegisteret = arbeidsforhold => arbeidsforhold.kilde && arbeidsforhold.kilde.navn.toLowerCase() === AA_REGISTERET;

const showNyttOrErstattPanel = (
  skalBrukeUendretForhold, vurderOmSkalErstattes, harErstattetEttEllerFlere,
) => skalBrukeUendretForhold && vurderOmSkalErstattes && !harErstattetEttEllerFlere;

const skalKunneOverstyreArbeidsforholdTomDato = (hasReceivedInntekstmelding, arbeidsforhold) => {
  const erLopende = arbeidsforhold.tomDato === null || arbeidsforhold.tomDato === undefined;
  return (isKildeAaRegisteret(arbeidsforhold) && erLopende && !hasReceivedInntekstmelding)
    || (arbeidsforhold.handlingType && arbeidsforhold.handlingType.kode === handlingTyper.BRUK_MED_OVERSTYRT_PERIODE);
};

// ----------------------------------------------------------------------------------
// Component: PersonArbeidsforholdDetailForm
// ----------------------------------------------------------------------------------
/**
 * PersonArbeidsforholdDetailForm
 */
export const PersonArbeidsforholdDetailForm = ({
  intl,
  cancelArbeidsforhold,
  isErstattArbeidsforhold,
  hasReceivedInntektsmelding,
  harErstattetEttEllerFlere,
  readOnly,
  showBegrunnelse,
  vurderOmSkalErstattes,
  kanFortsetteBehandlingForAktivtArbeidsforhodUtenIM,
  arbeidsforhold,
  skalBrukeUendretForhold,
  ...formProps
}) => (
  <ElementWrapper>
    <Element><FormattedMessage id="PersonArbeidsforholdDetailForm.Header" /></Element>
    <PersonAksjonspunktText arbeidsforhold={arbeidsforhold} />
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="5">
        <InputField
          name="beskrivelse"
          label={{ id: 'PersonArbeidsforholdDetailForm.Arbeidsgiver' }}
          bredde="XL"
          readOnly
        />
        <BehandlingFormFieldCleaner
          formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
          fieldNames={['fortsettUtenImAktivtArbeidsforhold', 'overstyrtTom']}
        >
          <RadioGroupField
            name="brukUendretArbeidsforhold"
            validate={[required]}
            direction="vertical"
            readOnly={readOnly}
          >
            <RadioOption
              label={intl.formatMessage({ id: 'PersonArbeidsforholdDetailForm.BrukArbeidsforholdet' })}
              value
              manualHideChildren
            >
              {skalBrukeUendretForhold && !hasReceivedInntektsmelding
              && (
              <Row>
                <Column xs="1" />
                <Column xs="11">
                  <RadioGroupField
                    name="fortsettUtenImAktivtArbeidsforhold"
                    validate={[required]}
                    direction="vertical"
                    readOnly={readOnly}
                  >
                    <RadioOption
                      label={intl.formatMessage({ id: 'PersonArbeidsforholdDetailForm.IkkeMottatt' })}
                      value={false}
                    />
                    <RadioOption
                      label={intl.formatMessage({ id: 'PersonArbeidsforholdDetailForm.FortsettBehandling' })}
                      value
                      disabled={!kanFortsetteBehandlingForAktivtArbeidsforhodUtenIM}
                    />
                  </RadioGroupField>
                </Column>
              </Row>
              )}
            </RadioOption>
            { skalKunneOverstyreArbeidsforholdTomDato(hasReceivedInntektsmelding, arbeidsforhold) && (
            <RadioOption
              label={intl.formatMessage({ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt' })}
              value={false}
            >
              <ArbeidsforholdAktivTomDatoPickerPanel
                readOnly={readOnly}
                fomDato={arbeidsforhold.fomDato}
              />
            </RadioOption>
            )}
            { !skalKunneOverstyreArbeidsforholdTomDato(hasReceivedInntektsmelding, arbeidsforhold) && (
            <RadioOption
              label={intl.formatMessage({ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdIkkeRelevant' })}
              value={false}
              disabled={isKildeAaRegisteret(arbeidsforhold)}
            />
            )}
          </RadioGroupField>
        </BehandlingFormFieldCleaner>
        <VerticalSpacer twentyPx />
        <BehandlingFormFieldCleaner formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM} fieldNames={['begrunnelse']}>
          {showBegrunnelse
          && (
          <TextAreaField
            name="begrunnelse"
            label={intl.formatMessage({ id: 'PersonArbeidsforholdDetailForm.Begrunnelse' })}
            validate={[required, maxLength400, hasValidText]}
            maxLength={400}
            readOnly={readOnly}
          />
          )}
        </BehandlingFormFieldCleaner>
        { (formProps.initialValues.tilVurdering || formProps.initialValues.erEndret)
        && (
        <FlexContainer fluid>
          <FlexRow>
            <FlexColumn>
              <Hovedknapp mini spinner={false} onClick={formProps.handleSubmit} disabled={formProps.pristine || readOnly}>
                <FormattedMessage id="PersonArbeidsforholdDetailForm.Oppdater" />
              </Hovedknapp>
            </FlexColumn>
            <FlexColumn>
              <Knapp mini htmlType="button" onClick={cancelArbeidsforhold} disabled={readOnly}>
                <FormattedMessage id="PersonArbeidsforholdDetailForm.Avbryt" />
              </Knapp>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        )}
      </Column>
      <Column xs="6">
        <PersonNyttEllerErstattArbeidsforholdPanel
          readOnly={readOnly}
          isErstattArbeidsforhold={isErstattArbeidsforhold}
          arbeidsforholdList={formProps.initialValues.replaceOptions}
          showContent={showNyttOrErstattPanel(skalBrukeUendretForhold, vurderOmSkalErstattes, harErstattetEttEllerFlere)}
          formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
        />
        { skalBrukeUendretForhold && harErstattetEttEllerFlere
          && (
          <Normaltekst>
            <FormattedMessage id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod" />
          </Normaltekst>
          )
        }
      </Column>
    </Row>
  </ElementWrapper>
);

PersonArbeidsforholdDetailForm.propTypes = {
  intl: intlShape.isRequired,
  cancelArbeidsforhold: PropTypes.func.isRequired,
  isErstattArbeidsforhold: PropTypes.bool.isRequired,
  hasReceivedInntektsmelding: PropTypes.bool.isRequired,
  vurderOmSkalErstattes: PropTypes.bool.isRequired,
  harErstattetEttEllerFlere: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  kanFortsetteBehandlingForAktivtArbeidsforhodUtenIM: PropTypes.bool.isRequired,
  arbeidsforhold: arbeidsforholdPropType.isRequired,
  skalBrukeUendretForhold: PropTypes.bool.isRequired,
  ...formPropTypes,
};

PersonArbeidsforholdDetailForm.defaultProps = {
  harErstattetEttEllerFlere: false,
};

export const showBegrunnelse = createSelector(
  [
    isBehandlingFormDirty(PERSON_ARBEIDSFORHOLD_DETAIL_FORM),
    getBehandlingFormValues(PERSON_ARBEIDSFORHOLD_DETAIL_FORM),
    getBehandlingFormInitialValues(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)],
  (dirty, values, initialValues = {}) => (dirty
    ? values.fortsettUtenImAktivtArbeidsforhold !== false
    : !!initialValues.begrunnelse && initialValues.begrunnelse !== ''),
);

const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.arbeidsforhold,
  readOnly: ownProps.readOnly || (!ownProps.arbeidsforhold.tilVurdering && !ownProps.arbeidsforhold.erEndret),
  showBegrunnelse: showBegrunnelse(state),
  hasReceivedInntektsmelding: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'mottattDatoInntektsmelding'),
  vurderOmSkalErstattes: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'vurderOmSkalErstattes'),
  harErstattetEttEllerFlere: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'harErstattetEttEllerFlere'),
  isErstattArbeidsforhold: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'erNyttArbeidsforhold') === false,
  skalBrukeUendretForhold: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'brukUendretArbeidsforhold'),
  fortsettUtenImAktivtArbeidsforhold: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'fortsettUtenImAktivtArbeidsforhold'),
  harOverstyrtTom: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'overstyrtTom'),
  onSubmit: values => ownProps.updateArbeidsforhold(values),
});

const validateForm = () => {
  const errors = {};
  return errors;
};

export default connect(mapStateToProps)(injectIntl(behandlingForm({
  form: PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
  validate: validateForm,
  enableReinitialize: true,
})(PersonArbeidsforholdDetailForm)));
