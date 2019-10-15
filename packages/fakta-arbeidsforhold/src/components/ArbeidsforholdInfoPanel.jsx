import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  behandlingForm, faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling,
} from '@fpsak-frontend/fp-felles';
import AksjonspunktHelpText from '@fpsak-frontend/shared-components/src/AksjonspunktHelpText';
import { omit } from '@fpsak-frontend/utils';

import BekreftOgForsettKnapp from './BekreftOgForsettKnapp';
import arbeidsforholdAksjonspunkterPropType from '../propTypes/arbeidsforholdAksjonspunkterPropType';
import PersonArbeidsforholdPanel from './PersonArbeidsforholdPanel';

// ----------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------

const formName = 'ArbeidsforholdInfoPanel';
const relevanteAksjonspunkter = [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

// ----------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------

export const fjernIdFraArbeidsforholdLagtTilAvSaksbehandler = (arbeidsforhold) => arbeidsforhold.map((a) => {
  if (a.lagtTilAvSaksbehandler === true) {
    return {
      ...a,
      id: null,
    };
  }
  return a;
});

const harAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCode);

/**
 * ArbeidsforholdInfoPanelImpl:
 * Ansvarlig for å rendre aksjonspunktteksten, arbeidsforholdene, og
 * bekreft & fortsett knappen
 * */
export const ArbeidsforholdInfoPanelImpl = ({
  aksjonspunkter,
  openInfoPanels,
  toggleInfoPanelCallback,
  readOnly,
  hasOpenAksjonspunkter,
  skalKunneLeggeTilNyeArbeidsforhold,
  skalKunneLageArbeidsforholdBasertPaInntektsmelding,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={<FormattedMessage id="ArbeidsforholdInfoPanel.Title" />}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.ARBEIDSFORHOLD)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.ARBEIDSFORHOLD}
    readOnly={readOnly}
  >
    <div>
      { aksjonspunkter.length > 0 && (
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter && !readOnly}>
          {[<FormattedMessage
            key="ArbeidsforholdInfoPanelAksjonspunkt"
            id={skalKunneLeggeTilNyeArbeidsforhold ? 'ArbeidsforholdInfoPanel.IngenArbeidsforholdRegistrert' : 'ArbeidsforholdInfoPanel.AvklarArbeidsforhold'}
          />]}
        </AksjonspunktHelpText>
      )}
      <form onSubmit={formProps.handleSubmit}>
        <PersonArbeidsforholdPanel
          readOnly={readOnly}
          hasAksjonspunkter={aksjonspunkter.length > 0}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          skalKunneLeggeTilNyeArbeidsforhold={skalKunneLeggeTilNyeArbeidsforhold}
          skalKunneLageArbeidsforholdBasertPaInntektsmelding={skalKunneLageArbeidsforholdBasertPaInntektsmelding}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
          alleKodeverk={alleKodeverk}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
        { harAksjonspunkt(aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, aksjonspunkter) && (
          <BekreftOgForsettKnapp
            readOnly={readOnly}
            isSubmitting={formProps.submitting}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}
      </form>
    </div>
  </FaktaEkspandertpanel>
);

ArbeidsforholdInfoPanelImpl.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  aksjonspunkter: PropTypes.arrayOf(arbeidsforholdAksjonspunkterPropType.isRequired).isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  skalKunneLeggeTilNyeArbeidsforhold: PropTypes.bool.isRequired,
  skalKunneLageArbeidsforholdBasertPaInntektsmelding: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

const buildInitialValues = createSelector(
  [(ownProps) => ownProps.arbeidsforhold],
  (arbeidsforhold) => ({
    ...PersonArbeidsforholdPanel.buildInitialValues(arbeidsforhold),
  }),
);

const transformValues = (values) => {
  const arbeidsforhold = fjernIdFraArbeidsforholdLagtTilAvSaksbehandler(values.arbeidsforhold);
  return {
    arbeidsforhold: arbeidsforhold.map((a) => omit(a,
      'erEndret',
      'replaceOptions',
      'originalFomDato',
      'arbeidsforholdHandlingField',
      'aktivtArbeidsforholdHandlingField')),
    kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
  };
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    onSubmit,
  });
};
const connectedComponent = connect(mapStateToPropsFactory)(behandlingForm({ form: formName })(ArbeidsforholdInfoPanelImpl));
const ArbeidsforholdInfoPanel = withDefaultToggling(faktaPanelCodes.ARBEIDSFORHOLD, relevanteAksjonspunkter)(connectedComponent);

export default ArbeidsforholdInfoPanel;
