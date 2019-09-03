import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import AppIndex from './AppIndex';

describe('<AppIndex>', () => {
  it('skal vise hjem-skjermbilde inkludert header men ikke feilmelding', () => {
    const wrapper = shallowWithIntl(<AppIndex.WrappedComponent
      intl={intlMock}
      navAnsattName="Peder"
      errorMessagesLength={0}
      showCrashMessage={sinon.spy()}
      removeErrorMessage={sinon.spy()}
      location={{ search: undefined }}
      showDetailedErrorMessages={false}
    />);

    const headerComp = wrapper.find('Header');
    expect(headerComp).to.have.length(1);
    expect(headerComp.prop('navAnsattName')).to.eql('Peder');

    const homeComp = wrapper.find('Home');
    expect(homeComp).to.have.length(1);
    expect(homeComp.prop('nrOfErrorMessages')).is.eql(0);
  });

  it('skal vise hjem-skjermbilde inkludert header og feilmelding', () => {
    const wrapper = shallowWithIntl(<AppIndex.WrappedComponent
      intl={intlMock}
      navAnsattName="Peder"
      showCrashMessage={sinon.spy()}
      removeErrorMessage={sinon.spy()}
      errorMessagesLength={1}
      location={{ search: undefined }}
      showDetailedErrorMessages={false}
    />);

    const headerComp = wrapper.find('Header');
    expect(headerComp).to.have.length(1);
    expect(headerComp.prop('navAnsattName')).to.eql('Peder');

    const homeComp = wrapper.find('Home');
    expect(homeComp).to.have.length(1);
    expect(homeComp.prop('nrOfErrorMessages')).is.eql(1);
  });

  it('skal vise query-feilmelding', () => {
    const location = {
      search: '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266',
    };

    const wrapper = shallowWithIntl(<AppIndex.WrappedComponent
      intl={intlMock}
      navAnsattName="Peder"
      removeErrorMessage={sinon.spy()}
      showCrashMessage={sinon.spy()}
      errorMessagesLength={1}
      location={location}
      showDetailedErrorMessages={false}
    />);

    const headerComp = wrapper.find('Header');
    expect(headerComp.prop('queryStrings')).to.eql({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });

    const homeComp = wrapper.find('Home');
    expect(homeComp.prop('nrOfErrorMessages')).is.eql(1);
  });
});
