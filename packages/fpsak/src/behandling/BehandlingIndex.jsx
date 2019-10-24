import React, { Component, Suspense } from 'react';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { trackRouteParam, requireProps } from '@fpsak-frontend/fp-felles';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import { getAlleKodeverk } from '../kodeverk/duck';
import { getAllDocuments } from '../behandlingsupport/behandlingsupportSelectors';
import { getHasSubmittedPaVentForm } from '../behandlingmenu/duck';
import {
  getSelectedSaksnummer, getSelectedFagsakStatus, getFagsakPerson,
  getFagsakYtelseType, isForeldrepengerFagsak, getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd,
} from '../fagsak/fagsakSelectors';
import { getNavAnsatt, getFeatureToggles } from '../app/duck';
import { reduxRestApi } from '../data/fpsakApi';
import {
  setSelectedBehandlingId, getSelectedBehandlingId, setBehandlingInfoHolder, resetBehandlingContext as resetBehandlingContextActionCreator,
} from './duck';
import {
  getBehandlingerVersjonMappedById, getBehandlingerTypesMappedById, getBehandlingerAktivPapirsoknadMappedById, getBehandlingerInfo,
  getBehandlingerLinksMappedById,
} from './selectors/behandlingerSelectors';
import behandlingUpdater from './BehandlingUpdater';
import appContextUpdater from './AppContextUpdater';

const BehandlingForstegangOgRevurderingIndex = React.lazy(() => import('@fpsak-frontend/fp-behandling-forstegang-og-revurdering'));
const BehandlingInnsynIndex = React.lazy(() => import('@fpsak-frontend/fp-behandling-innsyn'));
const BehandlingKlageIndex = React.lazy(() => import('@fpsak-frontend/fp-behandling-klage'));
const BehandlingTilbakekrevingIndex = React.lazy(() => import('@fpsak-frontend/fp-behandling-tilbakekreving'));
const BehandlingAnkeIndex = React.lazy(() => import('@fpsak-frontend/fp-behandling-anke'));
const BehandlingPapirsoknadIndex = React.lazy(() => import('@fpsak-frontend/fp-behandling-papirsoknad'));

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
    erAktivPapirsoknad: PropTypes.bool,
    resetBehandlingContext: PropTypes.func.isRequired,
    featureToggles: PropTypes.shape().isRequired,
    hasSubmittedPaVentForm: PropTypes.bool.isRequired,
    allDocuments: PropTypes.arrayOf(PropTypes.shape({
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
      kanRevurderingOpprettes: PropTypes.bool.isRequired,
      skalBehandlesAvInfotrygd: PropTypes.bool.isRequired,
    }).isRequired,
    fagsakBehandlingerInfo: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.shape({
        kode: PropTypes.string.isRequired,
      }).isRequired,
      avsluttet: PropTypes.string,
    })).isRequired,
    behandlingLinks: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string.isRequired,
      rel: PropTypes.string.isRequired,
      requestPayload: PropTypes.any,
      type: PropTypes.string.isRequired,
    })).isRequired,
    navAnsatt: navAnsattPropType.isRequired,
  };

  static defaultProps = {
    erAktivPapirsoknad: false,
  }

  constructor(props) {
    super(props);
    reduxRestApi.injectPaths(props.behandlingLinks);
  }

  componentDidUpdate(prevProps) {
    const { behandlingId, behandlingLinks } = this.props;
    if (behandlingId !== prevProps.behandlingId) {
      reduxRestApi.injectPaths(behandlingLinks);
    }
  }

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
      allDocuments,
      kodeverk,
      fagsak,
      fagsakBehandlingerInfo,
      navAnsatt,
    } = this.props;
    if (erAktivPapirsoknad) {
      return (
        <Suspense fallback={<LoadingPanel />}>
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
            navAnsatt={navAnsatt}
          />
        </Suspense>
      );
    }

    if (behandlingType === BehandlingType.TILBAKEKREVING || behandlingType === BehandlingType.TILBAKEKREVING_REVURDERING) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <BehandlingTilbakekrevingIndex
            key={behandlingId}
            saksnummer={saksnummer}
            behandlingId={behandlingId}
            behandlingerVersjonMappedById={behandlingerVersjonMappedById}
            location={location}
            setBehandlingInfoHolder={setHolder}
            behandlingUpdater={behandlingUpdater}
            appContextUpdater={appContextUpdater}
            hasSubmittedPaVentForm={hasSubmittedPaVentForm}
            fagsak={fagsak}
            fagsakBehandlingerInfo={fagsakBehandlingerInfo}
            navAnsatt={navAnsatt}
          />
        </Suspense>
      );
    }

    if (behandlingType === BehandlingType.DOKUMENTINNSYN) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <BehandlingInnsynIndex
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
            allDocuments={allDocuments}
            kodeverk={kodeverk}
            fagsak={fagsak}
            navAnsatt={navAnsatt}
          />
        </Suspense>
      );
    }

    if (behandlingType === BehandlingType.KLAGE) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <BehandlingKlageIndex
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
            allDocuments={allDocuments}
            kodeverk={kodeverk}
            fagsak={fagsak}
            fagsakBehandlingerInfo={fagsakBehandlingerInfo}
            navAnsatt={navAnsatt}
          />
        </Suspense>
      );
    }

    if (behandlingType === BehandlingType.ANKE) {
      return (
        <Suspense fallback={<LoadingPanel />}>
          <BehandlingAnkeIndex
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
            allDocuments={allDocuments}
            kodeverk={kodeverk}
            fagsak={fagsak}
            fagsakBehandlingerInfo={fagsakBehandlingerInfo}
            navAnsatt={navAnsatt}
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<LoadingPanel />}>
        <BehandlingForstegangOgRevurderingIndex
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
          fagsakBehandlingerInfo={fagsakBehandlingerInfo}
          navAnsatt={navAnsatt}
        />
      </Suspense>
    );
  }
}

export const getFagsakInfo = createSelector([getSelectedFagsakStatus, getFagsakPerson, getFagsakYtelseType, isForeldrepengerFagsak,
  getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd], (fagsakStatus, fagsakPerson, fagsakYtelseType, isForeldrepenger,
  kanRevurderingOpprettes, skalBehandlesAvInfotrygd) => ({
  fagsakStatus,
  fagsakPerson,
  fagsakYtelseType,
  kanRevurderingOpprettes,
  skalBehandlesAvInfotrygd,
  isForeldrepengerFagsak: isForeldrepenger,
}));

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
    kodeverk: getAlleKodeverk(state),
    allDocuments: getAllDocuments(state),
    fagsakBehandlingerInfo: getBehandlingerInfo(state),
    behandlingLinks: getBehandlingerLinksMappedById(state)[behandlingId],
    navAnsatt: getNavAnsatt(state),
    fagsak: getFagsakInfo(state),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setHolder: setBehandlingInfoHolder,
  resetBehandlingContext: resetBehandlingContextActionCreator,
}, dispatch);

export default trackRouteParam({
  paramName: 'behandlingId',
  parse: (saksnummerFromUrl) => Number.parseInt(saksnummerFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedBehandlingId,
  getParamFromStore: getSelectedBehandlingId,
})(connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingId'])(BehandlingIndex)));
