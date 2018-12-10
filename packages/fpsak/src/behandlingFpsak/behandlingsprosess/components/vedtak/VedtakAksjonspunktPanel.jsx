import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { connect } from 'react-redux';

<<<<<<< HEAD:packages/fpsak/src/behandlingFpsak/behandlingsprosess/components/vedtak/VedtakAksjonspunktPanel.jsx
<<<<<<< HEAD:packages/fpsak/src/behandlingFpsak/behandlingsprosess/components/vedtak/VedtakAksjonspunktPanel.jsx
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FadingPanel from 'sharedComponents/FadingPanel';
import { getBehandlingHenlagt } from 'behandlingFpsak/behandlingSelectors';
=======
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import FadingPanel from '@fpsak-frontend/shared-components/FadingPanel';
import { getBehandlingHenlagt } from 'behandling/behandlingSelectors';
>>>>>>> NOJIRA moduler:packages/fpsak/src/behandlingsprosess/components/vedtak/VedtakAksjonspunktPanel.jsx
import behandlingStatusCode from 'kodeverk/behandlingStatus';
=======
import { FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getBehandlingHenlagt } from 'behandling/behandlingSelectors';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
>>>>>>> NOJIRA nye pakker:packages/fpsak/src/behandlingsprosess/components/vedtak/VedtakAksjonspunktPanel.jsx
import VedtakHelpTextPanel from './VedtakHelpTextPanel';

export const getTextCode = behandlingStatus => (behandlingStatus === behandlingStatusCode.AVSLUTTET
|| behandlingStatus === behandlingStatusCode.IVERKSETTER_VEDTAK ? 'VedtakForm.vedtak' : 'VedtakForm.ForslagTilVedtak');

export const VedtakAksjonspunktPanelImpl = ({
  intl,
  children,
  behandlingStatusKode,
  isBehandlingHenlagt,
  aksjonspunktKoder,
  isBehandlingReadOnly,
  readOnly,
}) => {
  if (isBehandlingHenlagt) {
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
      <VedtakHelpTextPanel aksjonspunktKoder={aksjonspunktKoder} readOnly={readOnly} isBehandlingReadOnly={isBehandlingReadOnly} />
      {children}
    </FadingPanel>
  );
};


VedtakAksjonspunktPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  readOnly: PropTypes.bool.isRequired,
  aksjonspunktKoder: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  isBehandlingHenlagt: PropTypes.bool.isRequired,
  isBehandlingReadOnly: PropTypes.bool.isRequired,
};

VedtakAksjonspunktPanelImpl.defaultProps = {
  children: undefined,
};

const mapStateToProps = state => ({
  isBehandlingHenlagt: getBehandlingHenlagt(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakAksjonspunktPanelImpl));
