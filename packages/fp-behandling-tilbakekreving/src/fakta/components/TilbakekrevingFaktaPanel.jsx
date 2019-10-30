import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { PersonIndex } from '@fpsak-frontend/person-info';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';

import fptilbakeApi from '../../data/tilbakekrevingBehandlingApi';
import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';
import behandlingSelectors from '../../selectors/tilbakekrevingBehandlingSelectors';
import { getOpenInfoPanels } from '../duckFaktaTilbake';
import { getAlleTilbakekrevingKodeverk, getFagsakYtelseType, getFagsakPerson } from '../../duckBehandlingTilbakekreving';

import styles from './tilbakekrevingFaktaPanel.less';

const feilutbetalingData = [fptilbakeApi.BEHANDLING, fptilbakeApi.FEILUTBETALING_FAKTA, fptilbakeApi.FEILUTBETALING_AARSAK];

/**
 * TilbakekrevingFaktaPanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const TilbakekrevingFaktaPanel = ({
  aksjonspunkter,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
  fagsakPerson,
  alleMerknaderFraBeslutter,
  ytelseTypeKode,
  alleKodeverk,
}) => (
  <>
    <div className={styles.personContainer}>
      <PersonIndex medPanel person={fagsakPerson} />
      <DataFetcherWithCacheTemp
        behandlingVersjon={1}
        data={feilutbetalingData}
        render={(dataProps) => {
          if (dataProps.feilutbetalingFakta) {
            return (
              <FeilutbetalingFaktaIndex
                aksjonspunkter={aksjonspunkter}
                submitCallback={submitCallback}
                openInfoPanels={openInfoPanels}
                toggleInfoPanelCallback={toggleInfoPanelCallback}
                shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
                readOnly={readOnly}
                alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
                alleKodeverk={alleKodeverk}
                behandling={dataProps.behandling}
                feilutbetalingFakta={dataProps.feilutbetalingFakta}
                feilutbetalingAarsak={dataProps.feilutbetalingAarsak.find((a) => a.ytelseType.kode === ytelseTypeKode)}
              />
            );
          }
          return null;
        }}
      />
    </div>
    <div className={styles.container} />
  </>
);

TilbakekrevingFaktaPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

const mapStateToProps = (state) => ({
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  openInfoPanels: getOpenInfoPanels(state),
  readOnly: !behandlingSelectors.getRettigheter(state).writeAccess.isEnabled
    || behandlingSelectors.getBehandlingIsOnHold(state) || behandlingSelectors.hasReadOnlyBehandling(state),
  fagsakPerson: getFagsakPerson(state),
  alleMerknaderFraBeslutter: behandlingSelectors.getAllMerknaderFraBeslutter(state),
  ytelseTypeKode: getFagsakYtelseType(state).kode,
  alleKodeverk: getAlleTilbakekrevingKodeverk(state),
});

export default connect(mapStateToProps)(TilbakekrevingFaktaPanel);
