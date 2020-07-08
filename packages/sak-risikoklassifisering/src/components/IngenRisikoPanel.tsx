import React, { FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';

import innvilgetIkonUrl from '@fpsak-frontend/assets/images/innvilget.svg';

import TittelMedDivider from './TittelMedDivider';

import styles from './ingenRisikoPanel.less';

/**
 * IngenRisikoPanel
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
const IngenRisikoPanel: FunctionComponent = () => (
  <Panel className={styles.ingenRisikoOppdagetTittel}>
    <TittelMedDivider
      imageSrc={innvilgetIkonUrl}
      tittel="Risikopanel.Tittel.IngenFaresignaler"
    />
  </Panel>
);

export default IngenRisikoPanel;
