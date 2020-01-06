import React, {
  FunctionComponent, useState, useEffect, useCallback,
} from 'react';
import { useIntl, WrappedComponentProps } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setSubmitFailed } from 'redux-form';
import ProcessMenu from '@navikt/nap-process-menu';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { AdvarselModal } from '@fpsak-frontend/shared-components';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { behandlingspunktCodes as bpc, allAccessRights } from '@fpsak-frontend/fp-felles';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, MargMarkering, byggProsessmenySteg, Vilkar,
  FatterVedtakStatusModal, BehandlingHenlagtPanel, ProsessStegIkkeBehandletPanel, SimuleringResultat,
  DataFetcherBehandlingDataV2,
} from '@fpsak-frontend/behandling-felles';

import esBehandlingApi from '../data/esBehandlingApi';
import finnEngangsstonadSteg from '../definition/engangsstonadStegDefinition';
import prosessStegPaneler from '../definition/prosessStegPaneler';

import '@fpsak-frontend/assets/styles/arrowForProcessMenu.less';

const getValgtPanel = (stegKode, aksjonspunkter) => prosessStegPaneler.find((panel) => panel.showWhen({ stegKode, aksjonspunkter }));

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

const getPreviewCallback = (dispatch, behandling) => (data) => {
  const brevData = {
    ...data,
    behandling: behandling.uuid,
    ytelseType: fagsakYtelseType.ENGANGSSTONAD,
  };
  return dispatch(esBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};

const getPreviewFptilbakeCallback = (dispatch, fagsak, behandling) => (mottaker, brevmalkode, fritekst, saksnummer) => {
  const data = {
    behandlingUuid: behandling.uuid,
    fagsakYtelseType: fagsak.fagsakYtelseType,
    varseltekst: fritekst || '',
    mottaker,
    brevmalkode,
    saksnummer,
  };
  return dispatch(esBehandlingApi.PREVIEW_TILBAKEKREVING_MESSAGE.makeRestApiRequest()(data));
};

const getSubmitAksjonspunkter = (dispatch, toggleFatterVedtakModal, toggleOppdatereFagsakContext,
  fagsak, behandling, oppdaterProsessStegIUrl) => (aksjonspunktModels) => {
  const isFatterVedtakAp = aksjonspunktModels.some((ap) => ap.kode === aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK);

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

  return dispatch(esBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params, { keepData: true }))
    .then(() => {
      if (isFatterVedtakAp) {
        toggleOppdatereFagsakContext(false);
        toggleFatterVedtakModal(true);
      } else {
        oppdaterProsessStegIUrl('default');
      }
    });
};

