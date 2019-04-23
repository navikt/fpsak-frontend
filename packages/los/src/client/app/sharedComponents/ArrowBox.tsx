import React from 'react';
import PropTypes from 'prop-types';

// Css er satt opp på en spesiell måte her fordi React ikke støtter psydo-element i inline css. Her er en avhengig av å dynamisk
// endre enkelte variabler i after/before. Bedre løsninger finnes sikkert?
const getArrowBoxTopCss = alignOffset => [
  `.arrowBoxTop${alignOffset} {`,
  '  background: #ffffff;',
  '  border: 1px solid #cccccc;',
  '  border-radius: 4px;',
  '  padding: 15px 0px 0px 15px;',
  '  margin-bottom: 10px;',
  '  position: relative;',
  '}',
  `.arrowBoxTop${alignOffset}:after,`,
  `.arrowBoxTop${alignOffset}:before {`,
  '  border: solid transparent;',
  '  bottom: 100%;',
  '  content: \' \';',
  '  height: 0;',
  `  left: ${alignOffset}px;`,
  '  pointer-events: none;',
  '  position: absolute;',
  '  width: 0;',
  '}',
  `.arrowBoxTop${alignOffset}:after {`,
  '  border-bottom-color: #ffffff;',
  '  border-width: 11px;',
  '  margin-left: -11px;',
  '}',
  `.arrowBoxTop${alignOffset}:before {`,
  '  border-bottom-color: #cccccc;',
  '  border-width: 12px;',
  '  margin-left: -12px;',
  '}'];
const getArrowBoxLeftCss = alignOffset => [
  `.arrowBoxLeft${alignOffset} {`,
  '  background: #ffffff;',
  '  border: 1px solid #cccccc;',
  '  border-radius: 4px;',
  '  padding: 15px;',
  '  margin-bottom: 10px;',
  '  position: relative;',
  '}',
  `.arrowBoxLeft${alignOffset}:after,`,
  `.arrowBoxLeft${alignOffset}:before {`,
  '  border: solid transparent;',
  '  content: \' \';',
  '  height: 0;',
  '  pointer-events: none;',
  '  position: absolute;',
  '  right: 100%;',
  `  top: ${alignOffset}px;`,
  '  width: 0;',
  '}',
  `.arrowBoxLeft${alignOffset}:after {`,
  '  border-right-color: #ffffff;',
  '  border-width: 11px;',
  '  margin-left: -11px;',
  '}',
  `.arrowBoxLeft${alignOffset}:before {`,
  '  border-right-color: #cccccc;',
  '  border-width: 12px;',
  '  margin-left: -12px;',
  '}'];
const getArrowBox = (alignOffset, alignLeft) => (alignLeft ? getArrowBoxLeftCss(alignOffset) : getArrowBoxTopCss(alignOffset));
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
  hideBorder,
}) => {
  const offset = getOffset(alignOffset, alignLeft);
  return (
    <>
      <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: getArrowBox(offset, alignLeft).join('\n'),
      }}
      />
      <div className={getClassName(offset, alignLeft, hideBorder)}>{children}</div>
    </>
  );
};

ArrowBox.propTypes = {
  alignOffset: PropTypes.number,
  alignLeft: PropTypes.bool,
  hideBorder: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

ArrowBox.defaultProps = {
  alignOffset: undefined,
  alignLeft: false,
  hideBorder: false,
};

export default ArrowBox;
