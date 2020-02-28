import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import ProcessMenu from '@navikt/nap-process-menu';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import VedtakKlageProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';
import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';
import {
  FagsakInfo, MargMarkering, byggProsessmenySteg, FatterVedtakStatusModal, BehandlingHenlagtPanel, ProsessStegIkkeBehandletPanel,
} from '@fpsak-frontend/behandling-felles';
import klageVurderingKodeverk from '@fpsak-frontend/kodeverk/src/klageVurdering';
import {
  Behandling, Kodeverk, NavAnsatt, Vilkar, Aksjonspunkt,
} from '@fpsak-frontend/types';

import klageApi from '../data/klageBehandlingApi';
import finnKlageSteg from '../definition/klageStegDefinition';
import KlageBehandlingModal from './KlageBehandlingModal';
import KlageVurdering from '../types/klageVurderingTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  opneSokeside: () => void;
  klageVurdering?: KlageVurdering;
  alleBehandlinger: [{
    id: number;
    type: Kodeverk;
    avsluttet?: string;
    status: Kodeverk;
    uuid: string;
  }];
}

interface StateProps {
  hasFetchError: boolean;
}

interface DispatchProps {
  lagreAksjonspunkt: (params: {}, { keepData: boolean }) => Promise<any>;
  forhandsvisMelding: (brevData: {}) => Promise<any>;
  saveKlage: (params: {}) => Promise<any>;
  resolveKlageTemp: (params: {}) => Promise<any>;
}

type Props = OwnProps & StateProps & DispatchProps & WrappedComponentProps;

interface KlageProsessState{
  visFatterVedtakModal: boolean;
  visModalKlageBehandling: boolean;
  skalOppdatereFagsakKontekst: boolean;
}

class KlageProsess extends Component<Props, KlageProsessState> {
  constructor(props) {
    super(props);
    this.state = {
      visFatterVedtakModal: false,
      visModalKlageBehandling: false,
      skalOppdatereFagsakKontekst: true,
    };
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

  toggleKlageModal = () => {
    const { opneSokeside } = this.props;
    const { visModalKlageBehandling } = this.state;

    if (visModalKlageBehandling) {
      opneSokeside();
    }
    this.setState((state) => ({ ...state, visModalKlageBehandling: !state.visModalKlageBehandling }));
  }

  slaAvOppdateringAvFagsak = () => {
    this.setState((state) => ({ ...state, skalOppdatereFagsakKontekst: false }));
  }

  saveKlageText = (aksjonspunktModel) => {
    const {
      behandling, saveKlage, resolveKlageTemp, aksjonspunkter,
    } = this.props;
    const data = {
      behandlingId: behandling.id,
      ...aksjonspunktModel,
    };

    const getForeslaVedtakAp = aksjonspunkter
      .filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET)
      .filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);

