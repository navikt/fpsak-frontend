import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';

import styles from './fadingPanel.less';

/*
 * FadingPanel
 *
 * Wrapper rundt Panel-komponenten fra nav-frontend. Animerer(fade-in) innholdet i panelet.
 */
const FadingPanel = ({ withoutTopMargin, children }) => (
  <Panel
    className={withoutTopMargin ? styles.containerWithoutTopMargin : styles.container}
  >
    {children}
  </Panel>
);

FadingPanel.propTypes = {
  withoutTopMargin: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

FadingPanel.defaultProps = {
  withoutTopMargin: false,
};

export default FadingPanel;
