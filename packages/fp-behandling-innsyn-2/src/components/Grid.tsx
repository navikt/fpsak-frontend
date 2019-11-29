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
  innsyn,
  kodeverk,
  alleDokumenter,
  navAnsatt,
  valgtPunkt,
  oppdaterLocation,
  oppdaterBehandlingVersjon,
}) => (
  <>
    {behandling.behandlingHenlagt && (
      <span>Henlagt</span>
    )}
    {!behandling.behandlingHenlagt && (
      <Prosess
        fagsak={fagsak}
        behandling={behandling}
        aksjonspunkter={aksjonspunkter}
        vilkar={vilkar}
        innsyn={innsyn}
        kodeverk={kodeverk}
        alleDokumenter={alleDokumenter}
        navAnsatt={navAnsatt}
        valgtPunkt={valgtPunkt}
        oppdaterLocation={oppdaterLocation}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
      />
    )}
    <VerticalSpacer sixteenPx />
    <PersonIndex medPanel person={fagsak.fagsakPerson} />
  </>
);

Grid.propTypes = {
  fagsak: PropTypes.shape().isRequired,
  behandling: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  innsyn: PropTypes.shape().isRequired,
  kodeverk: PropTypes.shape().isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  valgtPunkt: PropTypes.string.isRequired,
  oppdaterLocation: PropTypes.func.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
};

export default Grid;
