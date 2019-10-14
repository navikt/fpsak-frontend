import React from 'react';
import PropTypes from 'prop-types';

import { Panel } from 'nav-frontend-paneler';
import oransjeTrekant from '@fpsak-frontend/assets/images/advarsel.svg';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import risikoklassifiseringPropType from '../propTypes/risikoklassifiseringPropType';
import risikoklassifiseringAksjonspunktPropType from '../propTypes/risikoklassifiseringAksjonspunktPropType';
import TittelMedDivider from './TittelMedDivider';
import Faresignaler from './Faresignaler';
import AvklarFaresignalerForm from './AvklarFaresignalerForm';

/**
 * AvklarFaresignaler
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
const HoyRisikoPanel = ({
  behandlingId,
  behandlingVersjon,
  risikoklassifisering,
  aksjonspunkt,
  readOnly,
  submitCallback,
}) => (
  <Panel>
    <TittelMedDivider
      imageSrc={oransjeTrekant}
      tittel="Risikopanel.Panel.Tittel"
    />
    <VerticalSpacer sixteenPx />
    <Faresignaler risikoklassifisering={risikoklassifisering} />
    {!!aksjonspunkt
      && (
      <AvklarFaresignalerForm
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        aksjonspunkt={aksjonspunkt}
        readOnly={readOnly}
        submitCallback={submitCallback}
        risikoklassifisering={risikoklassifisering}
      />
      )}
  </Panel>
);

HoyRisikoPanel.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  risikoklassifisering: risikoklassifiseringPropType.isRequired,
  aksjonspunkt: risikoklassifiseringAksjonspunktPropType,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
};

HoyRisikoPanel.defaultProps = {
  aksjonspunkt: undefined,
};

export default HoyRisikoPanel;
