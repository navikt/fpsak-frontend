import React, { Node } from 'react';
import PropTypes from 'prop-types';
import { Undertekst } from 'nav-frontend-typografi';

import styles from './menuButton.less';

type TsProps = Readonly<{
  onClick: () => void;
  children: Node;
}>;

/**
 * MenuButton
 *
 * Presentasjonskomponent. Lager lenker i behandlingsmeny
 */
const MenuButton = React.forwardRef(({
  onClick,
  children,
}: TsProps, ref) => (
  <button ref={ref} className={styles.button} onClick={onClick} type="button">
    <Undertekst>{children}</Undertekst>
  </button>
));

MenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default MenuButton;
