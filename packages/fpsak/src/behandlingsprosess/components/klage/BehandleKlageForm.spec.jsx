import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import klageVurdering from 'kodeverk/klageVurdering';
import { BehandleKlageForm } from './BehandleKlageForm';

describe('<BehandleKlageForm>', () => {
  it('skal vise tre options når aksjonspunkt er NFP', () => {
    const wrapper = shallowWithIntl(<BehandleKlageForm
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
      klageMedholdArsaker={[]}
      klageAvvistArsaker={[]}
      klageVurdering={klageVurdering.AVVIS_KLAGE}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(3);
    expect(radios.at(0).prop('label').id).to.equal('Klage.ResolveKlage.KeepVedtakNfp');
    expect(radios.at(1).prop('label').id).to.equal('Klage.ResolveKlage.ChangeVedtak');
    expect(radios.at(2).prop('label').id).to.equal('Klage.ResolveKlage.RejectKlage');
  });

  it('skal vise fire options når aksjonspunkt er NK', () => {
    const wrapper = shallowWithIntl(<BehandleKlageForm
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageMedholdArsaker={[]}
      klageAvvistArsaker={[]}
      klageVurdering={klageVurdering.AVVIS_KLAGE}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(4);
    expect(radios.at(0).prop('label').id).to.equal('Klage.ResolveKlage.NullifyVedtak');
    expect(radios.at(1).prop('label').id).to.equal('Klage.ResolveKlage.KeepVedtakNk');
    expect(radios.at(2).prop('label').id).to.equal('Klage.ResolveKlage.ChangeVedtak');
    expect(radios.at(3).prop('label').id).to.equal('Klage.ResolveKlage.RejectKlage');
  });

  it('skal vise selectfield når klagevurdering er avvis klage', () => {
    const wrapper = shallowWithIntl(<BehandleKlageForm
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageMedholdArsaker={[]}
      klageAvvistArsaker={[]}
      klageVurdering={klageVurdering.AVVIS_KLAGE}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
    />);
    expect(wrapper.find('SelectField').props().name).to.equal('klageAvvistArsak');
    expect(wrapper.find('SelectField')).to.have.length(1);
  });

  it('skal vise selectfield når klagevurdering er omgjort vedtak', () => {
    const wrapper = shallowWithIntl(<BehandleKlageForm
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageMedholdArsaker={[]}
      klageAvvistArsaker={[]}
      klageVurdering={klageVurdering.MEDHOLD_I_KLAGE}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
    />);
    expect(wrapper.find('SelectField').props().name).to.equal('klageMedholdArsak');
    expect(wrapper.find('SelectField')).to.have.length(1);
  });

  it('skal ikke vise selectfield når klagevurdering er opphev vedtak', () => {
    const wrapper = shallowWithIntl(<BehandleKlageForm
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      klageMedholdArsaker={[]}
      klageAvvistArsaker={[]}
      klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
    />);
    expect(wrapper.find('SelectField')).to.have.length(0);
  });

  it('skal sende brev når klagevurdering er stadfeste ytelsesvedtak og behandlende enhet er nfp', () => {
    const wrapper = shallowWithIntl(<BehandleKlageForm
      readOnly={false}
      readOnlySubmitButton
      aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
      klageMedholdArsaker={[]}
      klageAvvistArsaker={[]}
      klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
      previewCallback={sinon.spy()}
      intl={intlMock}
      formProps={{}}
    />);

    expect(wrapper.find('a')).to.have.length(1);
    expect(wrapper.find('FlexRow').children()).to.have.length(0);
  });
});
