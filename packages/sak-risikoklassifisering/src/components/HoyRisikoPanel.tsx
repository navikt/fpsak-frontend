import React, { FunctionComponent } from 'react';

import Panel from 'nav-frontend-paneler';
import oransjeTrekant from '@fpsak-frontend/assets/images/advarsel.svg';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Risikoklassifisering, Aksjonspunkt } from '@fpsak-frontend/types';

import TittelMedDivider from './TittelMedDivider';
import Faresignaler from './Faresignaler';
import AvklarFaresignalerForm from './AvklarFaresignalerForm';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  risikoklassifisering: Risikoklassifisering;
  aksjonspunkt?: Aksjonspunkt;
  readOnly: boolean;
  submitCallback: (aksjonspunkt: Aksjonspunkt) => void;
}

/**
 * AvklarFaresignaler
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
const HoyRisikoPanel: FunctionComponent<OwnProps> = ({
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

export default HoyRisikoPanel;
