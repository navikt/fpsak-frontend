import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import vilkarType from 'kodeverk/vilkarType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
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
      ytelseType={fagsakYtelseType.FORELDREPENGER}
      aksjonspunkter={[]}
      behandlingsresultat={behandlingsresultat}
      revurderingsAarsakString="Test"
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Årsak til revurdering');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
  });
});
