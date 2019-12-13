import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import ProcessMenu from '@navikt/nap-process-menu';

import { AdvarselModal } from '@fpsak-frontend/shared-components';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';
import ForeldelseProsessIndex from '@fpsak-frontend/prosess-foreldelse';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, MargMarkering, byggProsessmenySteg, DataFetcherBehandlingData,
  FatterVedtakStatusModal, BehandlingHenlagtPanel, ProsessStegIkkeBehandletPanel, getAlleMerknaderFraBeslutter, BehandlingDataCache,
} from '@fpsak-frontend/behandling-felles';

import tilbakekrevingApi from '../data/tilbakekrevingBehandlingApi';
import finnTilbakekrevingSteg from '../definition/tilbakekrevingStegDefinition';
import PerioderForeldelse from '../types/perioderForeldelseTsType';
import Beregningsresultat from '../types/beregningsresultatTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

const tilbakekrevingData = [tilbakekrevingApi.VILKARVURDERINGSPERIODER, tilbakekrevingApi.VILKARVURDERING];
const vedtakData = [tilbakekrevingApi.VEDTAKSBREV];


interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  opneSokeside: () => void;
  perioderForeldelse?: PerioderForeldelse;
  beregningsresultat?: Beregningsresultat;
  hasFetchError: boolean;
  harApenRevurdering: boolean;
}

interface DispatchProps {
  lagreAksjonspunkt: (params: {}, { keepData: boolean }) => Promise<any>;
  beregnBelop: (params: {}) => Promise<any>;
  fetchPreviewVedtaksbrev: (params: {}) => Promise<any>;
}

type Props = OwnProps & DispatchProps & WrappedComponentProps;

interface KlageProsessState{
  visFatterVedtakModal: boolean;
  visApenRevurderingModal: boolean;
  skalOppdatereFagsakKontekst: boolean;
}

export class TilbakekrevingProsess extends Component<Props, KlageProsessState> {
  behandlingDataCache: BehandlingDataCache = new BehandlingDataCache()

  constructor(props) {
    super(props);
    this.state = {
      visApenRevurderingModal: false,
      visFatterVedtakModal: false,
      skalOppdatereFagsakKontekst: true,
    };
  }

  componentDidMount = () => {
    const { harApenRevurdering, behandling } = this.props;
    this.setState((state) => ({ ...state, visApenRevurderingModal: harApenRevurdering && !behandling.behandlingPaaVent }));
  }

  componentDidUpdate = (prevProps) => {
    const {
      behandling, oppdaterBehandlingVersjon,
    } = this.props;
    const {
      skalOppdatereFagsakKontekst,
    } = this.state;
    if (skalOppdatereFagsakKontekst && behandling.versjon !== prevProps.behandling.versjon) {
      oppdaterBehandlingVersjon(behandling.versjon);
    }
  }

  setSteg = (nyttValg, forrigeSteg) => {
    const {
      oppdaterProsessStegIUrl,
    } = this.props;
    oppdaterProsessStegIUrl(!forrigeSteg || nyttValg !== forrigeSteg.kode ? nyttValg : undefined);
  }

  toggleFatterVedtakModal = () => {
    const { opneSokeside } = this.props;
    const { visFatterVedtakModal } = this.state;

    if (visFatterVedtakModal) {
      opneSokeside();
    }
    this.setState((state) => ({ ...state, visFatterVedtakModal: !state.visFatterVedtakModal }));
  }

  lukkApenRevurderingModal = () => {
    this.setState((state) => ({ ...state, visApenRevurderingModal: false }));
  }

  slaAvOppdateringAvFagsak = () => {
    this.setState((state) => ({ ...state, skalOppdatereFagsakKontekst: false }));
  }

  submitAksjonspunkter = (aksjonspunktModels) => {
    const {
      fagsak,
      behandling,
      lagreAksjonspunkt,
      oppdaterProsessStegIUrl,
    } = this.props;

    const isFatterVedtakAp = aksjonspunktModels.some((ap) => ap.kode === aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK);
    if (isFatterVedtakAp) {
      this.slaAvOppdateringAvFagsak();
    }

    const { id, versjon } = behandling;
    const models = aksjonspunktModels.map((ap) => ({
      '@type': ap.kode,
      ...ap,
    }));

    const params = {
      saksnummer: fagsak.saksnummer,
      behandlingId: id,
      behandlingVersjon: versjon,
      bekreftedeAksjonspunktDtoer: models,
    };

    return lagreAksjonspunkt(params, { keepData: true })
      .then(() => {
        if (isFatterVedtakAp) {
          this.setState((prevState) => ({ ...prevState, visFatterVedtakModal: true }));
        } else {
          oppdaterProsessStegIUrl('default');
        }
      });
  };

