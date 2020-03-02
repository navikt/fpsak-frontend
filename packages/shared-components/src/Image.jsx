import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './image.less';

/**
 * Image
 *
 * Presentasjonskomponent. Komponent som har ansvar for visning av bilder.
 */
class Image extends Component {
  constructor() {
    super();

    this.state = {
      isHovering: false,
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onFocus() {
    this.setState({ isHovering: true });
  }

  onBlur() {
    this.setState({ isHovering: false });
  }

  onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const { onKeyDown } = this.props;
      if (onKeyDown) {
        onKeyDown(e);
      }
      e.preventDefault();
    }
  }

  render() {
    const {
      tooltip, onClick, onMouseDown, tabIndex, className, src, srcHover, alt,
    } = this.props;
    let imgSource = src;
    const { isHovering } = this.state;
    if (srcHover !== null && isHovering) {
      imgSource = srcHover;
    }

    const image = (
      <img // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
        className={className}
        src={imgSource}
        alt={alt}
        tabIndex={tabIndex}
        onMouseOver={this.onFocus}
        onMouseOut={this.onBlur}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
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
  }
}

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
  src: null,
  srcHover: null,
  onMouseDown: null,
  onKeyDown: null,
  onClick: () => undefined,
  tabIndex: '-1',
  tooltip: undefined,
  alt: null,
};

export default Image;
