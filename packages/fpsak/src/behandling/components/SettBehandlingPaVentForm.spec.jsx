import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SettBehandlingPaVentModal from './SettBehandlingPaVentModal';
import { SettBehandlingPaVentFormImpl } from './SettBehandlingPaVentForm';

describe('<SettBehandlingPaVentForm>', () => {
  it('skal ikke vise avbrytknapp når ingen endringer er gjort på ventefrist eller ventearsak og behandling er på vent', () => {
    const wrapper = shallow(<SettBehandlingPaVentFormImpl
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="frist"
      originalFrist="frist"
      showModal
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      isUpdateOnHold
      hasManualPaVent
    />);

    const ventModal = wrapper.find(SettBehandlingPaVentModal);
    expect(ventModal.prop('showAvbryt')).to.equal(false);
  });

  it('skal vise avbrytknapp når det er gjort endringer på ventarsak eller frist', () => {
    const wrapper = shallow(<SettBehandlingPaVentFormImpl
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="fristEndret"
      originalFrist="frist"
      showModal
      ventearsak="ventearsakEndret"
      originalVentearsak="ventearsak"
      isUpdateOnHold={false}
      hasManualPaVent
    />);

    const ventModal = wrapper.find(SettBehandlingPaVentModal);
    expect(ventModal.prop('showAvbryt')).to.equal(true);
  });

  it('skal vise avbrytknapp når behandling ikke er på vent', () => {
    const wrapper = shallow(<SettBehandlingPaVentFormImpl
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="frist"
      originalFrist="frist"
      showModal
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      isUpdateOnHold={false}
      hasManualPaVent
    />);

    const ventModal = wrapper.find(SettBehandlingPaVentModal);
    expect(ventModal.prop('showAvbryt')).to.equal(true);
  });
});