  render() {
    const {
      intl,
      fagsak,
      behandling,
      aksjonspunkter,
      kodeverk,
      navAnsatt,
      valgtProsessSteg,
      hasFetchError,
      perioderForeldelse,
      beregningsresultat,
      beregnBelop,
      fetchPreviewVedtaksbrev,
    } = this.props;
    const { visFatterVedtakModal, visApenRevurderingModal } = this.state;

    const alleSteg = finnTilbakekrevingSteg({
      behandling, aksjonspunkter, perioderForeldelse, beregningsresultat,
    });
    const alleProsessMenySteg = byggProsessmenySteg({
      alleSteg, valgtProsessSteg, behandling, aksjonspunkter, vilkar: [], navAnsatt, fagsak, hasFetchError, intl,
    });

    const valgtSteg = alleProsessMenySteg[(alleProsessMenySteg.findIndex((p) => p.prosessmenySteg.isActive))];
    const valgtStegKode = valgtSteg ? valgtSteg.kode : undefined;
    const erStegBehandlet = valgtSteg ? valgtSteg.erStegBehandlet : false;

    const readOnlySubmitButton = valgtSteg && (vilkarUtfallType.OPPFYLT === valgtSteg.status || !valgtSteg.aksjonspunkter.some((ap) => ap.kanLoses));

    const fellesProps = {
      behandling,
      submitCallback: this.submitAksjonspunkter,
      readOnly: valgtSteg && valgtSteg.isReadOnly,
      alleKodeverk: kodeverk,
    };

    const vedtakStegVises = valgtStegKode === bpc.VEDTAK;
    const apCodes = valgtSteg && valgtSteg.aksjonspunkter.map((a) => a.definisjon.kode);

    if (this.behandlingDataCache.getCurrentVersion() !== behandling.versjon) {
      this.behandlingDataCache.setVersion(behandling.versjon);
    }

    return (
      <>
        {visApenRevurderingModal && (
          <AdvarselModal
            headerTextCode="BehandlingTilbakekrevingIndex.ApenRevurderingHeader"
            textCode="BehandlingTilbakekrevingIndex.ApenRevurdering"
            showModal
            submit={this.lukkApenRevurderingModal}
          />
        )}
        <FatterVedtakStatusModal
          visModal={visFatterVedtakModal}
          lukkModal={this.toggleFatterVedtakModal}
          tekstkode="FatterTilbakekrevingVedtakStatusModal.Sendt"
        />
        <ProcessMenu
          steps={alleProsessMenySteg.map((p) => p.prosessmenySteg)}
          onClick={(index) => this.setSteg(alleProsessMenySteg[index].kode, valgtSteg)}
        />
        {(erStegBehandlet) && (
          <MargMarkering
            behandlingStatus={behandling.status}
            aksjonspunkter={valgtSteg.aksjonspunkter}
            isReadOnly={valgtSteg.isReadOnly}
          >
            {valgtStegKode === bpc.FORELDELSE && (
              <ForeldelseProsessIndex
                perioderForeldelse={perioderForeldelse}
                apCodes={apCodes}
                readOnlySubmitButton={readOnlySubmitButton}
                navBrukerKjonn={fagsak.fagsakPerson.erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN}
                alleMerknaderFraBeslutter={getAlleMerknaderFraBeslutter(behandling, aksjonspunkter)}
                beregnBelop={beregnBelop}
                {...fellesProps}
              />
            )}
            <DataFetcherBehandlingData
              behandlingDataCache={this.behandlingDataCache}
              behandlingVersion={behandling.versjon}
              endpoints={tilbakekrevingData}
              showComponent={valgtStegKode === bpc.TILBAKEKREVING}
              render={(dataProps) => (
                <TilbakekrevingProsessIndex
                  apCodes={apCodes}
                  readOnlySubmitButton={readOnlySubmitButton}
                  navBrukerKjonn={fagsak.fagsakPerson.erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN}
                  alleMerknaderFraBeslutter={getAlleMerknaderFraBeslutter(behandling, aksjonspunkter)}
                  beregnBelop={beregnBelop}
                  perioderForeldelse={perioderForeldelse}
                  {...dataProps}
                  {...fellesProps}
                />
              )}
            />
            <DataFetcherBehandlingData
              behandlingDataCache={this.behandlingDataCache}
              behandlingVersion={behandling.versjon}
              endpoints={vedtakData}
              showComponent={vedtakStegVises && !behandling.behandlingHenlagt}
              render={(dataProps) => (
                <VedtakTilbakekrevingProsessIndex
                  beregningsresultat={beregningsresultat}
                  fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
                  aksjonspunktKodeForeslaVedtak={aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK}
                  {...dataProps}
                  {...fellesProps}
                />
              )}
            />
          </MargMarkering>
        )}
        {(vedtakStegVises && behandling.behandlingHenlagt) && (
          <BehandlingHenlagtPanel />
        )}
        {(valgtStegKode && !erStegBehandlet && !behandling.behandlingHenlagt) && (
          <ProsessStegIkkeBehandletPanel />
        )}
      </>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
  ...bindActionCreators({
    lagreAksjonspunkt: tilbakekrevingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    fetchPreviewVedtaksbrev: tilbakekrevingApi.PREVIEW_VEDTAKSBREV.makeRestApiRequest(),
    beregnBelop: tilbakekrevingApi.BEREGNE_BELØP.makeRestApiRequest(),
  }, dispatch),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(injectIntl(TilbakekrevingProsess));
