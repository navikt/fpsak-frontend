import React, {
  FunctionComponent, useState, useCallback, ReactNode, KeyboardEvent, MouseEvent,
} from 'react';

import styles from './image.less';

interface OwnProps {
  className?: string;
  src?: string;
  srcHover?: string;
  onMouseDown?: (event: MouseEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onClick?: (event: MouseEvent) => void;
  alt?: string;
  tabIndex?: number;
  tooltip?: string | ReactNode;
}

/**
 * Image
 *
 * Presentasjonskomponent. Komponent som har ansvar for visning av bilder.
 */
const Image: FunctionComponent<OwnProps> = ({
  onClick = () => undefined,
  onMouseDown,
  tabIndex = -1,
  className = '',
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

export default Image;
