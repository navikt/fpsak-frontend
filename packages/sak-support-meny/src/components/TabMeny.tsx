import React, { FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import {
  FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';

import styles from './tabMeny.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  tabs: {
    getSvg: (isActive: boolean, isDisabled: boolean, props: {}) => React.ReactNode;
    tooltip: string;
    isActive: boolean;
    isDisabled: boolean;
  }[];
  onClick: (index: number) => void;
}

const TabMeny: FunctionComponent<OwnProps> = ({
  tabs,
  onClick,
}) => (
  <FlexContainer>
    <FlexRow className={styles.container}>
      {tabs.map((tab, index) => (
        <FlexColumn className={styles.column}>
          <button
            className={classNames(styles.button, { active: tab.isActive })}
            type="button"
            onClick={() => onClick(index)}
            data-tooltip={tab.tooltip}
            disabled={tab.isDisabled}
          >
            {tab.getSvg(tab.isActive, tab.isDisabled, {
              className: styles.tabImage,
              tabIndex: '-1',
              alt: tab.tooltip,
            })}
          </button>
        </FlexColumn>
      ))}
    </FlexRow>
  </FlexContainer>
);

export default TabMeny;
