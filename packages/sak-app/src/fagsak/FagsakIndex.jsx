import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import {
  behandlingerPath, getRequestPollingMessage, requireProps, trackRouteParam,
} from '@fpsak-frontend/fp-felles';
import { DataFetchPendingModal } from '@fpsak-frontend/shared-components';

import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import { setSelectedSaksnummer } from './duck';
import { getSelectedSaksnummer } from './fagsakSelectors';
import FagsakResolver from './FagsakResolver';
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
  selectedSaksnummer: PropTypes.string.isRequired,
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
  parse: (saksnummerFromUrl) => saksnummerFromUrl,
  paramPropType: PropTypes.string,
  storeParam: setSelectedSaksnummer,
  getParamFromStore: getSelectedSaksnummer,
})(connect(mapStateToProps)(requireProps(['selectedSaksnummer'])(FagsakIndex)));
