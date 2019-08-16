import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import behandlingsprosessSelectors from '../selectors/behandlingsprosessTilbakeSelectors';
import ForeldelsePanel from './foreldelse/ForeldelsePanel';
import TilbakekrevingForm from './tilbakekreving/TilbakekrevingForm';
import TilbakekrevingVedtak from './vedtak/TilbakekrevingVedtak';

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
    {ForeldelsePanel.supports(selectedBehandlingspunkt, apCodes) && (
      <ForeldelsePanel
        submitCallback={submitCallback}
        isApOpen={openAksjonspunkt}
        apCodes={apCodes}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )}
    {TilbakekrevingForm.supports(selectedBehandlingspunkt, apCodes) && (
      <TilbakekrevingForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        isApOpen={openAksjonspunkt}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )}
    {TilbakekrevingVedtak.supports(apCodes) && (
      <TilbakekrevingVedtak
        submitCallback={submitCallback}
        readOnly={readOnly}
      />
    )}
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
  readOnlySubmitButton: behandlingsprosessSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  openAksjonspunkt: behandlingsprosessSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingsprosessSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes(state),
});

export default connect(mapStateToProps)(TilbakekrevingBehandlingspunktInfoPanel);
