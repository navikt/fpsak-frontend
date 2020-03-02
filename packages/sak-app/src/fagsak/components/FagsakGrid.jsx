import React from 'react';
import MediaQuery from 'react-responsive';
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
  visittkortContent,
}) => (
  <>
    <MediaQuery maxWidth={1600}>
      {visittkortContent()}
    </MediaQuery>
    <div className={styles.gridContainer}>
      <div className={styles.leftColumn}>
        <MediaQuery minWidth={1600}>
          {visittkortContent()}
        </MediaQuery>
        {behandlingContent}
      </div>
      <div className={styles.rightColumn}>
        <div>{profileAndNavigationContent}</div>
        <div>{supportContent}</div>
      </div>
    </div>
  </>
);

FagsakGrid.propTypes = {
  behandlingContent: PropTypes.node.isRequired,
  profileAndNavigationContent: PropTypes.node.isRequired,
  supportContent: PropTypes.node.isRequired,
  visittkortContent: PropTypes.func.isRequired,
};

export default FagsakGrid;
