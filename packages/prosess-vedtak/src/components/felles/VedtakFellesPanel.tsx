import React, {
  FunctionComponent, useState, useCallback, ReactNode, MouseEvent,
} from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { ReactComponent as PopOutPilSvg } from '@fpsak-frontend/assets/images/pop-out-pil.svg';
import { ReactComponent as EditUtlandSvg } from '@fpsak-frontend/assets/images/endre.svg';
import {
  Kodeverk, Behandlingsresultat, Aksjonspunkt,
} from '@fpsak-frontend/types';
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
  behandlingsresultat: Behandlingsresultat;
  behandlingType: Kodeverk;
  readOnly: boolean;
  kanOverstyre: boolean;
  erBehandlingEtterKlage: boolean;
  aksjonspunkter: Aksjonspunkt[];
  behandlingStatusKode: string;
  renderPanel: (skalBrukeManueltBrev: boolean, erInnvilget: boolean, erAvslatt: boolean, erOpphor: boolean) => ReactNode;
  previewAutomatiskBrev: (e: MouseEvent) => void;
  previewOverstyrtBrev: (e: MouseEvent) => void;
  tilbakekrevingtekst?: string;
  sprakkode: Kodeverk;
  resetForm: () => void;
  handleSubmit: (any) => void;
  submitting: boolean;
  behandlingPaaVent: boolean;
  vedtakstatusTekst?: string;
}

export const VedtakFellesPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingsresultat,
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
  vedtakstatusTekst,
}) => {
  const [skalBrukeManueltBrev, toggleSkalBrukeManueltBrev] = useState(behandlingsresultat.vedtaksbrev && behandlingsresultat.vedtaksbrev.kode === 'FRITEKST');
  const [skalViseModal, toggleVisModal] = useState(false);
  const onToggleOverstyring = useCallback(() => {
    toggleSkalBrukeManueltBrev(true);
  }, []);
  const avsluttRedigering = useCallback(() => {
    toggleSkalBrukeManueltBrev(false);
    toggleVisModal(false);
    resetForm();
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
      {renderPanel(skalBrukeManueltBrev, erInnvilget, erAvslatt, erOpphor)}
      {skalBrukeManueltBrev && (
        <ManueltVedtaksbrevPanel
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
