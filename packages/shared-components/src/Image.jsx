import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import styles from './image.less';

/**
 * Image
 *
 * Presentasjonskomponent. Komponent som har ansvar for visning av bilder.
 */
const Image = ({
  onClick,
  onMouseDown,
  tabIndex,
  className,
  src,
  srcHover,
  alt,
  onKeyDown,
  tooltip,
}) => {
  const [isHovering, setHoovering] = useState(false);

  const onFocus = useCallback(() => {
    setHoovering(true);
  }, []);
  const onBlur = useCallback(() => {
    setHoovering(false);
  }, []);

  const onKeyDownFn = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (onKeyDown) {
        onKeyDown(e);
      }
      e.preventDefault();
    }
  }, []);

  const imgSource = srcHover && isHovering ? srcHover : src;

  const image = (
    <img // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
      className={className}
      src={imgSource}
      alt={alt}
      tabIndex={tabIndex}
      onMouseOver={onFocus}
      onMouseOut={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDownFn}
      onMouseDown={onMouseDown}
      onClick={onClick}
    />
  );

  if (!tooltip) {
    return image;
  }

  return (
    <div className={styles.tooltip}>
      {image}
      <span className={styles.tooltiptext}>{tooltip}</span>
    </div>
  );
};

Image.propTypes = {
  className: PropTypes.string,
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  srcHover: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  onMouseDown: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClick: PropTypes.func,
  alt: PropTypes.string,
  tabIndex: PropTypes.string,
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

Image.defaultProps = {
  className: '',
  src: undefined,
  srcHover: undefined,
  onMouseDown: undefined,
  onKeyDown: undefined,
  onClick: () => undefined,
  tabIndex: '-1',
  tooltip: undefined,
  alt: undefined,
};

export default Image;
