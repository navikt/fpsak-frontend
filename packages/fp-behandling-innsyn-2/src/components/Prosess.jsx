import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useIntl } from 'react-intl';

import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  allAccessRights, DataFetcher, behandlingspunktCodes as bpc, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta,
} from '@fpsak-frontend/fp-felles';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';

import fpInnsynApi from '../data/innsynBehandlingApi';
import createForeldrepengerBpProps from '../definition/foreldrepengerInnsynBpDefinition';
import ProsessMeny from './ProsessMeny';

const innsynData = [fpInnsynApi.INNSYN];
const vedtakData = [fpInnsynApi.INNSYN];

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

const getBehandlingspunkterProps = (fagsak, behandling, aksjonspunkter, vilkar) => {
  if (!behandling.type) {
    return undefined;
  }

  const builderData = {
    behandlingType: behandling.type,
    aksjonspunkter,
    vilkar,
    innsynResultatType: {},
  };

  const liste = createForeldrepengerBpProps(builderData);
  return liste;
};

const submitAksjonspunkter = (dispatch, saksnummer, behandlingId, behandlingVersjon, oppdaterLocation, location) => (aksjonspunktModels) => {
  const models = aksjonspunktModels.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer,
    behandlingId,
    behandlingVersjon,
    bekreftedeAksjonspunktDtoer: models,
  };

  return dispatch(fpInnsynApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params, { keepData: true }))
    .then(() => oppdaterLocation(getLocationWithDefaultBehandlingspunktAndFakta(location)));
};

const isSaveStarted = createSelector([fpInnsynApi.SAVE_AKSJONSPUNKT.getRestApiStarted()], (isStarted) => (isStarted));

const hasReadOnlyBehandling = createSelector(
  [fpInnsynApi.BEHANDLING_INNSYN.getRestApiError()], (behandlingFetchError) => (!!behandlingFetchError),
);

const erReadOnly = (behandling, aksjonspunkterForPunkt, vilkarlisteForPunkt, navAnsatt, fagsak, hasFetchError) => {
  const rettigheter = allAccessRights(navAnsatt, fagsak.fagsakStatus, behandling.status, behandling.type);
  const behandlingIsOnHold = behandling.behandlingPaaVent;
  const isBehandlingReadOnly = hasFetchError || (behandling.taskStatus && behandling.taskStatus.readOnly ? behandling.taskStatus.readOnly : false);
  // TODO (TOR) bp-ap og bp-v
  const hasNonActivOrNonOverstyrbar = aksjonspunkterForPunkt.some((ap) => !ap.erAktivt) || vilkarlisteForPunkt.some((v) => !v.overstyrbar);
  return !rettigheter.writeAccess.isEnabled || behandlingIsOnHold || isBehandlingReadOnly || hasNonActivOrNonOverstyrbar;
};

const previewCallbackFunc = (dispatch, behandlingUuid, ytelseType) => (data) => {
  const brevData = {
    ...data,
    behandlingUuid,
    ytelseType,
  };

  return dispatch(fpInnsynApi.PREVIEW_MESSAGE.makeRestApiRequest()(brevData));
};


const Prosess = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  kodeverk,
  alleDokumenter,
  navAnsatt,
  location,
  oppdaterLocation,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const punkter = useMemo(() => getBehandlingspunkterProps(fagsak, behandling, aksjonspunkter, vilkar), [fagsak, behandling]);

  const hasFetchError = useSelector(hasReadOnlyBehandling);

  const submitCallback = useCallback(submitAksjonspunkter(dispatch, fagsak.saksnummer, behandling.id, behandling.versjon, oppdaterLocation, location));
  const previewCallback = useCallback(previewCallbackFunc(dispatch, behandling.uuid, fagsak.fagsakYtelseType));
  const isStarted = useSelector(isSaveStarted);

  const steps = punkter.map((p) => ({ label: intl.formatMessage({ id: p.titleCode }), code: p.code }));

  const defaultStegNummer = punkter.findIndex((p) => p.code === location.query.punkt);
  const stegMedApentAp = punkter.findIndex((p) => aksjonspunkter.filter((ap) => p.apCodes.includes(ap.definisjon.kode)).some((ap) => ap.status.kode === 'OPPR'));

  const [valgtStegNummer, setValgtSteg] = useState(defaultStegNummer !== -1 ? defaultStegNummer : stegMedApentAp);

  const valgtSteg = steps[valgtStegNummer];
  const valgtP = punkter[valgtStegNummer];


  useEffect(() => {
    if (valgtP) {
      const newLocation = getBehandlingspunktLocation(location)(formatBehandlingspunktName(valgtP.code));
      oppdaterLocation(newLocation);
    }
  }, [valgtStegNummer]);


  const apForBp = valgtP ? aksjonspunkter.filter((a) => valgtP.apCodes.includes(a.definisjon.kode)) : [];
  const vilkarForBp = valgtP ? vilkar.filter((v) => valgtP.vilkarene.includes(v)) : [];
  const isReadOnly = useMemo(() => erReadOnly(behandling, apForBp, vilkarForBp, navAnsatt, fagsak, hasFetchError),
    [behandling, apForBp, vilkarForBp, navAnsatt, fagsak, hasFetchError]);
  const isSubmittable = valgtP ? apForBp.some((ap) => ap.kanLoses) || vilkarUtfallType.OPPFYLT === valgtP.status : false;

  if (isStarted) {
    return (
      <>
        <ProsessMeny steps={steps} onClick={setValgtSteg} />
        <LoadingPanel />
      </>
    );
  }

  return (
    <>
      <ProsessMeny steps={steps} onClick={setValgtSteg} />
      <DataFetcher
        showComponent={!!valgtSteg && valgtSteg.code === bpc.BEHANDLE_INNSYN}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        showLoadingIcon
        endpoints={innsynData}
        render={(dataProps) => (
          <InnsynProsessIndex
            saksnummer={fagsak.saksnummer}
            alleDokumenter={alleDokumenter}
            submitCallback={submitCallback}
            readOnly={isReadOnly}
            isSubmittable={isSubmittable}
            aksjonspunkter={apForBp}
            alleKodeverk={kodeverk}
            behandling={behandling}
            innsyn={dataProps.innsyn}
          />
        )}
      />
      <DataFetcher
        showComponent={!!valgtSteg && valgtSteg.code === bpc.VEDTAK}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        showLoadingIcon
        endpoints={vedtakData}
        render={(dataProps) => (
          <VedtakInnsynProsessIndex
            saksnummer={fagsak.saksnummer}
            aksjonspunkter={aksjonspunkter}
            alleDokumenter={alleDokumenter}
            submitCallback={submitCallback}
            previewCallback={previewCallback}
            readOnly={isReadOnly}
            behandling={behandling}
            innsyn={dataProps.innsyn}
          />
        )}
      />
    </>
  );
};

Prosess.propTypes = {
  fagsak: PropTypes.shape().isRequired,
  behandling: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  kodeverk: PropTypes.shape().isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  location: PropTypes.shape().isRequired,
  oppdaterLocation: PropTypes.func.isRequired,
};

export default Prosess;
