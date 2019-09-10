import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tooltip from './Tooltip';

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
      tooltip, onClick, onMouseDown, tabIndex, title, className, src, srcHover, alt,
      alignTooltipArrowLeft,
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
        title={title}
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

    if (tooltip === null) {
      return image;
    }

    return (
      <Tooltip header={tooltip.header} body={tooltip.body} show={isHovering} alignArrowLeft={alignTooltipArrowLeft}>
        {image}
      </Tooltip>
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
  title: PropTypes.string,
  tabIndex: PropTypes.string,
  tooltip: PropTypes.shape({
    header: PropTypes.node.isRequired,
    body: PropTypes.node,
  }),
  alignTooltipArrowLeft: PropTypes.bool,
};

Image.defaultProps = {
  className: '',
  src: null,
  srcHover: null,
  onMouseDown: null,
  onKeyDown: null,
  onClick: () => undefined,
  tabIndex: '-1',
  tooltip: null,
  alignTooltipArrowLeft: false,
  alt: null,
  title: null,
};

export default Image;
