import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';

import styles from './loadingPanel.less';

/**
 * LoadingPanel
 *
 * Presentasjonskomponent. Viser lasteikon.
 */
const LoadingPanel = () => (
  <NavFrontendSpinner type="XL" className={styles.container} />
);

export default LoadingPanel;
