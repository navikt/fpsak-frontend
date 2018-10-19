import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import { expect } from 'chai';

import { LukkPapirSoknadModal } from './LukkPapirsoknadModal';

describe('<LukkPapirSoknadModal>', () => {
  const onChangeEventCallback = sinon.spy();
  const submitEventCallback = sinon.spy();
  const cancelEventCallback = sinon.spy();
  const form = 'TEST';

  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<LukkPapirSoknadModal
      showModal
      onChangeEvent={onChangeEventCallback}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      form={form}
    />);

    const modal = wrapper.find('Modal');
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Registrering av søknaden avsluttes');
    expect(modal.prop('onRequestClose')).to.eql(cancelEventCallback);
    expect(modal.prop('onAfterOpen')).is.not.null;

    const image = modal.find('InjectIntl(Image)');
    expect(image).to.have.length(1);

    const okKnapp = modal.find('Hovedknapp');
    expect(okKnapp).to.have.length(1);
    expect(okKnapp.prop('mini')).is.true;

    const avbrytKnapp = modal.find('Knapp');
    expect(avbrytKnapp).to.have.length(1);
    expect(avbrytKnapp.prop('mini')).is.true;
    expect(avbrytKnapp.prop('onClick')).is.eql(cancelEventCallback);
  });

  it('skal kalle submit ved klikk på ok-knapp', () => {
    const wrapper = shallowWithIntl(<LukkPapirSoknadModal
      showModal
      onChangeEvent={onChangeEventCallback}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      form="TEST"
    />);

    wrapper.find('Hovedknapp').simulate('click');
    expect(submitEventCallback).to.have.property('callCount', 1);
  });

  it('skal lukke modal ved klikk på avbryt-knapp', () => {
    const wrapper = shallowWithIntl(<LukkPapirSoknadModal
      showModal
      onChangeEvent={onChangeEventCallback}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      form="TEST"
    />);

    wrapper.find('Knapp').simulate('click');
    expect(cancelEventCallback).to.have.property('callCount', 1);
  });
});
