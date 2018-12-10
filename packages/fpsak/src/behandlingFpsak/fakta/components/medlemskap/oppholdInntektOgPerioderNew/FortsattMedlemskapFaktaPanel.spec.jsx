import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import { DatepickerField } from 'form/Fields';
import { FortsattMedlemskapFaktaPanelImpl as FortsattMedlemskapFaktaPanel } from './FortsattMedlemskapFaktaPanel';

describe('<FortsattMedlemskapFaktaPanel>', () => {
  it('skal vise datepicker og endrede opplysninger', () => {
    const wrapper = shallow(<FortsattMedlemskapFaktaPanel
      readOnly={false}
      skjaringstidspunkt="2018-01-01"
      changedOpplysninger={[{
        endretAttributt: 'Personstatus',
        fom: '2018-10-10',
      }, {
        endretAttributt: 'StatsborgerskapRegion',
        fom: '2018-11-11',
      }]}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(1);

    const messages = wrapper.find(FormattedMessage);
    expect(messages).to.have.length(3);
    expect(messages.at(0).prop('id')).to.eql('FortsattMedlemskapFaktaPanel.OpplysningerFraFolkeregisteret');
    expect(messages.at(1).prop('id')).to.eql('FortsattMedlemskapFaktaPanel.EndretPersonstatus');
    expect(messages.at(2).prop('id')).to.eql('FortsattMedlemskapFaktaPanel.EndretStatsborgerskap');
  });
});
