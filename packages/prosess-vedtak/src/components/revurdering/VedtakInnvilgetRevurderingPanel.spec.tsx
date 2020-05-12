import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { Behandlingsresultat } from '@fpsak-frontend/types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';

describe('<VedtakInnvilgetRevurderingPanel>', () => {
  it('skal rendre innvilget revurdering panel for engangsstønad ingen endring', () => {
    const resultatstruktur = {
      beregnetTilkjentYtelse: 61120,
      satsVerdi: 61120,
      antallBarn: 1,
    };

    const wrapper = shallow(<VedtakInnvilgetRevurderingPanel
      ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
      resultatstruktur={resultatstruktur}
      readOnly
      behandlingsresultat={{} as Behandlingsresultat}
      beregningErManueltFastsatt={false}
      sprakKode={{ kode: 'nb', kodeverk: '' }}
      skalBrukeOverstyrendeFritekstBrev
    />);

    const elementFields = wrapper.find(Element);
    expect(elementFields).to.have.length(2);
    expect(elementFields.first().childAt(0).text()).to.eql('61 120 kr');
    expect(elementFields.last().childAt(0).text()).to.eql('1');
  });


  it('skal rendre vpanel med årsak og fritekstpanel', () => {
    const wrapper = shallow(<VedtakInnvilgetRevurderingPanel
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      readOnly
      behandlingsresultat={{} as Behandlingsresultat}
      sprakKode={{ kode: 'nb', kodeverk: '' }}
      beregningErManueltFastsatt
      skalBrukeOverstyrendeFritekstBrev={false}
      revurderingsAarsakString="Endret til Avslag"
    />);

    expect(wrapper.find(Normaltekst).childAt(0).text()).to.eql('Endret til Avslag');
    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(1);
  });
});
