import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { VedtakRevurderingForm } from './VedtakRevurderingForm';
import VedtakAvslagArsakOgBegrunnelsePanel from './VedtakAvslagArsakOgBegrunnelsePanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakFellesPanel from '../felles/VedtakFellesPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-vedtak';

const createBehandling = (behandlingResultatType) => ({
  id: 1,
  versjon: 123,
  fagsakId: 1,
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  sprakkode: {
    kode: 'NO',
    kodeverk: '',
  },
  behandlingsresultat: {
    id: 1,
    type: {
      kode: behandlingResultatType,
      kodeverk: '',
    },
    avslagsarsak: behandlingResultatType === BehandlingResultatType.AVSLATT ? {
      kode: '1019',
      kodeverk: '',
    } : null,
    avslagsarsakFritekst: null,
  },
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
    kodeverk: '',
  },
  type: {
    kode: 'test',
    kodeverk: '',
  },
  opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
  behandlingArsaker: [],
});

const resultatstruktur = {
  antallBarn: 1,
};

const createBehandlingAvslag = () => createBehandling(BehandlingResultatType.AVSLATT);
const createBehandlingOpphor = () => createBehandling(BehandlingResultatType.OPPHOR);

describe('<VedtakRevurderingForm>', () => {
  it('skal vise result ved avslag', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingAvslag();

    revurdering.type = {
      kode: 'BT-004',
      kodeverk: '',
    };

    const aksjonspunkter = [{
      id: 0,
      definisjon: {
        kodeverk: '',
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        kodeverk: '',
        kode: '',
      },
      kanLoses: true,
      erAktivt: true,
    }];

    const wrapper = shallowWithIntl(<VedtakRevurderingForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandling={revurdering}
      aksjonspunkter={aksjonspunkter}
      previewCallback={previewCallback}
      readOnly={false}
      ytelseTypeKode="ES"
      isBehandlingReadOnly={false}
      resultatstruktur={resultatstruktur}
      beregningErManueltFastsatt={false}
    />);

    const fellesPanel = wrapper.find(VedtakFellesPanel);
    expect(fellesPanel).to.have.length(1);
    const avslattPanel = fellesPanel.renderProp('renderPanel')(false, false, true, false).find(VedtakAvslagArsakOgBegrunnelsePanel);
    expect(avslattPanel).to.have.length(1);
  });

  it('Revurdering, skal vise resultat ved endret belop, hovedknappen for totrinnskontroll og link for å forhåndsvise brev', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingAvslag();

    revurdering.behandlingsresultat = {
      ...revurdering.behandlingsresultat,
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        kodeverk: '',
      },
    };
    const aksjonspunkter = [{
      id: 0,
      definisjon: {
        kodeverk: '',
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        kodeverk: 'kodeverk',
        kode: '',
      },
      kanLoses: true,
      erAktivt: true,
    }];

    const wrapper = shallowWithIntl(<VedtakRevurderingForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={1}
      behandling={revurdering}
      aksjonspunkter={aksjonspunkter}
      previewCallback={previewCallback}
      readOnly={false}
      ytelseTypeKode="ES"
      isBehandlingReadOnly
      resultatstruktur={resultatstruktur}
      beregningErManueltFastsatt={false}
    />);

    const fellesPanel = wrapper.find(VedtakFellesPanel);
    expect(fellesPanel).to.have.length(1);
    const avslattPanel = fellesPanel.renderProp('renderPanel')(false, true, false, false).find(VedtakInnvilgetRevurderingPanel);
    expect(avslattPanel).to.have.length(1);
  });

  it('skal vise opphørspanel når behandlingsresultat er opphør', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingOpphor();

    const wrapper = shallowWithIntl(<VedtakRevurderingForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandling={revurdering}
      aksjonspunkter={[]}
      antallBarn={1}
      previewCallback={previewCallback}
      haveSentVarsel
      readOnly={false}
      ytelseTypeKode="ES"
      isBehandlingReadOnly
      resultatstruktur={resultatstruktur}
      beregningErManueltFastsatt={false}
    />);

    const fellesPanel = wrapper.find(VedtakFellesPanel);
    expect(fellesPanel).to.have.length(1);
    const opphorPanel = fellesPanel.renderProp('renderPanel')(false, false, false, true).find(VedtakOpphorRevurderingPanel);
    expect(opphorPanel).to.have.length(1);
  });
});
