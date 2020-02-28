import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import ProcessMenu from '@navikt/nap-process-menu';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';
import {
  FagsakInfo, MargMarkering, byggProsessmenySteg, BehandlingHenlagtPanel, IverksetterVedtakStatusModal, ProsessStegIkkeBehandletPanel,
} from '@fpsak-frontend/behandling-felles';
import {
  Kodeverk, Dokument, NavAnsatt, Behandling, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import innsynApi from '../data/innsynBehandlingApi';
import finnInnsynSteg from '../definition/innsynStegDefinition';
import Innsyn from '../types/innsynTsType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  innsyn: Innsyn;
  kodeverk: { [key: string]: Kodeverk[] };
  alleDokumenter: Dokument[];
  navAnsatt: NavAnsatt;
  valgtProsessSteg?: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  opneSokeside: () => void;
}

interface StateProps {
  hasFetchError: boolean;
}

interface DispatchProps {
  lagreAksjonspunkt: (params: {}, { keepData: boolean }) => Promise<any>;
  forhandsvisMelding: (brevData: {}) => Promise<any>;
}

type Props = OwnProps & StateProps & DispatchProps & WrappedComponentProps

interface InnsynProsessState {
  visIverksetterVedtakModal: boolean;
}

class InnsynProsess extends Component<Props, InnsynProsessState> {
  constructor(props) {
    super(props);
    this.state = { visIverksetterVedtakModal: false };
  }

  componentDidUpdate = (prevProps) => {
    const {
      behandling, oppdaterBehandlingVersjon,
    } = this.props;
    if (behandling.versjon !== prevProps.behandling.versjon) {
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

  submitAksjonspunkter = (aksjonspunktModels) => {
    const {
      fagsak,
      behandling,
      oppdaterProsessStegIUrl,
      lagreAksjonspunkt,
    } = this.props;

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
        const isVedtak = aksjonspunktModels.some((a) => a.kode === aksjonspunktCodes.FORESLA_VEDTAK);
        if (isVedtak) {
          this.toggleIverksetterVedtakModal();
        } else {
          oppdaterProsessStegIUrl('default');
        }
      });
  };

  previewCallback = (data) => {
    const {
      fagsak,
      behandling,
      forhandsvisMelding,
    } = this.props;
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
      innsyn,
      kodeverk,
      alleDokumenter,
      navAnsatt,
      valgtProsessSteg,
      hasFetchError,
    } = this.props;
    const { visIverksetterVedtakModal } = this.state;

    // TODO (TOR) Skriv denne på samme måte som ForeldrepengerProsess.

    const alleSteg = finnInnsynSteg({
      behandling, aksjonspunkter, vilkar, innsyn,
    });
    const alleProsessMenySteg = byggProsessmenySteg({
      alleSteg, valgtProsessSteg, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl,
    });

    const valgtSteg = alleProsessMenySteg[(alleProsessMenySteg.findIndex((p) => p.prosessmenySteg.isActive))];
    const vedtakStegVises = !!valgtSteg && valgtSteg.kode === bpc.VEDTAK;

    const fellesProps = {
      saksnummer: fagsak.saksnummer,
      submitCallback: this.submitAksjonspunkter,
      readOnly: valgtSteg && valgtSteg.isReadOnly,
      alleDokumenter,
      behandling,
      innsyn,
    };

    return (
      <>
        <IverksetterVedtakStatusModal
          visModal={visIverksetterVedtakModal}
          lukkModal={this.toggleIverksetterVedtakModal}
          behandlingsresultat={behandling.behandlingsresultat}
        />
        <div style={{ borderTopColor: '#78706A', borderTopStyle: 'solid', borderTopWidth: '1px' }}>
          <div style={{ marginBottom: '23px', marginLeft: '25px', marginRight: '25px' }}>
            <ProcessMenu
              steps={alleProsessMenySteg.map((p) => p.prosessmenySteg)}
              onClick={(index) => this.setSteg(alleProsessMenySteg[index].kode, valgtSteg)}
            />
          </div>
          {valgtSteg && (
          <MargMarkering
            behandlingStatus={behandling.status}
            aksjonspunkter={valgtSteg.aksjonspunkter}
            isReadOnly={valgtSteg.isReadOnly}
          >
            {(!!valgtSteg && valgtSteg.kode === bpc.BEHANDLE_INNSYN) && (
              <InnsynProsessIndex
                isSubmittable={valgtSteg.isSubmittable}
                aksjonspunkter={valgtSteg.aksjonspunkter}
                alleKodeverk={kodeverk}
                {...fellesProps}
              />
            )}
            {(vedtakStegVises && valgtSteg.aksjonspunkter.length > 0) && (
              <VedtakInnsynProsessIndex
                aksjonspunkter={aksjonspunkter}
                alleDokumenter={alleDokumenter}
                previewCallback={this.previewCallback}
                {...fellesProps}
              />
            )}
          </MargMarkering>
          )}
          {(vedtakStegVises && behandling.behandlingHenlagt) && (
          <BehandlingHenlagtPanel />
          )}
          {(vedtakStegVises && !behandling.behandlingHenlagt && valgtSteg && valgtSteg.aksjonspunkter.length === 0) && (
          <ProsessStegIkkeBehandletPanel />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state): StateProps => ({
  hasFetchError: !!innsynApi.BEHANDLING_INNSYN.getRestApiError()(state),
});

const mapDispatchToProps = (dispatch): DispatchProps => ({
  ...bindActionCreators({
    lagreAksjonspunkt: innsynApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    forhandsvisMelding: innsynApi.PREVIEW_MESSAGE.makeRestApiRequest(),
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(injectIntl(InnsynProsess));
