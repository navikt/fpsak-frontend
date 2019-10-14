import React from 'react';
import PropTypes from 'prop-types';

import PersonInfo from './PersonInfo';

/**
 * Viser grunnleggende personinformasjon. Dette panelet blir
 * vist som del av søkeresultatet, når fagsaken ikke har behandling eller ved papirsøknad
 */
const PersonIndex = ({
  person,
  medPanel,
}) => (person
  ? <PersonInfo person={person} medPanel={medPanel} />
  : null);

PersonIndex.propTypes = {
  person: PropTypes.shape(),
  medPanel: PropTypes.bool,
};

PersonIndex.defaultProps = {
  person: undefined,
  medPanel: false,
};

export default PersonIndex;
