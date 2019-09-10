import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingErPaVentModal, BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { CommonBehandlingIndex } from './CommonBehandlingIndex';
import CommonBehandlingResolver from './CommonBehandlingResolver';

describe('<CommonBehandlingIndex>', () => {
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

  it('skal vise paneler for behandlingsprosess og fakta', () => {
    const wrapper = shallow(
      <CommonBehandlingIndex
        behandlingId={1}
        hasShownBehandlingPaVent={false}
        closeBehandlingOnHoldModal={sinon.spy()}
        handleOnHoldSubmit={sinon.spy()}
        destroyReduxForms={sinon.spy()}
        hasSubmittedPaVentForm
        hasManualPaVent={false}
        setBehandlingInfo={sinon.spy()}
        behandlingerVersjonMappedById={{}}
        behandlingUpdater={{ setUpdater: sinon.spy() }}
        resetBehandlingFpsakContext={sinon.spy()}
        appContextUpdater={{}}
        behandlingIdentifier={new BehandlingIdentifier(2, 1)}
        isInSync
        fetchBehandling={sinon.spy()}
        fpBehandlingUpdater={{}}
        fagsakInfo={{
          fagsakSaksnummer: 2,
          behandlingId: 1,
          featureToggles: {},
          kodeverk: {},
          fagsak,
        }}
      >
        <BehandlingGrid />
      </CommonBehandlingIndex>,
    );

    expect(wrapper.find(CommonBehandlingResolver)).has.length(1);
    expect(wrapper.find(BehandlingGrid)).has.length(1);
  });

  it('skal kunne vise modal så lenge en ikke allerede har satt på vent', () => {
    const wrapper = shallow(<CommonBehandlingIndex
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
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      appContextUpdater={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fpBehandlingUpdater={{}}
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

    const wrapper = shallow(<CommonBehandlingIndex
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
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      appContextUpdater={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fetchBehandling={sinon.spy()}
      fpBehandlingUpdater={{}}
      fagsakInfo={{
        fagsakSaksnummer: 2,
        behandlingId: 1,
        featureToggles: {},
        kodeverk: {},
        fagsak,
      }}
    />);

    wrapper.setProps({ behandlingVersjon: 3 });

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

    const wrapper = shallow(<CommonBehandlingIndex
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
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      appContextUpdater={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fpBehandlingUpdater={{}}
      fetchBehandling={sinon.spy()}
      fagsakInfo={{
        fagsakSaksnummer: 2,
        behandlingId: 1,
        featureToggles: {},
        kodeverk: {},
        fagsak,
      }}
    />);

    wrapper.setProps({ behandlingsprosessEnabled: false });

    clock.tick(1100);

    expect(destroyForms.getCalls())
      .has
      .length(0);
  });

  it('skal renske opp former når komponent blir unmounta', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<CommonBehandlingIndex
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
      behandlingUpdater={{ setUpdater: sinon.spy() }}
      resetBehandlingFpsakContext={sinon.spy()}
      appContextUpdater={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      isInSync
      fpBehandlingUpdater={{}}
      fetchBehandling={sinon.spy()}
      fagsakInfo={{
        fagsakSaksnummer: 2,
        behandlingId: 1,
        featureToggles: {},
        kodeverk: {},
        fagsak,
      }}
    />);

    wrapper.unmount();

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
