import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import { FadingPanel } from '@fpsak-frontend/shared-components';

import styles from './prosessStegIkkeBehandletPanel.less';

const ProsessStegIkkeBehandletPanel = () => (
  <div className={styles.container}>
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="ProsessStegIkkeBehandletPanel.IkkeBehandlet" />
      </Undertittel>
    </FadingPanel>
  </div>
);

export default ProsessStegIkkeBehandletPanel;
