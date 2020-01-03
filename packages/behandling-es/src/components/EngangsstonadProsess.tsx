import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import ProcessMenu from '@navikt/nap-process-menu';

import { AdvarselModal } from '@fpsak-frontend/shared-components';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, MargMarkering, byggProsessmenySteg, Vilkar,
  FatterVedtakStatusModal, BehandlingHenlagtPanel, ProsessStegIkkeBehandletPanel, SimuleringResultat,
} from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../data/esBehandlingApi';
import finnEngangsstonadSteg from '../definition/engangsstonadStegDefinition';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  simuleringResultat: SimuleringResultat;
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  opneSokeside: () => void;
  hasFetchError: boolean;
  harApenRevurdering: boolean;
}

interface DispatchProps {
  lagreAksjonspunkt: (params: {}, { keepData: boolean }) => Promise<any>;
}

type Props = OwnProps & DispatchProps & WrappedComponentProps;

interface KlageProsessState{
  visFatterVedtakModal: boolean;
  visApenRevurderingModal: boolean;
  skalOppdatereFagsakKontekst: boolean;
}

export class EngangsstonadProsess extends Component<Props, KlageProsessState> {
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
      vilkar,
      simuleringResultat,
      beregningresultatEngangsstonad,
      navAnsatt,
      valgtProsessSteg,
      hasFetchError,
    } = this.props;
    const { visFatterVedtakModal, visApenRevurderingModal } = this.state;

    const alleSteg = finnEngangsstonadSteg({
      behandling, aksjonspunkter, vilkar, simuleringResultat, beregningresultatEngangsstonad,
    });
    const alleProsessMenySteg = byggProsessmenySteg({
      alleSteg, valgtProsessSteg, behandling, aksjonspunkter, vilkar: [], navAnsatt, fagsak, hasFetchError, intl,
    });

    const valgtSteg = alleProsessMenySteg[(alleProsessMenySteg.findIndex((p) => p.prosessmenySteg.isActive))];
    const valgtStegKode = valgtSteg ? valgtSteg.kode : undefined;
    const erStegBehandlet = valgtSteg ? valgtSteg.erStegBehandlet : false;

    const vedtakStegVises = valgtStegKode === bpc.VEDTAK;

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
            <div>test</div>
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
    lagreAksjonspunkt: esBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
  }, dispatch),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(injectIntl(EngangsstonadProsess));
