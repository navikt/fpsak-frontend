import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import {
  hasBehandlingspunktAtLeastOneOpenAksjonspunkt,
  isBehandlingspunktAksjonspunkterSolvable,
  isSelectedBehandlingspunktReadOnly,
  getBehandlingspunktAksjonspunkterCodes,
  isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt,
} from '../behandlingsprosessTilbakeSelectors';
import ForeldelsePanel from './foreldelse/ForeldelsePanel';
import TilbakekrevingForm from './tilbakekreving/TilbakekrevingForm';

import styles from './tilbakekrevingBehandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

/*
 * TilbakekrevingBehandlingspunktInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const TilbakekrevingBehandlingspunktInfoPanel = ({
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  submitCallback,
  selectedBehandlingspunkt,
  apCodes,
  readOnlySubmitButton,
}) => (
  <div className={classNames('behandlingsPunkt', { statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    {ForeldelsePanel.supports(selectedBehandlingspunkt, apCodes)
    && (
      <ForeldelsePanel
        submitCallback={submitCallback}
        isApOpen={openAksjonspunkt}
        apCodes={apCodes}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )
    }
    {TilbakekrevingForm.supports(selectedBehandlingspunkt, apCodes)
    && (
      <TilbakekrevingForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        isApOpen={openAksjonspunkt}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )
    }
  </div>
);

TilbakekrevingBehandlingspunktInfoPanel.propTypes = {
  openAksjonspunkt: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  readOnlySubmitButton: isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  openAksjonspunkt: hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: getBehandlingspunktAksjonspunkterCodes(state),
});

export default connect(mapStateToProps)(TilbakekrevingBehandlingspunktInfoPanel);
