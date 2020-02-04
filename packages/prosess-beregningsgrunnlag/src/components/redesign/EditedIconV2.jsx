import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import endretFelt from '@fpsak-frontend/assets/images/person-edit-2.svg';
import { useIntl } from 'react-intl';
import { Image } from '@fpsak-frontend/shared-components';

import styles from './editedIconV2.less';

const classNames = classnames.bind(styles);

/*
 * EditedIcon
 *
 * Komponent/Ikon som viser om noe i GUI er endret.
 */

const EditedIconV2 = ({ className }) => {
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

EditedIconV2.propTypes = {
  className: PropTypes.string,
};

EditedIconV2.defaultProps = {
  className: '',
};

export default EditedIconV2;
