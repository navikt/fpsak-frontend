import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import ProcessMenu from '@navikt/nap-process-menu';

import AnkeResultatProsessIndex from '@fpsak-frontend/prosess-anke-resultat';
import AnkeProsessIndex from '@fpsak-frontend/prosess-anke';
import AnkeMerknaderProsessIndex from '@fpsak-frontend/prosess-anke-merknader';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import {
  FagsakInfo, MargMarkering, byggProsessmenySteg, IverksetterVedtakStatusModal, ProsessStegIkkeBehandletPanel, BehandlingHenlagtPanel,
} from '@fpsak-frontend/behandling-felles';
import {
  Behandling, Kodeverk, NavAnsatt, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import ankeApi from '../data/ankeBehandlingApi';
import finnAnkeSteg from '../definition/ankeStegDefinition';
import AnkeBehandlingModal from './AnkeBehandlingModal';
import AnkeVurdering from '../types/ankeVurderingTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  opneSokeside: () => void;
  ankeVurdering?: AnkeVurdering;
  alleBehandlinger: {
    id: number;
    type: Kodeverk;
    avsluttet?: string;
  }[];
}

interface StateProps {
  hasFetchError: boolean;
}

interface DispatchProps {
  lagreAksjonspunkt: (params: {}, { keepData: boolean }) => Promise<any>;
  forhandsvisMelding: (brevData: {}) => Promise<any>;
  saveAnke: (params: {}) => Promise<any>;
  resolveAnkeTemp: (params: {}) => Promise<any>;
}

type Props = OwnProps & StateProps & DispatchProps & WrappedComponentProps;

interface AnkeProsessState{
  visIverksetterVedtakModal: boolean;
  visModalAnkeBehandling: boolean;
  skalOppdatereFagsakKontekst: boolean;
}

class AnkeProsess extends Component<Props, AnkeProsessState> {
  constructor(props) {
    super(props);
    this.state = {
      visIverksetterVedtakModal: false,
      visModalAnkeBehandling: false,
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

  toggleIverksetterVedtakModal = () => {
    const { opneSokeside } = this.props;
    const { visIverksetterVedtakModal } = this.state;

    if (visIverksetterVedtakModal) {
      opneSokeside();
    }
    this.setState((state) => ({ ...state, visIverksetterVedtakModal: !state.visIverksetterVedtakModal }));
  }

  toggleAnkeModal = () => {
    const { opneSokeside } = this.props;
    const { visModalAnkeBehandling } = this.state;

    if (visModalAnkeBehandling) {
      opneSokeside();
    }
    this.setState((state) => ({ ...state, visModalAnkeBehandling: !state.visModalAnkeBehandling }));
  }

  slaAvOppdateringAvFagsak = () => {
    this.setState((state) => ({ ...state, skalOppdatereFagsakKontekst: false }));
  }

  saveAnkeText = (aksjonspunktModel) => {
    const {
      behandling, saveAnke, resolveAnkeTemp, aksjonspunkter,
    } = this.props;
    const data = {
      behandlingId: behandling.id,
      ...aksjonspunktModel,
    };

    const getForeslaVedtakAp = aksjonspunkter
      .filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET)
      .filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);

    if (getForeslaVedtakAp.length === 1) {
      resolveAnkeTemp(data);
    } else {
      saveAnke(data);
    }
  }

