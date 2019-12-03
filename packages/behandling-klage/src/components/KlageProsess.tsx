import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import ProcessMenu from '@navikt/nap-process-menu';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { aksjonspunktPropType, navAnsattPropType } from '@fpsak-frontend/prop-types';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';
import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Vilkar, Aksjonspunkt, MargMarkering, byggProsessmenySteg,
  fagsakInfoPropType, behandlingPropType, IverksetterVedtakStatusModal,

} from '@fpsak-frontend/behandling-felles';

import klageApi from '../data/klageBehandlingApi';
import finnKlageSteg from '../definition/klageStegDefinition';


const submitAksjonspunkter = (lagreAksjonspunkt, saksnummer, behandling, oppdaterProsessStegIUrl, toggleIverksetterVedtakModal,
  vedtakStegVises) => (aksjonspunktModels) => {
  /* const { setDoNoUpdateFagsak } = this.props;
  const skalByttTilKlageinstans = aksjonspunktModels
    .some((apValue) => apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP && apValue.klageVurdering === klageVurdering.STADFESTE_YTELSESVEDTAK);
  const erKlageHjemsendt = aksjonspunktModels
    .some((apValue) => apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NK && apValue.klageVurdering === klageVurdering.HJEMSENDE_UTEN_Å_OPPHEVE);
  const erFatterVedtak = aksjonspunktModels[0].kode === aksjonspunktCodes.FORESLA_VEDTAK;

  if (skalByttTilKlageinstans || erFatterVedtak) {
    setDoNoUpdateFagsak();
  }

  const afterAksjonspunktSubmit = () => {
    if (skalByttTilKlageinstans) {
      this.setShowModalKlageBehandling(true);
    } else if (erKlageHjemsendt) {
      this.goToKlageResultat();
    } else {
      this.goToDefaultPage();
    }
  }; */

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

const getForeslaVedtakAp = createSelector([(ownProps) => ownProps.aksjonspunkter], (aksjonspunkter) => (aksjonspunkter
  .filter((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET)
  .filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK).length === 1));

type OwnProps = Readonly<{
  intl: {};
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  vilkar: [Vilkar];
  kodeverk: {[key: string]: [Kodeverk]};
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

type KlageProsessState= Readonly<{
  visIverksetterVedtakModal: boolean;
}>

export class KlageProsess extends Component<Props, KlageProsessState> {
  static propTypes = {
    intl: PropTypes.shape({}).isRequired,
    fagsak: fagsakInfoPropType.isRequired,
    behandling: behandlingPropType.isRequired,
    aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
    vilkar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    kodeverk: PropTypes.shape({}).isRequired,
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

  saveKlageText = (aksjonspunktModel) => {
    const {
      behandling, saveKlage, resolveKlageTemp, aksjonspunkter,
    } = this.props;
    const data = {
      behandlingId: behandling.id,
      ...aksjonspunktModel,
    };
    if (getForeslaVedtakAp({ aksjonspunkter })) {
      resolveKlageTemp(data);
    } else {
      saveKlage(data);
    }
  }

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
      lagreAksjonspunkt,
      forhandsvisMelding,
      oppdaterProsessStegIUrl,
      hasFetchError,
      alleBehandlinger,
    } = this.props;
    const { visIverksetterVedtakModal } = this.state;

    const alleSteg = finnKlageSteg({
      behandling, aksjonspunkter, vilkar,
    });
    const alleProsessMenySteg = byggProsessmenySteg({
      alleSteg, valgtProsessSteg, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl,
    });

    const valgtSteg = alleProsessMenySteg[(alleProsessMenySteg.findIndex((p) => p.prosessmenySteg.isActive))];
    const vedtakStegVises = !!valgtSteg && valgtSteg.kode === bpc.VEDTAK;
    const submitCallback = submitAksjonspunkter(lagreAksjonspunkt, fagsak.saksnummer, behandling, oppdaterProsessStegIUrl,
      this.toggleIverksetterVedtakModal, false);
    const previewCallback = previewCallbackFunc(forhandsvisMelding, behandling.uuid, fagsak.fagsakYtelseType);
    const apCodes = valgtSteg.aksjonspunkter.map((a) => a.definisjon.kode);

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
          {(!!valgtSteg && valgtSteg.kode === bpc.KLAGE_RESULTAT) && (
            <VedtakTilbakekrevingProsessIndex
              behandling={behandling}
              klageVurdering={klageVurdering}
              aksjonspunkter={valgtSteg.aksjonspunkter}
              submitCallback={submitCallback}
              previewVedtakCallback={previewCallback}
              readOnly={valgtSteg.isReadOnly}
            />
          )}
          {(apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NK)
          || apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NFP)) && (
            <KlagevurderingProsessIndex
              behandling={behandling}
              klageVurdering={klageVurdering}
              alleKodeverk={kodeverk}
              saveKlage={this.saveKlageText}
              submitCallback={submitCallback}
              readOnly={valgtSteg.isReadOnly}
              previewCallback={previewCallback}
              readOnlySubmitButton
              apCodes={valgtSteg.aksjonspunkter.map((a) => a.definisjon.kode)}
            />
          )}
          {(apCodes.includes(aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP)
          || apCodes.includes(aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA)) && (
            <FormkravProsessIndex
              behandling={behandling}
              klageVurdering={klageVurdering}
              submitCallback={submitCallback}
              readOnly={valgtSteg.isReadOnly}
              readOnlySubmitButton
              apCodes={valgtSteg.aksjonspunkter.map((a) => a.definisjon.kode)}
              alleKodeverk={kodeverk}
              avsluttedeBehandlinger={alleBehandlinger.filter((b) => b.status.kode === behandlingStatus.AVSLUTTET)}
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
