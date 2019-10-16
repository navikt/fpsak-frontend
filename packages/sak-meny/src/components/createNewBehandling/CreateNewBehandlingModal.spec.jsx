import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { CheckboxField, SelectField } from '@fpsak-frontend/form';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import MenyKodeverk from '../../MenyKodeverk';
import {
  CreateNewBehandlingModal, getBehandlingAarsaker, getBehandlingTyper, getEnabledBehandlingstyper,
} from './CreateNewBehandlingModal';

describe('<CreateNewBehandlingModal>', () => {
  const submitEventCallback = sinon.spy();
  const cancelEventCallback = sinon.spy();
  const menyKodeverk = new MenyKodeverk({ kode: behandlingType.FORSTEGANGSSOKNAD })
    .medFpSakKodeverk({})
    .medFpTilbakeKodeverk({});

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
      kanTilbakekrevingOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      menyKodeverk={menyKodeverk}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).to.eql('CreateNewBehandlingModal.ModalDescription');
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
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={menyKodeverk}
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
      kanTilbakekrevingOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      saksnummer={123}
      menyKodeverk={menyKodeverk}
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
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={menyKodeverk}
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
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={menyKodeverk}
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
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={menyKodeverk}
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
      kanTilbakekrevingOpprettes={sinon.spy()}
      sjekkOmTilbakekrevingKanOpprettes={sinon.spy()}
      erTilbakekrevingAktivert={false}
      saksnummer={123}
      menyKodeverk={menyKodeverk}
    />);

    expect(wrapper.find(SelectField)).to.have.length(1);
  });

  it('skal finne filtrerte behandlingsårsaker når det er valgt behandlingstype TILBAKEKREVING_REVURDERING', () => {
    const ytelseType = {
      kode: fagsakYtelseType.FORELDREPENGER,
    };
    const behandlingArsakerFpSak = [];
    const behandlingArsakerFpTilbake = {
      [kodeverkTyper.BEHANDLING_AARSAK]: [{
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
      }],
    };
    const bType = behandlingType.TILBAKEKREVING_REVURDERING;

    const kodeverk = new MenyKodeverk(bType)
      .medFpSakKodeverk(behandlingArsakerFpSak)
      .medFpTilbakeKodeverk(behandlingArsakerFpTilbake);

    const res = getBehandlingAarsaker.resultFunc(ytelseType, kodeverk, bType);

    expect(res).to.deep.include.members([
      behandlingArsakerFpTilbake[kodeverkTyper.BEHANDLING_AARSAK][3],
      behandlingArsakerFpTilbake[kodeverkTyper.BEHANDLING_AARSAK][2]]);
  });

  it('skal finne filtrerte behandlingsårsaker når det er valgt behandlingstype REVURDERING', () => {
    const ytelseType = {
      kode: fagsakYtelseType.REVURDERING,
    };
    const behandlingArsakerFpSak = {
      [kodeverkTyper.BEHANDLING_AARSAK]: [{
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
      }],
    };
    const behandlingArsakerFpTilbake = [];
    const bType = behandlingType.REVURDERING;
    const kodeverk = new MenyKodeverk(bType)
      .medFpSakKodeverk(behandlingArsakerFpSak)
      .medFpTilbakeKodeverk(behandlingArsakerFpTilbake);

    const res = getBehandlingAarsaker.resultFunc(ytelseType, kodeverk, bType);

    const aarsaker = behandlingArsakerFpSak[kodeverkTyper.BEHANDLING_AARSAK];
    expect(res).to.deep.include.members([
      aarsaker[0],
      aarsaker[2],
      aarsaker[1],
      aarsaker[4],
      aarsaker[3],
    ]);
  });

  it('skal finne filtrere behandlingstyper for kun fpsak', () => {
    const kodeverkFpSak = {
      [kodeverkTyper.BEHANDLING_TYPE]: [{
        kode: behandlingType.TILBAKEKREVING,
        navn: 'tilbakekreving',
      }, {
        kode: behandlingType.REVURDERING,
        navn: 'revurdering',
      }, {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'forstegangssoknad',
      }],
    };
    const kodeverkFpTilbake = {
      [kodeverkTyper.BEHANDLING_TYPE]: [{
        kode: behandlingType.TILBAKEKREVING,
        navn: 'tilbakekreving',
      }],
    };
    const kodeverk = new MenyKodeverk({ kode: behandlingType.FORSTEGANGSSOKNAD })
      .medFpSakKodeverk(kodeverkFpSak)
      .medFpTilbakeKodeverk(kodeverkFpTilbake);

    const res = getBehandlingTyper.resultFunc(kodeverk);

    expect(res).to.deep.include.members([
      kodeverkFpSak[kodeverkTyper.BEHANDLING_TYPE][2],
      kodeverkFpSak[kodeverkTyper.BEHANDLING_TYPE][1],
    ]);
  });

  it('skal finne filtrere behandlingstyper for både fpsak og fptilbake', () => {
    const behandlingtyperFpSak = {
      [kodeverkTyper.BEHANDLING_TYPE]: [{
        kode: behandlingType.TILBAKEKREVING,
        navn: 'tilbakekreving',
      }, {
        kode: behandlingType.REVURDERING,
        navn: 'revurdering',
      }, {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'forstegangssoknad',
      }],
    };
    const behandlingtyperFpTilbake = {
      [kodeverkTyper.BEHANDLING_TYPE]: [{
        kode: behandlingType.TILBAKEKREVING,
        navn: 'tilbakekreving',
      }],
    };
    const kodeverk = new MenyKodeverk({ kode: behandlingType.FORSTEGANGSSOKNAD })
      .medFpSakKodeverk(behandlingtyperFpSak)
      .medFpTilbakeKodeverk(behandlingtyperFpTilbake);

    const res = getBehandlingTyper.resultFunc(kodeverk);

    expect(res).to.deep.include.members([
      behandlingtyperFpSak[kodeverkTyper.BEHANDLING_TYPE][2],
      behandlingtyperFpSak[kodeverkTyper.BEHANDLING_TYPE][1],
      behandlingtyperFpTilbake[kodeverkTyper.BEHANDLING_TYPE][0],
    ]);
  });

  it('skal filtrere bort tilbakekreving når denne ikke kan lages', () => {
    const behandlingstyper = [{
      kode: behandlingType.TILBAKEKREVING,
    }, {
      kode: behandlingType.TILBAKEKREVING_REVURDERING,
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
    }, {
      kode: behandlingType.REVURDERING,
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
    }, {
      kode: behandlingType.TILBAKEKREVING_REVURDERING,
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
    }, {
      kode: behandlingType.REVURDERING,
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
    }, {
      kode: behandlingType.TILBAKEKREVING_REVURDERING,
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
    }, {
      kode: behandlingType.REVURDERING,
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
    }, {
      kode: behandlingType.TILBAKEKREVING_REVURDERING,
    }, {
      kode: behandlingType.FORSTEGANGSSOKNAD,
    }, {
      kode: behandlingType.REVURDERING,
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
