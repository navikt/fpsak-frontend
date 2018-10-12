import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tooltip from './Tooltip';

export class Svg extends Component {
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
      onKeyDown(e);
      e.preventDefault();
    }
  }

  render() {
    const {
      tooltip, onClick, onMouseDown, tabIndex, src, height, width, disabled
    } = this.props;
    const svgHeight = height !== undefined ? height : '32px';
    const svgWidth = width !== undefined ? width : '32px';
    const svgClass = 'svg';
    const { isHovering } = this.state;
    const svg = (
      <svg
        className={classNames(svgClass, { disabled, isHovering })}
        width={svgWidth}
        height={svgHeight}
        tabIndex={tabIndex}
        onMouseOver={this.onFocus}
        onMouseOut={this.onBlur}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onMouseDown={onMouseDown}
        onClick={() => onClick()}
      >
        <use xlinkHref={`#${src}`} />
      </svg>
    );

    if (tooltip === null) {
      return svg;
    }

    return (
      <Tooltip header={tooltip.header} body={tooltip.body}>
        {svg}
      </Tooltip>
    );
  }
}

Svg.propTypes = {
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
  onMouseDown: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClick: PropTypes.func,
  tabIndex: PropTypes.string,
  tooltip: PropTypes.shape({
    header: PropTypes.node.isRequired,
    body: PropTypes.node,
  }),
};

Svg.defaultProps = {
  className: '',
  src: null,
  onMouseDown: null,
  onKeyDown: null,
  onClick: () => undefined,
  tabIndex: null,
  tooltip: null,
};

export default Svg;
