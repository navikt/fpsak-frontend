import React, { ReactNode, FunctionComponent } from 'react';
import classnames from 'classnames/bind';

import styles from './aksjonspunktBox.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  children: ReactNode | ReactNode[];
  erAksjonspunktApent: boolean;
  className?: string;
}

const AksjonspunktBox: FunctionComponent<OwnProps> = ({
  erAksjonspunktApent,
  className,
  children,
}) => <div className={classNames(className, 'aksjonspunkt', { erAksjonspunktApent })}>{children}</div>;

export default AksjonspunktBox;
