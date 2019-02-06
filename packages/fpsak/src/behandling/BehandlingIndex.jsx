import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BehandlingPapirsoknadIndex from '@fpsak-frontend/fp-behandling-papirsoknad';
import BehandlingTilbakekrevingIndex from '@fpsak-frontend/fp-behandling-tilbakekreving';
import BehandlingFpsakIndex from '@fpsak-frontend/fp-behandling';
import { trackRouteParam, requireProps } from '@fpsak-frontend/fp-felles';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { getAlleKodeverk } from 'kodeverk/duck';
import { getFilteredReceivedDocuments } from 'behandlingsupport/behandlingsupportSelectors';
import { getHasSubmittedPaVentForm } from 'behandlingmenu/duck';
import {
  getSelectedSaksnummer, getSelectedFagsakStatus, getFagsakPerson,
  getFagsakYtelseType, isForeldrepengerFagsak,
} from 'fagsak/fagsakSelectors';
import { getFeatureToggles } from 'app/duck';
import {
  setSelectedBehandlingId, getSelectedBehandlingId, setBehandlingInfoHolder, resetBehandlingContext as resetBehandlingContextActionCreator,
} from './duck';
import {
  getBehandlingerVersjonMappedById, getBehandlingerTypesMappedById, getBehandlingerAktivPapirsoknadMappedById,
} from './selectors/behandlingerSelectors';
import behandlingUpdater from './BehandlingUpdater';
import appContextUpdater from './AppContextUpdater';

/**
 * BehandlingIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
export class BehandlingIndex extends Component {
  static propTypes = {
    saksnummer: PropTypes.number.isRequired,
    behandlingId: PropTypes.number.isRequired,
    behandlingType: PropTypes.string.isRequired,
    behandlingerVersjonMappedById: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    setHolder: PropTypes.func.isRequired,
    erAktivPapirsoknad: PropTypes.bool.isRequired,
    resetBehandlingContext: PropTypes.func.isRequired,
    featureToggles: PropTypes.shape().isRequired,
    hasSubmittedPaVentForm: PropTypes.bool.isRequired,
    filteredReceivedDocuments: PropTypes.arrayOf(PropTypes.shape({
      journalpostId: PropTypes.string.isRequired,
      dokumentId: PropTypes.string.isRequired,
      tittel: PropTypes.string.isRequired,
      tidspunkt: PropTypes.string,
      kommunikasjonsretning: PropTypes.string.isRequired,
    })).isRequired,
    kodeverk: PropTypes.shape().isRequired,
    fagsak: PropTypes.shape({
      fagsakStatus: PropTypes.shape().isRequired,
      fagsakPerson: PropTypes.shape().isRequired,
      fagsakYtelseType: PropTypes.shape().isRequired,
      isForeldrepengerFagsak: PropTypes.bool.isRequired,
    }).isRequired,
  };

  componentWillUnmount() {
    const { resetBehandlingContext } = this.props;
    resetBehandlingContext();
  }

  render() {
    const {
      saksnummer,
      behandlingId,
      behandlingType,
      behandlingerVersjonMappedById,
      location,
      setHolder,
      erAktivPapirsoknad,
      featureToggles,
      hasSubmittedPaVentForm,
      filteredReceivedDocuments,
      kodeverk,
      fagsak,
    } = this.props;
    if (erAktivPapirsoknad) {
      return (
        <BehandlingPapirsoknadIndex
          key={behandlingId}
          saksnummer={saksnummer}
          behandlingId={behandlingId}
          behandlingerVersjonMappedById={behandlingerVersjonMappedById}
          location={location}
          setBehandlingInfoHolder={setHolder}
          behandlingUpdater={behandlingUpdater}
          appContextUpdater={appContextUpdater}
          hasSubmittedPaVentForm={hasSubmittedPaVentForm}
          kodeverk={kodeverk}
          fagsak={fagsak}
        />
      );
    }

    if (behandlingType === BehandlingType.TILBAKEKREVING) {
      return (
        <BehandlingTilbakekrevingIndex
          key={behandlingId}
          saksnummer={saksnummer}
          behandlingId={behandlingId}
          behandlingerVersjonMappedById={behandlingerVersjonMappedById}
          location={location}
          setBehandlingInfoHolder={setHolder}
          behandlingUpdater={behandlingUpdater}
          appContextUpdater={appContextUpdater}
          featureToggles={featureToggles}
          hasSubmittedPaVentForm={hasSubmittedPaVentForm}
          kodeverk={kodeverk}
          fagsak={fagsak}
        />
      );
    }

    return (
      <BehandlingFpsakIndex
        key={behandlingId}
        saksnummer={saksnummer}
        behandlingId={behandlingId}
        behandlingerVersjonMappedById={behandlingerVersjonMappedById}
        location={location}
        setBehandlingInfoHolder={setHolder}
        behandlingUpdater={behandlingUpdater}
        appContextUpdater={appContextUpdater}
        featureToggles={featureToggles}
        hasSubmittedPaVentForm={hasSubmittedPaVentForm}
        filteredReceivedDocuments={filteredReceivedDocuments}
        kodeverk={kodeverk}
        fagsak={fagsak}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const behandlingId = getSelectedBehandlingId(state);
  return {
    behandlingId,
    saksnummer: getSelectedSaksnummer(state),
    behandlingerVersjonMappedById: getBehandlingerVersjonMappedById(state),
    behandlingType: getBehandlingerTypesMappedById(state)[behandlingId],
    location: state.router.location,
    erAktivPapirsoknad: getBehandlingerAktivPapirsoknadMappedById(state)[behandlingId],
    featureToggles: getFeatureToggles(state),
    hasSubmittedPaVentForm: getHasSubmittedPaVentForm(state),
    filteredReceivedDocuments: getFilteredReceivedDocuments(state),
    kodeverk: getAlleKodeverk(state),
    fagsak: {
      fagsakStatus: getSelectedFagsakStatus(state),
      fagsakPerson: getFagsakPerson(state),
      fagsakYtelseType: getFagsakYtelseType(state),
      isForeldrepengerFagsak: isForeldrepengerFagsak(state),
    },
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  setHolder: setBehandlingInfoHolder,
  resetBehandlingContext: resetBehandlingContextActionCreator,
}, dispatch);

export default trackRouteParam({
  paramName: 'behandlingId',
  parse: saksnummerFromUrl => Number.parseInt(saksnummerFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedBehandlingId,
  getParamFromStore: getSelectedBehandlingId,
})(connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingId'])(BehandlingIndex)));
