import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Undertekst } from 'nav-frontend-typografi';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';
import { ErrorMessagePanel } from './ErrorMessagePanel';
import shallowWithIntl from '../i18n/intl-enzyme-test-helper-sak-dekorator';

describe('<ErrorMessagePanel>', () => {
  it('skal vise feilmelding med ikke lenke for å vise detaljert info', () => {
    const wrapper = shallowWithIntl(<ErrorMessagePanel
      intl={intlMock}
      showDetailedErrorMessages={false}
      errorMessages={[{
        message: 'Error!',
        additionalInfo: undefined,
      }]}
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
      showDetailedErrorMessages={false}
      errorMessages={[{
        message: 'Høna &amp; egget og &#34;test1&#34; og &#39;test2&#39;',
        additionalInfo: undefined,
      }]}
      removeErrorMessage={() => undefined}
    />);

    const div = wrapper.find(Undertekst);
    expect(div).to.have.length(1);
    expect(div.childAt(0).text()).to.eql('Høna & egget og "test1" og \'test2\' ');
  });

  it('skal vise lenke for å se feildetaljer når dette er konfigurert og en har info', () => {
    const wrapper = shallowWithIntl(<ErrorMessagePanel
      intl={intlMock}
      showDetailedErrorMessages
      errorMessages={[{
        message: 'Høna &amp; egget og &#34;test1&#34; og &#39;test2&#39;',
        additionalInfo: {
          feilmelding: 'Dette er ein feilmelding',
          url: 'www.test.no',
        },
      }]}
      removeErrorMessage={() => undefined}
    />);

    expect(wrapper.find('a')).to.have.length(1);
    expect(wrapper.find(ErrorMessageDetailsModal)).to.have.length(0);
  });

  it('skal åpne, og så lukke, modal for visning av feildetaljer ved klikk på lenke', () => {
    const wrapper = shallowWithIntl(<ErrorMessagePanel
      intl={intlMock}
      showDetailedErrorMessages
      errorMessages={[{
        message: 'Høna &amp; egget og &#34;test1&#34; og &#39;test2&#39;',
        additionalInfo: {
          feilmelding: 'Dette er ein feilmelding',
          url: 'www.test.no',
        },
      }]}
      removeErrorMessage={() => undefined}
    />);

    const link = wrapper.find('a');
    link.simulate('click', { preventDefault: sinon.spy() });

    const modal = wrapper.find(ErrorMessageDetailsModal);
    expect(modal).to.have.length(1);
    expect(modal.prop('showModal')).is.true;
    expect(modal.prop('errorDetails')).is.eql({
      feilmelding: 'Dette er ein feilmelding',
      url: 'www.test.no',
    });

    modal.prop('closeModalFn')({
      preventDefault: sinon.spy(),
    });

    expect(wrapper.find(ErrorMessageDetailsModal)).to.have.length(0);
  });
});
