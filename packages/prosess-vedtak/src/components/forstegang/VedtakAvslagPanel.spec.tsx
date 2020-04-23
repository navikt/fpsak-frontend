import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Vilkar, Behandlingsresultat } from '@fpsak-frontend/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-vedtak';

describe('<VedtakAvslagPanel>', () => {
  const sprakkode = {
    kode: 'NO',
    kodeverk: '',
  };

  const vilkarUtenSoknadsfrist = [{
    vilkarType: {
      kode: vilkarType.MEDLEMSKAPSVILKARET,
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

  it('skal rendre avslagspanel for engangsstønad', () => {
    const wrapper = shallowWithIntl(<VedtakAvslagPanel.WrappedComponent
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={[]}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      skalBrukeOverstyrendeFritekstBrev
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).to.have.length(1);
    expect(message.prop('id')).to.eql('VedtakForm.UttaksperioderIkkeGyldig');

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(0);
  });

  it('skal rendre avslagspanel med fritekstpanel for engangsstønad', () => {
    const wrapper = shallowWithIntl(<VedtakAvslagPanel.WrappedComponent
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      vilkar={vilkarUtenSoknadsfrist as Vilkar[]}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      sprakkode={sprakkode}
      readOnly
      ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
      alleKodeverk={{}}
      beregningErManueltFastsatt
      skalBrukeOverstyrendeFritekstBrev={false}
    />);

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(1);
  });
});