const EngangsstonadProsess: FunctionComponent<Props> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  simuleringResultat,
  beregningresultatEngangsstonad,
  soknad,
  kodeverk,
  navAnsatt,
  valgtProsessSteg,
  hasFetchError,
  harApenRevurdering,
  oppdaterBehandlingVersjon,
  oppdaterProsessStegIUrl,
  featureToggles,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const [visApenRevurderingModal, lukkApenRevurderingModal] = useState(harApenRevurdering && !behandling.behandlingPaaVent);
  const [visFatterVedtakModal, toggleFatterVedtakModal] = useState(false);
  const [skalOppdatereFagsakKontekst, toggleOppdatereFagsakContext] = useState(true);
  const [overstyrteProsessSteg, toggleOverstyrteProsessSteg] = useState([]);

  const setStegIUrl = useCallback((nyttValg, forrigeSteg) => oppdaterProsessStegIUrl(!forrigeSteg || nyttValg !== forrigeSteg.kode ? nyttValg : undefined), []);
  const submitAksjonspunkter = useCallback(() => getSubmitAksjonspunkter(dispatch,
    toggleFatterVedtakModal, toggleOppdatereFagsakContext, fagsak, behandling, oppdaterProsessStegIUrl), [behandling.versjon]);
  const previewCallback = useCallback(() => getPreviewCallback(dispatch, behandling), []);
  const previewFptilbakeCallback = useCallback(() => getPreviewFptilbakeCallback(dispatch, behandling), []);
  const dispatchSubmitFailed = useCallback(() => dispatch(setSubmitFailed), []);

  useEffect(() => {
    if (skalOppdatereFagsakKontekst) {
      oppdaterBehandlingVersjon(behandling.versjon);
    }
  }, [behandling.versjon]);

  const alleSteg = finnEngangsstonadSteg({
    behandling, aksjonspunkter, vilkar, simuleringResultat, beregningresultatEngangsstonad,
  });
  const alleProsessMenySteg = byggProsessmenySteg({
    alleSteg, valgtProsessSteg, behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError, intl,
  });

  const valgtSteg = alleProsessMenySteg[(alleProsessMenySteg.findIndex((p) => p.prosessmenySteg.isActive))];
  const valgtStegKode = valgtSteg ? valgtSteg.kode : undefined;
  const erStegBehandlet = valgtSteg ? valgtSteg.erStegBehandlet : false;

  const valgtPanel = valgtSteg ? getValgtPanel(valgtStegKode, valgtSteg.aksjonspunkter) : undefined;
  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);

  return (
    <>
      {visApenRevurderingModal && (
        <AdvarselModal
          headerTextCode="BehandlingTilbakekrevingIndex.ApenRevurderingHeader"
          textCode="BehandlingTilbakekrevingIndex.ApenRevurdering"
          showModal
          submit={lukkApenRevurderingModal}
        />
      )}
      <FatterVedtakStatusModal
        visModal={visFatterVedtakModal}
        lukkModal={toggleFatterVedtakModal}
        tekstkode="FatterTilbakekrevingVedtakStatusModal.Sendt"
      />
      <ProcessMenu
        steps={alleProsessMenySteg.map((p) => p.prosessmenySteg)}
        onClick={(index) => setStegIUrl(alleProsessMenySteg[index].kode, valgtSteg)}
      />
      {(erStegBehandlet) && (
        <MargMarkering
          behandlingStatus={behandling.status}
          aksjonspunkter={valgtSteg.aksjonspunkter}
          isReadOnly={valgtSteg.isReadOnly}
        >
          <DataFetcherBehandlingDataV2
            key={valgtSteg.kode}
            behandlingVersion={behandling.versjon}
            endpoints={valgtPanel.endpoints}
            render={(dataProps) => valgtPanel.renderComponent({
              ...dataProps,
              submitCallback: submitAksjonspunkter,
              readOnly: valgtSteg.isReadOnly,
              readOnlySubmitButton: (!(valgtSteg.aksjonspunkter.some((ap) => ap.kanLoses)) || vilkarUtfallType.OPPFYLT === valgtSteg.status),
              aksjonspunkter: valgtSteg.aksjonspunkter,
              status: valgtSteg.status,
              alleKodeverk: kodeverk,
              isAksjonspunktOpen: valgtSteg.aksjonspunkter.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET),
              ...valgtPanel.getExtraData({
                valgtStegKode,
                vilkar: valgtSteg.vilkar,
                previewCallback,
                previewFptilbakeCallback,
                rettigheter,
                aksjonspunkter,
                overstyrteProsessSteg,
                label: valgtSteg.prosessmenySteg.label,
                alleKodeverk: kodeverk,
                dispatchSubmitFailed,
                featureToggles,
                fagsak,
              }),
              overrideReadOnly: valgtSteg.isOverrideReadOnly,
              kanOverstyreAccess: rettigheter.kanOverstyreAccess,
              toggleOverstyring: toggleOverstyrteProsessSteg,
            })}
          />
        </MargMarkering>
      )}
      {(valgtStegKode === bpc.VEDTAK && behandling.behandlingHenlagt) && (
        <BehandlingHenlagtPanel />
      )}
      {(valgtStegKode && !erStegBehandlet && (valgtStegKode !== bpc.VEDTAK || (valgtStegKode === bpc.VEDTAK && !behandling.behandlingHenlagt))) && (
        <ProsessStegIkkeBehandletPanel />
      )}
    </>
  );
};

export default EngangsstonadProsess;
