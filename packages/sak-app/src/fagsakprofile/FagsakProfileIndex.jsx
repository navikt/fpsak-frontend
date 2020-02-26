import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Redirect, withRouter } from 'react-router-dom';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  requireProps,
  DataFetcher,
  getLocationWithDefaultBehandlingspunktAndFakta,
  pathToBehandling,
  pathToBehandlinger,
} from '@fpsak-frontend/fp-felles';
import BehandlingVelgerSakIndex from '@fpsak-frontend/sak-behandling-velger';
import FagsakProfilSakIndex from '@fpsak-frontend/sak-fagsak-profil';

import { getEnabledApplicationContexts } from '../app/duck';
import ApplicationContextPath from '../behandling/ApplicationContextPath';
import BehandlingMenuIndex from '../behandlingmenu/BehandlingMenuIndex';
import fpsakApi from '../data/fpsakApi';
import {
  getFagsakYtelseType,
  getSelectedFagsakStatus,
  getSelectedSaksnummer,
  getSelectedFagsakDekningsgrad,
} from '../fagsak/fagsakSelectors';
import { getNoExistingBehandlinger } from '../behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../behandling/duck';
import RisikoklassifiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';
import { getAlleKodeverk } from '../kodeverk/duck';

import styles from './fagsakProfileIndex.less';

const risikoklassifiseringData = [fpsakApi.RISIKO_AKSJONSPUNKT, fpsakApi.KONTROLLRESULTAT];

const behandlingerRestApis = {
  [ApplicationContextPath.FPSAK]: fpsakApi.BEHANDLINGER_FPSAK,
  [ApplicationContextPath.FPTILBAKE]: fpsakApi.BEHANDLINGER_FPTILBAKE,
};

export const getEnabledContexts = createSelector(
  [(props) => props.behandlingerFpsak, (props) => props.behandlingerFptilbake],
  (behandlingerFpsak = [], behandlingerFptilbake = []) => behandlingerFpsak.concat(behandlingerFptilbake),
);

const findPathToBehandling = (saksnummer, location, alleBehandlinger) => {
  if (alleBehandlinger.length === 1) {
    return getLocationWithDefaultBehandlingspunktAndFakta({
      ...location,
      pathname: pathToBehandling(saksnummer, alleBehandlinger[0].id),
    });
  }
  return pathToBehandlinger(saksnummer);
};

export const FagsakProfileIndex = ({
  sakstype,
  selectedBehandlingId,
  behandlingVersjon,
  alleKodeverk,
  noExistingBehandlinger,
  fagsakStatus,
  saksnummer,
  location,
  enabledApis,
  shouldRedirectToBehandlinger,
  dekningsgrad,
}) => {
  const [showAll, setShowAll] = useState(!selectedBehandlingId);
  const toggleShowAll = useCallback(() => setShowAll(!showAll));

  useEffect(() => {
    setShowAll(!selectedBehandlingId);
  }, [selectedBehandlingId]);

  return (
    <div className={styles.panelPadding}>
      <DataFetcher
        behandlingId={selectedBehandlingId}
        behandlingVersjon={behandlingVersjon}
        showLoadingIcon
        behandlingNotRequired
        endpointParams={{
          [fpsakApi.BEHANDLINGER_FPSAK.name]: { saksnummer },
          [fpsakApi.BEHANDLINGER_FPTILBAKE.name]: { saksnummer },
        }}
        keepDataWhenRefetching
        endpoints={enabledApis}
        allowErrors
        render={(dataProps) => {
          const alleBehandlinger = getEnabledContexts(dataProps);
          if (shouldRedirectToBehandlinger) {
            return <Redirect to={findPathToBehandling(saksnummer, location, alleBehandlinger)} />;
          }
          return (
            <FagsakProfilSakIndex
              saksnummer={saksnummer}
              sakstype={sakstype}
              dekningsgrad={dekningsgrad}
              fagsakStatus={fagsakStatus}
              alleKodeverk={alleKodeverk}
              renderBehandlingMeny={() => <BehandlingMenuIndex />}
              renderBehandlingVelger={() => (
                <BehandlingVelgerSakIndex
                  behandlinger={alleBehandlinger}
                  saksnummer={saksnummer}
                  noExistingBehandlinger={noExistingBehandlinger}
                  behandlingId={selectedBehandlingId}
                  showAll={showAll}
                  toggleShowAll={toggleShowAll}
                  alleKodeverk={alleKodeverk}
                />
              )}
            />
          );
        }}
      />
      <DataFetcher
        behandlingId={selectedBehandlingId}
        behandlingVersjon={behandlingVersjon}
        showComponent={risikoklassifiseringData.every((d) => d.isEndpointEnabled())}
        endpoints={risikoklassifiseringData}
        render={(dataProps) => <RisikoklassifiseringIndex {...dataProps} />}
      />
    </div>
  );
};

FagsakProfileIndex.propTypes = {
  enabledApis: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  selectedBehandlingId: PropTypes.number,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingVersjon: PropTypes.number,
  shouldRedirectToBehandlinger: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  dekningsgrad: PropTypes.number.isRequired,
};

FagsakProfileIndex.defaultProps = {
  selectedBehandlingId: undefined,
  behandlingVersjon: null,
};

export const getEnabledApis = createSelector(
  [getEnabledApplicationContexts],
  (enabledApplicationContexts) => enabledApplicationContexts.map((c) => behandlingerRestApis[c]),
);

const mapStateToProps = (state) => ({
  enabledApis: getEnabledApis(state),
  saksnummer: getSelectedSaksnummer(state),
  dekningsgrad: getSelectedFagsakDekningsgrad(state),
  sakstype: getFagsakYtelseType(state),
  fagsakStatus: getSelectedFagsakStatus(state),
  selectedBehandlingId: getSelectedBehandlingId(state),
  noExistingBehandlinger: getNoExistingBehandlinger(state),
  alleKodeverk: getAlleKodeverk(state),
  behandlingVersjon: getBehandlingVersjon(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
  },
  dispatch,
);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  shouldRedirectToBehandlinger: ownProps.match.isExact,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(requireProps(['saksnummer'], <LoadingPanel />)(FagsakProfileIndex)),
);
