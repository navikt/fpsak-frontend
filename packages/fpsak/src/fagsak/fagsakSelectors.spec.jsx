import { expect } from 'chai';

import { FpsakApiKeys } from 'data/fpsakApi';
import behandlingOrchestrator from 'behandling/BehandlingOrchestrator';
import {
  getSelectedFagsak, getFetchFagsakInfoFinished, getFetchFagsakInfoFailed, getAllFagsakInfoResolved,
} from './fagsakSelectors';

describe('<fagsakSelectors>', () => {
  before(() => {
    behandlingOrchestrator.disableTilbakekreving();
  });

  after(() => {
    behandlingOrchestrator.reset();
  });

  it('skal returnere fagsak når valgt saksnummer stemmer overens med hentet fagsak', () => {
    const selectedSaksnummer = '123';
    const fagsak = {
      saksnummer: '123',
    };
    const res = getSelectedFagsak.resultFunc(selectedSaksnummer, fagsak);
    expect(res).is.eql(fagsak);
  });

  it('skal ikke returnere fagsak når valgt saksnummer er ulik hentet fagsak', () => {
    const selectedSaksnummer = '123';
    const fagsak = {
      saksnummer: '456',
    };

    const res = getSelectedFagsak.resultFunc(selectedSaksnummer, fagsak);
    expect(res).is.undefined;
  });

  it('skal returnere true når all data er hentet', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            finished: true,
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            finished: true,
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            finished: true,
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            finished: true,
          },
        },
      },
    };
    const res = getFetchFagsakInfoFinished(state);
    expect(res).is.true;
  });

  it('skal returnere false når restkall for å hente fagsak ikke er ferdig', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            finished: false,
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            finished: true,
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            finished: true,
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            finished: true,
          },
        },
      },
    };
    const res = getFetchFagsakInfoFinished(state);
    expect(res).is.false;
  });

  it('skal returnere false når restkall for å hente behandlinger ikke er ferdig', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            finished: true,
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            finished: false,
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            finished: true,
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            finished: true,
          },
        },
      },
    };
    const res = getFetchFagsakInfoFinished(state);
    expect(res).is.false;
  });

  it('skal returnere true når alle restkall går bra', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            error: undefined,
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            error: undefined,
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            error: undefined,
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            error: undefined,
          },
        },
      },
    };
    const res = getFetchFagsakInfoFailed(state);
    expect(res).is.false;
  });

  it('skal returnere false når restkall for å hente fagsak feiler', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            error: { feil: true },
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            error: undefined,
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            error: undefined,
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            error: undefined,
          },
        },
      },
    };
    const res = getFetchFagsakInfoFailed(state);
    expect(res).is.true;
  });

  it('skal returnere false når restkall for å hente behandlinger feiler', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            error: undefined,
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            error: { feil: true },
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            error: undefined,
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            error: undefined,
          },
        },
      },
    };
    const res = getFetchFagsakInfoFailed(state);
    expect(res).is.true;
  });

  it('skal returnere true når all data er hentet', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            data: {},
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            data: {},
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            data: {},
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            data: {},
          },
        },
      },
    };
    const res = getAllFagsakInfoResolved(state);
    expect(res).is.true;
  });

  it('skal returnere false når fagsakdata ikke er hentet', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            data: undefined,
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            data: {},
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            data: {},
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            data: {},
          },
        },
      },
    };
    const res = getAllFagsakInfoResolved(state);
    expect(res).is.false;
  });

  it('skal returnere false når behandlinger ikke er hentet', () => {
    const state = {
      default: {
        dataContext: {
          [FpsakApiKeys.FETCH_FAGSAK]: {
            data: {},
          },
          [FpsakApiKeys.BEHANDLINGER_FPSAK]: {
            data: undefined,
          },
          [FpsakApiKeys.ALL_DOCUMENTS_FPSAK]: {
            data: {},
          },
          [FpsakApiKeys.HISTORY_FPSAK]: {
            data: {},
          },
        },
      },
    };
    const res = getAllFagsakInfoResolved(state);
    expect(res).is.false;
  });
});
