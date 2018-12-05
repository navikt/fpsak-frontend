import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';

import styles from './menuButton.less';

/**
 * MenuButton
 *
 * Presentasjonskomponent. Lager lenker i behandlingsmeny
 */
const MenuButton = ({
  disabled,
  children,
  onMouseDown,
}) => (
  <Knapp mini className={styles.button} onMouseDown={onMouseDown} tabIndex="0" disabled={disabled}>
    {children}
  </Knapp>
);

MenuButton.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  disabled: PropTypes.bool,
};

MenuButton.defaultProps = {
  disabled: false,
};

export default MenuButton;
