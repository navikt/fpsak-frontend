import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AppIndex from './AppIndex';
import Home from './components/Home';
import Dekorator from './components/Dekorator';


describe('<AppIndex>', () => {
  const locationMock = {
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  };

  it('skal vise hjem-skjermbilde inkludert header men ikke feilmelding', () => {
    const wrapper = shallow(<AppIndex.WrappedComponent
      navAnsattName="Peder"
      location={locationMock}
    />);
    const headerComp = wrapper.find(Dekorator);
    expect(headerComp).to.have.length(1);
    expect(headerComp.prop('navAnsattName')).to.eql('Peder');
    expect(headerComp.prop('errorMessages').length).is.eql(0);

    const homeComp = wrapper.find(Home);
    expect(homeComp).to.have.length(1);
  });

  it('skal vise hjem-skjermbilde inkludert header og feilmelding', () => {
    const wrapper = shallow(<AppIndex.WrappedComponent
      navAnsattName="Peder"
      errorMessages={[{ message: 'error' }]}
      location={locationMock}
    />);

    const headerComp = wrapper.find(Dekorator);
    expect(headerComp).to.have.length(1);
    expect(headerComp.prop('navAnsattName')).to.eql('Peder');
    expect(headerComp.prop('errorMessages').length).is.eql(1);

    const homeComp = wrapper.find(Home);
    expect(homeComp).to.have.length(1);
  });

  it('skal vise query-feilmelding', () => {
    const location = {
      search: '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266',
    };

    const wrapper = shallow(<AppIndex.WrappedComponent
      navAnsattName="Peder"
      location={{ ...locationMock, ...location }}
    />);

    const headerComp = wrapper.find(Dekorator);
    expect(headerComp.prop('queryStrings')).to.eql({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });
  });
});
