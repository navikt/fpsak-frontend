import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import classnames from 'classnames/bind';
import styles from './fadingPanel.less';

const classNames = classnames.bind(styles);
/*
 * FadingPanel
 *
 * Wrapper rundt Panel-komponenten fra nav-frontend. Animerer(fade-in) innholdet i panelet.
 */
const FadingPanel = ({ withoutTopMargin, children }) => (
  <Panel
    className={withoutTopMargin ? classNames('container', 'containerWithoutTopMargin') : styles.container}
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
