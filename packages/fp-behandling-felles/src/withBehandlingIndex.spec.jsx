import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { BehandlingIdentifier, BehandlingErPaVentModal } from '@fpsak-frontend/fp-felles';

import { withBehandlingIndex } from './withBehandlingIndex';
import CommonBehandlingResolver from './CommonBehandlingResolver';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('withBehandlingIndex', () => {
  // eslint-disable-next-line no-console
  // console.log(global.Date.now());
  // process.exit(1);
  let sandbox;
  let clock;

  const fagsak = {
    fagsakStatus: {
      kode: 'test',
      navn: 'test',
    },
    fagsakPerson: {
      navn: 'Espen Utvikler',
      alder: 40,
      personnummer: '1234546',
      erKvinne: false,
      personstatusType: {
        kode: 'test',
        navn: 'test',
      },
    },
    fagsakYtelseType: {
      kode: 'test',
      navn: 'test',
    },
    isForeldrepengerFagsak: true,
  };

  before(() => {
    sandbox = sinon.createSandbox();
    clock = sandbox.useFakeTimers({
      now: 1483228800000,
      global,
      toFake: ['Date', 'setTimeout'],
    });
  });

  after(() => {
    sandbox.restore();
    clock.restore();
  });

  const BehandlingGrid = () => (
    <div className="component" />
  );

  const BehandlingComp = withBehandlingIndex(() => ({}), () => ({}), sinon.spy())(BehandlingGrid);

  it('skal vise paneler for behandlingsprosess og fakta', () => {
    const wrapper = shallow(<BehandlingComp
      store={mockStore({ router: { location: { path: 'test' } } })}
      behandlingId={1}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={sinon.spy()}
      hasSubmittedPaVentForm
      hasManualPaVent={false}
      setBehandlingInfo={sinon.spy()}
      behandlingerVersjonMappedById={{}}
      setBehandlingInfoHolder={sinon.spy()}
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      updateFagsakInfo={sinon.spy()}
      appContextUpdater={{}}
      filteredReceivedDocuments={[]}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fetchBehandling={sinon.spy()}
      fagsakInfo={{
        fagsakSaksnummer: 2,
        behandlingId: 1,
        featureToggles: {},
        kodeverk: {},
        fagsak,
      }}
    />);

    expect(wrapper.dive().find(CommonBehandlingResolver)).has.length(1);
    expect(wrapper.dive().find(BehandlingGrid)).has.length(1);
  });

  it('skal kunne vise modal så lenge en ikke allerede har satt på vent', () => {
    const wrapper = shallow(<BehandlingComp
      store={mockStore({ router: { location: { path: 'test' } } })}
      behandlingId={1}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={sinon.spy()}
      hasSubmittedPaVentForm={false}
      hasManualPaVent={false}
      behandlingPaaVent
      setBehandlingInfo={sinon.spy()}
      behandlingerVersjonMappedById={{}}
      setBehandlingInfoHolder={sinon.spy()}
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      updateFagsakInfo={sinon.spy()}
      appContextUpdater={{}}
      filteredReceivedDocuments={[]}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fetchBehandling={sinon.spy()}
      fagsakInfo={{
        fagsakSaksnummer: 2,
        behandlingId: 1,
        featureToggles: {},
        kodeverk: {},
        fagsak,
      }}
    />);

    const modal = wrapper.dive().find(BehandlingErPaVentModal);
    expect(modal)
      .to
      .have
      .length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal renske opp former når en behandlingsversjonen er endret', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingComp
      store={mockStore({ router: { location: { path: 'test' } } })}
      behandlingId={1}
      behandlingVersjon={2}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={destroyForms}
      hasSubmittedPaVentForm={false}
      hasManualPaVent={false}
      behandlingPaaVent
      setBehandlingInfo={sinon.spy()}
      behandlingerVersjonMappedById={{}}
      setBehandlingInfoHolder={sinon.spy()}
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      updateFagsakInfo={sinon.spy()}
      appContextUpdater={{}}
      filteredReceivedDocuments={[]}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fetchBehandling={sinon.spy()}
      fagsakInfo={{
        fagsakSaksnummer: 2,
        behandlingId: 1,
        featureToggles: {},
        kodeverk: {},
        fagsak,
      }}
    />);

    wrapper.dive().setProps({ behandlingVersjon: 3 });

    clock.tick(1100);

    expect(destroyForms.getCalls())
      .has
      .length(1);
    const { args } = destroyForms.getCalls()[0];
    expect(args)
      .has
      .length(1);
    expect(args[0])
      .is
      .eql('behandling_1_v2');
  });

  it('skal ikke renske opp former når behandlingsversjonen ikke er endret', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingComp
      store={mockStore({ router: { location: { path: 'test' } } })}
      behandlingId={1}
      behandlingVersjon={2}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={destroyForms}
      hasSubmittedPaVentForm={false}
      hasManualPaVent={false}
      behandlingPaaVent
      setBehandlingInfo={sinon.spy()}
      behandlingerVersjonMappedById={{}}
      setBehandlingInfoHolder={sinon.spy()}
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      updateFagsakInfo={sinon.spy()}
      appContextUpdater={{}}
      filteredReceivedDocuments={[]}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fetchBehandling={sinon.spy()}
      fagsakInfo={{
        fagsakSaksnummer: 2,
        behandlingId: 1,
        featureToggles: {},
        kodeverk: {},
        fagsak,
      }}
    />);

    wrapper.dive().setProps({ behandlingsprosessEnabled: false });

    clock.tick(1100);

    expect(destroyForms.getCalls())
      .has
      .length(0);
  });

  it('skal renske opp former når komponent blir unmounta', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingComp
      store={mockStore({ router: { location: { path: 'test' } } })}
      behandlingId={1}
      behandlingVersjon={2}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={destroyForms}
      hasSubmittedPaVentForm={false}
      hasManualPaVent={false}
      behandlingPaaVent
      setBehandlingInfo={sinon.spy()}
      behandlingerVersjonMappedById={{}}
      setBehandlingInfoHolder={sinon.spy()}
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      updateFagsakInfo={sinon.spy()}
      appContextUpdater={{}}
      filteredReceivedDocuments={[]}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fetchBehandling={sinon.spy()}
      fagsakInfo={{
        fagsakSaksnummer: 2,
        behandlingId: 1,
        featureToggles: {},
        kodeverk: {},
        fagsak,
      }}
    />);

    wrapper.dive().unmount();

    clock.tick(1100);

    expect(destroyForms.getCalls())
      .has
      .length(1);
    const { args } = destroyForms.getCalls()[0];
    expect(args)
      .has
      .length(1);
    expect(args[0])
      .is
      .eql('behandling_1_v2');
  });
});
