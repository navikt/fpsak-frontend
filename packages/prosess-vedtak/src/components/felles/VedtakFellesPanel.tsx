import React, {
  FunctionComponent, useMemo, useState, useCallback, ReactNode, MouseEvent,
} from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Undertittel, Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
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

const finnKnappetekstkode = (behandlingType, aksjonspunkter) => {
  if (aksjonspunkter && aksjonspunkter.some((ap) => ap.erAktivt && ap.toTrinnsBehandling)) {
    return 'VedtakForm.TilGodkjenning';
  }

  return 'VedtakForm.FattVedtak';
};

const harIkkeKonsekvenserForYtelsen = (behandlingResultat, ...konsekvenserForYtelsenKoder) => {
  if (!behandlingResultat) {
    return true;
  }
  const { konsekvenserForYtelsen } = behandlingResultat;
  if (!Array.isArray(konsekvenserForYtelsen) || konsekvenserForYtelsen.length !== 1) {
    return true;
  }
  return !konsekvenserForYtelsenKoder.some((kode) => kode === konsekvenserForYtelsen[0].kode);
};

interface OwnProps {
  behandling: Behandling;
  readOnly: boolean;
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

  const harIkkeKonsekvensForYtelse = useMemo(() => harIkkeKonsekvenserForYtelsen(behandlingsresultat,
    konsekvensForYtelsen.ENDRING_I_FORDELING_AV_YTELSEN, konsekvensForYtelsen.INGEN_ENDRING), [behandlingsresultat]);

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
      <FlexContainer>
        <FlexRow>
          <FlexColumn className={styles.space}>
            <Element>
              {vedtakstatusTekst}
              {tilbakekrevingtekst && (
                `. ${intl.formatMessage({ id: tilbakekrevingtekst })}`
              )}
            </Element>
          </FlexColumn>
          <FlexColumn className={styles.space}>
            {skalViseLink && !erBehandlingEtterKlage && harIkkeKonsekvensForYtelse && (
              <>
                <Lenke href="#" onClick={previewAutomatiskBrev}>
                  <span>
                    <FormattedMessage id="VedtakFellesPanel.AutomatiskVedtaksbrev" />
                  </span>
                  <Image src={popOutPilSvg} className={styles.pil} />
                </Lenke>
              </>
            )}
          </FlexColumn>
          <FlexColumn>
            {!readOnly && !skalBrukeManueltBrev && (
            <>
              <Lenke href="#" onClick={onToggleOverstyring} className={skalBrukeManueltBrev && styles.test}>
                <Image src={endreSvg} className={styles.blyant} />
                <span>
                  <FormattedMessage id="VedtakFellesPanel.RedigerVedtaksbrev" />
                </span>
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
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
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
                    <FormattedMessage id={finnKnappetekstkode(type, aksjonspunkter)} />
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
