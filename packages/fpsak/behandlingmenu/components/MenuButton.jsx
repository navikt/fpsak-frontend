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
  onClick,
  disabled,
  children,
}) => (
  <Knapp mini className={styles.button} onClick={onClick} tabIndex="0" disabled={disabled}>
    {children}
  </Knapp>
);

MenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  disabled: PropTypes.bool,
};

MenuButton.defaultProps = {
  disabled: false,
};

export default MenuButton;
