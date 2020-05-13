import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import TimeLineTab from './TimeLineTab';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-proses-uttak';

const stonadskonto = {
  kontonavn: 'FORELDREPENGER_FØR_FØDSEL',
  kontoinfo: {
    saldo: 30,
    aktivitetSaldoDtoList: [
      {
        fordelteDager: 30,
      },
      {
        fordelteDager: 25,
      },
    ],
  },
};

describe('<TimeLineTab>', () => {
  it('skal teste at TimeLineTab viser korrekte verdier', () => {
    const wrapper = shallowWithIntl(<TimeLineTab
      onClickCallback={sinon.spy()}
      stonadskonto={stonadskonto}
    />);

    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage.at(0).props().id).to.equal('TimeLineTab.Stonadinfo.ForeldrepengerFF');

    const FormattedMessage = wrapper.find('FormattedMessage');
    expect(FormattedMessage.at(1).props().values.ukerVerdi).to.equal(6);
    expect(FormattedMessage.at(1).props().values.dagerVerdi).to.equal(0);
  });
});
