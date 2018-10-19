import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from 'enzyme';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import behandlingStatus from 'kodeverk/behandlingStatus';
import BehandlingResultatType from 'kodeverk/behandlingResultatType';
import { VedtakKlageFormImpl as UnwrappedForm } from './VedtakKlageForm';
import VedtakKlageSubmitPanel from './VedtakKlageSubmitPanel';
import VedtakAvslagKlagePanel from './VedtakAvslagKlagePanel';
import VedtakKlagePanel from './VedtakKlagePanel';
import VedtakAksjonspunktPanel from '../VedtakAksjonspunktPanel';
import VedtakInnvilgetKlagePanel from './VedtakInnvilgetKlagePanel';

const behandlingsresultat = {
  id: 1,
  type: {
    kode: 'IKKE_FASTSATT',
    navn: 'IKKE_FASTSATT',
  },
  avslagsarsak: null,
  avslagsarsakFritekst: null,
};

describe('<VedtakKlageForm>', () => {
  it('skal vise resultat, årsak, begrunnelse, og forhandsvise brev når behandling er klage og resultat er avvist', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();
    const br = {
      id: 1,
      type: {
        kode: BehandlingResultatType.KLAGE_AVVIST,
        navn: 'avvist',
      },
    };

    const wrapper = shallow(<UnwrappedForm
      {...reduxFormPropsMock}
      behandlingPaaVent={false}
      behandlingStatusKode="UTRED"
      behandlingsresultat={br}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      readOnly={false}
      aksjonspunktKoder={[]}
      isBehandlingReadOnly
    />);

    expect(wrapper.find(VedtakAksjonspunktPanel)).to.have.length(1);
    expect(wrapper.find(VedtakAvslagKlagePanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetKlagePanel)).to.have.length(0);
    expect(wrapper.find(VedtakKlagePanel)).to.have.length(0);
    expect(wrapper.find(VedtakKlageSubmitPanel)).to.have.length(1);
  });

  it('skal vise resultat, årsak, begrunnelse, fritekst for brev og forhandsvise brev når behandling er klage og resultat er medhold', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();
    const br = {
      id: 1,
      type: {
        kode: BehandlingResultatType.KLAGE_MEDHOLD,
        navn: 'avvist',
      },
    };

    const wrapper = shallow(<UnwrappedForm
      {...reduxFormPropsMock}
      behandlingPaaVent={false}
      behandlingStatusKode="UTRED"
      behandlingsresultat={br}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      readOnly={false}
      aksjonspunktKoder={[]}
      isBehandlingReadOnly
    />);

    expect(wrapper.find(VedtakAksjonspunktPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetKlagePanel)).to.have.length(1);
    expect(wrapper.find(VedtakKlagePanel)).to.have.length(1);
    expect(wrapper.find(VedtakKlageSubmitPanel)).to.have.length(1);
  });


  it('skal vise resultat, begrunnelse, fritekst for brev og forhandsvise brev når behandling er klage og resultat er stadfeste vedtak', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();
    const br = {
      id: 1,
      type: {
        kode: BehandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET,
        navn: 'avvist',
      },
    };

    const wrapper = shallow(<UnwrappedForm
      {...reduxFormPropsMock}
      behandlingPaaVent={false}
      behandlingStatusKode="UTRED"
      behandlingsresultat={br}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      readOnly={false}
      aksjonspunktKoder={[]}
      isBehandlingReadOnly
    />);

    expect(wrapper.find(VedtakAksjonspunktPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetKlagePanel)).to.have.length(1);
    expect(wrapper.find(VedtakKlagePanel)).to.have.length(1);
    expect(wrapper.find(VedtakKlageSubmitPanel)).to.have.length(1);
    expect(wrapper.find(VedtakAvslagKlagePanel)).to.have.length(0);
  });


  it('skal ikke vise submitpanel når status er avsluttet', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();

    const wrapper = shallow(<UnwrappedForm
      {...reduxFormPropsMock}
      behandlingPaaVent={false}
      behandlingStatusKode={behandlingStatus.AVSLUTTET}
      behandlingsresultat={behandlingsresultat}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={[]}
      readOnly={false}
      isBehandlingReadOnly
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal ikke vise submitpanel når status er iverksetter vedtak', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();
    const wrapper = shallow(<UnwrappedForm
      {...reduxFormPropsMock}
      behandlingPaaVent={false}
      behandlingStatusKode={behandlingStatus.IVERKSETTER_VEDTAK}
      behandlingsresultat={behandlingsresultat}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={[]}
      readOnly={false}
      isBehandlingReadOnly
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal ikke vise submitpanel når status er fatter vedtak', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();

    const wrapper = shallow(<UnwrappedForm
      {...reduxFormPropsMock}
      behandlingPaaVent={false}
      behandlingStatusKode={behandlingStatus.FATTER_VEDTAK}
      behandlingsresultat={behandlingsresultat}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={[]}
      readOnly={false}
      isBehandlingReadOnly
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });
});
