import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import BehandlingFormFieldCleaner from 'behandling/BehandlingFormFieldCleaner';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import {
  behandlingForm, behandlingFormValueSelector, isBehandlingFormDirty, getBehandlingFormValues, getBehandlingFormInitialValues,
}
  from 'behandling/behandlingForm';
import { hasValidText, maxLength, required } from 'utils/validation/validators';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import {
  InputField, RadioGroupField, RadioOption, TextAreaField,
} from 'form/Fields';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';

export const PERSON_ARBEIDSFORHOLD_DETAIL_FORM = 'PersonArbeidsforholdDetailForm';

const maxLength400 = maxLength(400);

const showNyttOrErstattPanel = (
  shouldUseBehandling, vurderOmSkalErstattes, harErstattetEttEllerFlere,
) => shouldUseBehandling && vurderOmSkalErstattes && !harErstattetEttEllerFlere;

/**
 * PersonArbeidsforholdDetailForm
 */
export const PersonArbeidsforholdDetailForm = ({
  intl,
  cancelArbeidsforhold,
  shouldUseBehandling,
  isErstattArbeidsforhold,
  hasReceivedInntektsmelding,
  harErstattetEttEllerFlere,
  readOnly,
  showBegrunnelse,
  vurderOmSkalErstattes,
  ...formProps
}) => (
  <ElementWrapper>
    <Element><FormattedMessage id="PersonArbeidsforholdDetailForm.Header" /></Element>
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="5">
        <InputField
          name="beskrivelse"
          label={{ id: 'PersonArbeidsforholdDetailForm.Arbeidsgiver' }}
          bredde="XL"
          readOnly
        />
        <RadioGroupField
          name="brukArbeidsforholdet"
          validate={[required]}
          direction="vertical"
          readOnly={readOnly}
        >
          <RadioOption
            label={intl.formatMessage({ id: 'PersonArbeidsforholdDetailForm.BrukArbeidsforholdet' })}
            value
            manualHideChildren
          >
            <BehandlingFormFieldCleaner formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM} fieldNames={['fortsettBehandlingUtenInntektsmelding']}>
              {shouldUseBehandling && !hasReceivedInntektsmelding
              && (
              <Row>
                <Column xs="1" />
                <Column xs="11">
                  <RadioGroupField
                    name="fortsettBehandlingUtenInntektsmelding"
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
                    />
                  </RadioGroupField>
                </Column>
              </Row>
              )
                }
            </BehandlingFormFieldCleaner>
          </RadioOption>
          <RadioOption
            label={intl.formatMessage({ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdIkkeRelevant' })}
            value={false}
          />
        </RadioGroupField>
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
          )
          }
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
        )
        }
      </Column>
      <Column xs="6">
        <PersonNyttEllerErstattArbeidsforholdPanel
          readOnly={readOnly}
          isErstattArbeidsforhold={isErstattArbeidsforhold}
          arbeidsforholdList={formProps.initialValues.replaceOptions}
          showContent={showNyttOrErstattPanel(shouldUseBehandling, vurderOmSkalErstattes, harErstattetEttEllerFlere)}
          formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
        />
        { shouldUseBehandling && harErstattetEttEllerFlere
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
  shouldUseBehandling: PropTypes.bool,
  isErstattArbeidsforhold: PropTypes.bool.isRequired,
  hasReceivedInntektsmelding: PropTypes.bool.isRequired,
  vurderOmSkalErstattes: PropTypes.bool.isRequired,
  harErstattetEttEllerFlere: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  ...formPropTypes,
};

PersonArbeidsforholdDetailForm.defaultProps = {
  shouldUseBehandling: false,
  harErstattetEttEllerFlere: false,
};

export const showBegrunnelse = createSelector(
  [
    isBehandlingFormDirty(PERSON_ARBEIDSFORHOLD_DETAIL_FORM),
    getBehandlingFormValues(PERSON_ARBEIDSFORHOLD_DETAIL_FORM),
    getBehandlingFormInitialValues(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)],
  (dirty, values, initialValues = {}) => (dirty
    ? values.fortsettBehandlingUtenInntektsmelding !== false
    : !!initialValues.begrunnelse && initialValues.begrunnelse !== ''),
);

const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.arbeidsforhold,
  readOnly: ownProps.readOnly || (!ownProps.arbeidsforhold.tilVurdering && !ownProps.arbeidsforhold.erEndret),
  showBegrunnelse: showBegrunnelse(state),
  shouldUseBehandling: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'brukArbeidsforholdet'),
  hasReceivedInntektsmelding: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'mottattDatoInntektsmelding'),
  vurderOmSkalErstattes: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'vurderOmSkalErstattes'),
  harErstattetEttEllerFlere: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'harErstattetEttEllerFlere'),
  isErstattArbeidsforhold: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'erNyttArbeidsforhold') === false,
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
