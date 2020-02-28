import React, { FunctionComponent, ReactNode } from 'react';
import ProcessMenu from '@navikt/nap-process-menu';

import ProsessStegMenyRad from '../types/prosessStegMenyRadTsType';

import styles from './prosessStegContainer.less';

interface OwnProps {
  formaterteProsessStegPaneler: ProsessStegMenyRad[];
  velgProsessStegPanelCallback: (index: number) => void;
  children: ReactNode;
}

const ProsessStegContainer: FunctionComponent<OwnProps> = ({
  formaterteProsessStegPaneler,
  velgProsessStegPanelCallback,
  children,
}) => (
  <>
    <div className={styles.container}>
      <div className={styles.meny}>
        <ProcessMenu steps={formaterteProsessStegPaneler} onClick={velgProsessStegPanelCallback} />
      </div>
      {children}
    </div>
  </>
);

export default ProsessStegContainer;
