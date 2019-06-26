import React from 'react';
import PropTypes from 'prop-types';
import risikoIkon from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import HoyRisikoPanel from './HoyRisikoPanel';
import TittelMedDivider from './TittelMedDivider';

import styles from './hoyRisikoTittel.less';

/**
 * HoyRisikoTittel
 *
 * Presentasjonskomponent. Statisk visning av tittel i utvidbart panel dersom faresignaler er funnet.
 */
const HoyRisikoTittel = ({
  risikoklassifisering,
}) => (
  <EkspanderbartpanelBase
    className={styles.hoyRisikoPanelTittel}
    heading={(
      <TittelMedDivider
        imageSrc={risikoIkon}
        tittel="Risikopanel.Tittel.Faresignaler"
      />
      )}
    border
  >
    <HoyRisikoPanel
      risikoklassifisering={risikoklassifisering}
    />
  </EkspanderbartpanelBase>
);
HoyRisikoTittel.propTypes = {
  risikoklassifisering: PropTypes.shape().isRequired,
};

export default HoyRisikoTittel;
