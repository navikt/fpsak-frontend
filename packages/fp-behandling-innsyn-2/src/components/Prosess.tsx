import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import ProcessMenu from '@navikt/nap-process-menu';
import { injectIntl } from 'react-intl';

import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';
import {
  allAccessRights, behandlingspunktCodes as bpc,
} from '@fpsak-frontend/fp-felles';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';

import { Kodeverk } from '../types/kodeverkTsType';
import { Behandling } from '../types/behandlingTsType';
import { FagsakInfo } from '../types/fagsakInfoTsType';
import { Vilkar } from '../types/vilkarTsType';
import { NavAnsatt } from '../types/navAnsattTsType';
import { Aksjonspunkt } from '../types/aksjonspunktTsType';
import { Innsyn } from '../types/innsynTsType';
import { Dokument } from '../types/dokumentTsType';
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


const submitAksjonspunkter = (lagreAksjonspunkt, saksnummer, behandlingId, behandlingVersjon, oppdaterLocation, valgtPunkt) => (aksjonspunktModels) => {
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

  return lagreAksjonspunkt(params, { keepData: true })
    .then(() => oppdaterLocation());
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

const previewCallbackFunc = (forhandsvisMelding, behandlingUuid, ytelseType) => (data) => {
  const brevData = {
    ...data,
    behandlingUuid,
    ytelseType,
  };

  return forhandsvisMelding(brevData);
};


type Props = {
  intl: {};
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  vilkar: [Vilkar];
  innsyn: Innsyn;
  kodeverk: Kodeverk;
  alleDokumenter: [Dokument];
  navAnsatt: NavAnsatt;
  valgtPunkt: string;
  lagreAksjonspunkt: ({}, { keepData: boolean }) => Promise<any>;
  forhandsvisMelding: ({}, { keepData: boolean }) => Promise<any>;
  oppdaterLocation: (punktnavn: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
};

export class Prosess extends Component<Props> {
  componentDidUpdate = (prevProps) => {
    const {
      behandling, oppdaterBehandlingVersjon,
    } = this.props;
    if (behandling.versjon !== prevProps.behandling.versjon) {
      oppdaterBehandlingVersjon(behandling.versjon);
    }
  }

  oppdaterSteg = (punkt) => {
    const {
      oppdaterLocation,
    } = this.props;
    oppdaterLocation(punkt);
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
      valgtPunkt,
      lagreAksjonspunkt,
      forhandsvisMelding,
      oppdaterLocation,
    } = this.props;

    const punkter = getBehandlingspunkterProps(behandling, aksjonspunkter, vilkar, innsyn, valgtPunkt, intl);

    const hasFetchError = false;// useSelector(hasReadOnlyBehandling);

    const submitCallback = submitAksjonspunkter(lagreAksjonspunkt, fagsak.saksnummer, behandling.id, behandling.versjon, oppdaterLocation, valgtPunkt);
    const previewCallback = previewCallbackFunc(forhandsvisMelding, behandling.uuid, fagsak.fagsakYtelseType);

    const valgtSteg = punkter[(punkter.findIndex((p) => p.step.isActive))];

    const apForBp = valgtSteg ? aksjonspunkter.filter((a) => valgtSteg.apCodes.includes(a.definisjon.kode)) : [];
    const vilkarForBp = valgtSteg ? vilkar.filter((v) => valgtSteg.vilkarene.includes(v)) : [];
    const isReadOnly = erReadOnly(behandling, apForBp, vilkarForBp, navAnsatt, fagsak, hasFetchError);
    const isSubmittable = valgtSteg ? apForBp.some((ap) => ap.kanLoses) || vilkarUtfallType.OPPFYLT === valgtSteg.status : false;


    return (
      <>
        <BehandlingPaVent behandling={behandling} aksjonspunkter={aksjonspunkter} kodeverk={kodeverk} />
        <ProcessMenu steps={punkter.map((p) => p.step)} onClick={(nr) => this.oppdaterSteg(punkter[nr].code)} />
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
  }
}

Prosess.propTypes = {
  intl: PropTypes.shape().isRequired,
  fagsak: PropTypes.shape().isRequired,
  behandling: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  innsyn: PropTypes.shape().isRequired,
  kodeverk: PropTypes.shape().isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  valgtPunkt: PropTypes.string.isRequired,
  lagreAksjonspunkt: PropTypes.func.isRequired,
  forhandsvisMelding: PropTypes.func.isRequired,
  oppdaterLocation: PropTypes.func.isRequired,
};

export default injectIntl(Prosess);
