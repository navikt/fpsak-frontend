import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Systemtittel, Undertittel } from 'nav-frontend-typografi';

import { FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import VedtakHelpTextPanel from './VedtakHelpTextPanel';

export const getTextCode = (behandlingStatus) => (behandlingStatus === behandlingStatusCode.AVSLUTTET
|| behandlingStatus === behandlingStatusCode.IVERKSETTER_VEDTAK ? 'VedtakForm.vedtak' : 'VedtakForm.ForslagTilVedtak');

export const VedtakAksjonspunktPanelImpl = ({
  intl,
  children,
  behandlingStatusKode,
  erBehandlingHenlagt,
  aksjonspunktKoder,
  readOnly,
}) => {
  if (erBehandlingHenlagt) {
    return (
      <FadingPanel>
        <Systemtittel>{intl.formatMessage({ id: 'VedtakForm.BehandlingHenlagt' })}</Systemtittel>
      </FadingPanel>
    );
  }

  return (
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: getTextCode(behandlingStatusKode) })}</Undertittel>
      <VerticalSpacer twentyPx />
      <VedtakHelpTextPanel aksjonspunktKoder={aksjonspunktKoder} readOnly={readOnly} />
      {children}
    </FadingPanel>
  );
};


VedtakAksjonspunktPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  readOnly: PropTypes.bool.isRequired,
  aksjonspunktKoder: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  erBehandlingHenlagt: PropTypes.bool.isRequired,
};

VedtakAksjonspunktPanelImpl.defaultProps = {
  children: undefined,
};

export default injectIntl(VedtakAksjonspunktPanelImpl);
