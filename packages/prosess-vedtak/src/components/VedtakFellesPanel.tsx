import React, {
  FunctionComponent, useState, useCallback, ReactNode,
} from 'react';
import moment from 'moment';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { ReactComponent as PopOutPilSvg } from '@fpsak-frontend/assets/images/pop-out-pil.svg';
import { ReactComponent as EditUtlandSvg } from '@fpsak-frontend/assets/images/endre.svg';
import {
  Kodeverk, KodeverkMedNavn, BeregningsresultatFp, BeregningsresultatEs, Behandlingsresultat, Aksjonspunkt,
} from '@fpsak-frontend/types';
import {
  VerticalSpacer, FlexColumn, FlexContainer, FlexRow, OkAvbrytModal, Image,
} from '@fpsak-frontend/shared-components';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';

import vedtakResultType from '../kodeverk/vedtakResultType';
import FritekstBrevPanel from './FritekstBrevPanel';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import { findInnvilgetResultatText, findAvslagResultatText } from './VedtakHelper';

import styles from './vedtakFellesPanel.less';

const getOpphorsdato = (resultatstruktur, medlemskapFom, behandlingsresultat) => {
  if (resultatstruktur && resultatstruktur.opphoersdato) {
    return resultatstruktur.opphoersdato;
  }
  if (medlemskapFom) {
    return medlemskapFom;
  }
  return behandlingsresultat.skjæringstidspunkt
    ? behandlingsresultat.skjæringstidspunkt.dato : '';
};

export const getTextCode = (behandlingStatus) => (behandlingStatus === behandlingStatusCode.AVSLUTTET
  || behandlingStatus === behandlingStatusCode.IVERKSETTER_VEDTAK ? 'VedtakForm.vedtak' : 'VedtakForm.ForslagTilVedtak');

const kanSendesTilGodkjenning = (behandlingStatusKode) => behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

const finnKnappetekstkode = (behandlingType, skalBrukeManueltBrev, aksjonspunkter) => {
  if (behandlingType.kode === BehandlingType.REVURDERING && !skalBrukeManueltBrev) {
    return aksjonspunkter && aksjonspunkter.some((ap) => ap.erAktivt === true && ap.toTrinnsBehandling === true)
      ? 'VedtakForm.TilGodkjenning' : 'VedtakForm.FattVedtak';
  }

  if (!skalBrukeManueltBrev && aksjonspunkter && aksjonspunkter.some((a) => a.definisjon.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL)) {
    return 'VedtakForm.FattVedtak';
  }
  return 'VedtakForm.TilGodkjenning';
};

export const lagKonsekvensForYtelsenTekst = (konsekvenser, getKodeverknavn) => {
  if (!konsekvenser || konsekvenser.length < 1) {
    return '';
  }
  return konsekvenser.map((k) => getKodeverknavn(k)).join(' og ');
};

const isNewBehandlingResult = (beregningResultat, originaltBeregningResultat) => {
  const vedtakResult = beregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  const vedtakResultOriginal = originaltBeregningResultat ? vedtakResultType.INNVILGET : vedtakResultType.AVSLAG;
  return vedtakResultOriginal !== vedtakResult;
};

const isNewAmount = (beregningResultat, originaltBeregningResultat, erInnvilget) => {
  if (beregningResultat === null) {
    return false;
  }
  if (erInnvilget) {
    return beregningResultat.beregnetTilkjentYtelse !== originaltBeregningResultat.beregnetTilkjentYtelse;
  }
  return beregningResultat.antallBarn !== originaltBeregningResultat.antallBarn;
};

const resultText = (beregningResultat, originaltBeregningResultat, erInnvilget) => {
  if (isNewBehandlingResult(beregningResultat, originaltBeregningResultat)) {
    return beregningResultat ? 'VedtakForm.Resultat.EndretTilInnvilget' : 'VedtakForm.Resultat.EndretTilAvslag';
  }
  if (erInnvilget) {
    return isNewAmount(beregningResultat, originaltBeregningResultat, erInnvilget)
      ? 'VedtakForm.Resultat.EndretTilkjentYtelse'
      : 'VedtakForm.Resultat.IngenEndring';
  }
  return isNewAmount(beregningResultat, originaltBeregningResultat, erInnvilget)
    ? 'VedtakForm.Resultat.EndretAntallBarn'
    : 'VedtakForm.Resultat.IngenEndring';
};

