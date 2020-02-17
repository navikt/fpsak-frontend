import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import {
  behandlingerPath, getRequestPollingMessage, requireProps, trackRouteParam, DataFetcher,
} from '@fpsak-frontend/fp-felles';
import { DataFetchPendingModal } from '@fpsak-frontend/shared-components';

import { getFagsakPerson, getSelectedSaksnummer } from './fagsakSelectors';
import BehandlingerIndex from '../behandling/BehandlingerIndex';
import BehandlingSupportIndex from '../behandlingsupport/BehandlingSupportIndex';
import FagsakProfileIndex from '../fagsakprofile/FagsakProfileIndex';
import { setSelectedSaksnummer } from './duck';

import FagsakResolver from './FagsakResolver';
import FagsakGrid from './components/FagsakGrid';
import { getSelectedBehandlingId, getBehandlingVersjon, getBehandlingSprak } from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { getAlleFpSakKodeverk } from '../kodeverk/duck';

/**
 * FagsakIndex
 *
 * Container komponent. Er rot for for fagsakdelen av hovedvinduet, og har ansvar å legge valgt saksnummer fra URL-en i staten.
 */
export const FagsakIndex = ({
  selectedSaksnummer,
  requestPendingMessage,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  sprakkode,
  fagsakPerson,
}) => (
  <>
    <FagsakResolver key={selectedSaksnummer}>
      <FagsakGrid
        behandlingContent={<Route strict path={behandlingerPath} component={BehandlingerIndex} />}
        profileAndNavigationContent={<FagsakProfileIndex />}
        supportContent={<BehandlingSupportIndex />}
        visittkortContent={(
          <DataFetcher
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            showLoadingIcon
            endpoints={fpsakApi.BEHANDLING_PERSONOPPLYSNINGER.isEndpointEnabled() ? [fpsakApi.BEHANDLING_PERSONOPPLYSNINGER] : []}
            render={(props) => (
              <VisittkortSakIndex
                personopplysninger={props.behandlingPersonopplysninger}
                alleKodeverk={alleKodeverk}
                sprakkode={sprakkode}
                fagsakPerson={fagsakPerson}
              />
            )}
          />
        )}
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
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  selectedSaksnummer: getSelectedSaksnummer(state),
  requestPendingMessage: getRequestPollingMessage(state),
  alleKodeverk: getAlleFpSakKodeverk(state),
  sprakkode: getBehandlingSprak(state),
  fagsakPerson: getFagsakPerson(state),
});

export default trackRouteParam({
  paramName: 'saksnummer',
  parse: (saksnummerFromUrl) => Number.parseInt(saksnummerFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedSaksnummer,
  getParamFromStore: getSelectedSaksnummer,
})(connect(mapStateToProps)(requireProps(['selectedSaksnummer'])(FagsakIndex)));
