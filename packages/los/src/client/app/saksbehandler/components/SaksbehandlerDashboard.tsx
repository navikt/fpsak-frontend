
import React from 'react';
import Panel from 'nav-frontend-paneler';

import FagsakSearchIndex from '../fagsakSearch/FagsakSearchIndex';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import SaksstotteIndex from '../saksstotte/SaksstotteIndex';

import styles from './saksbehandlerDashboard.less';

/**
 * SaksbehandlerDashboard
 */
export const SaksbehandlerDashboard = () => (
  <div>
    <div className={styles.oppgaveContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.sakslisteContent}>
            <Panel className={styles.sakslistePanel}>
              <BehandlingskoerIndex />
              <FagsakSearchIndex />
            </Panel>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <Panel>
            <SaksstotteIndex />
          </Panel>
        </div>
      </div>
    </div>
  </div>
);

export default SaksbehandlerDashboard;
