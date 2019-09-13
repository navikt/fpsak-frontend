import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';

import { CheckboxField, SelectField } from '@fpsak-frontend/form';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import { CreateNewBehandlingModal, getBehandlingAarsaker, getBehandlingTyper } from './CreateNewBehandlingModal';

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
    expect(modal.prop('contentLabel')).to.eql('Ny behandling');
    expect(modal.prop('onRequestClose')).to.eql(cancelEventCallback);
    expect(modal.prop('onAfterOpen')).is.not.null;
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

    wrapper.find(Knapp).simulate('click');
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

    expect(wrapper.find(CheckboxField)).to.have.length(1);
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

    expect(wrapper.find(CheckboxField)).to.have.length(0);
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

    expect(wrapper.find(SelectField)).to.have.length(2);
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

    expect(wrapper.find(SelectField)).to.have.length(1);
  });

  it('skal finne filtrerte og sorterte behandlingsårsaker når det er valgt behandlingstype TILBAKEKREVING_REVURDERING', () => {
    const isForeldrepengerFagsak = true;
    const isSvangerskapFagsak = false;
    const behandlingArsakerFpSak = [];
    const behandlingArsakerFpTilbake = [{
      kode: behandlingArsakType.RE_KLAGE_KA,
      navn: 'RE_KLAGE_KA',
    }, {
      kode: behandlingArsakType.RE_KLAGE_NFP,
      navn: 'RE_KLAGE_KA',
    }, {
      kode: behandlingArsakType.RE_VILKÅR,
      navn: 'Nye opplysninger om vilkårsvurdering',
    }, {
      kode: behandlingArsakType.RE_FORELDELSE,
      navn: 'Nye opplysninger om foreldelse',
    }];
    const bType = behandlingType.TILBAKEKREVING_REVURDERING;

    const res = getBehandlingAarsaker.resultFunc(isForeldrepengerFagsak, isSvangerskapFagsak, behandlingArsakerFpSak, behandlingArsakerFpTilbake, bType);

    expect(res).is.eql([behandlingArsakerFpTilbake[3], behandlingArsakerFpTilbake[2]]);
  });

  it('skal finne filtrerte og sorterte behandlingsårsaker når det er valgt behandlingstype REVURDERING', () => {
    const isForeldrepengerFagsak = false;
    const isSvangerskapFagsak = false;
    const behandlingArsakerFpSak = [{
      kode: behandlingArsakType.ANNET,
      navn: 'annet',
    }, {
      kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
      navn: 'feil i lovandvendelse',
    }, {
      kode: behandlingArsakType.FEIL_ELLER_ENDRET_FAKTA,
      navn: 'feil eller endret fakta',
    }, {
      kode: behandlingArsakType.FEIL_REGELVERKSFORSTAELSE,
      navn: 'feil regelverksforstaelse',
    }, {
      kode: behandlingArsakType.FEIL_PROSESSUELL,
      navn: 'feil prosessuell',
    }];
    const behandlingArsakerFpTilbake = [];
    const bType = behandlingType.REVURDERING;

    const res = getBehandlingAarsaker.resultFunc(isForeldrepengerFagsak, isSvangerskapFagsak, behandlingArsakerFpSak, behandlingArsakerFpTilbake, bType);

    expect(res).is.eql([
      behandlingArsakerFpSak[0],
      behandlingArsakerFpSak[2],
      behandlingArsakerFpSak[1],
      behandlingArsakerFpSak[4],
      behandlingArsakerFpSak[3],
    ]);
  });

  it('skal finne filtrere og sortere behandlingstyper for kun fpsak', () => {
    const behandlingtyperFpSak = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: 'tilbakekreving',
    }, {
      kode: behandlingType.REVURDERING,
      navn: 'revurdering',
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'forstegangssoknad',
    }];
    const behandlingtyperFpTilbake = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: 'tilbakekreving',
    }];
    const aktiverTilbakekreving = false;

    const res = getBehandlingTyper.resultFunc(behandlingtyperFpSak, behandlingtyperFpTilbake, aktiverTilbakekreving);

    expect(res).is.eql([
      behandlingtyperFpSak[2],
      behandlingtyperFpSak[1],
    ]);
  });

  it('skal finne filtrere og sortere behandlingstyper for både fpsak og fptilbake', () => {
    const behandlingtyperFpSak = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: 'tilbakekreving',
    }, {
      kode: behandlingType.REVURDERING,
      navn: 'revurdering',
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'forstegangssoknad',
    }];
    const behandlingtyperFpTilbake = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: 'tilbakekreving',
    }];
    const aktiverTilbakekreving = true;

    const res = getBehandlingTyper.resultFunc(behandlingtyperFpSak, behandlingtyperFpTilbake, aktiverTilbakekreving);

    expect(res).is.eql([
      behandlingtyperFpSak[2],
      behandlingtyperFpSak[1],
      behandlingtyperFpTilbake[0],
    ]);
  });
});
