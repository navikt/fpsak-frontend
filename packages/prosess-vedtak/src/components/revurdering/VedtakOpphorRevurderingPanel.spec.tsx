import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Normaltekst } from 'nav-frontend-typografi';

import { Behandlingsresultat } from '@fpsak-frontend/types';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';

describe('<VedtakOpphorRevurderingPanel>', () => {
  it('skal rendre opphørpanel med avslagsårsak', () => {
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: 'test',
        kodeverk: '',
      },
      avslagsarsak: {
        kode: '1019',
        kodeverk: '',
      },
      avslagsarsakFritekst: null,
    };
    const wrapper = shallow(<VedtakOpphorRevurderingPanel
      readOnly
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      revurderingsAarsakString="Test"
      beregningErManueltFastsatt={false}
      skalBrukeOverstyrendeFritekstBrev
    />);

    const tekst = wrapper.find(Normaltekst);
    expect(tekst).to.have.length(1);
    expect(tekst.childAt(0).text()).to.eql('Test');

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(0);
  });

  it('skal rendre opphørpanel med uten avslagsårsak men med fritekstpanel', () => {
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: 'test',
        kodeverk: '',
      },
      avslagsarsak: {
        kode: '1019',
        kodeverk: '',
      },
      avslagsarsakFritekst: null,
    };
    const wrapper = shallow(<VedtakOpphorRevurderingPanel
      readOnly
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      beregningErManueltFastsatt
      skalBrukeOverstyrendeFritekstBrev={false}
    />);

    expect(wrapper.find(Normaltekst)).to.have.length(0);
    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(1);
  });
});
