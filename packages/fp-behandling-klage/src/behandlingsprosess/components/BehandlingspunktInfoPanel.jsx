import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import {
  getBehandlingspunktAksjonspunkterCodes,
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
  isSelectedBehandlingspunktReadOnly,
  getNotAcceptedByBeslutter,
} from 'behandlingKlage/src/behandlingsprosess/behandlingsprosessSelectors';
import VedtakPanels from './vedtak/VedtakPanels';
import BehandleKlageFormNfp from './klage/Klagevurdering/Nfp/BehandleKlageFormNfp';
import BehandleKlageFormKa from './klage/Klagevurdering/KA/BehandleKlageFormKa';
import FormkravKlageFormNfp from './klage/Formkrav/FormkravKlageFormNfp';
import FormkravKlageFormKa from './klage/Formkrav/FormkravKlageFormKa';

import styles from './behandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

/*
 * PunktInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  selectedBehandlingspunkt,
  saveTempKlage,
  submitCallback,
  previewCallback,
  previewCallbackKlage,
  previewVedtakCallback,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  apCodes,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <div>
      <VedtakPanels
        behandlingspunkt={selectedBehandlingspunkt}
        readOnly={readOnly}
        previewCallback={previewCallback}
        previewVedtakCallback={previewVedtakCallback}
        previewKlageBrevCallback={previewCallbackKlage}
        submitCallback={submitCallback}
      />

      {BehandleKlageFormKa.supports(apCodes)
      && (
      <BehandleKlageFormKa
        saveKlage={saveTempKlage}
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallbackKlage}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
      {BehandleKlageFormNfp.supports(apCodes)
      && (
      <BehandleKlageFormNfp
        saveKlage={saveTempKlage}
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallbackKlage}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
      {FormkravKlageFormNfp.supports(apCodes)
      && (
        <FormkravKlageFormNfp
          submitCallback={submitCallback}
          readOnly={readOnly}
          previewCallback={previewCallback}
          readOnlySubmitButton={readOnlySubmitButton}
        />
      )
      }
      {FormkravKlageFormKa.supports(apCodes)
      && (
        <FormkravKlageFormKa
          submitCallback={submitCallback}
          readOnly={readOnly}
          previewCallback={previewCallback}
          readOnlySubmitButton={readOnlySubmitButton}
        />
      )
      }
    </div>
  </div>
);

BehandlingspunktInfoPanel.propTypes = {
  saveTempKlage: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewCallbackKlage: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
};

BehandlingspunktInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = state => ({
  openAksjonspunkt: hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: getNotAcceptedByBeslutter(state),
});

export default connect(mapStateToProps)(BehandlingspunktInfoPanel);
