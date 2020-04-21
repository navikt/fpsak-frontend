import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import { isAvslag, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { ReactComponent as PopOutPilSvg } from '@fpsak-frontend/assets/images/pop-out-pil.svg';
import { ReactComponent as EditUtlandSvg } from '@fpsak-frontend/assets/images/endre.svg';
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

export const VedtakFellesPanel = ({
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
            <Undertittel>{intl.formatMessage({ id: getTextCode(behandlingStatusKode) })}</Undertittel>
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
          intl={intl}
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


VedtakFellesPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  aksjonspunktKoder: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  renderPanel: PropTypes.func.isRequired,
  previewAutomatiskBrev: PropTypes.func.isRequired,
  previewOverstyrtBrev: PropTypes.func.isRequired,
  tilbakekrevingtekst: PropTypes.string,
  resetForm: PropTypes.func.isRequired,
  sprakkode: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
};

VedtakFellesPanel.defaultProps = {
  tilbakekrevingtekst: undefined,
};

export default injectIntl(VedtakFellesPanel);
