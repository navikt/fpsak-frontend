import React from 'react';
import PropTypes from 'prop-types';

import styles from './behandlingGrid.less';

const BehandlingGrid = ({
  behandlingsprosessContent,
  faktaContent,
  papirsoknadContent,
}) => (
  <div className={styles.behandlingGrid}>
    {behandlingsprosessContent
    && (
    <div className={styles.contentBlock}>
      {behandlingsprosessContent}
    </div>
    )
    }
    {faktaContent
    && (
    <div className={styles.contentBlock}>
      {faktaContent}
    </div>
    )
    }
    {papirsoknadContent
    && (
    <div className={styles.contentBlock}>
      {papirsoknadContent}
    </div>
    )
    }
  </div>
);

BehandlingGrid.propTypes = {
  behandlingsprosessContent: PropTypes.node,
  faktaContent: PropTypes.node,
  papirsoknadContent: PropTypes.node,
};

BehandlingGrid.defaultProps = {
  behandlingsprosessContent: null,
  faktaContent: null,
  papirsoknadContent: null,
};

export default BehandlingGrid;
