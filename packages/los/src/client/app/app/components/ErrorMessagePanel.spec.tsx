import React from 'react';
import { expect } from 'chai';
import { Undertekst } from 'nav-frontend-typografi';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { ErrorMessagePanel, getErrorMessageList } from './ErrorMessagePanel';

describe('<ErrorMessagePanel>', () => {
  it('skal vise feilmelding med ikke lenke for å vise detaljert info', () => {
    const wrapper = shallowWithIntl(<ErrorMessagePanel
      intl={intlMock}
      errorMessages={['Error!']}
      removeErrorMessage={() => undefined}
    />);

    const div = wrapper.find(Undertekst);
    expect(div).to.have.length(1);
    expect(div.childAt(0).text()).to.eql('Error! ');

    expect(wrapper.find('a')).to.have.length(0);
  });

  it('skal erstatte spesialtegn i feilmelding', () => {
    const wrapper = shallowWithIntl(<ErrorMessagePanel
      intl={intlMock}
      errorMessages={['Høna &amp; egget og &#34;test1&#34; og &#39;test2&#39;']}
      removeErrorMessage={() => undefined}
    />);

    const div = wrapper.find(Undertekst);
    expect(div).to.have.length(1);
    expect(div.childAt(0).text()).to.eql('Høna & egget og "test1" og \'test2\' ');
  });

  it('skal sette sammen feil fra ulike kilder til en struktur', () => {
    const errorTextMappings = {
      'Error.Test': 'Feilmelding 1',
      'Error.Test2': 'Feilmelding 2',
    };

    const intlCustomMock = {
      ...intlMock,
      formatMessage: ({ id }) => errorTextMappings[id],
    };

    const ownProps = {
      queryStrings: {
        errorcode: 'Error.Test',
        errormessage: 'Dette er en feil',
      },
      intl: intlCustomMock,
    };
    const allErrorMessages = [{
      code: 'Error.Test2',
    }, {
      text: 'Feilet',
    }];

    const errors = getErrorMessageList.resultFunc(ownProps, allErrorMessages);

    expect(errors).to.eql(['Feilmelding 1', 'Dette er en feil', 'Feilmelding 2', 'Feilet']);
  });
});
