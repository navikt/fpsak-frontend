import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';
import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';

import {
  getAllDocuments, getAlleKodeverk, getSelectedSaksnummer,
} from '../../duckBehandlingInnsyn';
import fpInnsynApi from '../../data/innsynBehandlingApi';
import behandlingspunktInnsynSelectors from '../selectors/behandlingsprosessInnsynSelectors';
import behandlingInnsynSelectors from '../../selectors/innsynBehandlingSelectors';
import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';

import styles from './behandlingspunktInnsynInfoPanel.less';

const classNames = classnames.bind(styles);

const vedtakData = [fpInnsynApi.BEHANDLING, fpInnsynApi.INNSYN];
const innsynData = [fpInnsynApi.BEHANDLING, fpInnsynApi.INNSYN];

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
  behandlingspunktAksjonspunkter,
  aksjonspunkter,
  alleDokumenter,
  alleKodeverk,
  saksnummer,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <div>
      <DataFetcherWithCacheTemp
        behandlingVersjon={1}
        data={vedtakData}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.VEDTAK}
        render={(props) => (
          <VedtakInnsynProsessIndex
            saksnummer={saksnummer}
            aksjonspunkter={aksjonspunkter}
            alleDokumenter={alleDokumenter}
            submitCallback={submitCallback}
            previewCallback={previewCallback}
            readOnly={readOnly}
            {...props}
          />
        )}
      />

      <DataFetcherWithCacheTemp
        behandlingVersjon={1}
        data={innsynData}
        showComponent={apCodes.includes(aksjonspunktCodes.VURDER_INNSYN)}
        render={(props) => (
          <InnsynProsessIndex
            saksnummer={saksnummer}
            alleDokumenter={alleDokumenter}
            submitCallback={submitCallback}
            readOnly={readOnly}
            isSubmittable={readOnlySubmitButton}
            aksjonspunkter={behandlingspunktAksjonspunkter}
            alleKodeverk={alleKodeverk}
            {...props}
          />
        )}
      />
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
  behandlingspunktAksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  saksnummer: PropTypes.string.isRequired,
};

BehandlingspunktInnsynInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = (state) => ({
  openAksjonspunkt: behandlingspunktInnsynSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingspunktInnsynSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingspunktInnsynSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingspunktInnsynSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: behandlingspunktInnsynSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingspunktInnsynSelectors.getNotAcceptedByBeslutter(state),
  behandlingspunktAksjonspunkter: behandlingspunktInnsynSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
  aksjonspunkter: behandlingInnsynSelectors.getAksjonspunkter(state),
  alleDokumenter: getAllDocuments(state),
  alleKodeverk: getAlleKodeverk(state),
  saksnummer: getSelectedSaksnummer(state),
});

export default connect(mapStateToProps)(BehandlingspunktInnsynInfoPanel);
