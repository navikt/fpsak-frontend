import React, { FunctionComponent, useRef, useEffect } from 'react';
import classnames from 'classnames/bind';

import {
  FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';

import styles from './tabMeny.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  tabs: {
    getSvg: (isActive: boolean, isDisabled: boolean, props: any) => React.ReactNode;
    tooltip: string;
    isActive: boolean;
    isDisabled: boolean;
  }[];
  onClick: (index: number) => void;
}

const TabMeny: FunctionComponent<OwnProps> = ({
  tabs,
  onClick,
}) => {
  const tabRef = useRef([]);

  useEffect(() => {
    tabRef.current = tabRef.current.slice(0, tabs.length);
  }, [tabs]);

  return (
    <FlexContainer>
      <FlexRow className={styles.container}>
        {tabs.map((tab, index) => (
          <FlexColumn key={tab.tooltip} className={styles.column}>
            <button
              className={classNames(styles.button, { active: tab.isActive })}
              type="button"
              onClick={() => {
                if (tabRef.current[index]) {
                  tabRef.current[index].focus();
                }
                onClick(index);
              }}
              data-tooltip={tab.tooltip}
              disabled={tab.isDisabled}
              ref={(el) => { tabRef.current[index] = el; }}
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
};

export default TabMeny;
