import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import ProcessMenu from '@navikt/nap-process-menu';

import { aksjonspunktPropType, navAnsattPropType } from '@fpsak-frontend/prop-types';
import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';
import {
  Kodeverk, Dokument, NavAnsatt, FagsakInfo, Behandling, Vilkar, Aksjonspunkt, MargMarkering, byggProsessmenySteg,
  fagsakInfoPropType, behandlingPropType, IverksetterVedtakStatusModal,
} from '@fpsak-frontend/behandling-felles';
import innsynApi from '../data/innsynBehandlingApi';
import finnInnsynSteg from '../definition/innsynStegDefinition';
import { Innsyn } from '../types/innsynTsType';
import innsynPropType from '../propTypes/innsynPropType';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

const submitAksjonspunkter = (lagreAksjonspunkt, saksnummer, behandling, oppdaterProsessStegIUrl, toggleIverksetterVedtakModal,
  vedtakStegVises) => (aksjonspunktModels) => {
  const { id, versjon } = behandling;
  const models = aksjonspunktModels.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer,
    behandlingId: id,
    behandlingVersjon: versjon,
    bekreftedeAksjonspunktDtoer: models,
  };

  return lagreAksjonspunkt(params, { keepData: true })
    .then(() => oppdaterProsessStegIUrl())
    .then(() => {
      if (vedtakStegVises) {
        toggleIverksetterVedtakModal();
      }
    });
};

const previewCallbackFunc = (forhandsvisMelding, behandlingUuid, ytelseType) => (data) => {
  const brevData = {
    ...data,
    behandlingUuid,
    ytelseType,
  };

  return forhandsvisMelding(brevData);
};


type OwnProps = Readonly<{
  intl: {};
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  vilkar: [Vilkar];
  innsyn: Innsyn;
  kodeverk: { [key: string]: [Kodeverk] };
  alleDokumenter: [Dokument];
  navAnsatt: NavAnsatt;
  valgtProsessSteg: string;
  oppdaterProsessStegIUrl: (punktnavn: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  opneSokeside: () => void;
}>;

type StateProps = Readonly<{
  hasFetchError: boolean;
}>

type DispatchProps = Readonly<{
  lagreAksjonspunkt: (params: {}, { keepData: boolean }) => Promise<any>;
  forhandsvisMelding: (brevData: {}) => Promise<any>;
}>

type Props = OwnProps & StateProps & DispatchProps;

type InnsynProsessState = Readonly<{
  visIverksetterVedtakModal: boolean;
}>

export class InnsynProsess extends Component<Props, InnsynProsessState> {
  static propTypes = {
    intl: PropTypes.shape({}).isRequired,
    fagsak: fagsakInfoPropType.isRequired,
    behandling: behandlingPropType.isRequired,
    aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
    vilkar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    innsyn: innsynPropType.isRequired,
    kodeverk: PropTypes.shape({}).isRequired,
    alleDokumenter: PropTypes.arrayOf(PropTypes.shape({
      journalpostId: PropTypes.string.isRequired,
      dokumentId: PropTypes.string.isRequired,
      tittel: PropTypes.string,
      tidspunkt: PropTypes.string,
      kommunikasjonsretning: PropTypes.string.isRequired,
    })).isRequired,
    navAnsatt: navAnsattPropType.isRequired,
    valgtProsessSteg: PropTypes.string.isRequired,
    lagreAksjonspunkt: PropTypes.func.isRequired,
    forhandsvisMelding: PropTypes.func.isRequired,
    oppdaterProsessStegIUrl: PropTypes.func.isRequired,
    opneSokeside: PropTypes.func.isRequired,
    oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  }

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

  setSteg = (punkt) => {
    const {
      oppdaterProsessStegIUrl,
    } = this.props;
    oppdaterProsessStegIUrl(punkt);
  }

  toggleIverksetterVedtakModal = () => {
    const { opneSokeside } = this.props;
    const { visIverksetterVedtakModal } = this.state;

    if (visIverksetterVedtakModal) {
      opneSokeside();
    }
    this.setState((state) => ({ ...state, visIverksetterVedtakModal: !state.visIverksetterVedtakModal }));
  }

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
      lagreAksjonspunkt,
      forhandsvisMelding,
      oppdaterProsessStegIUrl,
      hasFetchError,
    } = this.props;
    const { visIverksetterVedtakModal } = this.state;

    const alleSteg = finnInnsynSteg({
      behandling, aksjonspunkter, vilkar, innsyn,
    });
    const alleProsessMenySteg = byggProsessmenySteg({
      alleSteg, valgtProsessSteg, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl,
    });

    const valgtSteg = alleProsessMenySteg[(alleProsessMenySteg.findIndex((p) => p.prosessmenySteg.isActive))];
    const vedtakStegVises = !!valgtSteg && valgtSteg.kode === bpc.VEDTAK;
    const submitCallback = submitAksjonspunkter(lagreAksjonspunkt, fagsak.saksnummer, behandling, oppdaterProsessStegIUrl,
      this.toggleIverksetterVedtakModal, vedtakStegVises);
    const previewCallback = previewCallbackFunc(forhandsvisMelding, behandling.uuid, fagsak.fagsakYtelseType);

    return (
      <>
        <IverksetterVedtakStatusModal
          visModal={visIverksetterVedtakModal}
          lukkModal={this.toggleIverksetterVedtakModal}
          behandlingsresultat={behandling.behandlingsresultat}
          behandlingStatusKode={behandling.status.kode}
        />
        <ProcessMenu
          steps={alleProsessMenySteg.map((p) => p.prosessmenySteg)}
          onClick={(index) => this.setSteg(alleProsessMenySteg[index].kode)}
        />
        <MargMarkering
          behandlingStatus={behandling.status}
          aksjonspunkter={valgtSteg.aksjonspunkter}
          isReadOnly={valgtSteg.isReadOnly}
        >
          {(!!valgtSteg && valgtSteg.kode === bpc.BEHANDLE_INNSYN) && (
            <InnsynProsessIndex
              saksnummer={fagsak.saksnummer}
              alleDokumenter={alleDokumenter}
              submitCallback={submitCallback}
              readOnly={valgtSteg.isReadOnly}
              isSubmittable={valgtSteg.isSubmittable}
              aksjonspunkter={valgtSteg.aksjonspunkter}
              alleKodeverk={kodeverk}
              behandling={behandling}
              innsyn={innsyn}
            />
          )}
          {(vedtakStegVises && valgtSteg.aksjonspunkter.length > 0) && (
            <VedtakInnsynProsessIndex
              saksnummer={fagsak.saksnummer}
              aksjonspunkter={aksjonspunkter}
              alleDokumenter={alleDokumenter}
              submitCallback={submitCallback}
              previewCallback={previewCallback}
              readOnly={valgtSteg.isReadOnly}
              behandling={behandling}
              innsyn={innsyn}
            />
          )}
          {(vedtakStegVises && valgtSteg.aksjonspunkter.length === 0) && (
            <div>Ingenting</div>
          )}
        </MargMarkering>
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
