import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { FadingPanel } from '@fpsak-frontend/shared-components';

import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import AksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OpptjeningVilkarView from './OpptjeningVilkarView';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';

const FORM_NAME = 'OpptjeningVilkarForm';

/**
 * OpptjeningVilkarForm
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */
export const OpptjeningVilkarFormImpl = ({
  isAksjonspunktOpen,
  hasAksjonspunkt,
  readOnlySubmitButton,
  readOnly,
  submitCallback,
}) => {
  if (hasAksjonspunkt) {
    return (
      <OpptjeningVilkarAksjonspunktPanel
        submitCallback={submitCallback}
        isAksjonspunktOpen={isAksjonspunktOpen}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        formName={FORM_NAME}
      />
    );
  }
  return (
    <FadingPanel withoutTopMargin>
      <OpptjeningVilkarView />
    </FadingPanel>
  );
};

OpptjeningVilkarFormImpl.propTypes = {
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
};


const mapStateToPropsFactory = (initialState) => {
  const aksjonspunkter = behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState);
  return () => ({
    hasAksjonspunkt: aksjonspunkter.length > 0,
  });
};

const OpptjeningVilkarForm = connect(mapStateToPropsFactory)(OpptjeningVilkarFormImpl);

OpptjeningVilkarForm.supports = (behandlingspunkt, aksjonspunktCodes) => (behandlingspunkt === behandlingspunktCodes.OPPTJENING
  && aksjonspunktCodes.includes(AksjonspunktCodes.VURDER_OPPTJENINGSVILKARET));

export default OpptjeningVilkarForm;
