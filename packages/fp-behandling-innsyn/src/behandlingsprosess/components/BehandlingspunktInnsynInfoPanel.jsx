import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import behandlingspunktInnsynSelectors from '../selectors/behandlingsprosessInnsynSelectors';
import InnsynVedtakForm from './vedtak/InnsynVedtakForm';
import InnsynForm from './innsyn/InnsynForm';

import styles from './behandlingspunktInnsynInfoPanel.less';

const classNames = classnames.bind(styles);

/*
 * BehandlingspunktInnsynInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktInnsynInfoPanel = ({
  selectedBehandlingspunkt,
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
      { selectedBehandlingspunkt === behandlingspunktCodes.VEDTAK
      && (
      <InnsynVedtakForm
        submitCallback={submitCallback}
        previewCallback={previewCallback}
        readOnly={readOnly}
      />
      )
     }

      {InnsynForm.supports(apCodes)
      && <InnsynForm submitCallback={submitCallback} readOnly={readOnly} isSubmittable={readOnlySubmitButton} />
      }
    </div>
  </div>
);

BehandlingspunktInnsynInfoPanel.propTypes = {
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

BehandlingspunktInnsynInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = state => ({
  openAksjonspunkt: behandlingspunktInnsynSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingspunktInnsynSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingspunktInnsynSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingspunktInnsynSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: behandlingspunktInnsynSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingspunktInnsynSelectors.getNotAcceptedByBeslutter(state),
});

export default connect(mapStateToProps)(BehandlingspunktInnsynInfoPanel);
