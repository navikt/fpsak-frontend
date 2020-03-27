import React, { ReactNode, FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './flexContainer.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  children?: ReactNode | ReactNode[];
  wrap?: boolean;
  fullHeight?: boolean;
}

const FlexContainer: FunctionComponent<OwnProps> = ({
  children,
  wrap = false,
  fullHeight = false,
}) => (
  <div className={classNames('flexContainer', 'fluid', { flexWrap: wrap, fullHeight })}>
    {children}
  </div>
);

export default FlexContainer;
