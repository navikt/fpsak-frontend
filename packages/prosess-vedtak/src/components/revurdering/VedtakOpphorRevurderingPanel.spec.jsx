import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { VedtakOpphorRevurderingPanelImpl } from './VedtakOpphorRevurderingPanel';


describe('<VedtakOpphorRevurderingPanel>', () => {
  it('skal rendre opphørpanel med avslagsårsak', () => {
    const vilkar = [{
      vilkarType: {
        kode: vilkarType.MEDLEMSKAPSVILKARET,
        navn: 'Medlemskapsvilkåret',
      },
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
        navn: 'test',
      },
      lovReferanse: '§ 22-13, 2. ledd',
    }];
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: 'test',
        navn: 'test',
      },
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
    };
    const wrapper = shallowWithIntl(<VedtakOpphorRevurderingPanelImpl
      intl={intlMock}
      vilkar={vilkar}
      readOnly
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      aksjonspunkter={[]}
      behandlingsresultat={behandlingsresultat}
      revurderingsAarsakString="Test"
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('VedtakForm.Resultat');
    expect(undertekstFields.last().childAt(0).text()).to.eql('VedtakForm.RevurderingFP.Aarsak');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
  });
  it('skal rendre opphørpanel med avslagsårsak før svangerskapspenger', () => {
    const vilkar = [{
      vilkarType: {
        kode: vilkarType.MEDLEMSKAPSVILKARET,
        navn: 'Medlemskapsvilkåret',
      },
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
        navn: 'test',
      },
      lovReferanse: '§ 22-13, 2. ledd',
    }];
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: 'test',
        navn: 'test',
      },
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
    };
    const wrapper = shallowWithIntl(<VedtakOpphorRevurderingPanelImpl
      intl={intlMock}
      vilkar={vilkar}
      readOnly
      ytelseTypeKode={fagsakYtelseType.SVANGERSKAPSPENGER}
      aksjonspunkter={[]}
      behandlingsresultat={behandlingsresultat}
      revurderingsAarsakString="Test"
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('VedtakForm.Resultat');
    expect(undertekstFields.last().childAt(0).text()).to.eql('VedtakForm.RevurderingFP.Aarsak');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
  });
});
