import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Panel from 'nav-frontend-paneler';

import styles from './borderBox.less';

const classNames = classnames.bind(styles);

/*
 * BorderBox
 *
 * Valideringskomponent. Visar en box kring noe som skall fikses.
 *
 */

const BorderBox = ({
  error,
  className,
  children,
}) => <Panel border className={classNames('borderbox', { error }, className)}>{children}</Panel>;

BorderBox.propTypes = {
  error: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

BorderBox.defaultProps = {
  error: false,
  className: null,
  children: null,
};

export default BorderBox;
