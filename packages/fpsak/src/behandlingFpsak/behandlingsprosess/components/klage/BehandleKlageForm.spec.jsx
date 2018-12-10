import React from 'react';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { BehandleKlageFormNy } from './BehandleKlageFormNy';

describe('<BehandleKlageFormNy>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };

  it('skal vise to options når aksjonspunkt er NFP og klage opprettholdt', () => {
    const wrapper = shallowWithIntl(<BehandleKlageFormNy
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
      klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
    expect(radios.at(0).prop('label').id).to.equal('Klage.ResolveKlage.ChangeVedtak');
    expect(radios.at(1).prop('label').id).to.equal('Klage.ResolveKlage.KeepVedtakNfp');
  });

  it('skal vise fem options når aksjonspunkt er NFP og klage medhold', () => {
    const wrapper = shallowWithIntl(<BehandleKlageFormNy
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
      klageVurdering={klageVurdering.MEDHOLD_I_KLAGE}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(5);
    expect(radios.at(0).prop('label').id).to.equal('Klage.ResolveKlage.ChangeVedtak');
    expect(radios.at(1).prop('label').id).to.equal('Klage.ResolveKlage.KeepVedtakNfp');
    expect(radios.at(2).prop('label').id).to.equal('Klage.Behandle.Omgjort');
    expect(radios.at(3).prop('label').id).to.equal('Klage.Behandle.Ugunst');
    expect(radios.at(4).prop('label').id).to.equal('Klage.Behandle.DelvisOmgjort');
  });

  it('skal vise fire options når aksjonspunkt er NK og klage stadfestet', () => {
    const wrapper = shallowWithIntl(<BehandleKlageFormNy
      readOnly={false}
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
    const wrapper = shallowWithIntl(<BehandleKlageFormNy
      readOnly={false}
      readOnlySubmitButton
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
    const wrapper = shallowWithIntl(<BehandleKlageFormNy
      readOnly={false}
      readOnlySubmitButton
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
    const wrapper = shallowWithIntl(<BehandleKlageFormNy
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
    />);
    expect(wrapper.find('SelectField')).to.have.length(0);
  });

  it('skal sende brev når klagevurdering er stadfeste ytelsesvedtak og behandlende enhet er nfp', () => {
    const wrapper = shallowWithIntl(<BehandleKlageFormNy
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
      klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
      sprakkode={sprakkode}
    />);

    expect(wrapper.find('a')).to.have.length(1);
    expect(wrapper.find('FlexRow').children()).to.have.length(0);
  });
});
