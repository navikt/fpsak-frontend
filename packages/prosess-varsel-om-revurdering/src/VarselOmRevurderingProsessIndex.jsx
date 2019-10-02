import React from 'react';
import PropTypes from 'prop-types';

import { CustomLanguageProvider } from '@fpsak-frontend/fp-felles';

import revurderingBehandlingPropType from './propTypes/revurderingBehandlingPropType';
import revurderingAksjonspunkterPropType from './propTypes/revurderingAksjonspunkterPropType';
import revurderingFamilieHendelsePropType from './propTypes/revurderingFamilieHendelsePropType';
import revurderingSoknadPropType from './propTypes/revurderingSoknadPropType';
import revurderingOriginalBehandlingPropType from './propTypes/revurderingOriginalBehandlingPropType';
import VarselOmRevurderingForm from './components/VarselOmRevurderingForm';
import messages from '../i18n/nb_NO';

const VarselOmRevurderingProsessIndex = ({
  behandling,
  familiehendelse,
  soknad,
  originalBehandling,
  aksjonspunkter,
  submitCallback,
  previewCallback,
  dispatchSubmitFailed,
  readOnly,
  alleKodeverk,
}) => (
  <CustomLanguageProvider messages={messages}>
    <VarselOmRevurderingForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingArsaker={behandling.behandlingArsaker}
      sprakkode={behandling.sprakkode}
      behandlingType={behandling.type}
      familiehendelse={familiehendelse}
      soknad={soknad}
      originalBehandling={originalBehandling}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      previewCallback={previewCallback}
      dispatchSubmitFailed={dispatchSubmitFailed}
      readOnly={readOnly}
      alleKodeverk={alleKodeverk}
    />
  </CustomLanguageProvider>
);

VarselOmRevurderingProsessIndex.propTypes = {
  behandling: revurderingBehandlingPropType.isRequired,
  familiehendelse: revurderingFamilieHendelsePropType.isRequired,
  soknad: revurderingSoknadPropType.isRequired,
  originalBehandling: revurderingOriginalBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(revurderingAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default VarselOmRevurderingProsessIndex;
