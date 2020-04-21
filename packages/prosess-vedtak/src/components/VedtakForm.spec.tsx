import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { buildInitialValues, VedtakForm } from './VedtakForm';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakOverstyrendeKnapp from './VedtakOverstyrendeKnapp';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-vedtak';

describe('<VedtakForm>', () => {
  const sprakkode = {
    kode: 'NO',
  };
  const aksjonspunktKoder = [
    {
      navn: 'annen ytelse',
      kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
    },
  ];
  const initialValues = {
    skalBrukeOverstyrendeFritekstBrev: false,
    aksjonspunktKoder,
    sprakkode,
  };
  it('skal vise at vedtak er innvilget, beløp og antall barn når en har et beregningsresultat', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [];

    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      previewCallback={previewCallback}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      aksjonspunktKoder={aksjonspunktKoder}
      kanOverstyre
      readOnly={false}
      behandlingPaaVent={false}
      isBehandlingReadOnly
      skalBrukeOverstyrendeFritekstBrev={false}
      sprakkode={sprakkode}
      erBehandlingEtterKlage={false}
      initialValues={initialValues}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);


    const vedtakInnvilgetPanel = wrapper.find(VedtakInnvilgetPanel);
    expect(vedtakInnvilgetPanel).to.have.length(1);
    expect(wrapper.find('VedtakAvslagPanel')).to.have.length(0);

    expect(vedtakInnvilgetPanel.prop('antallBarn')).is.eql(2);
  });

  it('skal ikke vise et element når en ikke har et beregningsresultat', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.AVSLATT,
        navn: 'test',
      },
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);
    const label = wrapper.find('Element');
    expect(label).to.have.length(0);
  });

  it('skal vise Engangsstønad ikke innvilget når en ikke har et beregningsresultat', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.AVSLATT,
        navn: 'test',
      },
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      kanOverstyre
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);

    expect(wrapper.find(VedtakAvslagPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetPanel)).to.have.length(0);
  });

  it('skal vise avslagsgrunn for søknadsfristvilkåret', () => {
    const previewCallback = sinon.spy();

    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.AVSLATT,
        navn: 'test',
      },
      avslagsarsak: {
        kode: '1019',
        navn: 'Søkt for sent',
      },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      kanOverstyre
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      erBehandlingEtterKlage={false}
      initialValues={initialValues}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);

    expect(wrapper.find(VedtakAvslagPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetPanel)).to.have.length(0);
  });

  it('skal vise knapper for å avslutt behandling då behandlingen er innvilget', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    const a = wrapper.find('ForhaandsvisningsKnapp');
    expect(a).to.have.length(1);
  });

  it('skal ikke vise knapper for å avslutt behandling når behandlingen er avvist med årsakkode 1099', () => {
    const previewCallback = sinon.spy();
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
      avslagsarsak: { kode: '1099' },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    const a = wrapper.find('ForhaandsvisningsKnapp');
    expect(a).to.have.length(0);
  });

  it('skal vise knapper for å fatte vedtak og forhåndsvisning brev når foreslå avslag', () => {
    const previewCallback = sinon.spy();

    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.AVSLATT,
        navn: 'test',
      },
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    const a = wrapper.find('ForhaandsvisningsKnapp');
    expect(a).to.have.length(1);
  });

  it('skal ikke vise knapper når status er avsluttet', () => {
    const previewCallback = sinon.spy();

    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.AVSLUTTET}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal ikke vise knapper når status er iverksetter vedtak', () => {
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const previewCallback = sinon.spy();
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.IVERKSETTER_VEDTAK}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      erBehandlingEtterKlage={false}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal ikke vise knapper når status er fatter vedtak', () => {
    const previewCallback = sinon.spy();

    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.FATTER_VEDTAK}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev
      initialValues={initialValues}
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal sette opp initialvalues når en ikke har beregningsresultat', () => {
    const aksjonspunkter = [{
      id: 0,
      definisjon: {
        navn: 'vedtak',
        kode: aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
    }, {
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    },
    ];
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const model = buildInitialValues.resultFunc(behandlingStatus.BEHANDLING_UTREDES, undefined, aksjonspunkter, { kode: 'ES' }, behandlingsresultat, sprakkode);

    expect(model).to.eql({
      aksjonspunktKoder: ['5018', '5033'],
      sprakkode,
      brødtekst: undefined,
      overskrift: undefined,
      skalBrukeOverstyrendeFritekstBrev: true,
      isEngangsstonad: false,
      antallBarn: undefined,
    });
  });

  it('skal sette opp initialvalues når en har beregningsresultat', () => {
    const aksjonspunkter = [{
      id: 1,
      definisjon: {
        navn: 'annen ytelse',
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        navn: 'Opprettet',
        kode: aksjonspunktStatus.OPPRETTET,
      },
      kanLoses: true,
      erAktivt: true,
    }];

    const beregningResultat = {
      beregnetTilkjentYtelse: '10000',
      antallBarn: 2,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
    };
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'test',
      },
      avslagsarsak: null,
      avslagsarsakFritekst: null,
      vedtaksbrev: {
        kode: 'FRITEKST',
      },
      overskrift: 'Overskrift',
      fritekstbrev: 'Brødtekst',
    };

    const model = buildInitialValues.resultFunc(
      behandlingStatus.BEHANDLING_UTREDES,
      beregningResultat,
      aksjonspunkter,
      'ES',
      behandlingsresultat,
      sprakkode,
    );
    expect(model).to.eql({
      aksjonspunktKoder: ['5033'],
      sprakkode,
      antallBarn: 2,
      isEngangsstonad: true,
      skalBrukeOverstyrendeFritekstBrev: true,
      overskrift: 'Overskrift',
      brødtekst: 'Brødtekst',
    });
  });

  const previewCallback = sinon.spy();
  const behandlingsresultat = {
    id: 1,
    type: {
      kode: BehandlingResultatType.INNVILGET,
      navn: 'test',
    },
    avslagsarsak: null,
    avslagsarsakFritekst: null,
    vedtaksbrev: {
      kode: 'FRITEKST',
    },
  };
  const aksjonspunkter = [{
    id: 1,
    definisjon: {
      navn: 'annen ytelse',
      kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
    },
    status: {
      navn: 'Opprettet',
      kode: aksjonspunktStatus.OPPRETTET,
    },
    kanLoses: true,
    erAktivt: true,
  }];


  it('skal vise avkrysningsboks i lesemodus for rolle med overstyringstilgang', () => {
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly
      isBehandlingReadOnly
      sprakkode={sprakkode}
      kanOverstyre
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);
    const overstyringsKnapp = wrapper.find(VedtakOverstyrendeKnapp);
    expect(overstyringsKnapp).to.have.length(1);
    expect(overstyringsKnapp.prop('readOnly')).to.eql(true);
    expect(overstyringsKnapp.prop('keyName')).to.eql('skalBrukeOverstyrendeFritekstBrev');
  });

  it('skal vise avkrysningsboks i skrivemodus for rolle med overstyringstilgang', () => {
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      kanOverstyre
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      erBehandlingEtterKlage={false}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);
    const overstyringsKnapp = wrapper.find(VedtakOverstyrendeKnapp);
    expect(overstyringsKnapp).to.have.length(1);
    expect(overstyringsKnapp.prop('readOnly')).to.eql(false);
    expect(overstyringsKnapp.prop('keyName')).to.eql('skalBrukeOverstyrendeFritekstBrev');
  });

  it('skal ikke vise avkrysningsboks for rolle uten overstyringstilgang', () => {
    const wrapper = shallowWithIntl(<VedtakForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewCallback={previewCallback}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      kanOverstyre={false}
      erBehandlingEtterKlage={false}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      alleKodeverk={{}}
      beregningErManueltFastsatt={false}
      vilkar={[]}
    />);
    const overstyringsKnapp = wrapper.find('VedtakOverstyrendeKnapp');
    expect(overstyringsKnapp).to.have.length(0);
  });
});
