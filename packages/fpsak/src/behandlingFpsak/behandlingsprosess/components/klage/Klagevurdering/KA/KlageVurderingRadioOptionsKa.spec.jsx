import React from 'react';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { KlageVurderingRadioOptionsKaImpl } from './KlageVurderingRadioOptionsKa';

describe('<KlageVurderingRadioOptionsKaImpl>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const medholdReasons = [
    { kode: 'NYE_OPPLYSNINGER', navn: 'Nytt faktum', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_REGELVERKSTOLKNING', navn: 'Feil lovanvendelse', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_VURDERING', navn: 'Ulik skjønnsvurdering', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'PROSESSUELL_FEIL', navn: 'Saksbehandlingsfeil', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
  ];

  it('skal vise fire options når klage stadfestet', () => {
    const wrapper = shallowWithIntl(<KlageVurderingRadioOptionsKaImpl
      readOnly={false}
      medholdReasons={medholdReasons}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(4);
    expect(radios.at(0).prop('label').id).to.equal('Klage.ResolveKlage.KeepVedtakNk');
    expect(radios.at(1).prop('label').id).to.equal('Klage.ResolveKlage.ChangeVedtak');
    expect(radios.at(2).prop('label').id).to.equal('Klage.ResolveKlage.NullifyVedtak');
    expect(radios.at(3).prop('label').id).to.equal('Klage.Behandle.Hjemsendt');
  });

  it('skal vise syv options når aksjonspunkt er NK og klage medhold', () => {
    const wrapper = shallowWithIntl(<KlageVurderingRadioOptionsKaImpl
      readOnly={false}
      readOnlySubmitButton
      medholdReasons={medholdReasons}
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageMedholdArsaker={[]}
      klageVurdering={klageVurdering.MEDHOLD_I_KLAGE}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(7);
    expect(radios.at(0).prop('label').id).to.equal('Klage.ResolveKlage.KeepVedtakNk');
    expect(radios.at(1).prop('label').id).to.equal('Klage.ResolveKlage.ChangeVedtak');
    expect(radios.at(2).prop('label').id).to.equal('Klage.ResolveKlage.NullifyVedtak');
    expect(radios.at(3).prop('label').id).to.equal('Klage.Behandle.Hjemsendt');
    expect(radios.at(4).prop('label').id).to.equal('Klage.Behandle.Omgjort');
    expect(radios.at(5).prop('label').id).to.equal('Klage.Behandle.Ugunst');
    expect(radios.at(6).prop('label').id).to.equal('Klage.Behandle.DelvisOmgjort');
  });

  it('skal vise selectfield når klagevurdering er omgjort vedtak', () => {
    const wrapper = shallowWithIntl(<KlageVurderingRadioOptionsKaImpl
      readOnly={false}
      readOnlySubmitButton
      medholdReasons={medholdReasons}
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageVurdering={klageVurdering.MEDHOLD_I_KLAGE}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
    />);
    expect(wrapper.find('SelectField').props().name).to.equal('klageMedholdArsak');
    expect(wrapper.find('SelectField')).to.have.length(1);
  });

  it('skal ikke vise selectfield når klagevurdering er opphev vedtak', () => {
    const wrapper = shallowWithIntl(<KlageVurderingRadioOptionsKaImpl
      readOnly={false}
      readOnlySubmitButton
      medholdReasons={medholdReasons}
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
    />);
    expect(wrapper.find('SelectField')).to.have.length(0);
  });
});
