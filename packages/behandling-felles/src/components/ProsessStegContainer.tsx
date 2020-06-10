import React, { useMemo, FunctionComponent, ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import ProcessMenu from '@navikt/nap-process-menu';

import ProsessStegMenyRad from '../types/prosessStegMenyRadTsType';

import styles from './prosessStegContainer.less';

interface OwnProps {
  formaterteProsessStegPaneler: ProsessStegMenyRad[];
  velgProsessStegPanelCallback: (index: number) => void;
  children: ReactNode;
}

const ProsessStegContainer: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  formaterteProsessStegPaneler,
  velgProsessStegPanelCallback,
  children,
}) => {
  const steg = useMemo(() => formaterteProsessStegPaneler.map((panel) => ({
    ...panel,
    label: intl.formatMessage({ id: panel.labelId }),
  })), [formaterteProsessStegPaneler]);

  return (
    <div className={styles.container}>
      <div className={styles.meny}>
        <ProcessMenu steps={steg} onClick={velgProsessStegPanelCallback} />
      </div>
      {children}
    </div>
  );
};

export default injectIntl(ProsessStegContainer);