    if (getForeslaVedtakAp.length === 1) {
      resolveKlageTemp(data);
    } else {
      saveKlage(data);
    }
  }

  submitAksjonspunkter = (aksjonspunktModels) => {
    const {
      fagsak,
      behandling,
      lagreAksjonspunkt,
      oppdaterProsessStegIUrl,
    } = this.props;
    const skalByttTilKlageinstans = aksjonspunktModels
      .some((apValue) => apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP
      && apValue.klageVurdering === klageVurderingKodeverk.STADFESTE_YTELSESVEDTAK);
    const erVedtakAp = aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK
      || aksjonspunktModels[0].kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL;

    if (skalByttTilKlageinstans || erVedtakAp) {
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
        if (skalByttTilKlageinstans) {
          this.toggleKlageModal();
        } else if (erVedtakAp) {
          this.toggleFatterVedtakModal();
        } else {
          oppdaterProsessStegIUrl('default');
        }
      });
  };

  previewCallback = (data) => {
    const { fagsak, behandling, forhandsvisMelding } = this.props;
    const brevData = {
      ...data,
      behandlingUuid: behandling.uuid,
      ytelseType: fagsak.fagsakYtelseType,
    };
    return forhandsvisMelding(brevData);
  };

  render() {
    const {
      intl,
      fagsak,
      behandling,
      aksjonspunkter,
      vilkar,
      klageVurdering,
      kodeverk,
      navAnsatt,
      valgtProsessSteg,
      hasFetchError,
      alleBehandlinger,
    } = this.props;
    const { visFatterVedtakModal, visModalKlageBehandling } = this.state;

    // TODO (TOR) Skriv denne på samme måte som ForeldrepengerProsess.

    const alleSteg = finnKlageSteg({
      behandling, aksjonspunkter, vilkar,
    });
    const alleProsessMenySteg = byggProsessmenySteg({
      alleSteg, valgtProsessSteg, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl,
    });

    const valgtSteg = alleProsessMenySteg[(alleProsessMenySteg.findIndex((p) => p.prosessmenySteg.isActive))];
    const valgtStegKode = valgtSteg ? valgtSteg.kode : undefined;

    const readOnlySubmitButton = valgtSteg && (vilkarUtfallType.OPPFYLT === valgtSteg.status || !valgtSteg.aksjonspunkter.some((ap) => ap.kanLoses));

    const skalViseTilBeslutterTekst = klageVurdering && klageVurdering.klageVurderingResultatNK
      && klageVurdering.klageVurderingResultatNK.godkjentAvMedunderskriver;

    const fellesProps = {
      behandling,
      klageVurdering,
      submitCallback: this.submitAksjonspunkter,
      readOnly: valgtSteg && valgtSteg.isReadOnly,
      alleKodeverk: kodeverk,
    };

    const vedtakStegVises = valgtStegKode === bpc.KLAGE_RESULTAT;

    return (
      <>
        <KlageBehandlingModal
          visModal={visModalKlageBehandling}
          lukkModal={this.toggleKlageModal}
        />
        <FatterVedtakStatusModal
          visModal={visFatterVedtakModal}
          lukkModal={this.toggleFatterVedtakModal}
          tekstkode={skalViseTilBeslutterTekst
            ? 'FatterVedtakStatusModal.SendtKlageResultatTilBeslutter' : 'FatterVedtakStatusModal.SendtKlageResultatTilMedunderskriver'}
        />
        <div style={{ borderTopColor: '#78706A', borderTopStyle: 'solid', borderTopWidth: '1px' }}>
          <div style={{ marginBottom: '23px', marginLeft: '25px', marginRight: '25px' }}>
            <ProcessMenu
              steps={alleProsessMenySteg.map((p) => p.prosessmenySteg)}
              onClick={(index) => this.setSteg(alleProsessMenySteg[index].kode, valgtSteg)}
            />
          </div>
          {valgtStegKode && (
          <MargMarkering
            behandlingStatus={behandling.status}
            aksjonspunkter={valgtSteg.aksjonspunkter}
            isReadOnly={valgtSteg.isReadOnly}
          >
            {(valgtStegKode === bpc.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON || valgtStegKode === bpc.FORMKRAV_KLAGE_NAV_KLAGEINSTANS) && (
            <FormkravProsessIndex
              readOnlySubmitButton={readOnlySubmitButton}
              apCodes={valgtSteg.aksjonspunkter.map((a) => a.definisjon.kode)}
              avsluttedeBehandlinger={alleBehandlinger.filter((b) => b.status.kode === behandlingStatus.AVSLUTTET)}
              {...fellesProps}
            />
            )}
            {(valgtStegKode === bpc.KLAGE_NAV_FAMILIE_OG_PENSJON || valgtStegKode === bpc.KLAGE_NAV_KLAGEINSTANS) && (
            <KlagevurderingProsessIndex
              saveKlage={this.saveKlageText}
              previewCallback={this.previewCallback}
              readOnlySubmitButton={readOnlySubmitButton}
              apCodes={valgtSteg.aksjonspunkter.map((a) => a.definisjon.kode)}
              {...fellesProps}
            />
            )}
            {(vedtakStegVises && !behandling.behandlingHenlagt && valgtSteg.aksjonspunkter.length > 0) && (
            <VedtakKlageProsessIndex
              aksjonspunkter={valgtSteg.aksjonspunkter}
              previewVedtakCallback={this.previewCallback}
              {...fellesProps}
            />
            )}
          </MargMarkering>
          )}
          {(vedtakStegVises && behandling.behandlingHenlagt) && (
          <BehandlingHenlagtPanel />
          )}
          {(!behandling.behandlingHenlagt && valgtSteg && valgtSteg.aksjonspunkter.length === 0) && (
          <ProsessStegIkkeBehandletPanel />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state): StateProps => ({
  hasFetchError: !!klageApi.BEHANDLING_KLAGE.getRestApiError()(state),
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
  ...bindActionCreators({
    lagreAksjonspunkt: klageApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    forhandsvisMelding: klageApi.PREVIEW_MESSAGE.makeRestApiRequest(),
    saveKlage: klageApi.SAVE_KLAGE_VURDERING.makeRestApiRequest(),
    resolveKlageTemp: klageApi.SAVE_REOPEN_KLAGE_VURDERING.makeRestApiRequest(),
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(injectIntl(KlageProsess));
