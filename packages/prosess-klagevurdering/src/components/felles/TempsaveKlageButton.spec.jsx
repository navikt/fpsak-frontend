import sinon from 'sinon';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { expect } from 'chai';
import { Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import { shallow } from 'enzyme/build';
import TempsaveKlageButton from './TempsaveKlageButton';

describe('<TempsaveKlageButton>', () => {
  const formValuesWithEmptyStrings = {
    klageVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    fritekstTilBrev: '',
    begrunnelse: '',
  };

  it('Skal rendre komponent korrekt', () => {
    const wrapper = shallow(<TempsaveKlageButton
      formValues={formValuesWithEmptyStrings}
      saveKlage={sinon.spy()}
      aksjonspunktCode="123"
      hasForeslaVedtakAp={false}
    />);
    expect(wrapper.find(Hovedknapp)).has.length(1);
  });
});
