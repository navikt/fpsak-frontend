import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import { OverstyrVurderingChecker } from './OverstyrVurderingChecker';

describe('<OverstyrVurderingChecker>', () => {
  const aksjonspunkter = [{
    id: 1,
    definisjon: {
      kode: '5011',
      navn: 'test',
    },
    status: {
      kode: 'OPPRETTET',
      navn: 'test',
    },
    kanLoses: true,
    erAktivt: true,
  }];

  it('skal vise checkbox for valg av overstyring når en har overstyrings-rettighet', () => {
    const wrapper = shallowWithIntl(<OverstyrVurderingChecker
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={sinon.spy()}
      aksjonspunkter={aksjonspunkter}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleBehandlingspunktOverstyring={sinon.spy()}
      selectedBehandlingspunkt="punkt"
      isBehandlingReadOnly
    />);

    const checkbox = wrapper.find('CheckboxField');
    expect(checkbox).to.have.length(1);
    expect(checkbox.prop('label')).is.eql('Overstyrt automatisk vurdering');
    expect(checkbox.prop('disabled')).is.true;
  });

  it('skal vise checkbox med tekst overstyr beregning', () => {
    const wrapper = shallowWithIntl(<OverstyrVurderingChecker
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={sinon.spy()}
      aksjonspunkter={aksjonspunkter}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleBehandlingspunktOverstyring={sinon.spy()}
      selectedBehandlingspunkt="punkt"
      isBeregningOverstyrer
      isBehandlingReadOnly
    />);

    const checkbox = wrapper.find('CheckboxField');
    expect(checkbox.prop('label')).is.eql('Overstyrt beregning');
  });

  it('skal ikke vise checkbox når en ikke har overstyrings-rettighet', () => {
    const wrapper = shallowWithIntl(<OverstyrVurderingChecker
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={sinon.spy()}
      aksjonspunkter={[]}
      kanOverstyreAccess={{ isEnabled: false }}
      toggleBehandlingspunktOverstyring={sinon.spy()}
      selectedBehandlingspunkt="punkt"
      isBehandlingReadOnly
    />);

    const checkbox = wrapper.find('CheckboxField');
    expect(checkbox).to.have.length(0);
  });

  it('skal vise checkbox som trykkbar', () => {
    const wrapper = shallowWithIntl(<OverstyrVurderingChecker
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={sinon.spy()}
      aksjonspunkter={aksjonspunkter}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleBehandlingspunktOverstyring={sinon.spy()}
      selectedBehandlingspunkt="punkt"
      isBehandlingReadOnly
    />);

    const checkbox = wrapper.find('CheckboxField');
    expect(checkbox).to.have.length(1);
  });

  it('skal resette form-verdier og toggle behandlingspunkt-status ved valg av checkbox', () => {
    const resetCallback = sinon.spy();
    const toggleCallback = sinon.spy();

    const wrapper = shallowWithIntl(<OverstyrVurderingChecker
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={resetCallback}
      aksjonspunkter={aksjonspunkter}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleBehandlingspunktOverstyring={toggleCallback}
      selectedBehandlingspunkt="punkt"
      isBehandlingReadOnly
    />);

    const checkbox = wrapper.find('CheckboxField');
    checkbox.prop('onChange')();

    expect(resetCallback).to.have.property('callCount', 1);
    expect(toggleCallback).to.have.property('callCount', 1);
    const { args } = toggleCallback.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql('punkt');
  });
});
