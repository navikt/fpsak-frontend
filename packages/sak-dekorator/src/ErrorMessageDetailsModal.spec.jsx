import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';
import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-dekorator';

describe('<ErrorMessageDetailsModal>', () => {
  it('skal vise feildetaljer', () => {
    const errorDetails = {
      feilmelding: 'Dette er feil',
      stacktrace: 'test',
    };
    const wrapper = shallowWithIntl(<ErrorMessageDetailsModal.WrappedComponent
      intl={intlMock}
      showModal={false}
      closeModalFn={sinon.spy()}
      errorDetails={errorDetails}
    />);

    const undertekst = wrapper.find(Undertekst);
    expect(undertekst).to.have.length(2);
    expect(undertekst.first().childAt(0).text()).is.eql('Feilmelding:');
    expect(undertekst.last().childAt(0).text()).is.eql('Stacktrace:');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(2);
    expect(normaltekst.first().childAt(0).text()).is.eql('Dette er feil');
    expect(normaltekst.last().childAt(0).text()).is.eql('test');
  });
});
