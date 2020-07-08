import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import { Behandlingsresultat } from '@fpsak-frontend/types';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import VedtakAvslagArsakOgBegrunnelsePanel from './VedtakAvslagArsakOgBegrunnelsePanel';

describe('<VedtakAvslagArsakOgBegrunnelsePanel>', () => {
  it('skal rendre avslagspanel og textArea når en har ikke oppfylt søknadsfristvilkår', () => {
    const sprakkode = {
      kode: 'NO',
      kodeverk: '',
    };
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
      vilkar={[]}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      alleKodeverk={{}}
      skalBrukeOverstyrendeFritekstBrev={false}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message.at(1).prop('id')).is.eql('VedtakForm.UttaksperioderIkkeGyldig');
  });
});
