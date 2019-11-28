import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { destroy } from 'redux-form';

import { DataFetcher, getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import { Kodeverk } from './types/kodeverkTsType';
import { FagsakInfo } from './types/fagsakInfoTsType';
import fagsakInfoPropType from './propTypes/fagsakInfoPropType';
import innsynApi, { reduxRestApi, InnsynBehandlingApiKeys } from './data/innsynBehandlingApi';
import Grid from './components/Grid';
import ErrorBoundary from './components/ErrorBoundary';

const behandlingData = [innsynApi.BEHANDLING_INNSYN];
const innsynData = [innsynApi.AKSJONSPUNKTER, innsynApi.VILKAR, innsynApi.INNSYN];

type InnsynProps = Readonly<{
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  kodeverk: Kodeverk;
  alleDokumenter: [{
    id: number;
  }];
  navAnsatt: {};
  location: {};
  oppdaterLocation: () => {};
  oppdaterBehandlingVersjon: () => number;
  behandlingEventHandler: {
    setHandler: ({}) => void;
    clear: () => void;
  };
}>;

const BehandlingInnsynIndex: React.FunctionComponent<InnsynProps> = ({
  behandlingId,
  behandlingVersjon,
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
      // Delay destruction to after potentially expensive transition
      setTimeout(() => dispatch(destroy(getBehandlingFormPrefix(behandlingId, behandlingVersjon)), 1000));

      return Object.values(InnsynBehandlingApiKeys)
        .forEach((value) => {
          dispatch(innsynApi[value].resetRestApi()());
        });
    };
  }, []);

  const forrigeVersjon = useRef();
  useEffect(() => {
    if (forrigeVersjon.current) {
      setTimeout(() => dispatch(destroy(getBehandlingFormPrefix(behandlingId, forrigeVersjon.current)), 1000));
    }
    forrigeVersjon.current = behandlingVersjon;
  }, [behandlingVersjon]);

  return (
    <ErrorBoundary>
      <DataFetcher
        showLoadingIcon
        keepDataWhenRefetching
        endpoints={behandlingData}
        behandlingNotRequired
        endpointParams={{ behandlingId }}
        render={(dataProps) => {
          const { behandlingInnsyn } = dataProps;
          reduxRestApi.injectPaths(behandlingInnsyn.links);
          return (
            <DataFetcher
              behandlingId={behandlingInnsyn.id}
              behandlingVersjon={behandlingInnsyn.versjon}
              showLoadingIcon
              endpoints={innsynData}
              render={(dProps) => (
                <Grid
                  fagsak={fagsak}
                  behandling={behandlingInnsyn}
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
    </ErrorBoundary>
  );
};

BehandlingInnsynIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsak: fagsakInfoPropType.isRequired,
  kodeverk: PropTypes.shape().isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  location: PropTypes.shape().isRequired,
  oppdaterLocation: PropTypes.func.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  behandlingEventHandler: PropTypes.shape().isRequired,
};

export default BehandlingInnsynIndex;
