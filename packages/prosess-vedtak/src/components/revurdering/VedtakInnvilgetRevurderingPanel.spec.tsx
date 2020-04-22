import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { Behandlingsresultat } from '@fpsak-frontend/types';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';

const ytelseType = fagsakYtelseType.ENGANGSSTONAD;

describe('<VedtakInnvilgetRevurderingPanel>', () => {
  it('skal rendre innvilget revurdering panel for engangsstønad ingen endring', () => {
    const resultatstruktur = {
      beregnetTilkjentYtelse: 61120,
      satsVerdi: 61120,
      antallBarn: 1,
    };

    const wrapper = shallow(<VedtakInnvilgetRevurderingPanel
      antallBarn={1}
      ytelseTypeKode={ytelseType}
      resultatstruktur={resultatstruktur}
      readOnly
      behandlingsresultat={{} as Behandlingsresultat}
      beregningErManueltFastsatt={false}
      sprakKode={{ kode: 'nb', kodeverk: '' }}
    />);

    const undertekstFields = wrapper.find(Undertekst);
    expect(undertekstFields).to.have.length(3);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.at(1).childAt(0).text()).to.eql('Beregnet engangsstønad');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Antall barn');

    const normaltekstFields = wrapper.find(Normaltekst);
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Ingen endring');

    const elementFields = wrapper.find(Element);
    expect(elementFields).to.have.length(2);
    expect(elementFields.first().childAt(0).text()).to.eql('61 120 kr');
    expect(elementFields.last().childAt(0).text()).to.eql('1');
  });


  it('skal rendre innvilget revurdering panel for engangsstønad endret til avslått', () => {
    const wrapper = shallow(<VedtakInnvilgetRevurderingPanel
      antallBarn={1}
      ytelseTypeKode={ytelseType}
      readOnly
      behandlingsresultat={{} as Behandlingsresultat}
      sprakKode={{ kode: 'nb', kodeverk: '' }}
      beregningErManueltFastsatt={false}
    />);

    const undertekstFields = wrapper.find(Undertekst);
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Antall barn');

    const normaltekstFields = wrapper.find(Normaltekst);
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Endret til Avslag');

    const elementFields = wrapper.find(Element);
    expect(elementFields).to.have.length(1);
    expect(elementFields.first().childAt(0).text()).to.eql('1');
  });
});
