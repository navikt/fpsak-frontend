import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Hovedknapp } from 'nav-frontend-knapper';

import { FormattedMessage } from 'react-intl';
import { PeriodpickerField, SelectField, RadioGroupField } from 'form/Fields';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import OAType from 'kodeverk/opptjeningAktivitetType';
import { ActivityPanel } from './ActivityPanel';

describe('<ActivityPanel>', () => {
  const opptjeningAktivitetTypes = [{
    kode: OAType.ARBEID,
    navn: 'Arbeid',
  }, {
    kode: OAType.NARING,
    navn: 'Næring',
  }];

  it('skal vise periodevelger som aktiv når aktivitet ikke er godkjent eller avvist og en har aksjonspunkt', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: undefined,
      begrunnelse: undefined,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt
      activityId={1}
    />);

    const periodevelger = wrapper.find(PeriodpickerField);
    expect(periodevelger).to.have.length(1);
    expect(periodevelger.prop('readOnly')).is.false;
  });

  it('skal vise periodevelger som aktiv når aktivitet er manuelt lagt til', () => {
    const activity = {
      erManueltOpprettet: true,
      erGodkjent: true,
      begrunnelse: 'en begrunnelse',
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt
      activityId={1}
    />);

    const periodevelger = wrapper.find(PeriodpickerField);
    expect(periodevelger).to.have.length(1);
    expect(periodevelger.prop('readOnly')).is.false;
  });

  it('skal vise periodevelger som aktiv når aktivitet er markert med erEndret', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      erEndret: true,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt
      activityId={1}
    />);

    const periodevelger = wrapper.find(PeriodpickerField);
    expect(periodevelger).to.have.length(1);
    expect(periodevelger.prop('readOnly')).is.false;
  });

  it('skal vise periodevelger som disablet når aktivitet er godkjent automatisk og en ikke har aksjonspunkt', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt={false}
      activityId={1}
    />);

    const periodevelger = wrapper.find(PeriodpickerField);
    expect(periodevelger).to.have.length(1);
    expect(periodevelger.prop('readOnly')).is.true;
  });

  it('skal vise antall månder og dager i valgt periode', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt={false}
      activityId={1}
    />);

    const daysInPeriodLabel = wrapper.find(FormattedMessage);
    expect(daysInPeriodLabel).to.have.length(2);
    expect(daysInPeriodLabel.at(1).prop('values')).is.eql({
      days: 17,
      months: 4,
    });
  });

  it('skal vise nedtrekksliste med opptjeningsaktiviteter når saksbehandler manuelt har lagt til aktivitet', () => {
    const activity = {
      erManueltOpprettet: true,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt
      activityId={1}
    />);

    const select = wrapper.find(SelectField);
    expect(select).to.have.length(1);
    expect(select.prop('selectValues').map(sv => sv.key)).is.eql([OAType.ARBEID, OAType.NARING]);
    expect(select.prop('readOnly')).is.false;
  });


  it('skal kun vise valgt opptjeningsaktivitet når aktivitet ikke manuelt er lagt til', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt
      activityId={1}
    />);

    const select = wrapper.find(SelectField);
    expect(select).to.have.length(1);
    expect(select.prop('readOnly')).is.true;
  });

  it('skal kunne oppdatere aktivitet når den er del av aksjonspunktet', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: undefined,
      begrunnelse: undefined,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt
      activityId={1}
    />);

    expect(wrapper.find(Hovedknapp)).to.have.length(1);
    expect(wrapper.find(RadioGroupField)).to.have.length(1);
  });


  it('skal ikke kunne oppdatere aktivitet når den ikke er manuelt lagt til eller del av aksjonspunkt', () => {
    const activity = {
      erManueltOpprettet: false,
      erGodkjent: true,
      begrunnelse: undefined,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt={false}
      activityId={1}
    />);

    expect(wrapper.find(Hovedknapp)).to.have.length(0);
  });

  it('skal ikke kunne godkjenne eller avvise aksjonspunkt når aktivitet manuelt er lagt til', () => {
    const activity = {
      erManueltOpprettet: true,
      erGodkjent: undefined,
      begrunnelse: undefined,
    };

    const wrapper = shallowWithIntl(<ActivityPanel
      {...reduxFormPropsMock}
      intl={intlMock}
      initialValues={activity}
      readOnly={false}
      opptjeningAktivitetTypes={opptjeningAktivitetTypes}
      cancelSelectedOpptjeningActivity={sinon.spy()}
      selectedActivityType={{ kode: OAType.ARBEID, navn: 'ARBEID' }}
      opptjeningFom="2017-08-15"
      opptjeningTom="2017-12-31"
      hasAksjonspunkt
      activityId={1}
    />);

    expect(wrapper.find(Hovedknapp)).to.have.length(1);
    expect(wrapper.find(RadioGroupField)).to.have.length(0);
  });
});
