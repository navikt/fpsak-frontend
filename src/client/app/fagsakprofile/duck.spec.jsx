import { expect } from 'chai';

import {
  toggleShowAllBehandlinger, resetFagsakProfile, fagsakProfileReducer, getShowAllBehandlinger,
} from './duck';

describe('Fagsak-reducer', () => {
  it('skal returnere initial state', () => {
    expect(fagsakProfileReducer(undefined, {})).to.eql({
      showAllBehandlinger: false,
    });
  });

  it('skal vise alle behandlinger', () => {
    const action = toggleShowAllBehandlinger();

    expect(fagsakProfileReducer(undefined, action)).to.eql({
      showAllBehandlinger: true,
    });
  });

  it('skal skjule alle behandlinger', () => {
    const state = {
      showAllBehandlinger: true,
    };

    const action = toggleShowAllBehandlinger();

    expect(fagsakProfileReducer(state, action)).to.eql({
      showAllBehandlinger: false,
    });
  });

  it('skal resette visning av alle behandlinger', () => {
    const state = {
      showAllBehandlinger: true,
    };

    const action = resetFagsakProfile();

    expect(fagsakProfileReducer(state, action)).to.eql({
      showAllBehandlinger: false,
    });
  });

  it('skal hente status for visning av alle behandlinger', () => {
    const state = {
      default: {
        fagsakProfileContext: {
          showAllBehandlinger: true,
        },
      },
    };
    const showAll = getShowAllBehandlinger(state);
    expect(showAll).is.true;
  });
});
