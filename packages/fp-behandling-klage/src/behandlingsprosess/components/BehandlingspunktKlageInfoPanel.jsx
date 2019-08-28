import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';

import behandlingspunktKlageSelectors from 'behandlingKlage/src/behandlingsprosess/selectors/behandlingsprosessKlageSelectors';
import VedtakKlageFormNy from './vedtak/VedtakKlageForm';
import BehandleKlageFormNfp from './klage/Klagevurdering/Nfp/BehandleKlageFormNfp';
import BehandleKlageFormKa from './klage/Klagevurdering/KA/BehandleKlageFormKa';
import FormkravKlageFormNfp from './klage/Formkrav/FormkravKlageFormNfp';
import FormkravKlageFormKa from './klage/Formkrav/FormkravKlageFormKa';

import styles from './behandlingspunktKlageInfoPanel.less';

const classNames = classnames.bind(styles);

/*
 * BehandlingspunktKlageInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktKlageInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  selectedBehandlingspunkt,
  saveTempKlage,
  submitCallback,
  previewCallback,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  apCodes,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <div>
      {selectedBehandlingspunkt === behandlingspunktCodes.KLAGE_RESULTAT
       && (
       <VedtakKlageFormNy
         submitCallback={submitCallback}
         previewVedtakCallback={previewCallback}
         readOnly={readOnly}
       />
       )}

      {BehandleKlageFormKa.supports(apCodes)
      && (
      <BehandleKlageFormKa
        saveKlage={saveTempKlage}
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
      {BehandleKlageFormNfp.supports(apCodes)
      && (
      <BehandleKlageFormNfp
        saveKlage={saveTempKlage}
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
      {FormkravKlageFormNfp.supports(apCodes)
      && (
        <FormkravKlageFormNfp
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
        />
      )}
      {FormkravKlageFormKa.supports(apCodes)
      && (
        <FormkravKlageFormKa
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
        />
      )}
    </div>
  </div>
);

BehandlingspunktKlageInfoPanel.propTypes = {
  saveTempKlage: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
};

BehandlingspunktKlageInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = (state) => ({
  openAksjonspunkt: behandlingspunktKlageSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingspunktKlageSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingspunktKlageSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingspunktKlageSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: behandlingspunktKlageSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingspunktKlageSelectors.getNotAcceptedByBeslutter(state),
});

export default connect(mapStateToProps)(BehandlingspunktKlageInfoPanel);
