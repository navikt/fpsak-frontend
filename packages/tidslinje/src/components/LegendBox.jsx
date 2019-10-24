import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '@fpsak-frontend/shared-components';
import styles from './legendBox.less';
import TimeLineButton from './TimeLineButton';

const LegendBox = ({
  legends,
}) => (
  <span className={styles.popUnder}>
    <span>
      <TimeLineButton type="question" text="Question" />
    </span>
    <div className={styles.popUnderContent}>
      <div className={styles.legendBoxContainer}>
        {legends.map((legend) => (
          <div className={styles.legendBoxLegend} key={legend.text}>
            <Image
              className={styles.legendBoxIcon}
              src={legend.src}
              alt={legend.text}
            />
            <span>
              {legend.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  </span>

);

const Legend = () => {};
Legend.propTypes = {
  src: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
LegendBox.propTypes = {
  legends: PropTypes.arrayOf(Legend).isRequired,
};

export default LegendBox;
