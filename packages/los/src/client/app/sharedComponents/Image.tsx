import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import Tooltip from 'sharedComponents/Tooltip';

/**
 * Image
 *
 * Presentasjonskomponent. Komponent som har ansvar for visning av bilder.
 */
export class Image extends Component {
  static propTypes = {
    className: PropTypes.string,
    /**
    * Brukes når en alltid skal vise samme bilde
    */
    src: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    /**
    * Brukes når en har behov for dynamisk visning av bilder, for eksempel grunnet mouseover.
    */
    imageSrcFunction: PropTypes.func,
    onMouseDown: PropTypes.func,
    onKeyDown: PropTypes.func,
    onClick: PropTypes.func,
    alt: PropTypes.string,
    altCode: PropTypes.string,
    title: PropTypes.string,
    titleCode: PropTypes.string,
    tabIndex: PropTypes.string,
    tooltip: PropTypes.shape({
      header: PropTypes.node.isRequired,
      body: PropTypes.node,
    }),
    alignTooltipArrowLeft: PropTypes.bool,
    intl: intlShape.isRequired,
  };

  static defaultProps = {
    className: '',
    src: null,
    imageSrcFunction: null,
    onMouseDown: null,
    onKeyDown: null,
    onClick: () => undefined,
    tabIndex: '-1',
    tooltip: null,
    alignTooltipArrowLeft: false,
    alt: null,
    altCode: null,
    title: null,
    titleCode: null,
  };

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
      tooltip, altCode, onClick, onMouseDown, tabIndex, titleCode, title, intl, className, src, imageSrcFunction, alt,
      alignTooltipArrowLeft,
    } = this.props;
    const { isHovering } = this.state;
    const image = (
      <img // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
        className={className}
        src={src !== null ? src : imageSrcFunction(isHovering)}
        alt={altCode ? intl.formatMessage({ id: altCode }) : alt}
        title={titleCode ? intl.formatMessage({ id: titleCode }) : title}
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

export default injectIntl(Image);
