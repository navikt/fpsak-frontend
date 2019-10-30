import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable';

const perioder = [
  {
    fom: '2016-03-16',
    tom: '2016-05-26',
  },
  {
    fom: '2016-06-27',
    tom: '2016-07-26',
  },
];

const headerTextCodes = [
  'FeilutbetalingInfoPanel.Period',
  'FeilutbetalingInfoPanel.Hendelse',
  'FeilutbetalingInfoPanel.Beløp',
];

const mockProps = {
  perioder,
  årsaker: [],
  formName: 'FaktaFeilutbetalingForm',
  readOnly: false,
  resetFields: sinon.spy(),
  behandlingId: 1,
  behandlingVersjon: 1,
};

describe('<FeilutbetalingPerioderTable>', () => {
  it('skal rendre FeilutbetalingInfoPanel', () => {
    const wrapper = shallow(<FeilutbetalingPerioderTable
      {...mockProps}
    />);

    const table = wrapper.find('Table');
    expect(table).has.length(1);
    expect(table.prop('headerTextCodes')).to.eql(headerTextCodes);
  });
});
