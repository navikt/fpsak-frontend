import React from 'react';

import { Image } from '@fpsak-frontend/shared-components';

import TimeLineButton from './TimeLineButton';

import styles from './legendBox.less';

interface LegendBoxProps {
  legends: {
    src: string;
    text: string;
  }[];
}

const LegendBox: React.FunctionComponent<LegendBoxProps> = ({
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

export default LegendBox;
