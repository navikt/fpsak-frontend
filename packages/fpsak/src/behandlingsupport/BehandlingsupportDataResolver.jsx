import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { getSelectedBehandlingId } from '../behandling/duck';
import { getBehandlingerTypesMappedById, getBehandlingerStatusMappedById } from '../behandling/selectors/behandlingerSelectors';
import fpsakApi from '../data/fpsakApi';

// TODO (TOR) Det er i dag behov for å kalle totrinns-endepunkt her fordi BehandlingSupportIndex har behov for datte. Bedre om dette
// kan flyttast til "approval".
/**
 * BehandlingsupportDataResolver
 *
 * Har ansvar for å hente opp data som skal brukes i supportpanelet.
 */
export class BehandlingsupportDataResolver extends Component {
  static propTypes = {
    fetchTotrinnsaksjonspunkter: PropTypes.func.isRequired,
    fetchTotrinnsaksjonspunkterReadonly: PropTypes.func.isRequired,
    resetTotrinnsaksjonspunkter: PropTypes.func.isRequired,
    resetTotrinnsaksjonspunkterReadonly: PropTypes.func.isRequired,
    behandlingId: PropTypes.number,
    behandlingStatusKode: PropTypes.string,
    isInSync: PropTypes.bool.isRequired,
    isInnsyn: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    behandlingId: undefined,
    behandlingStatusKode: undefined,
  };

  componentDidUpdate = (prevProps) => {
    const {
      fetchTotrinnsaksjonspunkter, fetchTotrinnsaksjonspunkterReadonly, resetTotrinnsaksjonspunkter,
      resetTotrinnsaksjonspunkterReadonly, behandlingId, behandlingStatusKode, isInnsyn,
    } = this.props;

    if (behandlingStatusKode && behandlingId !== prevProps.behandlingId) {
      resetTotrinnsaksjonspunkter();
      resetTotrinnsaksjonspunkterReadonly();
      if (!isInnsyn && behandlingStatusKode === BehandlingStatus.FATTER_VEDTAK) {
        fetchTotrinnsaksjonspunkter();
      }
      if (!isInnsyn && behandlingStatusKode === BehandlingStatus.BEHANDLING_UTREDES) {
        fetchTotrinnsaksjonspunkterReadonly();
      }
    }
  }

  render() {
    const { isInSync, children } = this.props;
    return isInSync
      ? children
      : <LoadingPanel />;
  }
}

const mapStateToProps = (state) => {
  const behandlingId = getSelectedBehandlingId(state);
  const behandlingStatusKode = getBehandlingerStatusMappedById(state)[behandlingId];
  const isInnsyn = getBehandlingerTypesMappedById(state)[behandlingId] === behandlingType.DOKUMENTINNSYN;

  const blockers = [];
  if (behandlingStatusKode && behandlingStatusKode.kode === BehandlingStatus.FATTER_VEDTAK) {
    blockers.push(fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.getRestApiFinished()(state));
  }
  if (behandlingStatusKode && behandlingStatusKode.kode === BehandlingStatus.BEHANDLING_UTREDES) {
    blockers.push(fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiFinished()(state));
  }

  return {
    isInSync: isInnsyn || blockers.every((finished) => finished),
    isInnsyn,
    behandlingId,
    behandlingStatusKode,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  resetTotrinnsaksjonspunkter: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.resetRestApi(),
  resetTotrinnsaksjonspunkterReadonly: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.resetRestApi(),
  fetchTotrinnsaksjonspunkter: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.makeRestApiRequest(),
  fetchTotrinnsaksjonspunkterReadonly: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingsupportDataResolver);
