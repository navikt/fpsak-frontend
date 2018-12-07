import { expect } from 'chai';
import vilkarType from 'kodeverk/vilkarType';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import klageVurdering from 'kodeverk/klageVurdering';
import { hasIkkeOppfyltSoknadsfristvilkar, hasKlageVurderingSomIkkeErAvvist } from './VedtakHelper';


describe('<VedtakHelper>', () => {
  it('hasIkkeOppfyltSoknadsfristvilkar skal returnere true når søknadfristvilkår ikkje er oppfylt', () => {
    const vilkarListe = [{
      vilkarType: {
        kode: vilkarType.SOKNADFRISTVILKARET,
        navn: 'Medlemskapsvilkåret',
      },
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
        navn: 'test',
      },
      lovReferanse: '§ 22-13, 2. ledd',
    }];

    const hasIkkeOppfylt = hasIkkeOppfyltSoknadsfristvilkar(vilkarListe);

    expect(hasIkkeOppfylt).to.eql(true);
  });


  it('hasKlageVurderingSomIkkeErAvvist skal returnere true når klage ikke er avvist', () => {
    const klageVurderingResultatNK = { klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK };
    const klageVurderingResultatNFP = { klageVurdering: klageVurdering.STADFESTE_YTELSESVEDTAK };

    const hasIkkeAvvist = hasKlageVurderingSomIkkeErAvvist(klageVurderingResultatNFP, klageVurderingResultatNK);

    expect(hasIkkeAvvist).to.eql(true);
  });
});
