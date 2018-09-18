import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedSaksnummer, getFagsakYtelseType, getSelectedFagsakStatus } from 'fagsak/fagsakSelectors';
import { getBehandlinger, getNoExistingBehandlinger } from 'behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingId } from 'behandling/duck';
import behandlingPropType from 'behandling/proptypes/behandlingPropType';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import requireProps from 'app/data/requireProps';

import {
  getShowAllBehandlinger, toggleShowAllBehandlinger, resetFagsakProfile, getAnnenPartBehandling,
} from './duck';
import FagsakProfile from './components/FagsakProfile';

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
      sakstype, toggleShowAll, showAll, selectedBehandlingId, behandlinger,
      noExistingBehandlinger, fagsakStatus, annenPartLink, saksnummer,
    } = this.props;
    return (
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
      />
    );
  }
}

FagsakProfileIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  selectedBehandlingId: PropTypes.number,
  behandlinger: PropTypes.arrayOf(behandlingPropType).isRequired,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  annenPartLink: PropTypes.shape(),
};

FagsakProfileIndex.defaultProps = {
  selectedBehandlingId: null,
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
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleShowAll: toggleShowAllBehandlinger,
  reset: resetFagsakProfile,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(requireProps(['saksnummer', 'behandlinger'], <LoadingPanel />)(FagsakProfileIndex));
