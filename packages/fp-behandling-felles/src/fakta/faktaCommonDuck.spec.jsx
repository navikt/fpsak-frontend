import { expect } from 'chai';

import getFaktaRedux from './faktaCommonDuck';

const faktaRedux = getFaktaRedux('reducerName');

describe('Fakta-common-reducer', () => {
  it('skal sette åpne infopanel', () => {
    const medlempanel = 'medlempanel';
    const adopsjonpanel = 'adopsjon';

    const action1 = faktaRedux.actionCreators.setOpenInfoPanels([medlempanel]);
    const result1 = faktaRedux.reducer(undefined, action1);
    expect(result1).to.eql({
      openInfoPanels: [medlempanel],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: false,
    });

    const action2 = faktaRedux.actionCreators.setOpenInfoPanels([medlempanel, adopsjonpanel]);
    const result2 = faktaRedux.reducer(result1, action2);
    expect(result2).to.eql({
      openInfoPanels: [medlempanel, adopsjonpanel],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: false,
    });
  });

  it('skal returnere initial state', () => {
    expect(faktaRedux.reducer(undefined, {})).to.eql({
      openInfoPanels: [],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: false,
    });
  });

  it('skal starte godkjenning av aksjonspunkt', () => {
    const action = faktaRedux.actionCreators.resolveFaktaAksjonspunkterStarted();
    const result = faktaRedux.reducer(undefined, action);
    expect(result).to.eql({
      openInfoPanels: [],
      resolveFaktaAksjonspunkterStarted: true,
      resolveFaktaAksjonspunkterSuccess: false,
    });
  });

  it('skal sette godkjenning av aksjonspunkt til ferdig', () => {
    const action = faktaRedux.actionCreators.resolveFaktaAksjonspunkterSuccess();
    const result = faktaRedux.reducer(undefined, action);
    expect(result).to.eql({
      openInfoPanels: [],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: true,
    });
  });

  it('skal resette fakta', () => {
    const data = {
      openInfoPanels: ['medlempanel'],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: true,
    };
    const action = faktaRedux.actionCreators.resetFakta();
    const result = faktaRedux.reducer(data, action);
    expect(result).to.eql({
      openInfoPanels: [],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: false,
    });
  });

  it('skal returnere initial state', () => {
    expect(faktaRedux.reducer(undefined, {})).to.eql({
      openInfoPanels: [],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: false,
    });
  });
});
