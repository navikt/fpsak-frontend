import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { MessagesImpl as Messages } from './Messages';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-meldinger';

const mockProps = {
  setRecipient: () => undefined,
  setTemplate: () => undefined,
  updateModel: () => undefined,
  previewCallback: () => undefined,
  submitCallback: () => undefined,
  validateModel: () => undefined,
  isSubmitting: false,
  intl: intlMock,
  ...reduxFormPropsMock,
};

describe('<Messages>', () => {
  const recipients = ['Søker', 'Annen person'];

  const sprakkode = {
    kode: 'en',
    navn: 'Engelsk',
  };

  const templates = [
    { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
    { kode: 'Mal2', navn: 'Mal 2', tilgjengelig: true },
    { kode: 'Mal3', navn: 'Mal 3', tilgjengelig: true },
  ];

  const model = {
    mottaker: 'Søker',
    brevmalkode: 'Mal1',
  };

  const causes = [
    { kode: 'kode', navn: 'Årsak 1', kodeverk: 'kode' },
  ];

  it('skal vise to select-bokser', () => {
    const wrapper = shallowWithIntl(<Messages
      {...mockProps}
      recipients={recipients}
      templates={templates}
      sprakKode={sprakkode}
      causes={causes}
      model={model}
    />);

    const form = wrapper.find('form');
    const selectFields = form.find('SelectField');
    expect(selectFields).to.have.length(2);

    const recipientSelect = selectFields.findWhere((selectField) => selectField.prop('name') === 'mottaker');
    expect(recipientSelect).to.have.length(1);
    expect(recipientSelect.prop('selectValues')).to.have.length(2);

    const templateSelect = selectFields.findWhere((selectField) => selectField.prop('name') === 'brevmalkode');
    expect(templateSelect).to.have.length(1);
    expect(templateSelect.prop('selectValues')).to.have.length(3);
  });

  it('skal vise forhåndvisningslenke når fritekst er gyldig', () => {
    const previewEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<Messages
      {...mockProps}
      recipients={recipients}
      templates={templates}
      sprakKode={sprakkode}
      model={model}
      causes={causes}
      previewCallback={previewEventCallback}
      fritekst="Dokument"
    />);

    const previewLink = wrapper.find('a');
    expect(previewLink).to.have.length(1);
    expect(previewLink.text()).to.eql('Forhåndsvis');

    expect(previewEventCallback.called).is.false;
    previewLink.simulate('click', { preventDefault: sinon.spy() });
    expect(previewEventCallback.called).is.true;
  });

  it('skal vise tre select-bokser når varsel om revurdering', () => {
    const previewEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<Messages
      {...mockProps}
      recipients={recipients}
      templates={templates}
      sprakKode={sprakkode}
      brevmalkode="REVURD"
      model={model}
      causes={causes}
      previewCallback={previewEventCallback}
      fritekst="Dokument"
    />);

    const form = wrapper.find('form');
    const selectFields = form.find('SelectField');
    expect(selectFields).to.have.length(3);

    const recipientSelect = selectFields.findWhere((selectField) => selectField.prop('name') === 'mottaker');
    expect(recipientSelect).to.have.length(1);
    expect(recipientSelect.prop('selectValues')).to.have.length(2);

    const templateSelect = selectFields.findWhere((selectField) => selectField.prop('name') === 'brevmalkode');
    expect(templateSelect).to.have.length(1);
    expect(templateSelect.prop('selectValues')).to.have.length(3);
  });
});
