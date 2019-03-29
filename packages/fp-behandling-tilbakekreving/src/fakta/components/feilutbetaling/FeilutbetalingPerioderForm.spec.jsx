import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import sinon from 'sinon';
import { FeilutbetalingPerioderFormImpl } from './FeilutbetalingPerioderForm';

const periode = {
  belop: 51000,
  fom: '2016-03-16',
  tom: '2016-05-26',
};

const mockProps = {
  ...reduxFormPropsMock,
  periode,
  elementId: 0,
  årsaker: [],
  readOnly: false,
  resetFields: sinon.spy(),
};

describe('<FeilutbetalingPerioderFormImpl>', () => {
  it('skal rendre FeilutbetalingInfoPanel', () => {
    const wrapper = shallow(<FeilutbetalingPerioderFormImpl
      {...mockProps}
    />);

    const tableRow = wrapper.find('TableRow');
    expect(tableRow).has.length(1);
    const tableColumn = wrapper.find('TableColumn');
    expect(tableColumn).has.length(3);
    const selectField = wrapper.find('SelectField');
    expect(selectField).has.length(1);
  });

  it('skal rendre underÅrsak selectfield hvis årsak har underÅrsaker', () => {
    const årsak = 'MEDLEMSKAP_VILKAARET_TYPE';
    const årsaker = [
      {
        kodeverk: 'MEDLEMSKAP_VILKAARET_TYPE',
        årsak: 'Medlemskapsvilkåret §14-2',
        årsakKode: 'MEDLEMSKAP_VILKAARET_TYPE',
        underÅrsaker: [
          {
            kodeverk: 'MEDLEMSKAP_VILKAAR',
            underÅrsak: 'Utvandret – fødsel',
            underÅrsakKode: 'UTVANDRET_FODSEL',
          },
        ],
      },
    ];
    const props = {
      ...mockProps,
      årsak,
      årsaker,
    };
    const wrapper = shallow(<FeilutbetalingPerioderFormImpl
      {...props}
    />);

    const tableRow = wrapper.find('TableRow');
    expect(tableRow).has.length(1);
    const tableColumn = wrapper.find('TableColumn');
    expect(tableColumn).has.length(3);
    const selectField = wrapper.find('SelectField');
    expect(selectField).has.length(2);
  });
});
