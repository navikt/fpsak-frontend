import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
// import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import {
  getBehandlingspunktAksjonspunkterCodes,
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
  isSelectedBehandlingspunktReadOnly,
  getNotAcceptedByBeslutter,
} from 'behandlingKlage/src/behandlingsprosess/behandlingsprosessKlageSelectors';


import styles from '../../../behandlingsprosess/components/behandlingspunktKlageInfoPanel.less';
import BehandleKlageForm from './BehandleAnkeForm';

const classNames = classnames.bind(styles);

/*
 * BehandlingspunktKlageInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktAnkeInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  // selectedBehandlingspunkt,
  saveTempKlage,
  submitCallback,
  previewCallback,
  // previewCallbackKlage,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  // apCodes,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <BehandleKlageForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      saveKlage={saveTempKlage}
      previewCallback={previewCallback}
      readOnlySubmitButton={readOnlySubmitButton}
    />
  </div>
);

BehandlingspunktAnkeInfoPanel.propTypes = {
  saveTempKlage: PropTypes.func.isRequired,
  // selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  // previewCallbackKlage: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  // apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
};

BehandlingspunktAnkeInfoPanel.defaultProps = {
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

export default connect(mapStateToProps)(BehandlingspunktAnkeInfoPanel);
