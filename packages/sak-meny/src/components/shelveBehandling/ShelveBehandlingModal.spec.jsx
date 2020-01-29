import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { getHenleggArsaker, ShelveBehandlingModalImpl } from './ShelveBehandlingModal';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-sak-meny';

describe('<ShelveBehandlingModal>', () => {
  const henleggArsaker = [{
    kode: 'HENLAGT_SØKNAD_TRUKKET',
  },
  {
    kode: 'HENLAGT_FEILOPPRETTET',
  }, {
    kode: 'MANGLER_BEREGNINGSREGLER',
  },
  ];

  it('skal rendre åpen modal', () => {
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      henleggArsaker={henleggArsaker}
      behandlingTypeKode="BT-002"
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
      showLink={false}
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingUuid="123"
      behandlingId={123}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Behandlingen henlegges');

    const button = wrapper.find('Hovedknapp');
    expect(button).to.have.length(1);
    expect(button.prop('disabled')).is.false;

    const previewLink = wrapper.find('a');
    expect(previewLink).to.have.length(0);
  });

  it('skal rendre lukket modal', () => {
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal={false}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      henleggArsaker={henleggArsaker}
      behandlingTypeKode="BT-002"
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
      showLink
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingUuid="123"
      behandlingId={123}
    />);

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.false;
  });

  it('skal vise nedtrekksliste med behandlingsresultat-typer', () => {
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      henleggArsaker={henleggArsaker}
      behandlingTypeKode="BT-002"
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
      showLink
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingUuid="123"
      behandlingId={123}
    />);

    const selectField = wrapper.find('SelectField');
    expect(selectField).to.have.length(1);
    expect(selectField.prop('placeholder')).is.eql('Velg årsak til henleggelse');
    const values = selectField.prop('selectValues');
    expect(values[0].props.value).is.eql(behandlingResultatType.HENLAGT_SOKNAD_TRUKKET);
    expect(values[1].props.value).is.eql(behandlingResultatType.HENLAGT_FEILOPPRETTET);
    expect(values[2].props.value).is.eql(behandlingResultatType.MANGLER_BEREGNINGSREGLER);
    expect(values).to.have.length(3);
  });

  const behandlingResultatTyper = [{
    kode: behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
  }, {
    kode: behandlingResultatType.HENLAGT_FEILOPPRETTET,
  }, {
    kode: behandlingResultatType.HENLAGT_INNSYN_TRUKKET,
  }, {
    kode: behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
  }, {
    kode: behandlingResultatType.HENLAGT_SOKNAD_MANGLER,
  }, {
    kode: behandlingResultatType.MANGLER_BEREGNINGSREGLER,
  }];

  it('skal bruke behandlingsresultat-typer for klage', () => {
    const behandlingsType = { kode: behandlingType.KLAGE };
    const resultat = getHenleggArsaker.resultFunc(behandlingResultatTyper, behandlingsType);
    expect(resultat.map((r) => r.kode)).is.eql([behandlingResultatType.HENLAGT_KLAGE_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET]);
  });

  it('skal bruke behandlingsresultat-typer for innsyn', () => {
    const behandlingsType = { kode: behandlingType.DOKUMENTINNSYN };
    const resultat = getHenleggArsaker.resultFunc(behandlingResultatTyper, behandlingsType);
    expect(resultat.map((r) => r.kode)).is.eql([behandlingResultatType.HENLAGT_INNSYN_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET]);
  });

  it('skal bruke behandlingsresultat-typer for tilbakekreving', () => {
    const behandlingsType = { kode: behandlingType.TILBAKEKREVING };
    const resultat = getHenleggArsaker.resultFunc(behandlingResultatTyper, behandlingsType);
    expect(resultat.map((r) => r.kode)).is.eql([behandlingResultatType.HENLAGT_FEILOPPRETTET]);
  });

  it('skal bruke behandlingsresultat-typer for revudering', () => {
    const behandlingsType = { kode: behandlingType.REVURDERING };
    const resultat = getHenleggArsaker.resultFunc(behandlingResultatTyper, behandlingsType);
    expect(resultat.map((r) => r.kode)).is.eql([behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET,
      behandlingResultatType.HENLAGT_SOKNAD_MANGLER]);
  });

  it('skal bruke behandlingsresultat-typer for førstegangsbehandling', () => {
    const behandlingsType = { kode: behandlingType.FORSTEGANGSSOKNAD };
    const resultat = getHenleggArsaker.resultFunc(behandlingResultatTyper, behandlingsType);
    expect(resultat.map((r) => r.kode)).is.eql([behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET,
      behandlingResultatType.HENLAGT_SOKNAD_MANGLER, behandlingResultatType.MANGLER_BEREGNINGSREGLER]);
  });

  it('skal disable knapp for lagring når behandlingsresultat-type og begrunnnelse ikke er valgt', () => {
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      henleggArsaker={henleggArsaker}
      behandlingTypeKode="BT-002"
      intl={intlMock}
      showLink
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingUuid="123"
      behandlingId={123}
    />);

    const button = wrapper.find('Hovedknapp');
    expect(button.prop('disabled')).is.true;
  });

  it('skal bruke submit-callback når en trykker lagre', () => {
    const submitEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      henleggArsaker={henleggArsaker}
      behandlingTypeKode="BT-002"
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
      showLink
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingUuid="123"
      behandlingId={123}
    />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() { return undefined; } });
    expect(submitEventCallback.called).is.true;
  });

  it('skal avbryte redigering ved trykk på avbryt-knapp', () => {
    const cancelEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      previewHenleggBehandling={sinon.spy()}
      henleggArsaker={henleggArsaker}
      behandlingTypeKode="BT-002"
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
      showLink
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingUuid="123"
      behandlingId={123}
    />);

    const avbrytKnapp = wrapper.find('Knapp');
    expect(avbrytKnapp).to.have.length(1);
    expect(avbrytKnapp.prop('mini')).is.true;

    avbrytKnapp.simulate('click');
    expect(cancelEventCallback.called).is.true;
  });


  it('skal vise forhåndvisningslenke når søknad om henleggelse er trukket', () => {
    const previewEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={previewEventCallback}
      henleggArsaker={henleggArsaker}
      behandlingTypeKode="BT-002"
      årsakKode={behandlingResultatType.HENLAGT_SOKNAD_TRUKKET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
      showLink
      ytelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
      }}
      behandlingUuid="123"
      behandlingId={123}
    />);

    const previewLink = wrapper.find('a');
    expect(previewLink).to.have.length(1);
    expect(previewLink.text()).to.eql('Forhåndsvis brev');

    expect(previewEventCallback.called).is.false;
    previewLink.simulate('click', { preventDefault: sinon.spy() });
    expect(previewEventCallback.called).is.true;
  });
});
