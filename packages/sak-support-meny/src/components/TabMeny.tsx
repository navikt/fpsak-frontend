import React, { FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import {
  Image, FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';

import styles from './tabMeny.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  tabs: {
    image: {};
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
    <FlexRow>
      {tabs.map((tab, index) => (
        <FlexColumn className={styles.container}>
          <button
            className={classNames(styles.button, { active: tab.isActive })}
            type="button"
            onClick={() => onClick(index)}
            data-tooltip={tab.tooltip}
            disabled={tab.isDisabled}
          >
            <Image
              tabIndex="0"
              className={styles.tabImage}
              alt={tab.tooltip}
              src={tab.image}
            />
          </button>
        </FlexColumn>
      ))}
    </FlexRow>
  </FlexContainer>
);

export default TabMeny;
