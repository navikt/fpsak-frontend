import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import HeaderWithErrorPanel from '@fpsak-frontend/sak-dekorator';

import Dekorator from './Dekorator';

describe('<Dekorator>', () => {
  it('skal vise søkeskjermbildet, men ikke systemstatuser', () => {
    const removeErrorMsg = sinon.spy();
    const ansattNavn = 'Dagobert';
    const wrapper = shallowWithIntl(<Dekorator.WrappedComponent
      intl={intlMock}
      queryStrings={{}}
      navAnsattName={ansattNavn}
      removeErrorMessage={removeErrorMsg}
      showDetailedErrorMessages={false}
      setSiteHeight={sinon.spy()}
    />);
    const header = wrapper.find(HeaderWithErrorPanel);
    expect(header.length)
      .is
      .equal(1);
    expect(header.prop('iconLinks'))
      .to
      .be
      .an('array');

    header.prop('iconLinks')
      .forEach((iconLink) => {
        expect(iconLink.url)
          .to
          .be
          .a('string')
          .and
          .match(
            // eslint-disable-next-line max-len
            /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
          );
      });
  });
});
