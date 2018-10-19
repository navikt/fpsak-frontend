import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { getAllAsyncPollingMessages } from 'data/duck';
import { behandlingerPath } from 'app/paths';
import BehandlingerIndex from 'behandling/BehandlingerIndex';
import BehandlingSupportIndex from 'behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from 'fagsakprofile/FagsakProfileIndex';
import trackRouteParam from 'app/data/trackRouteParam';
import requireProps from 'app/data/requireProps';
import ElementWrapper from 'sharedComponents/ElementWrapper';
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
export const FagsakIndex = ({ selectedSaksnummer, requestPendingMessages }) => (
  <ElementWrapper>
    <FagsakResolver key={selectedSaksnummer}>
      <FagsakGrid
        behandlingContent={<Route strict path={behandlingerPath} component={BehandlingerIndex} />}
        profileAndNavigationContent={<FagsakProfileIndex />}
        supportContent={<BehandlingSupportIndex />}
      />
    </FagsakResolver>
    {requestPendingMessages.length > 0 && <DataFetchPendingModal pendingMessages={requestPendingMessages} />}
  </ElementWrapper>
);

FagsakIndex.propTypes = {
  selectedSaksnummer: PropTypes.number.isRequired,
  requestPendingMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  selectedSaksnummer: getSelectedSaksnummer(state),
  requestPendingMessages: getAllAsyncPollingMessages(state),
});

export default trackRouteParam({
  paramName: 'saksnummer',
  parse: saksnummerFromUrl => Number.parseInt(saksnummerFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedSaksnummer,
  getParamFromStore: getSelectedSaksnummer,
})(connect(mapStateToProps)(requireProps(['selectedSaksnummer'])(FagsakIndex)));
