import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { DataFetcher } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import innsynApi, { reduxRestApi, InnsynBehandlingApiKeys } from './data/innsynBehandlingApi';
import Grid from './components/Grid';

const behandlingData = [innsynApi.BEHANDLING_INNSYN];
const innsynData = [innsynApi.AKSJONSPUNKTER, innsynApi.VILKAR, innsynApi.INNSYN];

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
  oppdaterBehandlingVersjon,
  behandlingEventHandler,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: (params) => dispatch(innsynApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest()(params))
        .then(() => dispatch(innsynApi.BEHANDLING_INNSYN.makeRestApiRequest()({ behandlingId }))),
      settBehandlingPaVent: (params) => dispatch(innsynApi.BEHANDLING_ON_HOLD.makeRestApiRequest()(params))
        .then(() => dispatch(innsynApi.BEHANDLING_INNSYN.makeRestApiRequest()({ behandlingId }))),
      taBehandlingAvVent: (params) => dispatch(innsynApi.RESUME_BEHANDLING.makeRestApiRequest()(params)),
      henleggBehandling: (params) => dispatch(innsynApi.HENLEGG_BEHANDLING.makeRestApiRequest()(params)),
    });

    return () => {
      behandlingEventHandler.clear();
      return Object.values(InnsynBehandlingApiKeys)
        .forEach((value) => {
          dispatch(innsynApi[value].resetRestApi()());
        });
    };
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
            endpoints={innsynData}
            render={(dProps) => (
              <Grid
                fagsak={fagsak}
                behandling={dataProps.behandlingInnsyn}
                aksjonspunkter={dProps.aksjonspunkter}
                vilkar={dProps.vilkar}
                innsyn={dProps.innsyn}
                kodeverk={kodeverk}
                alleDokumenter={alleDokumenter}
                navAnsatt={navAnsatt}
                location={location}
                oppdaterLocation={oppdaterLocation}
                oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
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
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  behandlingEventHandler: PropTypes.shape().isRequired,
};

export default BehandlingInnsynIndex;