const finnInvilgetTekst = (intl, behandlingsresultat, ytelseTypeKode) => intl
  .formatMessage({ id: findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode) });

const finnInvilgetRevurderingTekst = (intl, ytelseTypeKode, konsekvenserForYtelsen,
  getKodeverknavn, tilbakekrevingText, beregningResultat, originaltBeregningResultat) => {
  if (ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD) {
    return intl.formatMessage({ id: resultText(beregningResultat, originaltBeregningResultat, true) });
  }
  return `${lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn)}${
    lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, getKodeverknavn)}` !== '' && tilbakekrevingText && '. ';
};

interface OwnProps {
  behandlingsresultat?: Behandlingsresultat;
  ytelseTypeKode: string;
  behandlingType: Kodeverk;
  readOnly: boolean;
  kanOverstyre: boolean;
  erBehandlingEtterKlage: boolean;
  aksjonspunkter: Aksjonspunkt[];
  behandlingStatusKode: string;
  renderPanel: (skalBrukeManueltBrev: boolean, erInnvilget: boolean, erAvslatt: boolean) => ReactNode;
  previewAutomatiskBrev: (e: Event) => void;
  previewOverstyrtBrev: (e: Event) => void;
  tilbakekrevingtekst?: string;
  sprakkode: Kodeverk;
  resetForm: () => void;
  handleSubmit: (any) => void;
  submitting: boolean;
  behandlingPaaVent: boolean;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
  resultatstrukturOriginalBehandling?: {
    'beregningsresultat-engangsstonad'?: {};
    'beregningsresultat-foreldrepenger'?: {};
  };
  resultatstruktur?: BeregningsresultatFp | BeregningsresultatEs;
  medlemskapFom?: string;
}

