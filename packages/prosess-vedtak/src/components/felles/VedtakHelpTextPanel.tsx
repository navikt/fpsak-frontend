import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import Alertstripe from 'nav-frontend-alertstriper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt } from '@fpsak-frontend/types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

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

const VedtakHelpTextPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  readOnly,
  aksjonspunkter,
}) => {
  const helpTexts = findHelpTexts(intl, aksjonspunkter);
  if (!readOnly && helpTexts.length > 0) {
    return (
      <>
        <VerticalSpacer sixteenPx />
        <Alertstripe type="info">
          <Normaltekst><FormattedMessage id="VedtakHelpTextPanel.Vurder" /></Normaltekst>
          <ul>
            {helpTexts.map((text) => <li><Normaltekst>{text}</Normaltekst></li>)}
          </ul>
        </Alertstripe>
      </>
    );
  }
  return null;
};

export default injectIntl(VedtakHelpTextPanel);
