import React, {
  FunctionComponent, useState, useCallback, ReactNode,
} from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import { isAvslag, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { ReactComponent as PopOutPilSvg } from '@fpsak-frontend/assets/images/pop-out-pil.svg';
import { ReactComponent as EditUtlandSvg } from '@fpsak-frontend/assets/images/endre.svg';
import { Kodeverk, Behandlingsresultat } from '@fpsak-frontend/types';
import {
  VerticalSpacer, FlexColumn, FlexContainer, FlexRow, OkAvbrytModal, Image,
} from '@fpsak-frontend/shared-components';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';

import FritekstBrevPanel from './FritekstBrevPanel';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import { findInnvilgetResultatText, findAvslagResultatText } from './VedtakHelper';

import styles from './vedtakFellesPanel.less';

export const getTextCode = (behandlingStatus) => (behandlingStatus === behandlingStatusCode.AVSLUTTET
  || behandlingStatus === behandlingStatusCode.IVERKSETTER_VEDTAK ? 'VedtakForm.vedtak' : 'VedtakForm.ForslagTilVedtak');

const kanSendesTilGodkjenning = (behandlingStatusKode) => behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;

interface OwnProps {
  behandlingsresultat?: Behandlingsresultat;
  ytelseTypeKode: string;
  readOnly: boolean;
  kanOverstyre: boolean;
  erBehandlingEtterKlage: boolean;
  aksjonspunktKoder: string[];
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
}

export const VedtakFellesPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingsresultat,
  ytelseTypeKode,
  behandlingStatusKode,
  aksjonspunktKoder,
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

  const skalViseLink = (behandlingsresultat.avslagsarsak === null)
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
      <VedtakHelpTextPanel aksjonspunktKoder={aksjonspunktKoder} readOnly={readOnly} />
      <Row>
        <Column xs="3">
          <Element>
            {erInnvilget && intl.formatMessage({ id: findInnvilgetResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
            {erAvslatt && intl.formatMessage({ id: findAvslagResultatText(behandlingsresultat.type.kode, ytelseTypeKode) })}
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
                  {intl.formatMessage({
                    id: !skalBrukeManueltBrev && aksjonspunktKoder.includes(aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL)
                      ? 'VedtakForm.FattVedtak' : 'VedtakForm.TilGodkjenning',
                  })}
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
