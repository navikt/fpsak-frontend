import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useIntl } from 'react-intl';
import ProcessMenu from '@navikt/nap-process-menu';

import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';
import {
  allAccessRights, behandlingspunktCodes as bpc,
} from '@fpsak-frontend/fp-felles';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';

import fpInnsynApi from '../data/innsynBehandlingApi';
import createInnsynStegProps from '../definition/innsynStegDefinition';
import BehandlingPaVent from './BehandlingPaVent';
import MargMarkering from './MargMarkering';

const finnStatus = (status, harApentAp) => {
  if (status === vilkarUtfallType.OPPFYLT) {
    return 'success';
  } if (status === vilkarUtfallType.IKKE_VURDERT && harApentAp) {
    return 'warning';
  } if (status === vilkarUtfallType.IKKE_OPPFYLT) {
    return 'danger';
  }
  return 'default';
};

const getBehandlingspunkterProps = (behandling, aksjonspunkter, vilkar, innsyn, valgtPunkt, intl) => {
  if (!behandling.type) {
    return undefined;
  }

  const builderData = {
    behandlingType: behandling.type,
    aksjonspunkter,
    vilkar,
    innsynResultatType: innsyn.innsynResultatType,
  };

  const punkter = createInnsynStegProps(builderData);

  const stegMedApentApNr = punkter.findIndex((p) => aksjonspunkter
    .filter((ap) => p.apCodes.includes(ap.definisjon.kode)).some((ap) => ap.status.kode === 'OPPR'));
  const defaultStegNummer = punkter.findIndex((p) => p.code === valgtPunkt);
  const nr = defaultStegNummer !== -1 ? defaultStegNummer : stegMedApentApNr;

  return punkter.map((p, index) => {
    const harApentAp = stegMedApentApNr === index;
    const status = finnStatus(p.status, harApentAp);
    return {
      ...p,
      step: {
        label: intl.formatMessage({ id: p.titleCode }),
        type: status,
        isFinished: status === 'success',
        isActive: nr === index,
        isDisabled: true,
      },
    };
  });
};

const submitAksjonspunkter = (dispatch, saksnummer, behandlingId, behandlingVersjon, oppdaterLocation, valgtPunkt) => (aksjonspunktModels) => {
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
    .then(() => oppdaterLocation(valgtPunkt));
};

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
  innsyn,
  kodeverk,
  alleDokumenter,
  navAnsatt,
  valgtPunkt,
  oppdaterLocation,
  oppdaterBehandlingVersjon,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const punkter = useMemo(() => getBehandlingspunkterProps(behandling, aksjonspunkter, vilkar, innsyn, valgtPunkt, intl), [behandling, aksjonspunkter, vilkar, innsyn, valgtPunkt]);

  const hasFetchError = useSelector(hasReadOnlyBehandling);

  const submitCallback = useCallback(submitAksjonspunkter(dispatch, fagsak.saksnummer, behandling.id, behandling.versjon, oppdaterLocation, valgtPunkt));
  const previewCallback = useCallback(previewCallbackFunc(dispatch, behandling.uuid, fagsak.fagsakYtelseType));

  const [valgtStegNummer, setValgtSteg] = useState(punkter.findIndex((p) => p.step.isActive));


  const valgtSteg = punkter[valgtStegNummer];

  useEffect(() => {
    if (valgtPunkt !== valgtSteg.code) {
      oppdaterLocation(valgtSteg.code);
    }
  }, [valgtStegNummer]);

  useEffect(() => {
    oppdaterBehandlingVersjon(behandling.versjon);
  }, [behandling.versjon]);

  const apForBp = valgtSteg ? aksjonspunkter.filter((a) => valgtSteg.apCodes.includes(a.definisjon.kode)) : [];
  const vilkarForBp = valgtSteg ? vilkar.filter((v) => valgtSteg.vilkarene.includes(v)) : [];
  const isReadOnly = useMemo(() => erReadOnly(behandling, apForBp, vilkarForBp, navAnsatt, fagsak, hasFetchError),
    [behandling, apForBp, vilkarForBp, navAnsatt, fagsak, hasFetchError]);
  const isSubmittable = valgtSteg ? apForBp.some((ap) => ap.kanLoses) || vilkarUtfallType.OPPFYLT === valgtSteg.status : false;

  return (
    <>
      <BehandlingPaVent behandling={behandling} aksjonspunkter={aksjonspunkter} kodeverk={kodeverk} />
      <ProcessMenu steps={punkter.map((p) => p.step)} onClick={setValgtSteg} />
      <MargMarkering behandlingStatus={behandling.status} aksjonspunkter={apForBp} isReadOnly={isReadOnly}>
        {(!!valgtSteg && valgtSteg.code === bpc.BEHANDLE_INNSYN) && (
          <InnsynProsessIndex
            saksnummer={fagsak.saksnummer}
            alleDokumenter={alleDokumenter}
            submitCallback={submitCallback}
            readOnly={isReadOnly}
            isSubmittable={isSubmittable}
            aksjonspunkter={apForBp}
            alleKodeverk={kodeverk}
            behandling={behandling}
            innsyn={innsyn}
          />
        )}
        {(!!valgtSteg && valgtSteg.code === bpc.VEDTAK && apForBp.length > 0) && (
          <VedtakInnsynProsessIndex
            saksnummer={fagsak.saksnummer}
            aksjonspunkter={aksjonspunkter}
            alleDokumenter={alleDokumenter}
            submitCallback={submitCallback}
            previewCallback={previewCallback}
            readOnly={isReadOnly}
            behandling={behandling}
            innsyn={innsyn}
          />
        )}
        {(!!valgtSteg && valgtSteg.code === bpc.VEDTAK && apForBp.length === 0) && (
          <div>Ingenting</div>
        )}
      </MargMarkering>
    </>
  );
};

Prosess.propTypes = {
  fagsak: PropTypes.shape().isRequired,
  behandling: PropTypes.shape().isRequired,
  innsyn: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  kodeverk: PropTypes.shape().isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  valgtPunkt: PropTypes.string.isRequired,
  oppdaterLocation: PropTypes.func.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
};

export default Prosess;
