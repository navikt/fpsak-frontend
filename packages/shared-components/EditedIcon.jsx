import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import endretFelt from '@fpsak-frontend/assets/images/endret_felt.svg';
import Image from './Image';
import styles from './editedIcon.less';

const classNames = classnames.bind(styles);

/*
 * EditedIcon
 *
 * Komponent/Ikon som viser om noe i GUI er endret.
 */

const EditedIcon = ({ className }) => (
  <span className={classNames('editedIcon', className)}>
    <Image src={endretFelt} titleCode="Behandling.EditedField" altCode="Behandling.EditedField" />
  </span>
);

EditedIcon.propTypes = {
  className: PropTypes.string,
};

EditedIcon.defaultProps = {
  className: '',
};

export default EditedIcon;
