import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt } from '@fpsak-frontend/types';

import styles from './vedtakForm.less';

const findHelpTexts = (intl, aksjonspunkter) => {
  const helpTexts = [];
  if (aksjonspunkter && aksjonspunkter.some((a) => a.definisjon.kode === aksjonspunktCodes.VURDERE_ANNEN_YTELSE)) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.VurderAnnenYtelse' }));
  }
  if (aksjonspunkter && aksjonspunkter.some((a) => a.definisjon.kode === aksjonspunktCodes.VURDERE_DOKUMENT)) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.VurderDokument' }));
  }
  if (aksjonspunkter && aksjonspunkter.some((a) => a.definisjon.kode === aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST)) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.KontrollerRevurderingsbehandling' }));
  }

  return helpTexts;
};

interface OwnProps {
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
}

export const VedtakHelpTextPanelImpl: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  readOnly,
  aksjonspunkter,
}) => {
  const helpTexts = findHelpTexts(intl, aksjonspunkter);
  if (!readOnly && helpTexts.length > 0) {
    return (
      <>
        <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnly}>
          {helpTexts}
        </AksjonspunktHelpTextTemp>
        <VerticalSpacer eightPx />
        {aksjonspunkter && aksjonspunkter.some((a) => a.definisjon.kode === aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST)
        && (
        <Element className={styles.inline}>
          <FormattedMessage id="VedtakForm.HelpText0" />
        </Element>
        )}
        <Normaltekst className={styles.inline}><FormattedMessage id="VedtakForm.HelpText1" /></Normaltekst>
        <Element className={styles.inline}><FormattedMessage id="VedtakForm.TilGodkjenning" /></Element>
        <Normaltekst className={styles.inline}><FormattedMessage id="VedtakForm.HelpText2" /></Normaltekst>
        <VerticalSpacer twentyPx />
      </>
    );
  }
  return null;
};

export default injectIntl(VedtakHelpTextPanelImpl);
