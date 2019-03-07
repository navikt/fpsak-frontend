import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { ElementWrapper, AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import styles from './vedtakForm.less';

const findHelpTexts = (intl, aksjonspunktKoder) => {
  const helpTexts = [];
  if (aksjonspunktKoder && aksjonspunktKoder.includes(aksjonspunktCodes.VURDERE_ANNEN_YTELSE)) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.VurderAnnenYtelse' }));
  }
  if (aksjonspunktKoder && aksjonspunktKoder.includes(aksjonspunktCodes.VURDERE_DOKUMENT)) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.VurderDokument' }));
  }
  if (aksjonspunktKoder && aksjonspunktKoder.includes(aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST)) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.KontrollerRevurderingsbehandling' }));
  }

  return helpTexts;
};


export const VedtakHelpTextPanelImpl = ({
  intl,
  readOnly,
  aksjonspunktKoder,
  isBehandlingReadOnly,
}) => {
  const helpTexts = findHelpTexts(intl, aksjonspunktKoder);
  if (!readOnly && helpTexts.length > 0) {
    return (
      <ElementWrapper>
        <AksjonspunktHelpText isAksjonspunktOpen={!isBehandlingReadOnly}>
          {helpTexts}
        </AksjonspunktHelpText>
        <VerticalSpacer eightPx />
        <Element className={styles.inline}><FormattedMessage id="VedtakForm.HelpText0" /></Element>
        <Normaltekst className={styles.inline}><FormattedMessage id="VedtakForm.HelpText1" /></Normaltekst>
        <Element className={styles.inline}><FormattedMessage id="VedtakForm.TilGodkjenning" /></Element>
        <Normaltekst className={styles.inline}><FormattedMessage id="VedtakForm.HelpText2" /></Normaltekst>
        <VerticalSpacer twentyPx />
      </ElementWrapper>
    );
  }
  return null;
};

VedtakHelpTextPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunktKoder: PropTypes.arrayOf(PropTypes.string).isRequired,
  isBehandlingReadOnly: PropTypes.bool.isRequired,
};


export default injectIntl(VedtakHelpTextPanelImpl);