export const VedtakFellesPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingsresultat,
  ytelseTypeKode,
  behandlingStatusKode,
  aksjonspunkter,
  readOnly,
  renderPanel,
  kanOverstyre,
  previewAutomatiskBrev,
  previewOverstyrtBrev,
  sprakkode,
  tilbakekrevingtekst,
  resetForm,
  erBehandlingEtterKlage,
  handleSubmit,
  submitting,
  behandlingPaaVent,
  behandlingType,
  alleKodeverk,
  resultatstrukturOriginalBehandling,
  resultatstruktur,
  medlemskapFom,
}) => {
  const [skalBrukeManueltBrev, toggleSkalBrukeManueltBrev] = useState(behandlingsresultat.vedtaksbrev.kode === 'FRITEKST');
  const [skalViseModal, toggleVisModal] = useState(false);
  const onToggleOverstyring = useCallback(() => {
    toggleSkalBrukeManueltBrev(true);
  }, []);
  const avsluttRedigering = useCallback(() => {
    toggleSkalBrukeManueltBrev(false);
    toggleVisModal(false);
    resetForm();
  }, []);

  // for lenke:  readOnly={readOnly || (initialValues.skalBrukeOverstyrendeFritekstBrev === true)}
  const erInnvilget = isInnvilget(behandlingsresultat.type.kode);
  const erAvslatt = isAvslag(behandlingsresultat.type.kode);
  const erOpphor = isOpphor(behandlingsresultat.type.kode);

  const skalViseLink = (behandlingsresultat.avslagsarsak === null)
  || (behandlingsresultat.avslagsarsak && behandlingsresultat.avslagsarsak.kode !== avslagsarsakCodes.INGEN_BEREGNINGSREGLER);

  const erRevurdering = behandlingType.kode === BehandlingType.REVURDERING;
  const konsekvenserForYtelsen = behandlingsresultat !== undefined ? behandlingsresultat.konsekvenserForYtelsen : undefined;
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <>
      <OkAvbrytModal
        textCode="VedtakFellesPanel.Forkast"
        okButtonTextCode="VedtakFellesPanel.Ok"
        showModal={skalViseModal}
        cancel={() => toggleVisModal(false)}
        submit={avsluttRedigering}
      />
      <FlexContainer>
        <FlexRow>
          {(behandlingStatusKode === behandlingStatusCode.AVSLUTTET) && (
            <FlexColumn>
              <Image className={styles.status} src={erInnvilget ? innvilgetImage : avslattImage} />
            </FlexColumn>
          )}
          <FlexColumn>
            <Undertittel><FormattedMessage id={getTextCode(behandlingStatusKode)} /></Undertittel>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
      <VedtakHelpTextPanel aksjonspunkter={aksjonspunkter} readOnly={readOnly} />
      <Row>
        <Column xs="3">
          <Element>
            {erInnvilget && !erRevurdering && finnInvilgetTekst(intl, behandlingsresultat, ytelseTypeKode)}
            {erInnvilget && erRevurdering && finnInvilgetRevurderingTekst(intl, ytelseTypeKode, konsekvenserForYtelsen,
              getKodeverknavn, tilbakekrevingtekst, resultatstruktur, resultatstrukturOriginalBehandling)}
            {erAvslatt && !erRevurdering && intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
            {erAvslatt && erRevurdering && intl.formatMessage({ id: resultText(resultatstruktur, resultatstrukturOriginalBehandling, false) })}
            {erOpphor && erRevurdering && intl.formatMessage({
              id: ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER
                ? 'VedtakForm.RevurderingSVP.SvangerskapspengerOpphoerer' : 'VedtakForm.RevurderingFP.ForeldrepengerOpphoerer',
            }, { dato: moment(getOpphorsdato(resultatstruktur, medlemskapFom, behandlingsresultat)).format(DDMMYYYY_DATE_FORMAT) })}
            {tilbakekrevingtekst && (
              `. ${intl.formatMessage({ id: tilbakekrevingtekst })}`
            )}
          </Element>
        </Column>
        <Column xs="3">
          {skalViseLink && !erBehandlingEtterKlage && (
            <>
              <Lenke href="#" onClick={previewAutomatiskBrev}>
                <FormattedMessage id="VedtakFellesPanel.AutomatiskVedtaksbrev" />
              </Lenke>
              <PopOutPilSvg className={styles.pil} />
            </>
          )}
        </Column>
        {(!readOnly && kanOverstyre && !skalBrukeManueltBrev) && (
          <Column xs="3">
            <EditUtlandSvg className={styles.blyant} />
            <Lenke href="#" onClick={onToggleOverstyring} className={skalBrukeManueltBrev && styles.test}>
              <FormattedMessage id="VedtakFellesPanel.RedigerVedtaksbrev" />
            </Lenke>
          </Column>
        )}
      </Row>
      <VerticalSpacer twentyPx />
      {renderPanel(skalBrukeManueltBrev, erInnvilget, erAvslatt)}
      {skalBrukeManueltBrev && (
        <FritekstBrevPanel
          readOnly={readOnly}
          sprakkode={sprakkode}
          previewOverstyrtBrev={previewOverstyrtBrev}
          skalViseLink={skalViseLink}
        />
      )}
      {kanSendesTilGodkjenning(behandlingStatusKode) && (
        <>
          <VerticalSpacer twentyPx />
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                {!readOnly && (
                  <Hovedknapp
                    mini
                    onClick={handleSubmit}
                    disabled={behandlingPaaVent || submitting}
                    spinner={submitting}
                  >
                    <FormattedMessage id={finnKnappetekstkode(behandlingType, skalBrukeManueltBrev, aksjonspunkter)} />
                  </Hovedknapp>
                )}
              </FlexColumn>
              {skalBrukeManueltBrev && (
                <FlexColumn>
                  <Knapp
                    mini
                    htmlType="button"
                    onClick={() => toggleVisModal(true)}
                  >
                    <FormattedMessage id="VedtakFellesPanel.ForkastManueltBrev" />
                  </Knapp>
                </FlexColumn>
              )}
            </FlexRow>
          </FlexContainer>
        </>
      )}
    </>
  );
};

export default injectIntl(VedtakFellesPanel);
