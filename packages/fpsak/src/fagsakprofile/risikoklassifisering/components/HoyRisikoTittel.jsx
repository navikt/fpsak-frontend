import React from 'react';
import PropTypes from 'prop-types';
import risikoIkon from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
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
  aksjonspunkt,
  readOnly,
  submitCallback,
  isRiskPanelOpen,
  toggleRiskPanel,
}) => (
  <EkspanderbartpanelBase
    className={styles.hoyRisikoPanelTittel}
    apen={isRiskPanelOpen}
    onClick={toggleRiskPanel}
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
      aksjonspunkt={aksjonspunkt}
      readOnly={readOnly}
      submitCallback={submitCallback}
    />
  </EkspanderbartpanelBase>
);
HoyRisikoTittel.propTypes = {
  risikoklassifisering: PropTypes.shape().isRequired,
  aksjonspunkt: aksjonspunktPropType,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isRiskPanelOpen: PropTypes.bool.isRequired,
  toggleRiskPanel: PropTypes.func.isRequired,
};

HoyRisikoTittel.defaultProps = {
  aksjonspunkt: undefined,
};

export default HoyRisikoTittel;
