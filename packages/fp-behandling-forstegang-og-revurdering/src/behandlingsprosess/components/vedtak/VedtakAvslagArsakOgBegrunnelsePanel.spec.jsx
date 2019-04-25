import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VedtakAvslagArsakOgBegrunnelsePanel } from './VedtakAvslagArsakOgBegrunnelsePanel';


describe('<VedtakAvslagArsakOgBegrunnelsePanel>', () => {
  it('skal rendre avslagspanel og textArea når en har ikke oppfylt søknadsfristvilkår', () => {
    const sprakkode = {
      kode: 'NO',
      navn: 'norsk',
    };
    const vilkar = [{
      vilkarType: {
        kode: vilkarType.SOKNADFRISTVILKARET,
      },
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
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
      },
      avslagsarsakFritekst: null,
    };
    const getKodeverknavn = (kodeverk) => {
      if (kodeverk.kode === vilkarType.SOKNADFRISTVILKARET) {
        return 'Medlemskapsvilkåret';
      }
      if (kodeverk.kode === vilkarUtfallType.IKKE_OPPFYLT) {
        return 'test';
      }
      if (kodeverk.kode === '1019') {
        return 'Manglende dokumentasjon';
      }
      return '';
    };
    const wrapper = shallowWithIntl(<VedtakAvslagArsakOgBegrunnelsePanel
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkar}
      aksjonspunkter={[]}
      behandlingsresultat={behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      getKodeverknavn={getKodeverknavn}
    />);


    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(1);
    expect(undertekstFields.last().childAt(0).text()).to.eql('Årsak til avslag');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.last().childAt(0).text()).to.eql('Medlemskapsvilkåret: Manglende dokumentasjon');

    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    expect(textArea.prop('name')).is.eql('begrunnelse');
    expect(textArea.prop('maxLength')).is.eql(1500);
  });
});
