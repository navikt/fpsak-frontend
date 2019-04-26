import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import aktivtArbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/aktivtArbeidsforholdHandling';
import arbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandling';
import PersonArbeidsforholdTable from './PersonArbeidsforholdTable/PersonArbeidsforholdTable';
import PersonArbeidsforholdDetailForm from './PersonArbeidsforholdDetailForm/PersonArbeidsforholdDetailForm';
import PersonArbeidsforholdPanel, { PersonArbeidsforholdPanelImpl, sortArbeidsforhold, erDetTillattMedFortsettingAvAktivtArbeidsforholdUtenIM }
  from './PersonArbeidsforholdPanel';

describe('<PersonArbeidsforholdPanel>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforholdId: '1231-2345',
    navn: 'Svendsen Eksos',
    arbeidsgiverIdentifikator: '1234567',
    arbeidsgiverIdentifiktorGUI: '1234567',
    fomDato: '2018-01-01',
    tomDato: '2018-10-10',
    kilde: {
      kode: 'INNTEKT',
      navn: '',
    },
    brukArbeidsforholdet: true,
    tilVurdering: true,
    mottattDatoInntektsmelding: undefined,
    erNyttArbeidsforhold: undefined,
    erstatterArbeidsforholdId: undefined,
    inntektIkkeMedTilBeregningsgrunnlaget: undefined,
    inntektMedTilBeregningsgrunnlag: undefined,
    brukPermisjon: undefined,
    permisjoner: undefined,
  };
  const fagsystemer = [{
    kode: 'AA',
    navn: 'aa',
  }, {
    kode: 'INNTEKT',
    navn: 'inntekt',
  }];

  it('skal rendre komponent', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);
    expect(wrapper.find(PersonArbeidsforholdTable)).has.length(1);
    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(1);
  });

  it('skal ikke gi arbeidsforhold som er erstattet til tabell', () => {
    const arbeidsforhold2 = {
      ...arbeidsforhold,
      id: '2',
      erSlettet: true,
    };
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold, arbeidsforhold2]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const table = wrapper.find(PersonArbeidsforholdTable);
    expect(table.prop('alleArbeidsforhold')).is.eql([arbeidsforhold]);
  });

  it('skal ikke vise arbeidsforhold-detaljer når ingen er valgt i tabell', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    wrapper.setState({ selectedArbeidsforhold: undefined });

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(0);
  });

  it('skal automatisk vise arbeidsforhold når det er til vurdering og ikke allerede er endret av saksbehandler', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(1);
  });

  it('skal ikke vise arbeidsforhold automatisk når det er endret', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[{
        ...arbeidsforhold,
        tilVurdering: true,
        erEndret: true,
      }]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(0);
  });

  it('skal ikke vise arbeidsforhold automatisk når saksbehandler har det ikke er aksjonspunkt på det', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[{
        ...arbeidsforhold,
        tilVurdering: false,
      }]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(0);
  });

  it('skal fjerne detaljepanel ved avbryt', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);


    expect(wrapper.state().selectedArbeidsforhold).is.eql(arbeidsforhold);
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    expect(detailForm).has.length(1);

    detailForm.prop('cancelArbeidsforhold')();
    wrapper.update();

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
    expect(wrapper.find(PersonArbeidsforholdDetailForm)).has.length(0);
  });

  it('skal rulle tilbake markering av nytt arbeidsforhold når det ikke lenger skal brukes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      erNyttArbeidsforhold: true,
    };
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[newArbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);
    const editedArbeidsforhold = {
      ...newArbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD,
    };
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...editedArbeidsforhold,
      erNyttArbeidsforhold: undefined,
      brukArbeidsforholdet: false,
      erEndret: true,
      fortsettBehandlingUtenInntektsmelding: false,
      brukMedJustertPeriode: false,
      brukPermisjon: undefined,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      inntektMedTilBeregningsgrunnlag: undefined,
    }]);
    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
  });

  it('skal rulle tilbake arbeidsforholdet som skal erstattes ved valg av nytt arbeidsforhold', () => {
    const oldArbeidsforhold = {
      ...arbeidsforhold,
      erSlettet: true,
      mottattDatoInntektsmelding: '2018-01-01',
      tilVurdering: false,
      id: '2',
    };
    const newArbeidsforhold = {
      ...arbeidsforhold,
      erNyttArbeidsforhold: false,
      erstatterArbeidsforholdId: oldArbeidsforhold.id,
      mottattDatoInntektsmelding: '2018-10-01',
    };
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[newArbeidsforhold, oldArbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const editedArbeidsforhold = {
      ...newArbeidsforhold,
      erNyttArbeidsforhold: true,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
    };
    wrapper.setState({ selectedArbeidsforhold: editedArbeidsforhold });

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');

    // FIXME (TOR) fomDato skal ikkje vera undefined her
    expect(args[2]).to.eql([{
      ...oldArbeidsforhold,
      erSlettet: false,
    }, {
      ...editedArbeidsforhold,
      erstatterArbeidsforholdId: undefined,
      erEndret: true,
      fomDato: undefined,
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: undefined,
      brukPermisjon: undefined,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      inntektMedTilBeregningsgrunnlag: undefined,
    }]);

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
  });

  it('skal sortere arbeidsforhold etter navn og mottakstidspunkt for inntektsmelding', () => {
    const arbeidsforhold2 = {
      ...arbeidsforhold,
      navn: 'Svendsen Eksos',
      mottattDatoInntektsmelding: '2018-01-01',
    };
    const arbeidsforhold3 = {
      ...arbeidsforhold,
      navn: 'Svendsen Eksos',
      mottattDatoInntektsmelding: '2017-01-01',
    };
    const arbeidsforhold4 = {
      ...arbeidsforhold,
      navn: 'Svendsen Eksos',
      mottattDatoInntektsmelding: '2019-01-01',
    };
    const arbeidsforhold5 = {
      ...arbeidsforhold,
      navn: 'Nav',
      mottattDatoInntektsmelding: '2018-01-01',
    };

    const arbeidsforholdListe = [arbeidsforhold, arbeidsforhold2, arbeidsforhold3, arbeidsforhold4, arbeidsforhold5];
    const sorterteArbeidsforhol = sortArbeidsforhold(arbeidsforholdListe);

    expect(sorterteArbeidsforhol).is.eql([arbeidsforhold5, arbeidsforhold4, arbeidsforhold2, arbeidsforhold3, arbeidsforhold]);
  });

  it('skal legge gamle arbeidsforhold med samme orgnr på nytt arbeidsforhold', () => {
    const oldArbeidsforhold = {
      ...arbeidsforhold,
      mottattDatoInntektsmelding: '2018-01-01',
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: true,
      brukArbeidsforholdet: true,
    };
    const newArbeidsforhold = {
      id: 2,
      ...arbeidsforhold,
      arbeidsforholdId: '1231-9876',
      mottattDatoInntektsmelding: '2018-10-01',
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: true,
      brukArbeidsforholdet: true,
    };

    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold, oldArbeidsforhold]);

    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [oldArbeidsforhold],
        arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
        aktivtArbeidsforholdHandlingField: undefined,
        overstyrtTom: undefined,
      }, {
        ...oldArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
        aktivtArbeidsforholdHandlingField: undefined,
        overstyrtTom: undefined,
      }],
    });
  });

  it('skal ikke kunne fortsette uten inntekstmelding når en har to arbeidsforhold fra samme arbeidsgiver der en ikke har inntektsmelding for den ene', () => {
    const toArbeidsforhold = [{
      id: '1',
      arbeidsforholdId: '1231-2345',
      navn: 'Svendsen Eksos',
      arbeidsgiverIdentifikator: '1234567',
      arbeidsgiverIdentifiktorGUI: '1234567',
      fomDato: '2018-01-01',
      tomDato: '2018-10-10',
      kilde: {
        kode: 'INNTEKT',
        navn: '',
      },
      mottattDatoInntektsmelding: false,
      brukArbeidsforholdet: true,
      erNyttArbeidsforhold: undefined,
      erstatterArbeidsforholdId: undefined,
      tilVurdering: true,
    }, {
      id: '2',
      arbeidsforholdId: '1231-2345',
      navn: 'Svendsen Eksos',
      arbeidsgiverIdentifikator: '1234567',
      arbeidsgiverIdentifiktorGUI: '1234567',
      fomDato: '2018-01-01',
      tomDato: '2018-10-10',
      kilde: {
        kode: 'INNTEKT',
        navn: '',
      },
      mottattDatoInntektsmelding: true,
      brukArbeidsforholdet: true,
      erNyttArbeidsforhold: undefined,
      erstatterArbeidsforholdId: undefined,
      tilVurdering: false,
    }];
    const isAllowed = erDetTillattMedFortsettingAvAktivtArbeidsforholdUtenIM(toArbeidsforhold);

    expect(isAllowed).is.false;
  });

  it('skal kunne fortsette uten inntekstmelding når en har to arbeidsforhold fra samme arbeidsgiver der begge har inntektsmelding', () => {
    const toArbeidsforhold = [{
      id: '1',
      arbeidsforholdId: '1231-2345',
      navn: 'Svendsen Eksos',
      arbeidsgiverIdentifikator: '1234567',
      arbeidsgiverIdentifiktorGUI: '1234567',
      fomDato: '2018-01-01',
      tomDato: '2018-10-10',
      kilde: {
        kode: 'INNTEKT',
        navn: '',
      },
      mottattDatoInntektsmelding: true,
      brukArbeidsforholdet: true,
      erNyttArbeidsforhold: undefined,
      erstatterArbeidsforholdId: undefined,
      tilVurdering: true,
    }, {
      id: '2',
      arbeidsforholdId: '1231-2345',
      navn: 'Svendsen Eksos',
      arbeidsgiverIdentifikator: '1234567',
      arbeidsgiverIdentifiktorGUI: '1234567',
      fomDato: '2018-01-01',
      tomDato: '2018-10-10',
      kilde: {
        kode: 'INNTEKT',
        navn: '',
      },
      mottattDatoInntektsmelding: true,
      brukArbeidsforholdet: true,
      erNyttArbeidsforhold: undefined,
      erstatterArbeidsforholdId: undefined,
      tilVurdering: false,
    }];
    const isAllowed = erDetTillattMedFortsettingAvAktivtArbeidsforholdUtenIM(toArbeidsforhold);

    expect(isAllowed).is.true;
  });

  it('skal oppdatere arbeidsforholdet korrekt med når man skal fjerne arbeidsforholdet', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD,
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...editedArbeidsforhold,
      erEndret: true,
      brukArbeidsforholdet: false,
      fortsettBehandlingUtenInntektsmelding: false,
      brukMedJustertPeriode: false,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      brukPermisjon: undefined,
      inntektMedTilBeregningsgrunnlag: undefined,
    }]);

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
  });

  it('skal oppdatere arbeidsforholdet korrekt med når man skal fortsette uten inntektsmelding', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.BENYTT_A_INNTEKT_I_BG,
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...editedArbeidsforhold,
      erEndret: true,
      fortsettBehandlingUtenInntektsmelding: true,
      brukMedJustertPeriode: false,
      brukPermisjon: undefined,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      inntektMedTilBeregningsgrunnlag: undefined,
    }]);

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
  });

  it('skal oppdatere arbeidsforholdet korrekt når nødvendig inntektsmelding ikke mottatt', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.AVSLA_YTELSE,
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...editedArbeidsforhold,
      erEndret: true,
      fortsettBehandlingUtenInntektsmelding: false,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      brukMedJustertPeriode: false,
      brukPermisjon: undefined,
      inntektMedTilBeregningsgrunnlag: undefined,
    }]);

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
  });

  it('skal oppdatere arbeidsforholdet korrekt når overstyrtTom satt av saksbehandler', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.OVERSTYR_TOM,
      aktivtArbeidsforholdHandlingField: undefined,
      overstyrtTom: '2019-03-06',
    };

    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);

    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...editedArbeidsforhold,
      erEndret: true,
      fortsettBehandlingUtenInntektsmelding: true,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      brukMedJustertPeriode: true,
      brukPermisjon: undefined,
      inntektMedTilBeregningsgrunnlag: undefined,
    }]);

    expect(wrapper.state().selectedArbeidsforhold).is.undefined;
  });

  it('skal lage nytt arbeidsforhold object', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold
    />);
    const instance = wrapper.instance();
    expect(wrapper.state().selectedArbeidsforhold).to.eql(undefined);
    instance.leggTilArbeidsforhold();
    expect(wrapper.state().selectedArbeidsforhold).to.not.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.id).to.not.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.lagtTilAvSaksbehandler).to.eql(true);
    expect(wrapper.state().selectedArbeidsforhold.tilVurdering).to.eql(true);
    expect(wrapper.state().selectedArbeidsforhold.kilde.navn).to.eql('Saksbehandler');
    expect(wrapper.state().selectedArbeidsforhold.brukArbeidsforholdet).to.eql(true);
    expect(wrapper.state().selectedArbeidsforhold.arbeidsforholdHandlingField).to.eql(arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD);
    expect(wrapper.state().selectedArbeidsforhold.erEndret).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.vurderOmSkalErstattes).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.ikkeRegistrertIAaRegister).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.harErsattetEttEllerFlere).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.erstatterArbeidsforholdId).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.erSlettet).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.erNyttArbeidsforhold).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.fortsettBehandlingUtenInntektsmelding).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.stillingsprosent).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.begrunnelse).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.mottattDatoInntektsmelding).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.fomDato).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.tomDato).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.arbeidsforholdId).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.arbeidsgiverIdentifiktorGUI).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.arbeidsgiverIdentifikator).to.eql(undefined);
    expect(wrapper.state().selectedArbeidsforhold.navn).to.eql(undefined);
  });

  it('skal vise knapp for å legge til arbeidsforhold', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold
    />);
    const btn = wrapper.find('button');
    expect(btn).to.have.length(1);
    expect(btn.props().children.props.id).to.eql('PersonArbeidsforholdTable.LeggTilArbeidsforhold');
    expect(wrapper.state().selectedArbeidsforhold).to.eql(undefined);
  });

  it('skal ikke vise knapp for å legge til arbeidsforhold', () => {
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[]}
      behandlingFormPrefix="panel"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold
    />);
    const btn = wrapper.find('button');
    expect(btn).to.have.length(0);
    expect(wrapper.state().selectedArbeidsforhold).to.eql(undefined);
  });

  it('skal oppdatere arbeidsforholdet korrekt når man skal bruke permisjon', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.SOKER_ER_I_PERMISJON,
      permisjoner: [
        {
          permisjonFom: '2018-10-10',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
      ],
    };
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...editedArbeidsforhold,
      erEndret: true,
      brukArbeidsforholdet: true,
      fortsettBehandlingUtenInntektsmelding: true,
      brukMedJustertPeriode: false,
      brukPermisjon: true,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      inntektMedTilBeregningsgrunnlag: undefined,
    }]);
  });

  it('skal oppdatere arbeidsforholdet korrekt når man ikke skal bruke permisjon', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      permisjoner: [
        {
          permisjonFom: '2012-01-01',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
        {
          permisjonFom: '2018-10-10',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        },
      ],
    };
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...editedArbeidsforhold,
      erEndret: true,
      brukArbeidsforholdet: true,
      fortsettBehandlingUtenInntektsmelding: true,
      brukMedJustertPeriode: false,
      brukPermisjon: false,
      inntektIkkeMedTilBeregningsgrunnlaget: false,
      inntektMedTilBeregningsgrunnlag: undefined,
    }]);
  });

  it('skal oppdatere arbeidsforholdet korrekt når man ikke skal ha inntekt med til beregningsgrunnlaget', () => {
    const formChangeCallback = sinon.spy();
    const wrapper = shallow(<PersonArbeidsforholdPanelImpl
      readOnly={false}
      hasAksjonspunkter
      hasOpenAksjonspunkter
      arbeidsforhold={[arbeidsforhold]}
      behandlingFormPrefix="panel"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      fagsystemer={fagsystemer}
      aktivtArbeidsforholdTillatUtenIM
      skalKunneLeggeTilNyeArbeidsforhold={false}
    />);

    const editedArbeidsforhold = {
      ...arbeidsforhold,
      arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.INNTEKT_IKKE_MED_I_BG,
    };
    const detailForm = wrapper.find(PersonArbeidsforholdDetailForm);
    detailForm.prop('updateArbeidsforhold')(editedArbeidsforhold);
    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('panel.ArbeidsforholdInfoPanel');
    expect(args[1]).to.eql('arbeidsforhold');
    expect(args[2]).to.eql([{
      ...editedArbeidsforhold,
      erEndret: true,
      brukArbeidsforholdet: true,
      fortsettBehandlingUtenInntektsmelding: true,
      brukMedJustertPeriode: false,
      brukPermisjon: undefined,
      inntektIkkeMedTilBeregningsgrunnlaget: true,
      inntektMedTilBeregningsgrunnlag: false,
    }]);
  });

  it('skal ikke utlede handlingstyper når arbeidsforholdet ikke er endret eller ikke til vurdering', () => {
    const oldArbeidsforhold = {
      ...arbeidsforhold,
      tilVurdering: false,
      erEndret: false,
    };
    const newArbeidsforhold = {
      id: 2,
      ...arbeidsforhold,
      tilVurdering: false,
      erEndret: false,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold, oldArbeidsforhold]);
    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: undefined,
        aktivtArbeidsforholdHandlingField: undefined,
        overstyrtTom: undefined,
      }, {
        ...oldArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: undefined,
        aktivtArbeidsforholdHandlingField: undefined,
        overstyrtTom: undefined,
      }],
    });
  });

  it('skal utlede riktig handlingstyper når overstyrt tom dato er satt', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukMedJustertPeriode: true,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold]);
    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: arbeidsforholdHandling.OVERSTYR_TOM,
        aktivtArbeidsforholdHandlingField: undefined,
        overstyrtTom: '2018-10-10',
      }],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet skal bruke pemisjon', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      permisjoner: [{
          permisjonFom: '2012-01-01',
          permisjonTom: undefined,
          permisjonsprosent: 100,
          permisjonsÅrsak: 'aarsak',
        }],
      brukPermisjon: true,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold]);
    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: arbeidsforholdHandling.SOKER_ER_I_PERMISJON,
        aktivtArbeidsforholdHandlingField: undefined,
        overstyrtTom: undefined,
      }],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet skal fjernes', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukArbeidsforholdet: false,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold]);
    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD,
        aktivtArbeidsforholdHandlingField: undefined,
        overstyrtTom: undefined,
      }],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet er aktivt og ytelsen skal avslås', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: false,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold]);
    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
        aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.AVSLA_YTELSE,
        overstyrtTom: undefined,
      }],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet er aktivt og innktekten ikke skal med til beregningsgrunnlaget', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukMedJustertPeriode: false,
      inntektIkkeMedTilBeregningsgrunnlaget: true,
      inntektMedTilBeregningsgrunnlag: false,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold]);
    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
        aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.INNTEKT_IKKE_MED_I_BG,
        overstyrtTom: undefined,
      }],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet er aktivt og behandlingen skal forsette uten inntektsmelding', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukMedJustertPeriode: false,
      fortsettBehandlingUtenInntektsmelding: true,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold]);
    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
        aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.BENYTT_A_INNTEKT_I_BG,
        overstyrtTom: undefined,
      }],
    });
  });

  it('skal utlede riktig handlingstyper når arbeidsforholdet er aktivt, søker er ikke i permisjon, og behandlingen skal forsette uten inntektsmelding', () => {
    const newArbeidsforhold = {
      ...arbeidsforhold,
      brukPermisjon: false,
      permisjoner: [{
        permisjonFom: '2012-01-01',
        permisjonTom: undefined,
        permisjonsprosent: 100,
        permisjonsÅrsak: 'aarsak',
      }],
      fortsettBehandlingUtenInntektsmelding: true,
    };
    const initialValues = PersonArbeidsforholdPanel.buildInitialValues([newArbeidsforhold]);
    expect(initialValues).is.eql({
      arbeidsforhold: [{
        ...newArbeidsforhold,
        originalFomDato: '2018-01-01',
        replaceOptions: [],
        arbeidsforholdHandlingField: arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD,
        aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.BENYTT_A_INNTEKT_I_BG,
        overstyrtTom: undefined,
      }],
    });
  });
});
