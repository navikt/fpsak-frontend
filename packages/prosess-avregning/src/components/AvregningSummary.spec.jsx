import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AvregningSummary from './AvregningSummary';

describe('<AvregningSummary>', () => {
  const mockProps = {
    fom: '2018-01-01',
    tom: '2018-07-07',
    feilutbetaling: 15000,
    etterbetaling: 0,
    inntrekk: 20000,
  };

  it('skal vise AvregningSummary', () => {
    const props = {
      ...mockProps,
      ingenPerioderMedAvvik: false,
    };
    const wrapper = shallow(<AvregningSummary
      {...props}
    />);

    const element = wrapper.find('Element');
    expect(element).to.have.length(1);
    const normaltekst = wrapper.find('Normaltekst');
    expect(normaltekst).to.have.length(4);
    const row = wrapper.find('Row');
    expect(row).has.length(3);
    const column = wrapper.find('Column');
    expect(column).has.length(6);
  });

  it('skal vise melding ingen perioder med avvik', () => {
    const props = {
      ...mockProps,
      ingenPerioderMedAvvik: true,
    };
    const wrapper = shallow(<AvregningSummary
      {...props}
    />);

    const message = wrapper.find('FormattedMessage');
    expect(message.at(0).prop('id')).is.eql('Avregning.bruker');
    expect(message.at(1).prop('id')).is.eql('Avregning.ingenPerioder');
  });
});