  submitAksjonspunkter = (aksjonspunktModels) => {
    const {
      fagsak,
      behandling,
      lagreAksjonspunkt,
      oppdaterProsessStegIUrl,
    } = this.props;
    const skalTilMedunderskriver = aksjonspunktModels
      .some((apValue) => apValue.kode === aksjonspunktCodes.FORESLA_VEDTAK);
    const skalFerdigstilles = aksjonspunktModels
      .some((apValue) => apValue.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL);
    const erManuellVurderingAvAnke = aksjonspunktModels
      .some((apValue) => apValue.kode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE_MERKNADER);

    if (skalTilMedunderskriver || skalFerdigstilles || erManuellVurderingAvAnke) {
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
        if (skalTilMedunderskriver || skalFerdigstilles) {
          this.toggleAnkeModal();
        } else if (erManuellVurderingAvAnke) {
          this.toggleIverksetterVedtakModal();
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
      ankeVurdering,
      navAnsatt,
      valgtProsessSteg,
      hasFetchError,
      alleBehandlinger,
    } = this.props;
    const { visIverksetterVedtakModal, visModalAnkeBehandling } = this.state;

    const alleSteg = finnAnkeSteg({
      behandling, aksjonspunkter, vilkar,
    });
    const alleProsessMenySteg = byggProsessmenySteg({
      alleSteg, valgtProsessSteg, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl,
    });

    const valgtSteg = alleProsessMenySteg[(alleProsessMenySteg.findIndex((p) => p.prosessmenySteg.isActive))];
    const valgtStegKode = valgtSteg ? valgtSteg.kode : undefined;

    const readOnlySubmitButton = valgtSteg && (vilkarUtfallType.OPPFYLT === valgtSteg.status || !valgtSteg.aksjonspunkter.some((ap) => ap.kanLoses));

    const fellesProps = {
      behandling,
      ankeVurdering,
      aksjonspunkter: valgtSteg && valgtSteg.aksjonspunkter,
      submitCallback: this.submitAksjonspunkter,
      readOnly: valgtSteg && valgtSteg.isReadOnly,
      previewCallback: this.previewCallback,
      previewVedtakCallback: this.previewCallback,
      readOnlySubmitButton,
      saveAnke: this.saveAnkeText,
    };

    return (
      <>
        <IverksetterVedtakStatusModal
          visModal={visIverksetterVedtakModal}
          lukkModal={this.toggleIverksetterVedtakModal}
          behandlingsresultat={behandling.behandlingsresultat}
        />
        <AnkeBehandlingModal
          visModal={visModalAnkeBehandling}
          lukkModal={this.toggleAnkeModal}
        />
        <ProcessMenu
          steps={alleProsessMenySteg.map((p) => p.prosessmenySteg)}
          onClick={(index) => this.setSteg(alleProsessMenySteg[index].kode, valgtSteg)}
        />
        {valgtStegKode && (
          <MargMarkering
            behandlingStatus={behandling.status}
            aksjonspunkter={valgtSteg.aksjonspunkter}
            isReadOnly={valgtSteg.isReadOnly}
          >
            {(valgtStegKode === bpc.ANKEBEHANDLING && valgtSteg.aksjonspunkter.length > 0) && (
              <AnkeProsessIndex behandlinger={alleBehandlinger} {...fellesProps} />
            )}
            {(valgtStegKode === bpc.ANKE_RESULTAT && valgtSteg.aksjonspunkter.length > 0) && (
              <AnkeResultatProsessIndex {...fellesProps} />
            )}
            {(valgtStegKode === bpc.ANKE_MERKNADER && valgtSteg.aksjonspunkter.length > 0) && (
              <AnkeMerknaderProsessIndex {...fellesProps} />
            )}
          </MargMarkering>
        )}
        {(valgtStegKode === bpc.ANKE_MERKNADER && behandling.behandlingHenlagt) && (
          <BehandlingHenlagtPanel />
        )}
        {(!behandling.behandlingHenlagt && valgtSteg && valgtSteg.aksjonspunkter.length === 0) && (
          <ProsessStegIkkeBehandletPanel />
        )}
      </>
    );
  }
}

const mapStateToProps = (state): StateProps => ({
  hasFetchError: !!ankeApi.BEHANDLING_ANKE.getRestApiError()(state),
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
  ...bindActionCreators({
    lagreAksjonspunkt: ankeApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    forhandsvisMelding: ankeApi.PREVIEW_MESSAGE.makeRestApiRequest(),
    saveAnke: ankeApi.SAVE_ANKE_VURDERING.makeRestApiRequest(),
    resolveAnkeTemp: ankeApi.SAVE_REOPEN_ANKE_VURDERING.makeRestApiRequest(),
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(injectIntl(AnkeProsess));
