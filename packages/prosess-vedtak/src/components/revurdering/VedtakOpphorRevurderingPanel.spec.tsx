import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Behandlingsresultat } from '@fpsak-frontend/types';

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

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Årsak til revurdering');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
  });
  it('skal rendre opphørpanel med avslagsårsak før svangerskapspenger', () => {
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

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Årsak til revurdering');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
  });
});
