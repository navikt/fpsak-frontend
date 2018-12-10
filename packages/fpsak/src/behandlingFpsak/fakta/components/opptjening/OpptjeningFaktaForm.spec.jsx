import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import OAType from 'kodeverk/opptjeningAktivitetType';
import { OpptjeningFaktaFormImpl as OpptjeningFaktaForm } from './OpptjeningFaktaForm';
import ActivityPanel from './activity/ActivityPanel';

describe('<OpptjeningFaktaForm>', () => {
  const opptjeningActivities = [{
    id: 1,
    aktivitetType: { kode: OAType.ARBEID, navn: 'ARBEID' },
    opptjeningFom: '2017-06-01',
    opptjeningTom: '2017-07-10',
    arbeidsgiver: 'Andersen Transport AS',
    oppdragsgiverOrg: 583948180,
    stillingsandel: 100,
    erGodkjent: true,
    begrunnelse: null,
    erManueltOpprettet: false,
    erEndret: false,
  }, {
    id: 2,
    aktivitetType: { kode: OAType.NARING, navn: 'NARING' },
    opptjeningFom: '2017-07-15',
    opptjeningTom: '2017-08-15',
    arbeidsgiver: 'Andersen Transport AS',
    oppdragsgiverOrg: 583948180,
    stillingsandel: 100,
    registreringsdato: '2018-02-20',
    erGodkjent: null,
    begrunnelse: null,
    erManueltOpprettet: false,
    erEndret: false,
  }];

  const opptjeningAktivitetTypes = [{
    kode: OAType.ARBEID,
    navn: 'Arbeid',
  }, {
    kode: OAType.NARING,
    navn: 'Næring',
  }];

  it('skal vise aksjonspunktinformasjon og knapper når aksjonspunkt finnes', () => {
    const wrapper = shallow(<OpptjeningFaktaForm
      hasAksjonspunkt
      opptjeningFomDato="2017-08-15"
      opptjeningTomDato="2017-08-31"
      readOnly={false}
      opptjeningActivities={opptjeningActivities}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      formName="test"
      behandlingFormPrefix="test"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      hasOpenAksjonspunkter
      submitting={false}
      isDirty={false}
    />);

    wrapper.setState({ selectedOpptjeningActivity: opptjeningActivities[0] });

    const helpText = wrapper.find(AksjonspunktHelpText);
    expect(helpText).to.have.length(1);
    expect(helpText.prop('isAksjonspunktOpen')).is.true;
    expect(helpText.childAt(0)).to.have.length(1);
    expect(helpText.childAt(0).prop('id')).is.eql('OpptjeningFaktaForm.FlereArbeidKanGodkjennes');

    expect(wrapper.find(ActivityPanel)).to.have.length(1);
    const oppdaterKnapp = wrapper.find(Hovedknapp);
    expect(oppdaterKnapp).to.have.length(1);
    expect(oppdaterKnapp.prop('disabled')).is.true;

    const avbrytKnapp = wrapper.find(Knapp);
    expect(avbrytKnapp).to.have.length(1);
    expect(avbrytKnapp.prop('disabled')).is.false;
  });

  it('skal ikke vise aksjonspunktinformasjon og knapper når aksjonspunkt ikke finnes', () => {
    const wrapper = shallow(<OpptjeningFaktaForm
      hasAksjonspunkt={false}
      opptjeningFomDato="2017-08-15"
      opptjeningTomDato="2017-08-31"
      readOnly={false}
      opptjeningActivities={opptjeningActivities}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      formName="test"
      behandlingFormPrefix="test"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      hasOpenAksjonspunkter
      submitting={false}
      isDirty={false}
    />);

    wrapper.setState({ selectedOpptjeningActivity: opptjeningActivities[0] });

    expect(wrapper.find(AksjonspunktHelpText)).to.have.length(0);
    expect(wrapper.find(Hovedknapp)).to.have.length(0);
    expect(wrapper.find(Knapp)).to.have.length(0);
  });

  it('skal ikke vise informasjon om aktiviteten når det ikke er valgt aktivitetstype i dropdown', () => {
    const wrapper = shallow(<OpptjeningFaktaForm
      hasAksjonspunkt
      opptjeningFomDato="2017-08-15"
      opptjeningTomDato="2017-08-31"
      readOnly={false}
      opptjeningActivities={opptjeningActivities}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      formName="test"
      behandlingFormPrefix="test"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      hasOpenAksjonspunkter
      submitting={false}
      isDirty={false}
    />);

    wrapper.setState({ selectedOpptjeningActivity: undefined });

    expect(wrapper.find(ActivityPanel)).to.have.length(0);
  });

  it('skal kunne lagre og legge til når ingen aktivitet er valgt og alle aksjonspunkter er avklart', () => {
    const activities = opptjeningActivities.map(oa => ({
      ...oa,
      erGodkjent: true,
    }));

    const wrapper = shallow(<OpptjeningFaktaForm
      hasAksjonspunkt
      opptjeningFomDato="2017-08-15"
      opptjeningTomDato="2017-08-31"
      readOnly={false}
      opptjeningActivities={activities}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      formName="test"
      behandlingFormPrefix="test"
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
      hasOpenAksjonspunkter
      submitting={false}
      isDirty={false}
    />);

    wrapper.setState({ selectedOpptjeningActivity: undefined });

    const oppdaterKnapp = wrapper.find(Hovedknapp);
    expect(oppdaterKnapp.prop('disabled')).is.false;

    const avbrytKnapp = wrapper.find(Knapp);
    expect(avbrytKnapp.prop('disabled')).is.false;
  });

  it('skal automatisk åpne aktivitet som må avklares', () => {
    const formChangeCallback = sinon.spy();
    const formInitCallback = sinon.spy();

    const wrapper = shallow(<OpptjeningFaktaForm
      hasAksjonspunkt
      opptjeningFomDato="2017-08-15"
      opptjeningTomDato="2017-08-31"
      readOnly={false}
      opptjeningActivities={opptjeningActivities}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      behandlingFormPrefix="Behandling_123"
      formName="OpptjeningFaktaForm"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={formInitCallback}
      hasOpenAksjonspunkter
      submitting={false}
      isDirty={false}
    />);

    expect(wrapper.state().selectedOpptjeningActivity).to.eql(opptjeningActivities[1]);

    expect(formInitCallback.getCalls()).to.have.length(0);
  });

  it('skal oppdatere aktivitet etter editering', () => {
    const formChangeCallback = sinon.spy();
    const formInitCallback = sinon.spy();

    const wrapper = shallow(<OpptjeningFaktaForm
      hasAksjonspunkt
      opptjeningFomDato="2017-08-15"
      opptjeningTomDato="2017-08-31"
      readOnly={false}
      opptjeningActivities={opptjeningActivities}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      behandlingFormPrefix="Behandling_123"
      formName="OpptjeningFaktaForm"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={formInitCallback}
      hasOpenAksjonspunkter
      submitting={false}
      isDirty={false}
    />);

    const activityPanel = wrapper.find(ActivityPanel);
    expect(activityPanel).to.have.length(1);

    const editedActivity = {
      ...opptjeningActivities[1],
      erEndret: true,
      erGodkjent: true,
    };
    activityPanel.prop('updateActivity')(editedActivity);

    const calls = formChangeCallback.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(3);
    expect(args[0]).to.eql('Behandling_123.OpptjeningFaktaForm');
    expect(args[1]).to.eql('opptjeningActivities');
    expect(args[2]).to.eql([opptjeningActivities[0], editedActivity]);

    expect(wrapper.state().selectedOpptjeningActivity).is.undefined;

    expect(formInitCallback.getCalls()).to.have.length(1);
  });

  it('skal legge til aktivitet', () => {
    const formChangeCallback = sinon.spy();

    const wrapper = shallow(<OpptjeningFaktaForm
      hasAksjonspunkt
      opptjeningFomDato="2017-08-15"
      opptjeningTomDato="2017-08-31"
      readOnly={false}
      opptjeningActivities={opptjeningActivities}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      behandlingFormPrefix="Behandling_123"
      formName="OpptjeningFaktaForm"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={sinon.spy()}
      hasOpenAksjonspunkter
      submitting={false}
      isDirty={false}
    />);

    wrapper.find(Knapp).simulate('click');

    expect(wrapper.state().selectedOpptjeningActivity).is.eql({
      id: 3,
      erGodkjent: true,
      erManueltOpprettet: true,
    });
  });

  it('skal kunne avbryte editering', () => {
    const formChangeCallback = sinon.spy();
    const formInitCallback = sinon.spy();

    const wrapper = shallow(<OpptjeningFaktaForm
      hasAksjonspunkt
      opptjeningFomDato="2017-08-15"
      opptjeningTomDato="2017-08-31"
      readOnly={false}
      opptjeningActivities={opptjeningActivities}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      behandlingFormPrefix="Behandling_123"
      formName="OpptjeningFaktaForm"
      reduxFormChange={formChangeCallback}
      reduxFormInitialize={formInitCallback}
      hasOpenAksjonspunkter
      submitting={false}
      isDirty={false}
    />);

    const activityPanel = wrapper.find(ActivityPanel);
    activityPanel.prop('cancelSelectedOpptjeningActivity')();

    const initCalls = formInitCallback.getCalls();
    expect(initCalls).to.have.length(1);
    expect(initCalls[0].args).to.have.length(2);
    expect(initCalls[0].args[0]).to.eql('Behandling_123.ActivityPanel');
    expect(initCalls[0].args[1]).to.eql({});

    expect(wrapper.state().selectedOpptjeningActivity).is.undefined;
  });
});
