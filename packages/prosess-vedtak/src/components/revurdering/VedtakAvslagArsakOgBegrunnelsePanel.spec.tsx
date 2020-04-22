import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Vilkar, Behandlingsresultat } from '@fpsak-frontend/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import VedtakAvslagArsakOgBegrunnelsePanel from './VedtakAvslagArsakOgBegrunnelsePanel';


describe('<VedtakAvslagArsakOgBegrunnelsePanel>', () => {
  it('skal rendre avslagspanel og textArea når en har ikke oppfylt søknadsfristvilkår', () => {
    const sprakkode = {
      kode: 'NO',
      kodeverk: '',
    };
    const vilkar = [{
      vilkarType: {
        kode: vilkarType.SOKNADFRISTVILKARET,
        kodeverk: '',
      },
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
        kodeverk: '',
      },
      lovReferanse: '§ 22-13, 2. ledd',
    }];
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
    const wrapper = shallow(<VedtakAvslagArsakOgBegrunnelsePanel
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkar as Vilkar[]}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      alleKodeverk={{}}
    />);


    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(1);
    expect(undertekstFields.last().childAt(0).text()).to.eql('Årsak til avslag');

    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    expect(textArea.prop('name')).is.eql('begrunnelse');
    expect(textArea.prop('maxLength')).is.eql(1500);
  });
});
