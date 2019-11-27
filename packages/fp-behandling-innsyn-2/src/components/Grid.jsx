import React from 'react';
import PropTypes from 'prop-types';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';
import { PersonIndex } from '@fpsak-frontend/person-info';

import Prosess from './Prosess';

const Grid = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  kodeverk,
  alleDokumenter,
  navAnsatt,
  location,
  oppdaterLocation,
}) => (
  <>
    <Prosess
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      vilkar={vilkar}
      kodeverk={kodeverk}
      alleDokumenter={alleDokumenter}
      navAnsatt={navAnsatt}
      location={location}
      oppdaterLocation={oppdaterLocation}
    />
    <VerticalSpacer sixteenPx />
    <PersonIndex medPanel person={fagsak.fagsakPerson} />
  </>
);

Grid.propTypes = {
  fagsak: PropTypes.shape().isRequired,
  behandling: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  kodeverk: PropTypes.shape().isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  location: PropTypes.shape().isRequired,
  oppdaterLocation: PropTypes.func.isRequired,
};

export default Grid;
