import React from 'react';
import PropTypes from 'prop-types';
import { Undertekst } from 'nav-frontend-typografi';
import classnames from 'classnames/bind';
import { Image } from '@fpsak-frontend/shared-components';

import styles from './behandlingspunktIcon.less';

const classNames = classnames.bind(styles);

/*
 * BehandlingspunktIcon
 *
 * Presentasjonskomponent.
 */
export const BehandlingspunktIcon = (
  {
    callback,
    isIkkeVurdert,
    selected,
    src,
    srcHover,
    title,
  },
) => (
  <div className={classNames('behandlingspunkt', { active: selected })} key={title}>
    <Image
      alt={title}
      className={isIkkeVurdert ? styles.behandlingspunktIkonDisabled : styles.behandlingspunktIkon}
      onKeyDown={isIkkeVurdert ? undefined : callback}
      onMouseDown={isIkkeVurdert ? undefined : callback}
      src={src}
      srcHover={srcHover}
      tabIndex={isIkkeVurdert ? '-1' : '0'}
    />
    <Undertekst className={styles.label}>{title}</Undertekst>
  </div>
);

BehandlingspunktIcon.propTypes = {
  callback: PropTypes.func,
  isIkkeVurdert: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
  srcHover: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default BehandlingspunktIcon;
