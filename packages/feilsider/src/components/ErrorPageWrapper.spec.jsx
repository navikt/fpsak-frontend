import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Innholdstittel } from 'nav-frontend-typografi';
import ErrorPageWrapper from './ErrorPageWrapper';

describe('<ErrorPageWrapper>', () => {
  it('skal rendre ErrorPageWrapper korrekt', () => {
    const wrapper = mount(<ErrorPageWrapper><article>pageContent</article></ErrorPageWrapper>);
    expect(wrapper.find('article')).to.have.length(1);
    expect(wrapper.find(Innholdstittel)).to.have.length(1);
  });
});
