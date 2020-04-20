import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp } from 'nav-frontend-knapper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import { isAvslag, isInnvilget } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { ReactComponent as FraBeslutterSvg } from '@fpsak-frontend/assets/images/arrow-return.svg';
import editUtlandIcon from '@fpsak-frontend/assets/images/endre.svg';
// import editUtlandDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import { VerticalSpacer, Image } from '@fpsak-frontend/shared-components';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import FritekstBrevPanel from './FritekstBrevPanel';
import VedtakHelpTextPanel from './VedtakHelpTextPanel';
import { findInnvilgetResultatText, findAvslagResultatText } from './VedtakHelper';

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
  behandlingFormPrefix,
  tilbakekrevingtekst,
  clearFormFields,
  erBehandlingEtterKlage,
  handleSubmit,
  submitting,
  behandlingPaaVent,
}) => {
  const [skalBrukeOverstyrendeFritekstBrev, toggleSkalBrukeOverstyrendeFritekstBrev] = useState(behandlingsresultat.vedtaksbrev.kode === 'FRITEKST');
  const onToggleOverstyring = useCallback(() => {
    toggleSkalBrukeOverstyrendeFritekstBrev(!skalBrukeOverstyrendeFritekstBrev);

    const fields = ['begrunnelse', 'overskrift', 'brødtekst'];
    clearFormFields(`${behandlingFormPrefix}.VedtakForm`, false, false, ...fields);
  }, []);

  // for lenke:  readOnly={readOnly || (initialValues.skalBrukeOverstyrendeFritekstBrev === true)}
  const erInnvilget = isInnvilget(behandlingsresultat.type.kode);
  const erAvslatt = isAvslag(behandlingsresultat.type.kode);

  const skalViseLink = (behandlingsresultat.avslagsarsak === null)
  || (behandlingsresultat.avslagsarsak && behandlingsresultat.avslagsarsak.kode !== avslagsarsakCodes.INGEN_BEREGNINGSREGLER);

  return (
    <>
      <Undertittel>{intl.formatMessage({ id: getTextCode(behandlingStatusKode) })}</Undertittel>
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
          {!readOnly && skalViseLink && !erBehandlingEtterKlage && (
            <Lenke href="#" onClick={previewAutomatiskBrev}>
              <span><FormattedMessage id="VedtakInnvilgetPanel.AutomatiskVedtaksbrev" /></span>
              <FraBeslutterSvg />
            </Lenke>
          )}
        </Column>
        {(kanOverstyre || readOnly) && (
          <Column xs="3">
            <Lenke href="#" onClick={onToggleOverstyring}>
              <Image src={editUtlandIcon} />
              <span><FormattedMessage id="VedtakInnvilgetPanel.RedigerVedtaksbrev" /></span>
            </Lenke>
          </Column>
        )}
      </Row>
      <VerticalSpacer twentyPx />
      {renderPanel(skalBrukeOverstyrendeFritekstBrev, erInnvilget, erAvslatt)}
      {skalBrukeOverstyrendeFritekstBrev && (
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
          <Row>
            <Column xs="12">
              {!readOnly && (
              <Hovedknapp
                mini
                onClick={handleSubmit}
                disabled={behandlingPaaVent || submitting}
                spinner={submitting}
              >
                {intl.formatMessage({
                  id: !skalBrukeOverstyrendeFritekstBrev && aksjonspunktKoder.includes(aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL)
                    ? 'VedtakForm.FattVedtak' : 'VedtakForm.TilGodkjenning',
                })}
              </Hovedknapp>
              )}
            </Column>
          </Row>
        </>
      )}
    </>
  );
};


VedtakFellesPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  aksjonspunktKoder: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  renderPanel: PropTypes.func.isRequired,
  previewAutomatiskBrev: PropTypes.func.isRequired,
  previewOverstyrtBrev: PropTypes.func.isRequired,
  tilbakekrevingtekst: PropTypes.string.isRequired,
  clearFormFields: PropTypes.func.isRequired,
  sprakkode: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
};

export default injectIntl(VedtakFellesPanel);
