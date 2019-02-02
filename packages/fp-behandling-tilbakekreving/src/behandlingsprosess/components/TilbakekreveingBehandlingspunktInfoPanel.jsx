import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isSelectedBehandlingspunktReadOnly,
} from '../behandlingsprosessSelectors';

import styles from './tilbakekreveingBehandlingspunktInfoPanel.less';

const findStyle = (isApOpen, isApSolvable, readOnly) => (isApOpen && isApSolvable && !readOnly ? styles.statusAksjonspunkt : undefined);
/*
 * TilbakekreveingBehandlingspunktInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const TilbakekreveingBehandlingspunktInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  openAksjonspunkt,
  readOnly,
  isApSolvable,
}) => (
  <div className={findStyle(openAksjonspunkt, isApSolvable, readOnly)}>
    test
  </div>
);

TilbakekreveingBehandlingspunktInfoPanel.propTypes = {
  openAksjonspunkt: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  openAksjonspunkt: hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: isBehandlingspunktAksjonspunkterSolvable(state),
});

export default connect(mapStateToProps)(TilbakekreveingBehandlingspunktInfoPanel);
