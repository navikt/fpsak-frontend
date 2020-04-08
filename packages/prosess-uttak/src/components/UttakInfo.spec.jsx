import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { UttakInfo } from './UttakInfo';

describe('<UttakInfo>', () => {
  const selectedItem = {
    id: 1,
    fom: '2018-01-01',
    tom: '2018-02-01',
    periodeResultatType: {
      kode: '',
      navn: '',
      kodeverk: '',
    },
    periodeResultatÅrsak: {
      kode: '',
      navn: '',
      kodeverk: '',
    },
    flerbarnsdager: false,
    utsettelseType: {
      kode: '-',
    },
    periodeType: {
      kode: '-',
    },
    oppholdÅrsak: {
      kode: '-',
    },
    aktiviteter: [{
      trekkdager: 28,
      utbetalingsgrad: 100,
      stønadskontoType: {
        kode: '',
        navn: 'Mødrekvote',
        kodeverk: '',
      },
    }],
  };

  it('skal rendre uttakinfo med to checkboxes, når flerbarnsdager', () => {
    const wrapper = shallow(<UttakInfo
      selectedItemData={selectedItem}
      readOnly={false}
      harSoktOmFlerbarnsdager
      oppholdArsakTyper={[]}
      alleKodeverk={{}}
    />);
    const checkboxField = wrapper.find('CheckboxField');
    expect(checkboxField).to.have.length(2);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).to.have.length(3);
  });

  it('skal rendre uttakinfo med to checkboxes disabled vid read only', () => {
    const wrapper = shallow(<UttakInfo
      selectedItemData={selectedItem}
      readOnly
      oppholdArsakTyper={[]}
      harSoktOmFlerbarnsdager
      alleKodeverk={{}}
    />);
    const checkboxField = wrapper.find('CheckboxField');
    expect(checkboxField).to.have.length(2);
    expect(wrapper.contains(
      <input type="checkbox" disabled />,
    ));
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).to.have.length(4);
  });

  it('skal rendre uttakinfo uten flerbarns checkbox når ett barn', () => {
    const wrapper = shallow(<UttakInfo
      selectedItemData={selectedItem}
      readOnly={false}
      harSoktOmFlerbarnsdager={false}
      oppholdArsakTyper={[]}
      alleKodeverk={{}}
    />);
    const checkboxField = wrapper.find('CheckboxField');
    expect(checkboxField).to.have.length(1);
    expect(checkboxField.at(0).prop('name')).to.eql('samtidigUttak');
  });
});
