import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Header from './Header';

describe('<Header>', () => {
  it('skal sjekke at navn blir vist', () => {
    const wrapper = shallow(<Header
      navAnsattName="Per"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
      setValgtAvdeling={() => undefined}
    />);
    const lastDiv = wrapper.find('div').last();
    expect(lastDiv.text()).to.eql('Per');
  });

  it('skal vise to avdelinger i dropdown', () => {
    const avdelinger = [{
      avdelingEnhet: '2323',
      navn: 'NAV Drammen',
      kreverKode6: false,
    }, {
      avdelingEnhet: '4323',
      navn: 'NAV Oslo',
      kreverKode6: false,
    }];

    const wrapper = shallow(<Header
      navAnsattName="Per"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
      avdelinger={avdelinger}
      setValgtAvdeling={() => undefined}
    />);

    const options = wrapper.find('option');
    expect(options).has.length(2);
    expect(options.first().prop('value')).to.eql('2323');
    expect(options.first().childAt(0).text()).to.eql('2323 NAV Drammen');
    expect(options.last().prop('value')).to.eql('4323');
    expect(options.last().childAt(0).text()).to.eql('4323 NAV Oslo');
  });

  it('skal vise to avdelinger i dropdown', () => {
    const avdelinger = [{
      avdelingEnhet: '2323',
      navn: 'NAV Drammen',
      kreverKode6: false,
    }, {
      avdelingEnhet: '4323',
      navn: 'NAV Oslo',
      kreverKode6: false,
    }];

    const wrapper = shallow(<Header
      navAnsattName="Per"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
      avdelinger={avdelinger}
      setValgtAvdeling={() => undefined}
    />);

    const options = wrapper.find('option');
    expect(options).has.length(2);
    expect(options.first().prop('value')).to.eql('2323');
    expect(options.first().childAt(0).text()).to.eql('2323 NAV Drammen');
    expect(options.last().prop('value')).to.eql('4323');
    expect(options.last().childAt(0).text()).to.eql('4323 NAV Oslo');
  });

  it('skal sette valgt avdeling til første avdeling i listen når ingenting er valgt fra før og en har avdelinger', () => {
    const setValgtAvdelingFn = sinon.spy();
    const avdelinger = [{
      avdelingEnhet: '2323',
      navn: 'NAV Drammen',
      kreverKode6: false,
    }, {
      avdelingEnhet: '4323',
      navn: 'NAV Oslo',
      kreverKode6: false,
    }];

    shallow(<Header
      navAnsattName="Per"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
      avdelinger={avdelinger}
      setValgtAvdeling={setValgtAvdelingFn}
    />);

    expect(setValgtAvdelingFn.calledOnce).to.be.true;
    const { args } = setValgtAvdelingFn.getCalls()[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql('2323');
  });

  it('skal ikke sette valgt avdeling når en ikke har avdelinger', () => {
    const setValgtAvdelingFn = sinon.spy();
    const avdelinger = [];

    shallow(<Header
      navAnsattName="Per"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
      avdelinger={avdelinger}
      setValgtAvdeling={setValgtAvdelingFn}
    />);

    expect(setValgtAvdelingFn.calledOnce).to.be.false;
  });

  it('skal ikke sette valgt avdeling når den allerede er satt fra før', () => {
    const setValgtAvdelingFn = sinon.spy();
    const avdelinger = [{
      avdelingEnhet: '2323',
      navn: 'NAV Drammen',
      kreverKode6: false,
    }, {
      avdelingEnhet: '4323',
      navn: 'NAV Oslo',
      kreverKode6: false,
    }];

    shallow(<Header
      navAnsattName="Per"
      removeErrorMessage={() => undefined}
      queryStrings={{}}
      avdelinger={avdelinger}
      setValgtAvdeling={setValgtAvdelingFn}
      valgtAvdelingEnhet="2"
    />);

    expect(setValgtAvdelingFn.calledOnce).to.be.false;
  });
});
