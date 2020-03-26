import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { getRequestPollingMessage } from '@fpsak-frontend/rest-api-redux';
import { DataFetchPendingModal, requireProps } from '@fpsak-frontend/shared-components';
import { Fagsak, FagsakPerson } from '@fpsak-frontend/types';

import { getSelectedAktoer, getSelectedAktoerId } from './aktoerSelectors';
import { setSelectedAktoerId } from './duck';
import AktoerGrid from './components/AktoerGrid';
import AktoerResolver from './AktoerResolver';
import trackRouteParam from '../app/trackRouteParam';

interface OwnProps {
  aktoerId: number;
  requestPendingMessage?: string;
  selectedAktoer?: {
    fagsaker: Fagsak[];
    person: FagsakPerson;
  };
}

/**
 * AktoerIndex
 */
export const AktoerIndex: FunctionComponent<OwnProps> = ({
  aktoerId, requestPendingMessage, selectedAktoer,
}) => (
  <>
    <AktoerResolver>
      <>{selectedAktoer.person ? <AktoerGrid data={selectedAktoer} /> : `Ugyldig aktoerId: ${aktoerId}`}</>
    </AktoerResolver>
    {requestPendingMessage && <DataFetchPendingModal pendingMessage={requestPendingMessage} />}
  </>
);

const mapStateToProps = (state) => ({
  aktoerId: getSelectedAktoerId(state),
  requestPendingMessage: getRequestPollingMessage(state),
  selectedAktoer: getSelectedAktoer(state),
});


export default trackRouteParam({
  paramName: 'aktoerId',
  parse: (aktoerIdFromUrl) => Number.parseInt(aktoerIdFromUrl, 10),
  storeParam: setSelectedAktoerId,
  getParamFromStore: getSelectedAktoerId,
})(connect(mapStateToProps)(requireProps(['aktoerId'])(AktoerIndex)));
