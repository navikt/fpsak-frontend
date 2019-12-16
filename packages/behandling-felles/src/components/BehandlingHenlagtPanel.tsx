import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { FadingPanel } from '@fpsak-frontend/shared-components';

import styles from './behandlingHenlagtPanel.less';

const BehandlingHenlagtPanel = () => (
  <div className={styles.container}>
    <FadingPanel>
      <Normaltekst>
        <FormattedMessage id="BehandlingHenlagtPanel.Henlagt" />
      </Normaltekst>
    </FadingPanel>
  </div>
);

export default BehandlingHenlagtPanel;
