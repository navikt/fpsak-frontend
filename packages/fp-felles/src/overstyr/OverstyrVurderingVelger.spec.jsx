import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { CheckboxField } from '@fpsak-frontend/form';

import { OverstyrVurderingVelger } from './OverstyrVurderingVelger';

describe('<OverstyrVurderingVelger>', () => {
  const aksjonspunktCodes = ['5011', 'OPPRETTET'];

  it('skal vise checkbox for valg av overstyring når en har overstyrings-rettighet', () => {
    const wrapper = shallowWithIntl(<OverstyrVurderingVelger
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={sinon.spy()}
      aksjonspunktCodes={aksjonspunktCodes}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleOverstyring={sinon.spy()}
      overrideReadOnly
    />);

    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).to.have.length(1);
    expect(checkbox.prop('label')).is.eql('Overstyrt automatisk vurdering');
    expect(checkbox.prop('disabled')).is.true;
  });

  it('skal vise checkbox med tekst overstyr beregning', () => {
    const wrapper = shallowWithIntl(<OverstyrVurderingVelger
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={sinon.spy()}
      aksjonspunktCodes={aksjonspunktCodes}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleOverstyring={sinon.spy()}
      isBeregningOverstyrer
      overrideReadOnly
    />);

    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox.prop('label')).is.eql('Overstyrt beregning');
  });

  it('skal ikke vise checkbox når en ikke har overstyrings-rettighet', () => {
    const wrapper = shallowWithIntl(<OverstyrVurderingVelger
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={sinon.spy()}
      aksjonspunktCodes={[]}
      kanOverstyreAccess={{ isEnabled: false }}
      toggleOverstyring={sinon.spy()}
      overrideReadOnly
    />);

    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).to.have.length(0);
  });

  it('skal vise checkbox som trykkbar', () => {
    const wrapper = shallowWithIntl(<OverstyrVurderingVelger
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={sinon.spy()}
      aksjonspunktCodes={aksjonspunktCodes}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleOverstyring={sinon.spy()}
      overrideReadOnly
    />);

    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).to.have.length(1);
  });

  it('skal resette form-verdier og toggle behandlingspunkt-status ved valg av checkbox', () => {
    const resetCallback = sinon.spy();
    const toggleCallback = sinon.spy();

    const wrapper = shallowWithIntl(<OverstyrVurderingVelger
      intl={intlMock}
      aksjonspunktCode="5011"
      resetValues={resetCallback}
      aksjonspunktCodes={aksjonspunktCodes}
      kanOverstyreAccess={{ isEnabled: true }}
      toggleOverstyring={toggleCallback}
      overrideReadOnly
    />);

    const checkbox = wrapper.find(CheckboxField);
    checkbox.prop('onChange')();

    expect(resetCallback).to.have.property('callCount', 1);
    expect(toggleCallback).to.have.property('callCount', 1);
  });
});
