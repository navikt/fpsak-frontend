import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { shallow } from 'enzyme';

import opplysningsKilde from 'kodeverk/opplysningsKilde';
import { ISO_DATE_FORMAT } from 'utils/formats';
import { BarnPanelImpl as BarnPanel } from './BarnPanel';

const getMockedFields = (fieldNames, children) => {
  const field = {
    get: idx => children[idx],
  };
  return {
    map: callback => fieldNames.map((fieldname, idx) => callback(fieldname, idx, field)),
  };
};

describe('<BarnPanel>', () => {
  it('skal kunne endre fødselsdatoer når barna ikke er bekreftet av TPS', () => {
    const fieldNames = ['barn[0]', 'barn[1]'];
    const children = [{
      id: 1,
      navn: 'Espen Utvikler',
      fodselsdato: '10-10-2017',
      adresse: undefined,
      opplysningsKilde: opplysningsKilde.SOKNAD,
    }, {
      id: 2,
      navn: 'Petra Utvikler',
      fodselsdato: '10-01-2017',
      adresse: undefined,
      opplysningsKilde: opplysningsKilde.SOKNAD,
    }];
    const wrapper = shallow(<BarnPanel
      readOnly
      fields={getMockedFields(fieldNames, children)}
      antallBarn={2}
    />);

    const DatepickerField = wrapper.find('DatepickerField');
    expect(DatepickerField).to.have.length(2);
    const DateLabel = wrapper.find('DateLabel');
    expect(DateLabel).to.have.length(0);
  });

  it('skal ikke kunne endre fødselsdatoer når barna er bekreftet av TPS', () => {
    const fieldNames = ['barn[0]', 'barn[1]'];
    const children = [{
      id: 1,
      navn: 'Espen Utvikler',
      fodselsdato: '10-10-2017',
      adresse: undefined,
      opplysningsKilde: opplysningsKilde.TPS,
    }, {
      id: 2,
      navn: 'Petra Utvikler',
      fodselsdato: '10-01-2017',
      adresse: undefined,
      opplysningsKilde: opplysningsKilde.TPS,
    }];
    const wrapper = shallow(<BarnPanel
      readOnly
      fields={getMockedFields(fieldNames, children)}
      antallBarn={2}
    />);

    const DatepickerField = wrapper.find('DatepickerField');
    expect(DatepickerField).to.have.length(0);
    const DateLabel = wrapper.find('DateLabel');
    expect(DateLabel).to.have.length(2);
  });

  it('skal vise korrekt alder på barn', () => {
    const fodselsdato1 = moment().subtract(2, 'years').add(1, 'days').format(ISO_DATE_FORMAT);
    const fodselsdato2 = moment().subtract(2, 'years').format(ISO_DATE_FORMAT);

    const fieldNames = ['barn[0]', 'barn[1]'];
    const children = [
      {
        id: 1,
        navn: 'Espen Utvikler',
        adresse: undefined,
        opplysningsKilde: opplysningsKilde.TPS,
        fodselsdato: fodselsdato1,
      },
      {
        id: 2,
        navn: 'Espen Askeladd',
        adresse: undefined,
        opplysningsKilde: opplysningsKilde.TPS,
        fodselsdato: fodselsdato2,
      },
    ];

    const wrapper = shallow(<BarnPanel
      readOnly={false}
      fields={getMockedFields(fieldNames, children)}
      antallBarn={2}
    />);

    const alderMessage = wrapper.find({ id: 'BarnPanel.Age' });
    expect(alderMessage).to.have.length(2);
    expect(alderMessage.at(0).props().values.age).to.eql('1');
    expect(alderMessage.at(1).props().values.age).to.eql('2');
  });
});
