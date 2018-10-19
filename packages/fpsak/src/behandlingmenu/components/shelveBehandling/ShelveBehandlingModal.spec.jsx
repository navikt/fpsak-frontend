import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import behandlingResultatType from 'kodeverk/behandlingResultatType';
import { ShelveBehandlingModalImpl } from './ShelveBehandlingModal';

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

  const behandlingstype = {
    kode: 'BT-002',
  };

  it('skal rendre åpen modal', () => {
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      behandlingId={0}
      henleggArsaker={henleggArsaker}
      behandlingsType={behandlingstype}
      henleggArsakerResultReceived
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const modal = wrapper.find('Modal');
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
      behandlingId={0}
      henleggArsaker={henleggArsaker}
      behandlingsType={behandlingstype}
      henleggArsakerResultReceived
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const modal = wrapper.find('Modal');
    expect(modal.prop('isOpen')).is.false;
  });

  it('skal vise nedtrekksliste med behandlingsresultat-typer', () => {
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      behandlingId={0}
      henleggArsaker={henleggArsaker}
      behandlingsType={behandlingstype}
      henleggArsakerResultReceived
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
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

  it('skal vise nedtrekksliste med behandlingsresultat-typer', () => {
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      behandlingId={0}
      henleggArsaker={henleggArsaker}
      behandlingsType={{ kode: 'BT-004' }}
      henleggArsakerResultReceived
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const selectField = wrapper.find('SelectField');
    expect(selectField).to.have.length(1);
    expect(selectField.prop('placeholder')).is.eql('Velg årsak til henleggelse');
    const values = selectField.prop('selectValues');
    expect(values[0].props.value).is.eql(behandlingResultatType.HENLAGT_SOKNAD_TRUKKET);
    expect(values[1].props.value).is.eql(behandlingResultatType.HENLAGT_FEILOPPRETTET);
    expect(values).to.have.length(2);
  });

  it('skal disable knapp for lagring når behandlingsresultat-type og begrunnnelse ikke er valgt', () => {
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      previewHenleggBehandling={sinon.spy()}
      behandlingId={0}
      henleggArsaker={henleggArsaker}
      behandlingsType={behandlingstype}
      henleggArsakerResultReceived
      intl={intlMock}
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
      behandlingId={0}
      henleggArsaker={henleggArsaker}
      behandlingsType={behandlingstype}
      henleggArsakerResultReceived
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() {} });
    expect(submitEventCallback.called).is.true;
  });

  it('skal avbryte redigering ved trykk på avbryt-knapp', () => {
    const cancelEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<ShelveBehandlingModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      previewHenleggBehandling={sinon.spy()}
      behandlingId={0}
      henleggArsaker={henleggArsaker}
      behandlingsType={behandlingstype}
      henleggArsakerResultReceived
      årsakKode={behandlingResultatType.HENLAGT_FEILOPPRETTET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
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
      behandlingId={0}
      henleggArsaker={henleggArsaker}
      behandlingsType={behandlingstype}
      henleggArsakerResultReceived
      årsakKode={behandlingResultatType.HENLAGT_SOKNAD_TRUKKET}
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const previewLink = wrapper.find('a');
    expect(previewLink).to.have.length(1);
    expect(previewLink.text()).to.eql('Forhåndsvis brev');

    expect(previewEventCallback.called).is.false;
    previewLink.simulate('click', { preventDefault: sinon.spy() });
    expect(previewEventCallback.called).is.true;
  });
});
