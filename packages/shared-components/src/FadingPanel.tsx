import React, { ReactNode, FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';

import styles from './fadingPanel.less';

interface OwnProps {
  withoutTopMargin?: boolean;
  children: ReactNode | ReactNode[];
}

/*
 * FadingPanel
 *
 * Wrapper rundt Panel-komponenten fra nav-frontend. Animerer(fade-in) innholdet i panelet.
 */
const FadingPanel: FunctionComponent<OwnProps> = ({
  withoutTopMargin = false,
  children,
}) => (
  <Panel
    className={withoutTopMargin ? styles.containerWithoutTopMargin : styles.container}
  >
    {children}
  </Panel>
);

export default FadingPanel;
