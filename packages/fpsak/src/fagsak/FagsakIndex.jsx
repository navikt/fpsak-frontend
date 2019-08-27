import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import BehandlingerIndex from 'behandling/BehandlingerIndex';
import BehandlingSupportIndex from 'behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from 'fagsakprofile/FagsakProfileIndex';
import {
  behandlingerPath, trackRouteParam, requireProps, getRequestPollingMessage,
} from '@fpsak-frontend/fp-felles';
import { setSelectedSaksnummer } from './duck';
import { getSelectedSaksnummer } from './fagsakSelectors';
import FagsakResolver from './FagsakResolver';
import DataFetchPendingModal from './components/DataFetchPendingModal';
import FagsakGrid from './components/FagsakGrid';

/**
 * FagsakIndex
 *
 * Container komponent. Er rot for for fagsakdelen av hovedvinduet, og har ansvar å legge valgt saksnummer fra URL-en i staten.
 */
export const FagsakIndex = ({ selectedSaksnummer, requestPendingMessage }) => (
  <>
    <FagsakResolver key={selectedSaksnummer}>
      <FagsakGrid
        behandlingContent={<Route strict path={behandlingerPath} component={BehandlingerIndex} />}
        profileAndNavigationContent={<FagsakProfileIndex />}
        supportContent={<BehandlingSupportIndex />}
      />
    </FagsakResolver>
    {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
  </>
);

FagsakIndex.propTypes = {
  selectedSaksnummer: PropTypes.number.isRequired,
  requestPendingMessage: PropTypes.string,
};

FagsakIndex.defaultProps = {
  requestPendingMessage: undefined,
};

const mapStateToProps = (state) => ({
  selectedSaksnummer: getSelectedSaksnummer(state),
  requestPendingMessage: getRequestPollingMessage(state),
});

export default trackRouteParam({
  paramName: 'saksnummer',
  parse: (saksnummerFromUrl) => Number.parseInt(saksnummerFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedSaksnummer,
  getParamFromStore: getSelectedSaksnummer,
})(connect(mapStateToProps)(requireProps(['selectedSaksnummer'])(FagsakIndex)));
