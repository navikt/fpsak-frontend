import React from 'react';
import PropTypes from 'prop-types';

const navGra40 = '#B7B1A9';
const borderRadius = 4;

// Css er satt opp på en spesiell måte her fordi React ikke støtter psydo-element i inline css. Her er en avhengig av å dynamisk
// endre enkelte variabler i after/before. Bedre løsninger finnes sikkert?
const getArrowBoxTopCss = (alignOffset, marginTop) => `
  .arrowBoxTop${alignOffset} {
    background: #ffffff;
    border: 1px solid ${navGra40};
    border-radius: ${borderRadius}px;
    padding: 15px;
    margin-bottom: 10px;
    position: relative;
    margin-top: ${marginTop}px;
  }
  .arrowBoxTop${alignOffset}:before {
    background-color: #ffffff;
    border: 1px solid ${navGra40};
    border-bottom-width: 0;
    border-right-width: 0;
    content: '';
    height: 1rem;
    top: 0;
    margin-top: -1px;
    position: absolute;
    left: ${alignOffset}px;
    transform: rotate(45deg) translateY(-100%) translateZ(0);
    transform-origin: 0 0;
    width: 1rem;
  }
`;

const getArrowBoxLeftCss = (alignOffset, marginTop) => `
  .arrowBoxLeft${alignOffset} {
    background: #ffffff;
    border: 1px solid ${navGra40};
    border-radius: ${borderRadius}px;
    padding: 15px;
    margin-bottom: 10px;
    position: relative;
    margin-top: ${marginTop}px;
  }

  .arrowBoxLeft${alignOffset}:before {
    background-color: #ffffff;
    border: 1px solid ${navGra40};
    border-bottom-width: 0;
    border-right-width: 0;
    content: '';
    height: 1rem;
    left: 0;
    margin-left: -1px;
    position: absolute;
    top: ${alignOffset}px;
    transform: rotate(-45deg) translateY(-100%) translateZ(0);
    transform-origin: 0 0;
    width: 1rem;
  }
`;
const getArrowBox = (alignOffset, alignLeft, marginTop) => (alignLeft
  ? getArrowBoxLeftCss(alignOffset, marginTop)
  : getArrowBoxTopCss(alignOffset, marginTop)
);
const getClassName = (alignOffset, alignLeft, hideBorder) => {
  if (hideBorder) {
    return '';
  }
  return alignLeft ? `arrowBoxLeft${alignOffset}` : `arrowBoxTop${alignOffset}`;
};

/*
 * ArrowBox
 *
 * Vise innhold med ramme og pil
 */
const ArrowBox = ({
  children,
  alignOffset,
  alignLeft,
  marginTop,
  hideBorder,
}) => (
  <React.Fragment>
    <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
      __html: getArrowBox(alignOffset, alignLeft, marginTop),
    }}
    />
    <div className={getClassName(alignOffset, alignLeft, hideBorder)}>{children}</div>
  </React.Fragment>
);

ArrowBox.propTypes = {
  alignOffset: PropTypes.number,
  alignLeft: PropTypes.bool,
  hideBorder: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  marginTop: PropTypes.number,
};

ArrowBox.defaultProps = {
  alignOffset: 0,
  alignLeft: false,
  hideBorder: false,
  marginTop: 0,
};

export default ArrowBox;
