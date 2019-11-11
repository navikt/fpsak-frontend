import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Panel } from 'nav-frontend-paneler';

import { behandlingIListePropType } from '@fpsak-frontend/prop-types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { requireProps, DataFetcher } from '@fpsak-frontend/fp-felles';

import fpsakApi from '../data/fpsakApi';
import { getFagsakYtelseType, getSelectedFagsakStatus, getSelectedSaksnummer } from '../fagsak/fagsakSelectors';
import { getBehandlinger, getNoExistingBehandlinger } from '../behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../behandling/duck';
import {
  getAnnenPartBehandling, getShowAllBehandlinger, resetFagsakProfile, toggleShowAllBehandlinger,
} from './duck';
import FagsakProfile from './components/FagsakProfile';
import RisikoklassifiseringIndex from './risikoklassifisering/RisikoklassifiseringIndex';
import { getAlleKodeverk } from '../kodeverk/duck';

import styles from './fagsakProfileIndex.less';

const risikoklassifiseringData = [fpsakApi.RISIKO_AKSJONSPUNKT, fpsakApi.KONTROLLRESULTAT];

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

  render() {
    const {
      sakstype, toggleShowAll, showAll, selectedBehandlingId, behandlingVersjon, behandlinger, alleKodeverk,
      noExistingBehandlinger, fagsakStatus, annenPartLink, saksnummer,
    } = this.props;
    return (
      <Panel className={styles.panelPadding}>
        <FagsakProfile
          annenPartLink={annenPartLink}
          saksnummer={saksnummer}
          sakstype={sakstype}
          fagsakStatus={fagsakStatus}
          behandlinger={behandlinger}
          noExistingBehandlinger={noExistingBehandlinger}
          selectedBehandlingId={selectedBehandlingId}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
          alleKodeverk={alleKodeverk}
        />
        <DataFetcher
          behandlingId={selectedBehandlingId}
          behandlingVersjon={behandlingVersjon}
          showComponent={risikoklassifiseringData.every((d) => d.isEndpointEnabled())}
          data={risikoklassifiseringData}
          render={(props) => (
            <RisikoklassifiseringIndex
              {...props}
            />
          )}
        />
      </Panel>
    );
  }
}

FagsakProfileIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  selectedBehandlingId: PropTypes.number,
  behandlinger: PropTypes.arrayOf(behandlingIListePropType).isRequired,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  annenPartLink: PropTypes.shape(),
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingVersjon: PropTypes.number,
};

FagsakProfileIndex.defaultProps = {
  selectedBehandlingId: null,
  behandlingVersjon: null,
  annenPartLink: {},
};

const mapStateToProps = (state) => {
  const annenPartLink = getAnnenPartBehandling(state);

  return {
    annenPartLink,
    saksnummer: getSelectedSaksnummer(state),
    sakstype: getFagsakYtelseType(state),
    fagsakStatus: getSelectedFagsakStatus(state),
    selectedBehandlingId: getSelectedBehandlingId(state),
    behandlinger: getBehandlinger(state),
    noExistingBehandlinger: getNoExistingBehandlinger(state),
    showAll: getShowAllBehandlinger(state),
    alleKodeverk: getAlleKodeverk(state),
    behandlingVersjon: getBehandlingVersjon(state),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleShowAll: toggleShowAllBehandlinger,
  reset: resetFagsakProfile,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(requireProps(['saksnummer', 'behandlinger'], <LoadingPanel />)(FagsakProfileIndex));
