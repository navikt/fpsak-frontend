import React from 'react';
import Proptypes from 'prop-types';
import cn from 'classnames';
import Chevron from 'nav-frontend-chevron';
import styles from './lesMerPanel.less';

const LesMerToggle = (props) => {
  const {
    erApen, onClick, lukkTekst, apneTekst, other,
  } = props;
  const btnClassName = cn(styles.lesMerPanel__togglelink,
    erApen ? styles['lesMerPanel__togglelink--erApen'] : '');

  return (
    <div className={styles.lesMerPanel__toggle}>
      <button
        type="button"
        aria-expanded={erApen}
        onClick={onClick}
        className={btnClassName}
        {...other}
      >

        <div className={styles.lesMerPanel__toggleTekst}>
          {erApen ? lukkTekst : apneTekst}
          <Chevron type={erApen ? 'opp' : 'ned'} className={styles.lesMerPanel__toggleChevron} />
        </div>
      </button>
    </div>
  );
};

LesMerToggle.propTypes = {
  erApen: Proptypes.bool,
  onClick: Proptypes.func.isRequired,
  lukkTekst: Proptypes.node,
  apneTekst: Proptypes.node,
  other: Proptypes.shape(),
};

export default LesMerToggle;
