import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';

import { PersonIndex } from '@fpsak-frontend/person-info';

/**
 * Viser grunnleggende personinformasjon. Dette panelet blir
 * vist som del av søkeresultatet, når fagsaken ikke har behandling eller ved papirsøknad
 */
const GrunnleggendePersoninfoPanel = ({
  person,
}) => (
  <Panel>
    {person && (
      <PersonIndex person={person} />
    )}
  </Panel>
);

GrunnleggendePersoninfoPanel.propTypes = {
  person: PropTypes.shape(),
};

GrunnleggendePersoninfoPanel.defaultProps = {
  person: undefined,
};

export default GrunnleggendePersoninfoPanel;
