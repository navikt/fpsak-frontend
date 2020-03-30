import React, { Component, ReactNode } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { getSelectedBehandlingId } from '../behandling/duck';
import { getBehandlingerTypesMappedById, getBehandlingerStatusMappedById } from '../behandling/selectors/behandlingerSelectors';
import fpsakApi from '../data/fpsakApi';

interface OwnProps {
  fetchTotrinnsaksjonspunkter: () => void;
  fetchTotrinnsaksjonspunkterReadonly: () => void;
  resetTotrinnsaksjonspunkter: () => void;
  resetTotrinnsaksjonspunkterReadonly: () => void;
  behandlingId?: number;
  behandlingStatusKode?: string;
  isInSync: boolean;
  isInnsyn: boolean;
  children: ReactNode;
}

// TODO (TOR) Det er i dag behov for å kalle totrinns-endepunkt her fordi BehandlingSupportIndex har behov for datte. Bedre om dette
// kan flyttast til "approval".
/**
 * BehandlingsupportDataResolver
 *
 * Har ansvar for å hente opp data som skal brukes i supportpanelet.
 */
export class BehandlingsupportDataResolver extends Component<OwnProps> {
  componentDidUpdate = (prevProps) => {
    const {
      fetchTotrinnsaksjonspunkter, fetchTotrinnsaksjonspunkterReadonly, resetTotrinnsaksjonspunkter,
      resetTotrinnsaksjonspunkterReadonly, behandlingId, behandlingStatusKode, isInnsyn,
    } = this.props;

    if (behandlingId && (behandlingStatusKode !== prevProps.behandlingStatusKode || behandlingId !== prevProps.behandlingId)) {
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
  const behandlingStatus = getBehandlingerStatusMappedById(state)[behandlingId];
  const bType = getBehandlingerTypesMappedById(state)[behandlingId];
  const isInnsyn = !!bType && bType.kode === behandlingType.DOKUMENTINNSYN;

  const blockers = [];
  if (behandlingStatus && behandlingStatus.kode === BehandlingStatus.FATTER_VEDTAK) {
    blockers.push(fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.getRestApiFinished()(state));
  }
  if (behandlingStatus && behandlingStatus.kode === BehandlingStatus.BEHANDLING_UTREDES) {
    blockers.push(fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiFinished()(state));
  }

  return {
    isInSync: isInnsyn || blockers.every((finished) => finished),
    behandlingStatusKode: behandlingStatus ? behandlingStatus.kode : undefined,
    isInnsyn,
    behandlingId,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  resetTotrinnsaksjonspunkter: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.resetRestApi(),
  resetTotrinnsaksjonspunkterReadonly: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.resetRestApi(),
  fetchTotrinnsaksjonspunkter: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER.makeRestApiRequest(),
  fetchTotrinnsaksjonspunkterReadonly: fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingsupportDataResolver);
