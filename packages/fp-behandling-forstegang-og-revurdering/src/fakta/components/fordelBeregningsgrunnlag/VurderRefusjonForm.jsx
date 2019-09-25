import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { VerticalSpacer, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getArbeidsgiverInfoForRefusjonskravSomKommerForSent } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';

const {
  VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
} = aksjonspunktCodes;


const FORM_NAME_SEN_REFUSON = 'senRefusjonForm';

const erRefusjonskravGyldigFieldPrefix = 'erKravGyldig_';

export const lagFieldName = (arbeidsgiverVisningsnavn) => erRefusjonskravGyldigFieldPrefix + arbeidsgiverVisningsnavn;

const lagRefusjonskravRadios = (senRefusjonkravListe, readOnly, isAksjonspunktClosed) => senRefusjonkravListe.map((kravPerArbeidsgiver) => {
  const { arbeidsgiverVisningsnavn } = kravPerArbeidsgiver;
  return (
    <React.Fragment key={arbeidsgiverVisningsnavn}>
      <VerticalSpacer twentyPx />
      <FormattedMessage
        id="VurderRefusjonForm.ErRefusjonskravGyldig"
        values={{
          arbeidsgiverVisningsnavn,
        }}
      />
      <VerticalSpacer eightPx />
      <RadioGroupField
        name={lagFieldName(arbeidsgiverVisningsnavn)}
        validate={[required]}
        readOnly={readOnly}
        isEdited={isAksjonspunktClosed}
      >
        <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
        <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
      </RadioGroupField>
    </React.Fragment>
  );
});


const findAksjonspunktMedBegrunnelse = (aksjonspunkter) => aksjonspunkter
  .find((ap) => ap.definisjon.kode === VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT && ap.begrunnelse !== null);

export const BEGRUNNELSE_SEN_REFUSJON_NAME = 'begrunnelseSenRefusjon';

/**
 * VurderRefusjonForm
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for vurdering av refusjonskrav som har kommet for sent.
 */
export const VurderRefusjonFormImpl = ({
  readOnly,
  submittable,
  isAksjonspunktClosed,
  hasBegrunnelse,
  senRefusjonkravListe,
  submitEnabled,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <AksjonspunktHelpText isAksjonspunktOpen={!isAksjonspunktClosed}>
      {[<FormattedMessage id="VurderRefusjonForm.AksjonspunktHelpText" key="vurderRefusjon" />]}
    </AksjonspunktHelpText>
    {lagRefusjonskravRadios(senRefusjonkravListe, readOnly, isAksjonspunktClosed)}
    <VerticalSpacer twentyPx />
    <FaktaBegrunnelseTextField
      name={BEGRUNNELSE_SEN_REFUSJON_NAME}
      isDirty={formProps.dirty}
      isSubmittable={submittable}
      isReadOnly={readOnly}
      hasBegrunnelse={hasBegrunnelse}
    />
    <>
      <VerticalSpacer twentyPx />
      <FaktaSubmitButton
        formName={formProps.form}
        isSubmittable={submittable && submitEnabled}
        isReadOnly={readOnly}
        hasOpenAksjonspunkter={!isAksjonspunktClosed}
      />
    </>
  </form>
);

VurderRefusjonFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  submitEnabled: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  senRefusjonkravListe: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ...formPropTypes,
};

export const transformValues = createSelector(
  [behandlingSelectors.getAksjonspunkter, getArbeidsgiverInfoForRefusjonskravSomKommerForSent],
  (aksjonspunkter, arbeidsgiverListe) => (values) => {
    if (!hasAksjonspunkt(VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT, aksjonspunkter) || arbeidsgiverListe.length === 0) {
      return [{}];
    }
    const begrunnelse = values[BEGRUNNELSE_SEN_REFUSJON_NAME];
    return [{
      begrunnelse,
      kode: VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
      refusjonskravGyldighet: arbeidsgiverListe.map(({ arbeidsgiverId, arbeidsgiverVisningsnavn }) => ({
        arbeidsgiverId,
        skalUtvideGyldighet: values[lagFieldName(arbeidsgiverVisningsnavn)],
      })),
    }];
  },
);

export const buildInitialValues = createSelector(
  [behandlingSelectors.getAksjonspunkter, getArbeidsgiverInfoForRefusjonskravSomKommerForSent],
  (aksjonspunkter, arbeidsgiverListe) => {
    const initialValues = {};
    if (!hasAksjonspunkt(VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT, aksjonspunkter) || arbeidsgiverListe.length === 0) {
      return initialValues;
    }
    arbeidsgiverListe.forEach(({ arbeidsgiverVisningsnavn, erRefusjonskravGyldig }) => {
      initialValues[lagFieldName(arbeidsgiverVisningsnavn)] = erRefusjonskravGyldig;
    });
    return ({
      ...initialValues,
      ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter), BEGRUNNELSE_SEN_REFUSJON_NAME),
    });
  },
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback(transformValues(initialState)(values));
  return (state) => {
    const alleAp = behandlingSelectors.getAksjonspunkter(state);
    const relevantAp = alleAp.find((ap) => ap.definisjon.kode === VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT);
    const isAksjonspunktClosed = !isAksjonspunktOpen(relevantAp.status.kode);
    const initialValues = buildInitialValues(state);
    const hasBegrunnelse = initialValues && !!initialValues[BEGRUNNELSE_SEN_REFUSJON_NAME];
    return {
      isAksjonspunktClosed,
      hasBegrunnelse,
      initialValues,
      aksjonspunkter: alleAp,
      onSubmit,
      senRefusjonkravListe: getArbeidsgiverInfoForRefusjonskravSomKommerForSent(state),
    };
  };
};

const VurderRefusjonForm = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({ form: FORM_NAME_SEN_REFUSON })(VurderRefusjonFormImpl));

export default VurderRefusjonForm;
