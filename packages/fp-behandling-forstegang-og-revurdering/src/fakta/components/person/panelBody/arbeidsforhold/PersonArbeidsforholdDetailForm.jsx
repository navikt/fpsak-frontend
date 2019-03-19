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
  getBehandlingFormInitialValues,
  getBehandlingFormValues,
  isBehandlingFormDirty,
} from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import {
  dateAfterOrEqual, hasValidDate, hasValidText, maxLength, required,
} from '@fpsak-frontend/utils';
import {
  InputField, RadioGroupField, RadioOption, TextAreaField,
} from '@fpsak-frontend/form';
import {
  ElementWrapper, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import handlingTyper from '@fpsak-frontend/kodeverk/src/handlingTyper';
import ArrowBox from '@fpsak-frontend/shared-components/src/ArrowBox';
import DatepickerField from '@fpsak-frontend/form/src/DatepickerField';
import PersonAksjonspunktText from './PersonAksjonspunktText';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';

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

const arbeidsforholdTomDatoPickerErrorMsg = fomDato => ([
  { id: 'PersonArbeidsforholdDetailForm.DateNotAfterOrEqual' },
  { fomDato },
]);

const isKildeAaRegisteret = arbeidsforhold => arbeidsforhold.kilde && arbeidsforhold.kilde.navn.toLowerCase() === AA_REGISTERET;

const showNyttOrErstattPanel = (
  skalBrukeUendretForhold, vurderOmSkalErstattes, harErstattetEttEllerFlere,
) => !!skalBrukeUendretForhold
  && vurderOmSkalErstattes
  && !harErstattetEttEllerFlere;

const skalKunneOverstyreArbeidsforholdTomDato = (hasReceivedInntekstmelding, arbeidsforhold) => {
  const erLopende = arbeidsforhold.tomDato === undefined || arbeidsforhold.tomDato === null;
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
        <RadioGroupField
          name="brukUendretArbeidsforhold"
          validate={[required]}
          direction="vertical"
          readOnly={readOnly}
        >
          <RadioOption
            label={{ id: 'PersonArbeidsforholdDetailForm.BrukArbeidsforholdet' }}
            value
            manualHideChildren
          >
            <BehandlingFormFieldCleaner formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM} fieldNames={['aktivtArbeidsforholdFortsettBehandlingUtenIM']}>
              {skalBrukeUendretForhold && !hasReceivedInntektsmelding && (
                <Row>
                  <Column xs="1" />
                  <Column xs="11">
                    <RadioGroupField
                      name="aktivtArbeidsforholdFortsettBehandlingUtenIM"
                      validate={[required]}
                      direction="vertical"
                      readOnly={readOnly}
                    >
                      <RadioOption
                        label={{ id: 'PersonArbeidsforholdDetailForm.IkkeMottatt' }}
                        value={false}
                      />
                      <RadioOption
                        label={{ id: 'PersonArbeidsforholdDetailForm.FortsettBehandling' }}
                        value
                        disabled={!aktivtArbeidsforholdTillatUtenIM}
                      />
                    </RadioGroupField>
                  </Column>
                </Row>
              )}
            </BehandlingFormFieldCleaner>
          </RadioOption>
          { skalKunneOverstyreArbeidsforholdTomDato(hasReceivedInntektsmelding, arbeidsforhold) && (
            <RadioOption
              label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt' }}
              value={false}
              manualHideChildren
            >
              <BehandlingFormFieldCleaner formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM} fieldNames={['overstyrtTom']}>
                { skalBrukeUendretForhold === false && (
                  <ArrowBox>
                    <DatepickerField
                      name="overstyrtTom"
                      label={<FormattedMessage id="PersonArbeidsforholdDetailForm.ArbeidsforholdetAktivTomDato" />}
                      validate={[required, hasValidDate, dateAfterOrEqual(arbeidsforhold.fomDato, arbeidsforholdTomDatoPickerErrorMsg)]}
                      readOnly={readOnly}
                    />
                  </ArrowBox>
                )}
              </BehandlingFormFieldCleaner>
            </RadioOption>
          )}
          { !skalKunneOverstyreArbeidsforholdTomDato(hasReceivedInntektsmelding, arbeidsforhold) && (
            <RadioOption
              label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdIkkeRelevant' }}
              value={false}
              disabled={isKildeAaRegisteret(arbeidsforhold)}
            />
          )}
        </RadioGroupField>
        <VerticalSpacer twentyPx />
        <BehandlingFormFieldCleaner formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM} fieldNames={['begrunnelse']}>
          {showBegrunnelse && (
            <TextAreaField
              name="begrunnelse"
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
        <PersonNyttEllerErstattArbeidsforholdPanel
          readOnly={readOnly}
          isErstattArbeidsforhold={isErstattArbeidsforhold}
          arbeidsforholdList={formProps.initialValues.replaceOptions}
          showContent={showNyttOrErstattPanel(skalBrukeUendretForhold, vurderOmSkalErstattes, harErstattetEttEllerFlere)}
          formName={PERSON_ARBEIDSFORHOLD_DETAIL_FORM}
        />
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
    dirty ? values.aktivtArbeidsforholdFortsettBehandlingUtenIM !== false : !!initialValues.begrunnelse && initialValues.begrunnelse !== ''
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
  aktivtArbeidsforholdFortsettBehandlingUtenIM:
    !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'aktivtArbeidsforholdFortsettBehandlingUtenIM'),
  overstyrtTom: behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'overstyrtTom'),
  onSubmit: values => ownProps.updateArbeidsforhold(values),
});

const validateForm = () => ({});

export default connect(mapStateToProps)(behandlingForm({
  form: PERSON_ARBEIDSFORHOLD_DETAIL_FORM,
  validate: validateForm,
  enableReinitialize: true,
})(PersonArbeidsforholdDetailForm));
