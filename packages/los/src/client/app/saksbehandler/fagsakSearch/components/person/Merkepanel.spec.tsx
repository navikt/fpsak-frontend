
import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import { FormattedMessage } from 'react-intl';
import diskresjonskodeType from 'kodeverk/diskresjonskodeType';
import { MerkePanel } from './Merkepanel';

describe('<MerkePanel>', () => {
  it('skal sjekke at kun merking om død vises når person er død', () => {
    const wrapper = shallowWithIntl(<MerkePanel
      erDod
      erNAVAnsatt
      erVerge
      diskresjonskode={diskresjonskodeType.KODE6}
      intl={intlMock}
    />);
    expect(wrapper.find(FormattedMessage).prop('id')).to.equal('MerkePanel.Dod');
  });
});
