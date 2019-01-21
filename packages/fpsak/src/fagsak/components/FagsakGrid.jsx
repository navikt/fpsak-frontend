import React from 'react';
import PropTypes from 'prop-types';

import styles from './fagsakGrid.less';

/**
 * FagsakGrid
 *
 * Presentasjonskomponent. Har ansvar for å sette opp applikasjonens hovedgrid.
 */
const FagsakGrid = ({
  behandlingContent,
  profileAndNavigationContent,
  supportContent,
}) => (
  <React.Fragment>
    <div className={styles.fagsakContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.behandlingContent}>
            {behandlingContent}
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div>{profileAndNavigationContent}</div>
          <div>{supportContent}</div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

FagsakGrid.propTypes = {
  behandlingContent: PropTypes.node.isRequired,
  profileAndNavigationContent: PropTypes.node.isRequired,
  supportContent: PropTypes.node.isRequired,
};

export default FagsakGrid;
