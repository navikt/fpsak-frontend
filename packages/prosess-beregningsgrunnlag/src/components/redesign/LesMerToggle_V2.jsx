import React from 'react';
import Proptypes from 'prop-types';
import cn from 'classnames';
import Chevron from 'nav-frontend-chevron';
import styles from './lesmerpanel_V2-style.less';

const LesMerToggle2 = (props) => {
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

        <div className={styles.lesMerPanel__toggleTekst} id="linkTekst">
          {erApen ? lukkTekst : apneTekst}
          <Chevron type={erApen ? 'opp' : 'ned'} className={styles.lesMerPanel__toggleChevron} />
        </div>
      </button>
    </div>
  );
};

LesMerToggle2.propTypes = {
  erApen: Proptypes.bool,
  onClick: Proptypes.func.isRequired,
  lukkTekst: Proptypes.node,
  apneTekst: Proptypes.node,
  other: Proptypes.shape(),
};


export default LesMerToggle2;
