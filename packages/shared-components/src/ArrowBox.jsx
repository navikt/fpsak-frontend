import React from 'react';
import PropTypes from 'prop-types';

const navGra40 = '#B7B1A9';

// Css er satt opp på en spesiell måte her fordi React ikke støtter psydo-element i inline css. Her er en avhengig av å dynamisk
// endre enkelte variabler i after/before. Bedre løsninger finnes sikkert?
const getArrowBoxTopCss = (alignOffset, marginTop) => [`
  .arrowBoxTop${alignOffset} {
    background: #ffffff;
    border: 1px solid ${navGra40};
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 10px;
    position: relative;
    margin-top: ${marginTop}px;
  }
  .arrowBoxTop${alignOffset}:after,
  .arrowBoxTop${alignOffset}:before {
    border: solid transparent;
    bottom: 100%;
    content: '';
    height: 0;
    left: ${alignOffset}px;
    pointer-events: none;
    position: absolute;
    width: 0;
  }
  .arrowBoxTop${alignOffset}:after {
    border-bottom-color: #ffffff;
    border-width: 11px;
    margin-left: -11px;
  }
  .arrowBoxTop${alignOffset}:before {
    border-bottom-color: ${navGra40};
    border-width: 12px;
    margin-left: -12px;
  }
`];
const getArrowBoxLeftCss = (alignOffset, marginTop) => [`
  .arrowBoxLeft${alignOffset} {
    background: #ffffff;
    border: 1px solid ${navGra40};
    border-radius: 4px;
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
`];
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

const BACKWARDS_COMPABILITY_OFFSET = 18;
const DEFAULT_LEFT_OFFSET = 15;
const DEFAULT_TOP_OFFSET = 25;
const getOffset = (alignOffset, alignLeft) => {
  if (alignOffset) {
    return alignLeft ? alignOffset : alignOffset + BACKWARDS_COMPABILITY_OFFSET;
  }
  return alignLeft ? DEFAULT_LEFT_OFFSET : DEFAULT_TOP_OFFSET;
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
}) => {
  const offset = getOffset(alignOffset, alignLeft);
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: getArrowBox(offset, alignLeft, marginTop).join('\n'),
      }}
      />
      <div className={getClassName(offset, alignLeft, hideBorder)}>{children}</div>
    </React.Fragment>
  );
};

ArrowBox.propTypes = {
  alignOffset: PropTypes.number,
  alignLeft: PropTypes.bool,
  hideBorder: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  marginTop: PropTypes.number,
};

ArrowBox.defaultProps = {
  alignOffset: undefined,
  alignLeft: false,
  hideBorder: false,
  marginTop: 0,
};

export default ArrowBox;
