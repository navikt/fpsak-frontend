import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import MerkePanel from './Merkepanel';

describe('<MerkePanel>', () => {
  it('skal sjekke at kun merking om død vises når fpsak.person er død', () => {
    const wrapper = shallowWithIntl(<MerkePanel
      erDod
      erNAVAnsatt
      erVerge
      diskresjonskode={diskresjonskodeType.KODE6}
    />);
    expect(wrapper.find('FormattedMessage').prop('id')).to.equal('MerkePanel.Dod');
  });
});
