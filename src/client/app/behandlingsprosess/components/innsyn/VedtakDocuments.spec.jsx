import React from 'react';
import { expect } from 'chai';

import { shallow } from 'enzyme';

import VedtakDocuments from './VedtakDocuments';

describe('<VedtakDocuments>', () => {
  it('skal kun vise lenke for å vise dokumentliste', () => {
    const vedtaksdokumenter = [{
      dokumentId: '1',
      tittel: 'test',
      opprettetDato: '2017-08-31',
    }];

    const wrapper = shallow(<VedtakDocuments
      behandlingTypes={[{ kode: 'test', navn: 'navnTest' }]}
      vedtaksdokumenter={vedtaksdokumenter}
    />);

    expect(wrapper.find('a')).to.have.length(1);
  });

  it('skal vise dokumentlisten etter at lenke er trykket', () => {
    const vedtaksdokumenter = [{
      dokumentId: '1',
      tittel: 'test',
      opprettetDato: '2017-08-31',
    }];

    const wrapper = shallow(<VedtakDocuments
      behandlingTypes={[{ kode: 'test', navn: 'navnTest' }]}
      vedtaksdokumenter={vedtaksdokumenter}
    />);

    wrapper.find('a').simulate('click', { preventDefault: () => undefined });
    expect(wrapper.find('a')).to.have.length(2);
  });
});
