import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isSelectedBehandlingspunktReadOnly,
  getBehandlingspunktAksjonspunkterCodes,
} from '../behandlingsprosessTilbakeSelectors';
import ForeldelsePanel from './foreldelse/ForeldelsePanel';
import TilbakekrevingPanel from './tilbakekreving/TilbakekrevingPanel';
import styles from './tilbakekreveingBehandlingspunktInfoPanel.less';

const findStyle = (isApOpen, isApSolvable, readOnly) => (isApOpen && isApSolvable && !readOnly ? styles.statusAksjonspunkt : undefined);
/*
 * TilbakekrevingBehandlingspunktInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const TilbakekreveingBehandlingspunktInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  submitCallback,
  selectedBehandlingspunkt,
  apCodes,
}) => (
  <div className={findStyle(openAksjonspunkt, isApSolvable, readOnly)}>
    {ForeldelsePanel.supports(selectedBehandlingspunkt, apCodes)
    && (
      <ForeldelsePanel
        submitCallback={submitCallback}
        readOnly={readOnly}
        isApOpen={openAksjonspunkt}
      />
    )
    }
    {TilbakekrevingPanel.supports(selectedBehandlingspunkt, apCodes)
    && (
      <TilbakekrevingPanel
        submitCallback={submitCallback}
        readOnly={readOnly}
        isApOpen={openAksjonspunkt}
      />
    )
    }
  </div>
);

TilbakekreveingBehandlingspunktInfoPanel.propTypes = {
  openAksjonspunkt: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  openAksjonspunkt: hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: getBehandlingspunktAksjonspunkterCodes(state),
});

export default connect(mapStateToProps)(TilbakekreveingBehandlingspunktInfoPanel);
