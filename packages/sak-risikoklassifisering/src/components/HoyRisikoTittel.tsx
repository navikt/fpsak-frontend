import React, { FunctionComponent } from 'react';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';

import risikoIkon from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import { Risikoklassifisering, Aksjonspunkt } from '@fpsak-frontend/types';

import HoyRisikoPanel from './HoyRisikoPanel';
import TittelMedDivider from './TittelMedDivider';

import styles from './hoyRisikoTittel.less';

interface OwnProps {
  risikoklassifisering: Risikoklassifisering;
  aksjonspunkt?: Aksjonspunkt;
  readOnly: boolean;
  submitCallback: (aksjonspunkt: Aksjonspunkt) => void;
  isRiskPanelOpen: boolean;
  toggleRiskPanel: () => void;
  behandlingId: number;
  behandlingVersjon: number;
}

/**
 * HoyRisikoTittel
 *
 * Presentasjonskomponent. Statisk visning av tittel i utvidbart panel dersom faresignaler er funnet.
 */
const HoyRisikoTittel: FunctionComponent<OwnProps> = ({
  risikoklassifisering,
  aksjonspunkt,
  readOnly,
  submitCallback,
  isRiskPanelOpen,
  toggleRiskPanel,
  behandlingId,
  behandlingVersjon,
}) => (
  <EkspanderbartpanelBase
    className={styles.hoyRisikoPanelTittel}
    apen={isRiskPanelOpen}
    onClick={toggleRiskPanel}
    tittel={(
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
  </EkspanderbartpanelBase>
);

export default HoyRisikoTittel;
