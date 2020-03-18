import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import keyImage from '@fpsak-frontend/assets/images/key-1-rotert.svg';
import keyUtgraetImage from '@fpsak-frontend/assets/images/key-1-rotert-utgraet.svg';

import Image from './Image';

import styles from './overstyringKnapp.less';

/*
 * OverstyringKnapp
 */
const OverstyringKnapp = ({
  intl,
  onClick,
  erOverstyrt,
}) => {
  const [isOverstyrt, setOverstyrt] = useState(erOverstyrt);
  const setOverstyrtFn = useCallback(() => {
    if (!isOverstyrt) {
      setOverstyrt(true);
      onClick(true);
    }
  }, []);

  useEffect(() => {
    setOverstyrt(erOverstyrt);
  }, [erOverstyrt]);

  return (
    <Image
      className={isOverstyrt ? styles.keyWithoutCursor : styles.key}
      src={isOverstyrt ? keyUtgraetImage : keyImage}
      onClick={setOverstyrtFn}
      onKeyDown={setOverstyrtFn}
      tabIndex="0"
      tooltip={intl.formatMessage({ id: 'OverstyringKnapp.Overstyring' })}
    />
  );
};

OverstyringKnapp.propTypes = {
  intl: PropTypes.shape().isRequired,
  onClick: PropTypes.func,
  erOverstyrt: PropTypes.bool,
};

OverstyringKnapp.defaultProps = {
  onClick: () => undefined,
  erOverstyrt: false,
};

export default injectIntl(OverstyringKnapp);
