import React from 'react';
import PropTypes from 'prop-types';

import { Panel } from 'nav-frontend-paneler';
import oransjeTrekant from '@fpsak-frontend/assets/images/advarsel.svg';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import TittelMedDivider from './TittelMedDivider';

import Faresignaler from './Faresignaler';

/**
 * AvklarFaresignaler
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
const AvklarFaresignaler = ({
  risikoklassifisering,
}) => (
  <Panel>
    <TittelMedDivider
      imageSrc={oransjeTrekant}
      tittel="Risikopanel.Panel.Tittel"
    />
    <VerticalSpacer sixteenPx />
    <Faresignaler risikoklassifisering={risikoklassifisering} />
  </Panel>
);
AvklarFaresignaler.propTypes = {
  risikoklassifisering: PropTypes.shape().isRequired,
};

export default AvklarFaresignaler;
