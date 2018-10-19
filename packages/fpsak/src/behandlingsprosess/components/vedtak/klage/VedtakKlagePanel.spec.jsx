import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import vilkarType from 'kodeverk/vilkarType';
import behandlingType from 'kodeverk/behandlingType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import klageVurdering from 'kodeverk/klageVurdering';
import { medholdIKlage } from '../VedtakHelper';
import { VedtakKlagePanelImpl, getMedholdArsak } from './VedtakKlagePanel';

describe('<VedtakKlagePanel>', () => {
  it('skal rendre textArea når en har ikke oppfylt søknadsfristvilkår', () => {
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
    const wrapper = shallowWithIntl(<VedtakKlagePanelImpl
      intl={intlMock}
      behandlingTypeKode={behandlingType.KLAGE}
      sprakkode={{
        kode: 'NO',
        navn: 'Norsk',
      }}
      vilkar={vilkarListe}
      behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={{
        avslagsarsak: {
          kode: '1019',
          navn: 'Manglende dokumentasjon',
        },
      }}
      klageVurderingResultatNK={{
        begrunnelse: 'Dette er en tekst',
        klageVurdering: klageVurdering.MEDHOLD_I_KLAGE,
        klageMedholdArsakNavn: 'TEKST',
      }}
      readOnly={false}
    />);

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Årsak');
    expect(undertekstFields.last().childAt(0).text()).to.eql('Begrunnelse');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(2);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('TEKST');
    expect(normaltekstFields.last().childAt(0).text()).to.eql('Dette er en tekst');

    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    expect(textArea.prop('name')).is.eql('begrunnelse');
    expect(textArea.prop('maxLength')).is.eql(1500);
  });


  it('getMedholdArsak skal gi meholdårsak når klage har fått mehold', () => {
    const klageVurderingResultatNK = {
      begrunnelse: 'Dette er en tekst',
      klageVurdering: klageVurdering.MEDHOLD_I_KLAGE,
      klageMedholdArsakNavn: 'TEKST',
    };

    const medhold = medholdIKlage(klageVurderingResultatNK);
    expect(medhold).to.eql(true);


    const medholdArsak = getMedholdArsak(klageVurderingResultatNK, null);
    expect(medholdArsak).to.eql('TEKST');
  });
});
