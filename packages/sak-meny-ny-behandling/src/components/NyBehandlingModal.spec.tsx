import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { CheckboxField, SelectField } from '@fpsak-frontend/form';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import {
  NyBehandlingModal, getBehandlingAarsaker, getBehandlingTyper, getEnabledBehandlingstyper,
} from './NyBehandlingModal';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-meny';

describe('<CreateNewBehandlingModal>', () => {
  const submitEventCallback = sinon.spy();
  const cancelEventCallback = sinon.spy();

  it('skal rendre komponent korrekt', () => {
    const behandlingstyper = [{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD', kodeverk: 'BEHANDLING_TYPE' }];
    const wrapper = shallowWithIntl(<NyBehandlingModal
      {...reduxFormPropsMock}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' }]}
      enabledBehandlingstyper={behandlingstyper}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).to.eql('Ny behandling');
    expect(modal.prop('onRequestClose')).to.eql(cancelEventCallback);
    expect(modal.prop('onAfterOpen')).is.not.null;
  });

  it('skal bruke submit-callback når en trykker lagre', () => {
    const behandlingstyper = [{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD', kodeverk: 'BEHANDLING_TYPE' }];
    const wrapper = shallowWithIntl(<NyBehandlingModal
      {...reduxFormPropsMock}
      handleSubmit={submitEventCallback}
      cancelEvent={sinon.spy()}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={{}}
    />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() { return undefined; } });
    expect(submitEventCallback.called).is.true;
  });

  it('skal lukke modal ved klikk på avbryt-knapp', () => {
    const behandlingstyper = [{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD', kodeverk: 'BEHANDLING_TYPE' }];
    const wrapper = shallowWithIntl(<NyBehandlingModal
      {...reduxFormPropsMock}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakekrevingOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      saksnummer={123}
      menyKodeverk={{}}
    />);

    wrapper.find(Knapp).simulate('click');
    expect(cancelEventCallback).to.have.property('callCount', 1);
  });


  it('skal vise checkbox for behandling etter klage når førstegangsbehandling er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.FORSTEGANGSSOKNAD, navn: 'FØRSTEGANGSSØKNAD', kodeverk: 'BEHANDLING_TYPE' }];
    const wrapper = shallowWithIntl(<NyBehandlingModal
      {...reduxFormPropsMock}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={{}}
    />);

    expect(wrapper.find(CheckboxField)).to.have.length(1);
  });


  it('skal ikke vise checkbox for behandling etter klage når dokumentinnsyn er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.DOKUMENTINNSYN, navn: 'DOKUMENTINNSYN', kodeverk: 'BEHANDLING_TYPE' }];
    const wrapper = shallowWithIntl(<NyBehandlingModal
      {...reduxFormPropsMock}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingType={behandlingType.DOKUMENTINNSYN}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={{}}
    />);

    expect(wrapper.find(CheckboxField)).to.have.length(0);
  });

  it('skal vise dropdown for revuderingsårsaker når revurdering er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.REVURDERING, navn: 'REVURDERING', kodeverk: 'BEHANDLING_TYPE' }];
    const wrapper = shallowWithIntl(<NyBehandlingModal
      {...reduxFormPropsMock}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingType={behandlingType.REVURDERING}
      behandlingArsakTyper={[{ kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE, navn: 'FEIL_I_LOVANDVENDELSE', kodeverk: 'ARSAK' }]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={{}}
    />);

    expect(wrapper.find(SelectField)).to.have.length(2);
  });

  it('skal ikke vise dropdown for revuderingsårsaker når dokumentinnsyn er valgt', () => {
    const behandlingstyper = [{ kode: behandlingType.DOKUMENTINNSYN, navn: 'DOKUMENTINNSYN', kodeverk: 'BEHANDLING_TYPE' }];
    const wrapper = shallowWithIntl(<NyBehandlingModal
      {...reduxFormPropsMock}
      handleSubmit={submitEventCallback}
      cancelEvent={cancelEventCallback}
      intl={intlMock}
      behandlingTyper={behandlingstyper}
      behandlingType={behandlingType.DOKUMENTINNSYN}
      behandlingArsakTyper={[]}
      enabledBehandlingstyper={behandlingstyper}
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={{}}
    />);

    expect(wrapper.find(SelectField)).to.have.length(1);
  });

  it('skal finne filtrerte behandlingsårsaker når det er valgt behandlingstype TILBAKEKREVING_REVURDERING', () => {
    const ytelseType = {
      kode: fagsakYtelseType.FORELDREPENGER,
    };
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

    const behandlingArsakerFpSak = [];

    const res = getBehandlingAarsaker.resultFunc(ytelseType, behandlingArsakerFpSak, behandlingArsakerFpTilbake, bType);

    expect(res).to.deep.include.members([
      behandlingArsakerFpTilbake[3],
      behandlingArsakerFpTilbake[2]]);
  });

  it('skal finne filtrerte behandlingsårsaker når det er valgt behandlingstype REVURDERING', () => {
    const ytelseType = {
      kode: fagsakYtelseType.REVURDERING,
    };
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
    const bType = behandlingType.REVURDERING;
    const behandlingArsakerFpTilbake = [];

    const res = getBehandlingAarsaker.resultFunc(ytelseType, behandlingArsakerFpSak, behandlingArsakerFpTilbake, bType);

    expect(res).to.deep.include.members([
      behandlingArsakerFpSak[0],
      behandlingArsakerFpSak[2],
      behandlingArsakerFpSak[1],
      behandlingArsakerFpSak[4],
      behandlingArsakerFpSak[3],
    ]);
  });

  it('skal finne filtrere behandlingstyper for kun fpsak', () => {
    const kodeverkFpSak = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: 'tilbakekreving',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.REVURDERING,
      navn: 'revurdering',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: 'forstegangssoknad',
      kodeverk: 'BEHANDLING_TYPE',
    }];

    const res = getBehandlingTyper.resultFunc(kodeverkFpSak);

    expect(res).to.deep.include.members([
      kodeverkFpSak[2],
      kodeverkFpSak[1],
    ]);
  });

  it('skal filtrere bort tilbakekreving når denne ikke kan lages', () => {
    const behandlingstyper = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.TILBAKEKREVING_REVURDERING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.REVURDERING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }];
    const hasEnabledCreateNewBehandling = true;
    const hasEnabledCreateRevurdering = true;
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: false,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper.resultFunc(
      behandlingstyper, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, kanTilbakekrevingOpprettes,
    );

    expect(res).is.eql([
      behandlingstyper[1],
      behandlingstyper[2],
      behandlingstyper[3],
    ]);
  });

  it('skal filtrere bort tilbakekreving-revurdering når denne ikke kan lages', () => {
    const behandlingstyper = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.TILBAKEKREVING_REVURDERING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.REVURDERING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }];
    const hasEnabledCreateNewBehandling = true;
    const hasEnabledCreateRevurdering = true;
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: false,
    };

    const res = getEnabledBehandlingstyper.resultFunc(
      behandlingstyper, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, kanTilbakekrevingOpprettes,
    );

    expect(res).is.eql([
      behandlingstyper[0],
      behandlingstyper[2],
      behandlingstyper[3],
    ]);
  });

  it('skal filtrere bort førstegangsbehandling når denne ikke kan lages', () => {
    const behandlingstyper = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.TILBAKEKREVING_REVURDERING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.REVURDERING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }];
    const hasEnabledCreateNewBehandling = false;
    const hasEnabledCreateRevurdering = true;
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper.resultFunc(
      behandlingstyper, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, kanTilbakekrevingOpprettes,
    );

    expect(res).is.eql([
      behandlingstyper[0],
      behandlingstyper[1],
      behandlingstyper[3],
    ]);
  });

  it('skal filtrere bort revurdering når denne ikke kan lages', () => {
    const behandlingstyper = [{
      kode: behandlingType.TILBAKEKREVING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.TILBAKEKREVING_REVURDERING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }, {
      kode: behandlingType.REVURDERING,
      navn: '',
      kodeverk: 'BEHANDLING_TYPE',
    }];
    const hasEnabledCreateNewBehandling = true;
    const hasEnabledCreateRevurdering = false;
    const kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: true,
      kanRevurderingOpprettes: true,
    };

    const res = getEnabledBehandlingstyper.resultFunc(
      behandlingstyper, hasEnabledCreateNewBehandling, hasEnabledCreateRevurdering, kanTilbakekrevingOpprettes,
    );

    expect(res).is.eql([
      behandlingstyper[0],
      behandlingstyper[1],
      behandlingstyper[2],
    ]);
  });
});
