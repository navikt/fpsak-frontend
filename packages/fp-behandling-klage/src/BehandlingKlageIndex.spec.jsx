import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { BehandlingGrid } from '@fpsak-frontend/fp-behandling-felles';
import { BehandlingIdentifier, BehandlingErPaVentModal } from '@fpsak-frontend/fp-felles';
import { BehandlingKlageIndex } from './BehandlingKlageIndex';

describe('BehandlingKlageIndex', () => {
  const timestamp = moment.now();
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
    clock = sinon.useFakeTimers(timestamp);
  });

  after(() => {
    sandbox.restore();
    clock.restore();
  });

  it('skal vise paneler for behandlingsprosess og fakta', () => {
    const wrapper = shallow(<BehandlingKlageIndex
      saksnummer={2}
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
      fagsak={fagsak}
      appContextUpdater={{}}
      featureToggles={{}}
      filteredReceivedDocuments={[]}
      kodeverk={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      avsluttedeBehandlinger={[]}
    />);

    const grid = wrapper.find(BehandlingGrid);
    expect(grid.prop('behandlingsprosessContent').type.displayName).to.contain('BehandlingsprosessKlageIndex');
    expect(grid.prop('faktaContent').type.displayName).to.contain('FaktaKlageIndex');

    expect(grid.find(BehandlingErPaVentModal)).to.have.length(0);
  });

  it('skal kunne vise modal så lenge en ikke allerede har satt på vent', () => {
    const wrapper = shallow(<BehandlingKlageIndex
      saksnummer={2}
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
      fagsak={fagsak}
      appContextUpdater={{}}
      featureToggles={{}}
      filteredReceivedDocuments={[]}
      kodeverk={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      avsluttedeBehandlinger={[]}
    />);

    const modal = wrapper.find(BehandlingErPaVentModal);
    expect(modal).to.have.length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal renske opp former når en behandlingsversjonen er endret', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingKlageIndex
      saksnummer={2}
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
      fagsak={fagsak}
      appContextUpdater={{}}
      featureToggles={{}}
      filteredReceivedDocuments={[]}
      kodeverk={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      avsluttedeBehandlinger={[]}
    />);

    wrapper.setProps({ behandlingVersjon: 3 });

    clock.tick(1100);

    expect(destroyForms.getCalls()).has.length(1);
    const { args } = destroyForms.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql('behandling_1_v2');
  });

  it('skal ikke renske opp former når behandlingsversjonen ikke er endret', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingKlageIndex
      saksnummer={2}
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
      fagsak={fagsak}
      appContextUpdater={{}}
      featureToggles={{}}
      filteredReceivedDocuments={[]}
      kodeverk={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      avsluttedeBehandlinger={[]}
    />);

    wrapper.setProps({ behandlingsprosessEnabled: false });

    clock.tick(1100);

    expect(destroyForms.getCalls()).has.length(0);
  });

  it('skal renske opp former når komponent blir unmounta', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingKlageIndex
      saksnummer={2}
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
      fagsak={fagsak}
      appContextUpdater={{}}
      featureToggles={{}}
      filteredReceivedDocuments={[]}
      kodeverk={{}}
      behandlingIdentifier={new BehandlingIdentifier(2, 1)}
      avsluttedeBehandlinger={[]}
    />);

    wrapper.unmount();

    clock.tick(1100);

    expect(destroyForms.getCalls()).has.length(1);
    const { args } = destroyForms.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql('behandling_1_v2');
  });
});
