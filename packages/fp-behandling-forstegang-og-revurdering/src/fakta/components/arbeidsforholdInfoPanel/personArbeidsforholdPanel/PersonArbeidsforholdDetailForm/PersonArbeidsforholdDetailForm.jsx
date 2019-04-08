import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import {
  behandlingForm,
  behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import {
  ElementWrapper, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import arbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandling';
import PersonAksjonspunktText from './PersonAksjonspunktText';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';
import ArbeidsforholdBegrunnelse from './ArbeidsforholdBegrunnelse';
import PermisjonPeriode from './PermisjonPeriode';

// ----------------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------------

export const PERSON_ARBEIDSFORHOLD_DETAIL_FORM = 'PersonArbeidsforholdDetailForm';

// ----------------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------------
const showNyttOrErstattPanel = (
  arbeidsforholdHandlingVerdi, vurderOmSkalErstattes, harErstattetEttEllerFlere,
) => arbeidsforholdHandlingVerdi === arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD
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
  vurderOmSkalErstattes,
  aktivtArbeidsforholdTillatUtenIM,
  arbeidsforhold,
  arbeidsforholdHandlingVerdi,
  skalKunneLeggeTilNyeArbeidsforhold,
  ...formProps
}) => (
  <ElementWrapper>
    <Element><FormattedMessage id="PersonArbeidsforholdDetailForm.Header" /></Element>
    <PermisjonPeriode arbeidsforhold={arbeidsforhold} />
    <PersonAksjonspunktText arbeidsforhold={arbeidsforhold} />
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
          arbeidsforholdHandlingVerdi={arbeidsforholdHandlingVerdi}
        />
        <VerticalSpacer twentyPx />
        <ArbeidsforholdBegrunnelse
          readOnly={readOnly}
          formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
        />
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
        { showNyttOrErstattPanel(arbeidsforholdHandlingVerdi, vurderOmSkalErstattes, harErstattetEttEllerFlere) && (
          <PersonNyttEllerErstattArbeidsforholdPanel
            readOnly={readOnly}
            isErstattArbeidsforhold={isErstattArbeidsforhold}
            arbeidsforholdList={formProps.initialValues.replaceOptions}
            formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
          />
        )}
        { arbeidsforholdHandlingVerdi === arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD && harErstattetEttEllerFlere && (
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
  arbeidsforholdHandlingVerdi: PropTypes.string,
  skalKunneLeggeTilNyeArbeidsforhold: PropTypes.bool.isRequired,
  ...formPropTypes,
};

PersonArbeidsforholdDetailForm.defaultProps = {
  harErstattetEttEllerFlere: false,
  arbeidsforholdHandlingVerdi: undefined,
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.updateArbeidsforhold(values);
  return state => ({
    initialValues: ownProps.arbeidsforhold,
    readOnly: ownProps.readOnly || (!ownProps.arbeidsforhold.tilVurdering && !ownProps.arbeidsforhold.erEndret),
    hasReceivedInntektsmelding: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'mottattDatoInntektsmelding'),
    vurderOmSkalErstattes: !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'vurderOmSkalErstattes'),
    harErstattetEttEllerFlere: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'harErstattetEttEllerFlere'),
    isErstattArbeidsforhold: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'erNyttArbeidsforhold') === false,
    arbeidsforholdHandlingVerdi: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'arbeidsforholdHandlingField'),
    onSubmit,
  });
};


const validateForm = values => ({
  ...LeggTilArbeidsforholdFelter.validate(values),
});

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
  validate: values => validateForm(values),
  enableReinitialize: true,
})(PersonArbeidsforholdDetailForm));
