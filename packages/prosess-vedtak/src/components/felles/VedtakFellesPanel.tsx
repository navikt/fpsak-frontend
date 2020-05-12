import React, {
  FunctionComponent, useState, useCallback, ReactNode, MouseEvent,
} from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import popOutPilSvg from '@fpsak-frontend/assets/images/pop-out-pil.svg';
import endreSvg from '@fpsak-frontend/assets/images/endre.svg';
import endreDisabletSvg from '@fpsak-frontend/assets/images/endre_disablet.svg';
import { Behandling, Aksjonspunkt } from '@fpsak-frontend/types';
import {
  VerticalSpacer, FlexColumn, FlexContainer, FlexRow, OkAvbrytModal, Image,
} from '@fpsak-frontend/shared-components';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';

import ManueltVedtaksbrevPanel from './ManueltVedtaksbrevPanel';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';

import styles from './vedtakFellesPanel.less';

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

interface OwnProps {
  behandling: Behandling;
  readOnly: boolean;
  kanOverstyre: boolean;
  erBehandlingEtterKlage: boolean;
  aksjonspunkter: Aksjonspunkt[];
  renderPanel: (skalBrukeManueltBrev: boolean, erInnvilget: boolean, erAvslatt: boolean, erOpphor: boolean) => ReactNode;
  previewAutomatiskBrev: (e: MouseEvent) => void;
  previewOverstyrtBrev: (e: MouseEvent) => void;
  tilbakekrevingtekst?: string;
  clearFormField: (fieldId: string) => void;
  handleSubmit: (any) => void;
  submitting: boolean;
  vedtakstatusTekst?: string;
}

const VedtakFellesPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandling,
  aksjonspunkter,
  readOnly,
  renderPanel,
  kanOverstyre,
  previewAutomatiskBrev,
  previewOverstyrtBrev,
  tilbakekrevingtekst,
  erBehandlingEtterKlage,
  handleSubmit,
  submitting,
  vedtakstatusTekst,
  clearFormField,
}) => {
  const {
    behandlingsresultat, behandlingPaaVent, sprakkode, status, type,
  } = behandling;

  const [skalBrukeManueltBrev, toggleSkalBrukeManueltBrev] = useState(behandlingsresultat.vedtaksbrev && behandlingsresultat.vedtaksbrev.kode === 'FRITEKST');
  const [skalViseModal, toggleVisModal] = useState(false);
  const onToggleOverstyring = useCallback(() => {
    toggleSkalBrukeManueltBrev(true);
  }, []);
  const avsluttRedigering = useCallback(() => {
    toggleSkalBrukeManueltBrev(false);
    toggleVisModal(false);
    clearFormField('overskrift');
    clearFormField('brødtekst');
  }, []);

  const erInnvilget = isInnvilget(behandlingsresultat.type.kode);
  const erAvslatt = isAvslag(behandlingsresultat.type.kode);
  const erOpphor = isOpphor(behandlingsresultat.type.kode);

  const skalViseLink = !behandlingsresultat.avslagsarsak
    || (behandlingsresultat.avslagsarsak && behandlingsresultat.avslagsarsak.kode !== avslagsarsakCodes.INGEN_BEREGNINGSREGLER);

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
          {(status.kode === behandlingStatusCode.AVSLUTTET) && (
            <FlexColumn>
              <Image className={styles.status} src={erInnvilget ? innvilgetImage : avslattImage} />
            </FlexColumn>
          )}
          <FlexColumn>
            <Undertittel><FormattedMessage id={getTextCode(status.kode)} /></Undertittel>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="3">
          <Element>
            {vedtakstatusTekst}
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
              <Image src={popOutPilSvg} className={styles.pil} />
            </>
          )}
        </Column>
        {(kanOverstyre) && (
          <Column xs="3">
            {!readOnly && !skalBrukeManueltBrev && (
              <>
                <Image src={endreSvg} className={styles.blyant} />
                <Lenke href="#" onClick={onToggleOverstyring} className={skalBrukeManueltBrev && styles.test}>
                  <FormattedMessage id="VedtakFellesPanel.RedigerVedtaksbrev" />
                </Lenke>
              </>
            )}
            {(readOnly || skalBrukeManueltBrev) && (
              <>
                <Image src={endreDisabletSvg} className={styles.blyant} />
                <Normaltekst className={styles.disabletLink}>
                  <FormattedMessage id="VedtakFellesPanel.RedigerVedtaksbrev" />
                </Normaltekst>
              </>
            )}
          </Column>
        )}
      </Row>
      <VedtakHelpTextPanel aksjonspunkter={aksjonspunkter} readOnly={readOnly} />
      <VerticalSpacer twentyPx />
      {renderPanel(skalBrukeManueltBrev, erInnvilget, erAvslatt, erOpphor)}
      {skalBrukeManueltBrev && (
        <ManueltVedtaksbrevPanel
          readOnly={readOnly}
          sprakkode={sprakkode}
          previewOverstyrtBrev={previewOverstyrtBrev}
          skalViseLink={skalViseLink}
        />
      )}
      {kanSendesTilGodkjenning(status.kode) && (
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
                    <FormattedMessage id={finnKnappetekstkode(type, skalBrukeManueltBrev, aksjonspunkter)} />
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
