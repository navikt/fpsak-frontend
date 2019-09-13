import React from 'react';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import Image from '@fpsak-frontend/shared-components/src/Image';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { Hovedknapp } from 'nav-frontend-knapper';
import { CreateNewBehandlingModal } from './CreateNewBehandlingModal';

describe('<CreateNewBehandlingModal>', () => {
  const submitEventCallback = sinon.spy();
  const cancelEventCallback = sinon.spy();

  it('skal rendre komponent korrekt', () => {
    const behandlingstyper = [{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD' }];
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakeRevurderingOpprettes={sinon.spy()}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Ny behandling');
    expect(modal.prop('onRequestClose')).to.eql(cancelEventCallback);
    expect(modal.prop('onAfterOpen')).is.not.null;

    const image = modal.find(Image);
    expect(image).to.have.length(1);

    const okKnapp = modal.find(Hovedknapp);
    expect(okKnapp).to.have.length(1);
    expect(okKnapp.prop('mini')).is.true;

    const avbrytKnapp = modal.find('Knapp');
    expect(avbrytKnapp).to.have.length(1);
    expect(avbrytKnapp.prop('mini')).is.true;
    expect(avbrytKnapp.prop('onClick')).is.eql(cancelEventCallback);
  });

  it('skal bruke submit-callback når en trykker lagre', () => {
    const behandlingstyper = [{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD' }];
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={sinon.spy()}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakeRevurderingOpprettes={sinon.spy()}
    />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() { return undefined; } });
    expect(submitEventCallback.called).is.true;
  });

  it('skal lukke modal ved klikk på avbryt-knapp', () => {
    const behandlingstyper = [{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD' }];
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakeRevurderingOpprettes={sinon.spy()}
    />);

    wrapper.find('Knapp').simulate('click');
    expect(cancelEventCallback).to.have.property('callCount', 1);
  });


  it('skal vise checkbox for behandling etter klage når førstegangsbehandling er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD' }];
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakeRevurderingOpprettes={sinon.spy()}
    />);

    expect(wrapper.find('CheckboxField')).to.have.length(1);
  });


  it('skal ikke vise checkbox for behandling etter klage når dokumentinnsyn er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.DOKUMENTINNSYN, navn: 'DOKUMENTINNSYN' }];
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingType={behandlingType.DOKUMENTINNSYN}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakeRevurderingOpprettes={sinon.spy()}
    />);

    expect(wrapper.find('CheckboxField')).to.have.length(0);
  });

  it('skal vise dropdown for revuderingsårsaker når revurdering er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.REVURDERING, navn: 'REVURDERING' }];
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingType={behandlingType.REVURDERING}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakeRevurderingOpprettes={sinon.spy()}
    />);

    expect(wrapper.find('SelectField')).to.have.length(2);
  });


  it('skal ikke vise dropdown for revuderingsårsaker når dokumentinnsyn er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.DOKUMENTINNSYN, navn: 'DOKUMENTINNSYN' }];
    const wrapper = shallowWithIntl(<CreateNewBehandlingModal
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingType={behandlingType.DOKUMENTINNSYN}
      behandlingArsakTyper={[]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakeRevurderingOpprettes={sinon.spy()}
    />);

    expect(wrapper.find('SelectField')).to.have.length(1);
  });
});
