import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import behandlingsprosessSelectors from '../selectors/behandlingsprosessTilbakeSelectors';
import ForeldelseForm from './foreldelse/ForeldelseForm';
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
  isBehandlingHenlagt,
}) => (
  <div className={classNames('behandlingsPunkt', { statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    {ForeldelseForm.supports(selectedBehandlingspunkt, apCodes) && (
      <ForeldelseForm
        submitCallback={submitCallback}
        apCodes={apCodes}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )}
    {TilbakekrevingForm.supports(selectedBehandlingspunkt, apCodes) && (
      <TilbakekrevingForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )}
    {TilbakekrevingVedtak.supports(apCodes, isBehandlingHenlagt) && (
      <TilbakekrevingVedtak
        submitCallback={submitCallback}
        readOnly={readOnly}
        isBehandlingHenlagt={isBehandlingHenlagt}
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
  isBehandlingHenlagt: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  readOnlySubmitButton: behandlingsprosessSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  openAksjonspunkt: behandlingsprosessSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingsprosessSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  isBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
});

export default connect(mapStateToProps)(TilbakekrevingBehandlingspunktInfoPanel);
