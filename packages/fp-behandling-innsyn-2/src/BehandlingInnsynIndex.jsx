import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { DataFetcher } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import innsynApi, { reduxRestApi, InnsynBehandlingApiKeys } from './data/innsynBehandlingApi';
import Grid from './components/Grid';

const behandlingData = [innsynApi.BEHANDLING_INNSYN];
const aksjonspunktOgVilkarData = [innsynApi.AKSJONSPUNKTER, innsynApi.VILKAR];

/**
 * BehandlingInnsynIndex
 */
const BehandlingInnsynIndex = ({
  behandlingId,
  fagsak,
  kodeverk,
  alleDokumenter,
  navAnsatt,
  location,
  oppdaterLocation,
}) => {
  const dispatch = useDispatch();
  useEffect(() => () => {
    Object.values(InnsynBehandlingApiKeys)
      .forEach((value) => {
        dispatch(innsynApi[value].resetRestApi()());
      });
  }, []);
  return (
    <DataFetcher
      showLoadingIcon
      keepDataWhenRefetching
      endpoints={behandlingData}
      behandlingNotRequired
      endpointParams={{ behandlingId }}
      render={(dataProps) => {
        reduxRestApi.injectPaths(dataProps.behandlingInnsyn.links);
        return (
          <DataFetcher
            behandlingId={dataProps.behandlingInnsyn.id}
            behandlingVersjon={dataProps.behandlingInnsyn.versjon}
            showLoadingIcon
            endpoints={aksjonspunktOgVilkarData}
            render={(dProps) => (
              <Grid
                fagsak={fagsak}
                behandling={dataProps.behandlingInnsyn}
                aksjonspunkter={dProps.aksjonspunkter}
                vilkar={dProps.vilkar}
                kodeverk={kodeverk}
                alleDokumenter={alleDokumenter}
                navAnsatt={navAnsatt}
                location={location}
                oppdaterLocation={oppdaterLocation}
              />
            )}
          />
        );
      }}
    />
  );
};

BehandlingInnsynIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  fagsak: PropTypes.shape().isRequired,
  kodeverk: PropTypes.shape().isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  location: PropTypes.shape().isRequired,
  oppdaterLocation: PropTypes.func.isRequired,
};

export default BehandlingInnsynIndex;
