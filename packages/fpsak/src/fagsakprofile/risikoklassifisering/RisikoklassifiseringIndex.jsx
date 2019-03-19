import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getRisikoklassifisering,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import kontrollresultatKode from '@fpsak-frontend/kodeverk/src/kontrollresultatKode';

import IngenRisikoPanel from './components/IngenRisikoPanel';
import ManglendeKlassifiseringPanel from './components/ManglendeKlassifiseringPanel';
import HoyRisikoTittel from './components/HoyRisikoTittel';

const harResultatkode = (risikoklassifisering, resultatkode) => {
  if (!risikoklassifisering || !risikoklassifisering.kontrollresultat) {
    return false;
  }
  return risikoklassifisering.kontrollresultat.kode === resultatkode;
};

/**
 * RisikoklassifiseringIndex
 *
 * Container komponent. Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */

export const RisikoklassifiseringIndexImpl = ({
   risikoklassifisering,
}) => {
    if (harResultatkode(risikoklassifisering, kontrollresultatKode.IKKE_HOY)) {
      return (
        <IngenRisikoPanel />
      );
    }
    if (harResultatkode(risikoklassifisering, kontrollresultatKode.HOY)) {
      return (
        <HoyRisikoTittel
          risikoklassifisering={risikoklassifisering}
        />
      );
    }
    return (
      <ManglendeKlassifiseringPanel />
      );
};

RisikoklassifiseringIndexImpl.propTypes = {
  risikoklassifisering: PropTypes.shape(),
};

RisikoklassifiseringIndexImpl.defaultProps = {
  risikoklassifisering: undefined,
};

const mapStateToProps = state => ({
  risikoklassifisering: getRisikoklassifisering(state),
});

const RisikoklassifiseringIndex = connect(mapStateToProps)(RisikoklassifiseringIndexImpl);

export default RisikoklassifiseringIndex;
