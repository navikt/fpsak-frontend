import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import endretFelt from '@fpsak-frontend/assets/images/person-edit-2.svg';
import { useIntl } from 'react-intl';
import { Image } from '@fpsak-frontend/shared-components';

import styles from './editedIcon.less';

const classNames = classnames.bind(styles);

/*
 * EditedIcon
 *
 * Komponent/Ikon som viser om noe i GUI er endret.
 */

const EditedIcon = ({ className }) => {
  const intl = useIntl();
  return (
    <span className={classNames('editedIcon', className)}>
      <Image
        src={endretFelt}
        alt={intl.formatMessage({ id: 'Behandling.EditedField' })}
        title={intl.formatMessage({ id: 'Behandling.EditedField' })}
      />
    </span>
  );
};

EditedIcon.propTypes = {
  className: PropTypes.string,
};

EditedIcon.defaultProps = {
  className: '',
};

export default EditedIcon;
