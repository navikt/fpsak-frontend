import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Redirect, withRouter } from 'react-router-dom';
import { Panel } from 'nav-frontend-paneler';

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
import { getShowAllBehandlinger, resetFagsakProfile, toggleShowAllBehandlinger } from './duck';
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

const createLink = (link) => `/fagsak/${link.saksnr.verdi}/behandling/${link.behandlingId}/?punkt=uttak`;

export class FagsakProfileIndex extends Component {
  componentDidMount() {
    const { selectedBehandlingId, showAll, toggleShowAll } = this.props;
    if (!selectedBehandlingId && !showAll) {
      toggleShowAll();
    }
  }

  componentWillUnmount() {
    const { reset } = this.props;
    reset();
  }

  pathToBehandling = (alleBehandlinger) => {
    const { saksnummer, location } = this.props;
    if (alleBehandlinger.length === 1) {
      return getLocationWithDefaultBehandlingspunktAndFakta({
        ...location,
        pathname: pathToBehandling(saksnummer, alleBehandlinger[0].id),
      });
    }
    return pathToBehandlinger(saksnummer);
  };

  render() {
    const {
      sakstype,
      toggleShowAll,
      showAll,
      selectedBehandlingId,
      behandlingVersjon,
      alleKodeverk,
      noExistingBehandlinger,
      fagsakStatus,
      saksnummer,
      enabledApis,
      shouldRedirectToBehandlinger,
      dekningsgrad,
    } = this.props;
    return (
      <Panel className={styles.panelPadding}>
        <DataFetcher
          behandlingId={selectedBehandlingId}
          behandlingVersjon={behandlingVersjon}
          showLoadingIcon
          behandlingNotRequired
          endpointParams={{ saksnummer }}
          keepDataWhenRefetching
          endpoints={enabledApis}
          allowErrors
          render={(props) => {
            const alleBehandlinger = getEnabledContexts(props);
            if (shouldRedirectToBehandlinger) {
              return <Redirect to={this.pathToBehandling(alleBehandlinger)} />;
            }
            return (
              <FagsakProfilSakIndex
                annenPartLink={props.annenPartBehandling}
                saksnummer={saksnummer}
                sakstype={sakstype}
                dekningsgrad={dekningsgrad}
                fagsakStatus={fagsakStatus}
                toggleShowAll={toggleShowAll}
                createLink={createLink}
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
          render={(props) => <RisikoklassifiseringIndex {...props} />}
        />
      </Panel>
    );
  }
}

FagsakProfileIndex.propTypes = {
  enabledApis: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  selectedBehandlingId: PropTypes.number,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingVersjon: PropTypes.number,
  shouldRedirectToBehandlinger: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  dekningsgrad: PropTypes.number.isRequired,
};

FagsakProfileIndex.defaultProps = {
  selectedBehandlingId: null,
  behandlingVersjon: null,
};

export const getEnabledApis = createSelector(
  [getEnabledApplicationContexts],
  (enabledApplicationContexts) => [fpsakApi.ANNEN_PART_BEHANDLING].concat(enabledApplicationContexts.map((c) => behandlingerRestApis[c])),
);

const mapStateToProps = (state) => ({
  enabledApis: getEnabledApis(state),
  saksnummer: getSelectedSaksnummer(state),
  dekningsgrad: getSelectedFagsakDekningsgrad(state),
  sakstype: getFagsakYtelseType(state),
  fagsakStatus: getSelectedFagsakStatus(state),
  selectedBehandlingId: getSelectedBehandlingId(state),
  noExistingBehandlinger: getNoExistingBehandlinger(state),
  showAll: getShowAllBehandlinger(state),
  alleKodeverk: getAlleKodeverk(state),
  behandlingVersjon: getBehandlingVersjon(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    toggleShowAll: toggleShowAllBehandlinger,
    reset: resetFagsakProfile,
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
