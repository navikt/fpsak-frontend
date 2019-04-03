import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import BehandlingFormFieldCleaner from 'behandlingForstegangOgRevurdering/src/BehandlingFormFieldCleaner';
import {
  behandlingForm,
  behandlingFormValueSelector,
  getBehandlingFormValues,
  getBehandlingFormInitialValues,
  isBehandlingFormDirty,
} from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { hasValidText, maxLength, required } from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  ElementWrapper, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import aktivtArbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/aktivtArbeidsforholdHandling';
import PersonAksjonspunktText from './PersonAksjonspunktText';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';
// ----------------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------------

export const PERSON_ARBEIDSFORHOLD_DETAIL_FORM = 'PersonArbeidsforholdDetailForm';

const maxLength400 = maxLength(400);

// ----------------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------------
const showNyttOrErstattPanel = (
  skalBrukeUendretForhold, vurderOmSkalErstattes, harErstattetEttEllerFlere,
) => !!skalBrukeUendretForhold
  && vurderOmSkalErstattes
  && !harErstattetEttEllerFlere;

// ----------------------------------------------------------------------------------
// Component: PersonArbeidsforholdDetailForm
// ----------------------------------------------------------------------------------
/**
 * PersonArbeidsforholdDetailForm
 */
export const PersonArbeidsforholdDetailForm = ({
  cancelArbeidsforhold,
  isErstattArbeidsforhold,
  hasReceivedInntektsmelding,
  harErstattetEttEllerFlere,
  readOnly,
  showBegrunnelse,
  vurderOmSkalErstattes,
  aktivtArbeidsforholdTillatUtenIM,
  arbeidsforhold,
  skalBrukeUendretForhold,
  skalKunneLeggeTilNyeArbeidsforhold,
  ...formProps
}) => (
  <ElementWrapper>
    <Element><FormattedMessage id="PersonArbeidsforholdDetailForm.Header" /></Element>
    <PersonAksjonspunktText
      arbeidsforhold={arbeidsforhold}
    />
    <VerticalSpacer eightPx />
    { skalKunneLeggeTilNyeArbeidsforhold && (
      <LeggTilArbeidsforholdFelter
        readOnly={readOnly}
        formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
      />
    )}
    <Row>
      <Column xs="5">
        <VerticalSpacer twentyPx />
        <ArbeidsforholdRadioknapper
          readOnly={readOnly}
          formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
          hasReceivedInntektsmelding={hasReceivedInntektsmelding}
          arbeidsforhold={arbeidsforhold}
          skalKunneLeggeTilNyeArbeidsforhold={skalKunneLeggeTilNyeArbeidsforhold}
          aktivtArbeidsforholdTillatUtenIM={aktivtArbeidsforholdTillatUtenIM}
          skalBrukeUendretForhold={skalBrukeUendretForhold}
        />
        <VerticalSpacer twentyPx />
        <BehandlingFormFieldCleaner formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM} fieldNames={['beskrivelse']}>
          {showBegrunnelse && (
            <TextAreaField
              name="beskrivelse"
              label={{ id: 'PersonArbeidsforholdDetailForm.Begrunnelse' }}
              validate={[required, maxLength400, hasValidText]}
              maxLength={400}
              readOnly={readOnly}
            />
          )}
        </BehandlingFormFieldCleaner>
        { (formProps.initialValues.tilVurdering || formProps.initialValues.erEndret) && (
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
        { showNyttOrErstattPanel(skalBrukeUendretForhold, vurderOmSkalErstattes, harErstattetEttEllerFlere) && (
          <PersonNyttEllerErstattArbeidsforholdPanel
            readOnly={readOnly}
            isErstattArbeidsforhold={isErstattArbeidsforhold}
            arbeidsforholdList={formProps.initialValues.replaceOptions}
            formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
          />
        )}
        { skalBrukeUendretForhold && harErstattetEttEllerFlere && (
          <Normaltekst>
            <FormattedMessage id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod" />
          </Normaltekst>
        )}
      </Column>
    </Row>
  </ElementWrapper>
);

PersonArbeidsforholdDetailForm.propTypes = {
  cancelArbeidsforhold: PropTypes.func.isRequired,
  isErstattArbeidsforhold: PropTypes.bool.isRequired,
  hasReceivedInntektsmelding: PropTypes.bool.isRequired,
  vurderOmSkalErstattes: PropTypes.bool.isRequired,
  harErstattetEttEllerFlere: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  aktivtArbeidsforholdTillatUtenIM: PropTypes.bool.isRequired,
  arbeidsforhold: arbeidsforholdPropType.isRequired,
  skalBrukeUendretForhold: PropTypes.bool,
  skalKunneLeggeTilNyeArbeidsforhold: PropTypes.bool.isRequired,
  ...formPropTypes,
};

PersonArbeidsforholdDetailForm.defaultProps = {
  harErstattetEttEllerFlere: false,
  skalBrukeUendretForhold: undefined,
};

export const showBegrunnelse = createSelector(
  [
    isBehandlingFormDirty(PERSON_ARBEIDSFORHOLD_DETAIL_FORM),
    getBehandlingFormValues(PERSON_ARBEIDSFORHOLD_DETAIL_FORM),
    getBehandlingFormInitialValues(PERSON_ARBEIDSFORHOLD_DETAIL_FORM),
  ],
  (dirty, values, initialValues = {}) => (
    dirty
      ? values.aktivtArbeidsforholdHandlingField !== aktivtArbeidsforholdHandling.AVSLA_YTELSE
      : !!initialValues.begrunnelse && initialValues.begrunnelse !== ''
  ),
);

const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.arbeidsforhold,
  readOnly: ownProps.readOnly || (!ownProps.arbeidsforhold.tilVurdering && !ownProps.arbeidsforhold.erEndret),
  showBegrunnelse: showBegrunnelse(state),
  hasReceivedInntektsmelding: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'mottattDatoInntektsmelding'),
  vurderOmSkalErstattes: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'vurderOmSkalErstattes'),
  harErstattetEttEllerFlere: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'harErstattetEttEllerFlere'),
  isErstattArbeidsforhold: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'erNyttArbeidsforhold') === false,
  skalBrukeUendretForhold: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'brukUendretArbeidsforhold'),
  overstyrtTom: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'overstyrtTom'),
  onSubmit: values => ownProps.updateArbeidsforhold(values),
});

const validateForm = values => ({
  ...LeggTilArbeidsforholdFelter.validate(values),
});

export default connect(mapStateToProps)(behandlingForm({
  form: PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
  validate: values => validateForm(values),
  enableReinitialize: true,
})(PersonArbeidsforholdDetailForm));
