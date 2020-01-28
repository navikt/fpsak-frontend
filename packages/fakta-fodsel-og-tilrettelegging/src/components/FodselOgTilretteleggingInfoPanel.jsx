import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';

import fodselOgTilretteleggingAksjonspunkterPropType from '../propTypes/fodselOgTilretteleggingAksjonspunkterPropType';
import fodselOgTilretteleggingPropType from '../propTypes/fodselOgTilretteleggingPropType';
import FodselOgTilretteleggingFaktaForm from './FodselOgTilretteleggingFaktaForm';

/**
 * Svangerskapspenger
 * Fakta om Fødsel og tilrettelegging
 */
const FodselOgTilretteleggingInfoPanel = ({
  behandlingId,
  behandlingVersjon,
  svangerskapspengerTilrettelegging,
  aksjonspunkter,
  readOnly,
  hasOpenAksjonspunkter,
  submitCallback,
  submittable,
}) => (
  <>
    <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {[<FormattedMessage id="FodselOgTilretteleggingInfoPanel.Aksjonspunkt" key="svangerskapspengerAp" />]}
    </AksjonspunktHelpTextTemp>
    <VerticalSpacer eightPx />
    <FodselOgTilretteleggingFaktaForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      submittable={submittable}
    />
  </>
);

FodselOgTilretteleggingInfoPanel.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  svangerskapspengerTilrettelegging: fodselOgTilretteleggingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fodselOgTilretteleggingAksjonspunkterPropType).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default FodselOgTilretteleggingInfoPanel;
