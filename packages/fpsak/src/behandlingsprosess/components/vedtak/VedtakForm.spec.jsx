import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import BehandlingResultatType from 'kodeverk/behandlingResultatType';
import behandlingStatus from 'kodeverk/behandlingStatus';
import { VedtakFormImpl as UnwrappedForm, buildInitialValues } from './VedtakForm';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';


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
    const forhandsvisVedtaksbrevFunc = sinon.spy();
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

    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      aksjonspunktKoder={aksjonspunktKoder}
      kanOverstyre
      readOnly={false}
      behandlingPaaVent={false}
      isBehandlingReadOnly
      skalBrukeOverstyrendeFritekstBrev={false}
      sprakkode={sprakkode}
      initialValues={initialValues}
    />);


    const vedtakInnvilgetPanel = wrapper.find(VedtakInnvilgetPanel);
    expect(vedtakInnvilgetPanel).to.have.length(1);
    expect(wrapper.find('VedtakAvslagPanel')).to.have.length(0);
    expect(wrapper.find('VedtakKlagePanel')).to.have.length(0);

    expect(vedtakInnvilgetPanel.prop('antallBarn')).is.eql(2);
  });

  it('skal ikke vise et element når en ikke har et beregningsresultat', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();
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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev
    />);
    const label = wrapper.find('Element');
    expect(label).to.have.length(0);
  });

  it('skal vise Engangsstønad ikke innvilget når en ikke har et beregningsresultat', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();
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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      kanOverstyre
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);

    expect(wrapper.find(VedtakAvslagPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetPanel)).to.have.length(0);
  });

  it('skal vise avslagsgrunn for søknadsfristvilkåret', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();

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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      kanOverstyre
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);

    expect(wrapper.find(VedtakAvslagPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetPanel)).to.have.length(0);
  });

  it('skal vise knapper for å avslutt behandling då behandlingen er innvilget', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();
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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    const a = wrapper.find('ForhaandsvisningsKnapp');
    expect(a).to.have.length(1);
  });

  it('skal ikke vise knapper for å avslutt behandling når behandlingen er avvist med årsakkode 1099', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();
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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    const a = wrapper.find('ForhaandsvisningsKnapp');
    expect(a).to.have.length(0);
  });

  it('skal vise knapper for å fatte vedtak og forhåndsvisning brev når foreslå avslag', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();

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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    const a = wrapper.find('ForhaandsvisningsKnapp');
    expect(a).to.have.length(1);
  });

  it('skal ikke vise knapper når status er avsluttet', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();

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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.AVSLUTTET}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
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
    const forhandsvisVedtaksbrevFunc = sinon.spy();
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.IVERKSETTER_VEDTAK}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(0);
    const button = wrapper.find('button');
    expect(button).to.have.length(0);
  });

  it('skal ikke vise knapper når status er fatter vedtak', () => {
    const forhandsvisVedtaksbrevFunc = sinon.spy();

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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.FATTER_VEDTAK}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      skalBrukeOverstyrendeFritekstBrev
      initialValues={initialValues}
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
      { kode: 'ES' },
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

  const forhandsvisVedtaksbrevFunc = sinon.spy();
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
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      kanOverstyre
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);
    const overstyringsKnapp = wrapper.find('CheckboxField');
    expect(overstyringsKnapp.first().prop('name')).to.eql('skalBrukeOverstyrendeFritekstBrev');
    expect(overstyringsKnapp.first().prop('readOnly')).to.eql(false);
  });
  it('skal vise avkrysningsboks i skrivemodus for rolle med overstyringstilgang', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly
      isBehandlingReadOnly
      sprakkode={sprakkode}
      kanOverstyre
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);
    const overstyringsKnapp = wrapper.find('CheckboxField');
    expect(overstyringsKnapp.first().prop('name')).to.eql('skalBrukeOverstyrendeFritekstBrev');
    expect(overstyringsKnapp.first().prop('readOnly')).to.eql(true);
  });

  it('skal ikke vise avkrysningsboks for rolle uten overstyringstilgang', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      antallBarn={2}
      behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
      behandlingsresultat={behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      behandlingPaaVent={false}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      previewManueltBrevCallback={forhandsvisVedtaksbrevFunc}
      aksjonspunktKoder={aksjonspunktKoder}
      readOnly={false}
      isBehandlingReadOnly
      sprakkode={sprakkode}
      kanOverstyre={false}
      skalBrukeOverstyrendeFritekstBrev={false}
      initialValues={initialValues}
    />);
    const overstyringsKnapp = wrapper.find('CheckboxField');
    expect(overstyringsKnapp).to.have.length(0);
  });
});
