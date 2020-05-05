import React, {
  FunctionComponent, useEffect, useCallback, useState,
} from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import keyImage from '@fpsak-frontend/assets/images/key-1-rotert.svg';
import keyUtgraetImage from '@fpsak-frontend/assets/images/key-1-rotert-utgraet.svg';

import Image from './Image';

import styles from './overstyringKnapp.less';

interface OwnProps {
  onClick?: (overstyrt: boolean) => void;
  erOverstyrt?: boolean;
}

/*
 * OverstyringKnapp
 */
const OverstyringKnapp: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  onClick = () => undefined,
  erOverstyrt = false,
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
      onClick={!erOverstyrt && setOverstyrtFn}
      onKeyDown={!erOverstyrt && setOverstyrtFn}
      tabIndex={0}
      tooltip={intl.formatMessage({ id: 'OverstyringKnapp.Overstyring' })}
    />
  );
};

export default injectIntl(OverstyringKnapp);
