import sinon from 'sinon';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { expect } from 'chai';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import { shallow } from 'enzyme/build';
import { TempsaveKlageButtonImpl } from './TempsaveKlageButton';


describe('<TempsaveKlageButton>', () => {
  const lastSavedVersionValues = {
    klageVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    klageMedholdArsak: null,
    klageVurderingOmgjoer: null,
    fritekstTilBrev: null,
    begrunnelse: null,
  };

  const formValues = {
    klageVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    fritekstTilBrev: null,
    begrunnelse: null,
  };


  it('Skal vise knapp i readOnly når lagret versjon er lik form versjon', () => {
    const wrapper = shallow(<TempsaveKlageButtonImpl
      lastSavedVersionValues={lastSavedVersionValues}
      formValues={formValues}
      saveKlage={sinon.spy()}
      aksjonspunktCode="123"
      hasForeslaVedtakAp={false}
    />);
    expect(wrapper.find(Hovedknapp).prop('disabled')).to.equal(true);
  });

  const formValuesWithDiff = {
    klageVurdering: klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE,
  };


  it('Skal vise knapp når lagret versjon er ulik form versjon', () => {
    const wrapper = shallow(<TempsaveKlageButtonImpl
      lastSavedVersionValues={lastSavedVersionValues}
      formValues={formValuesWithDiff}
      saveKlage={sinon.spy()}
      aksjonspunktCode="123"
      hasForeslaVedtakAp={false}
    />);
    expect(wrapper.find(Hovedknapp).prop('disabled')).to.equal(false);
  });

  const formValuesWithEmptyStrings = {
    klageVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    fritekstTilBrev: '',
    begrunnelse: '',
  };


  it('Skal vise knapp i readOnly når lagret tomme strenger blir lagret i tekststrenger', () => {
    const wrapper = shallow(<TempsaveKlageButtonImpl
      lastSavedVersionValues={lastSavedVersionValues}
      formValues={formValuesWithEmptyStrings}
      saveKlage={sinon.spy()}
      aksjonspunktCode="123"
      hasForeslaVedtakAp={false}
    />);
    expect(wrapper.find(Hovedknapp).prop('disabled')).to.equal(true);
  });
});
