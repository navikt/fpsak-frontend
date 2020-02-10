import React from 'react';
import PropTypes from 'prop-types';
import { EkspanderbartpanelBasePure } from 'nav-frontend-ekspanderbartpanel';

import risikoIkon from '@fpsak-frontend/assets/images/avslaatt_hover.svg';

import risikoklassifiseringPropType from '../propTypes/risikoklassifiseringPropType';
import risikoklassifiseringAksjonspunktPropType from '../propTypes/risikoklassifiseringAksjonspunktPropType';
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
  behandlingId,
  behandlingVersjon,
}) => (
  <EkspanderbartpanelBasePure
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
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    />
  </EkspanderbartpanelBasePure>
);
HoyRisikoTittel.propTypes = {
  risikoklassifisering: risikoklassifiseringPropType.isRequired,
  aksjonspunkt: risikoklassifiseringAksjonspunktPropType,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isRiskPanelOpen: PropTypes.bool.isRequired,
  toggleRiskPanel: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

HoyRisikoTittel.defaultProps = {
  aksjonspunkt: undefined,
};

export default HoyRisikoTittel;
