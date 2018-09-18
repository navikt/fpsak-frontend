import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import diskresjonskodeType from 'kodeverk/diskresjonskodeType';
import MerkePanel from './Merkepanel';

describe('<MerkePanel>', () => {
  it('skal sjekke at kun merking om død vises når person er død', () => {
    const wrapper = shallowWithIntl(<MerkePanel.WrappedComponent
      erDod
      erNAVAnsatt
      erVerge
      diskresjonskode={diskresjonskodeType.KODE6}
      intl={intlMock}
    />);
    expect(wrapper.find('FormattedMessage').prop('id')).to.equal('MerkePanel.Dod');
  });

  it('skal sjekke prioritet for merking (diskresjon -> ansatt -> verge)', () => {
    const wrapper = shallowWithIntl(<MerkePanel.WrappedComponent
      erDod={false}
      erNAVAnsatt
      erVerge
      diskresjonskode={diskresjonskodeType.KODE6}
      intl={intlMock}
    />);

    const message = wrapper.find('FormattedMessage');
    expect(message.first().prop('id')).to.equal('MerkePanel.Diskresjon6');
    expect(message.at(1).prop('id')).to.equal('MerkePanel.EgenAnsatt');
    expect(message.last().prop('id')).to.equal('MerkePanel.Verge');
  });
});
