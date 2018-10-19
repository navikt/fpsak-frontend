import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import { expect } from 'chai';

import behandlingType from 'kodeverk/behandlingType';
import behandlingArsakType from 'kodeverk/behandlingArsakType';
import { CreateNewBehandlingModal } from './CreateNewBehandlingModal';

describe('<CreateNewBehandlingModal>', () => {
  const submitEventCallback = sinon.spy();
  const cancelEventCallback = sinon.spy();

  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={[{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD' }]}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      hasEnabledCreateNewBehandling
      hasEnabledCreateRevurdering
    />);

    const modal = wrapper.find('Modal');
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Ny behandling');
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

  it('skal bruke submit-callback når en trykker lagre', () => {
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={sinon.spy()}
      intl={intlMock}
      behandlingTyper={[{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD' }]}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      hasEnabledCreateNewBehandling
      hasEnabledCreateRevurdering
    />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() {} });
    expect(submitEventCallback.called).is.true;
  });

  it('skal lukke modal ved klikk på avbryt-knapp', () => {
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={[{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD' }]}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      hasEnabledCreateNewBehandling
      hasEnabledCreateRevurdering
    />);

    wrapper.find('Knapp').simulate('click');
    expect(cancelEventCallback).to.have.property('callCount', 1);
  });


  it('skal vise checkbox for behandling etter klage når førstegangsbehandling er valgt', () => {
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={[{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD' }]}
      behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      hasEnabledCreateNewBehandling
      hasEnabledCreateRevurdering
    />);

    expect(wrapper.find('CheckboxField')).to.have.length(1);
  });


  it('skal ikke vise checkbox for behandling etter klage når dokumentinnsyn er valgt', () => {
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={[{ kode: behandlingType.DOKUMENTINNSYN, navn: 'DOKUMENTINNSYN' }]}
      behandlingType={behandlingType.DOKUMENTINNSYN}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      hasEnabledCreateNewBehandling
      hasEnabledCreateRevurdering
    />);

    expect(wrapper.find('CheckboxField')).to.have.length(0);
  });

  it('skal vise dropdown for revuderingsårsaker når revurdering er valgt', () => {
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={[{ kode: behandlingType.REVURDERING, navn: 'REVURDERING' }]}
      behandlingType={behandlingType.REVURDERING}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      hasEnabledCreateNewBehandling
      hasEnabledCreateRevurdering
    />);

    expect(wrapper.find('SelectField')).to.have.length(2);
  });


  it('skal ikke vise dropdown for revuderingsårsaker når dokumentinnsyn er valgt', () => {
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={[{ kode: behandlingType.DOKUMENTINNSYN, navn: 'DOKUMENTINNSYN' }]}
      behandlingType={behandlingType.DOKUMENTINNSYN}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      hasEnabledCreateNewBehandling
      hasEnabledCreateRevurdering
    />);

    expect(wrapper.find('SelectField')).to.have.length(1);
  });
});
