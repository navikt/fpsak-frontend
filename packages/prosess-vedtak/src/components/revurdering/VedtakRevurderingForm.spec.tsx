import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VedtakRevurderingForm } from './VedtakRevurderingForm';
import VedtakAvslagArsakOgBegrunnelsePanel from './VedtakAvslagArsakOgBegrunnelsePanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';


const createBehandling = (behandlingResultatType) => ({
  id: 1,
  versjon: 123,
  fagsakId: 1,
  aksjonspunkter: [],
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
});

const resultatstruktur = {
  antallBarn: 1,
};

const createBehandlingAvslag = () => createBehandling(BehandlingResultatType.AVSLATT);
const createBehandlingOpphor = () => createBehandling(BehandlingResultatType.OPPHOR);


describe('<VedtakRevurderingForm>', () => {
  it('skal vise result ved avslag, og submitpanel', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingAvslag();

    revurdering.type = {
      kode: 'BT-004',
      kodeverk: '',
    };

    revurdering.aksjonspunkter.push({
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
    });

    const wrapper = shallow(<VedtakRevurderingForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={revurdering.status.kode}
      behandlingresultat={revurdering.behandlingsresultat}
      aksjonspunkter={revurdering.aksjonspunkter}
      previewCallback={previewCallback}
      readOnly={false}
      ytelseTypeKode="ES"
      isBehandlingReadOnly={false}
      resultatstruktur={resultatstruktur}
      beregningErManueltFastsatt={false}
    />);

    expect(wrapper.find(VedtakAvslagArsakOgBegrunnelsePanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(0);
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
    revurdering.aksjonspunkter.push({
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
    });

    const wrapper = shallow(<VedtakRevurderingForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={1}
      behandlingStatusKode={revurdering.status.kode}
      behandlingresultat={revurdering.behandlingsresultat}
      aksjonspunkter={revurdering.aksjonspunkter}
      previewCallback={previewCallback}
      aksjonspunktKoder={[aksjonspunktCodes.FORESLA_VEDTAK]}
      readOnly={false}
      ytelseTypeKode="ES"
      isBehandlingReadOnly
      resultatstruktur={resultatstruktur}
      beregningErManueltFastsatt={false}
    />);

    expect(wrapper.find(VedtakAvslagArsakOgBegrunnelsePanel)).to.have.length(0);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(1);
  });

  it('skal vise result ved ingen endring, hoved knappen og ikke vise link for forhandsvise brev', () => {
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

    const wrapper = shallow(<VedtakRevurderingForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={1}
      behandlingStatusKode={revurdering.status.kode}
      behandlingresultat={revurdering.behandlingsresultat}
      aksjonspunkter={revurdering.aksjonspunkter}
      previewCallback={previewCallback}
      readOnly={false}
      ytelseTypeKode="ES"
      isBehandlingReadOnly
      resultatstruktur={resultatstruktur}
      beregningErManueltFastsatt={false}
    />);

    expect(wrapper.find(VedtakAvslagArsakOgBegrunnelsePanel)).to.have.length(0);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(1);
  });


  it('skal vise result ved ingen endring, og submitpanel', () => {
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

    const wrapper = shallow(<VedtakRevurderingForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={revurdering.status.kode}
      behandlingresultat={revurdering.behandlingsresultat}
      aksjonspunkter={revurdering.aksjonspunkter}
      antallBarn={1}
      previewCallback={previewCallback}
      haveSentVarsel
      readOnly={false}
      ytelseTypeKode="ES"
      isBehandlingReadOnly
      resultatstruktur={resultatstruktur}
      beregningErManueltFastsatt={false}
    />);

    expect(wrapper.find(VedtakAvslagArsakOgBegrunnelsePanel)).to.have.length(0);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(1);
  });


  it('skal vise opphørspanel når behandlingsresultat er opphør', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingOpphor();

    const wrapper = shallow(<VedtakRevurderingForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={revurdering.status.kode}
      behandlingresultat={revurdering.behandlingsresultat}
      aksjonspunkter={revurdering.aksjonspunkter}
      antallBarn={1}
      previewCallback={previewCallback}
      haveSentVarsel
      readOnly={false}
      ytelseTypeKode="ES"
      isBehandlingReadOnly
      resultatstruktur={resultatstruktur}
      beregningErManueltFastsatt={false}
    />);

    expect(wrapper.find(VedtakAvslagArsakOgBegrunnelsePanel)).to.have.length(0);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(0);
    expect(wrapper.find(VedtakOpphorRevurderingPanel)).to.have.length(1);
  });
});
