import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import OpptjeningVilkarForm from './OpptjeningVilkarForm';
import OpptjeningVilkarView from './OpptjeningVilkarView';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';
import opptjeningAktivitetKlassifisering from '../kodeverk/opptjeningAktivitetKlassifisering';

const fastsattOpptjening = {
  opptjeningperiode: {
    måneder: 2,
    dager: 3,
  },
  fastsattOpptjeningAktivitetList: [{
    id: 1,
    fom: '2018-01-01',
    tom: '2018-04-04',
    klasse: {
      kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
    },
  }],
  opptjeningFom: '2018-01-01',
  opptjeningTom: '2018-10-01',
};

describe('<OpptjeningVilkarForm>', () => {
  it('skal vise OpptjeningVilkarAksjonspunktPanel når en har aksjonspunkt', () => {
    const wrapper = shallow(<OpptjeningVilkarForm
      readOnlySubmitButton
      readOnly
      isAksjonspunktOpen
      hasAksjonspunkt
      submitCallback={sinon.spy()}
      behandlingId={1}
      behandlingVersjon={2}
      behandlingsresultat={{}}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.SVANGERSKAPSVILKARET,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
      }]}
      status="test"
      lovReferanse="Dette er en lovreferanse"
      fastsattOpptjening={fastsattOpptjening}
    />);

    const aksjonspunktPanel = wrapper.find(OpptjeningVilkarAksjonspunktPanel);
    expect(aksjonspunktPanel).to.have.length(1);
  });

  it('skal vise OpptjeningVilkarView når en ikke har aksjonspunkt', () => {
    const wrapper = shallow(<OpptjeningVilkarForm
      readOnlySubmitButton
      readOnly
      isAksjonspunktOpen={false}
      hasAksjonspunkt={false}
      submitCallback={sinon.spy()}
      behandlingId={1}
      behandlingVersjon={2}
      behandlingsresultat={{}}
      aksjonspunkter={[]}
      status="test"
      lovReferanse="Dette er en lovreferanse"
      fastsattOpptjening={fastsattOpptjening}
    />);
    const vilkarView = wrapper.find(OpptjeningVilkarView);
    expect(vilkarView).to.have.length(1);
  });
});
