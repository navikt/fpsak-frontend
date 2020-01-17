import React from 'react';
import PropTypes from 'prop-types';

import AksjonspunktHelpTextHTML from './AksjonspunktHelpTextHTML';
import AksjonspunktHelpText from './AksjonspunktHelpText';

/**
 * TODO (TOR) Dette er ein midlertidig komponent som byttar mellom to komponentar. Er ikkje bestemt korleis dette faktisk skal sjå ut enno.
 */
const AksjonspunktHelpTextTemp = ({
  isAksjonspunktOpen,
  children,
}) => (
  <>
    {isAksjonspunktOpen && (
      <AksjonspunktHelpTextHTML>
        {children}
      </AksjonspunktHelpTextHTML>
    )}
    {!isAksjonspunktOpen && (
      <AksjonspunktHelpText isAksjonspunktOpen={false}>
        {children}
      </AksjonspunktHelpText>
    )}
  </>
);

AksjonspunktHelpTextTemp.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string.isRequired),
    PropTypes.arrayOf(PropTypes.element.isRequired),
  ]).isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
};

export default AksjonspunktHelpTextTemp;
