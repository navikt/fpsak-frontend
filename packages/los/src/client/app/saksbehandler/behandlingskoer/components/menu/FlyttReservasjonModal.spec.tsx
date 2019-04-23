
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { Form } from 'react-final-form';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import { FlyttReservasjonModal } from './FlyttReservasjonModal';

describe('<FlyttReservasjonModal>', () => {
  const oppgave = {
    id: 1,
    status: {
      erReservert: false,
      reservertTilTidspunkt: moment().add(2, 'hours').format(),
    },
    saksnummer: 1,
    behandlingId: 2,
    personnummer: '1234567',
    navn: 'Espen Utvikler',
    behandlingstype: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: '',
    },
    opprettetTidspunkt: '2017-01-01',
    behandlingsfrist: '2017-01-01',
    erTilSaksbehandling: true,
    fagsakYtelseType: {
      kode: fagsakYtelseType.FORELDREPRENGER,
      navn: 'FP',
    },
    behandlingStatus: {
      kode: behandlingStatus.OPPRETTET,
      navn: '',
    },
  };

  it('skal ikke vise saksbehandler før søk er utført', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {},
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
      />,
    ).find(Form).first().drill(props => props.render(formProps))
      .shallow();

    expect(wrapper.find(Normaltekst)).has.length(0);
  });

  it('skal vise at saksbehandler ikke finnes når søket er utført og ingen saksbehandler vart returnert', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {},
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig
      />,
    ).find(Form).first().drill(props => props.render(formProps))
      .shallow();

    const tekst = wrapper.find(Normaltekst);
    expect(tekst).has.length(1);
    expect(tekst.childAt(0).text()).is.eql('Kan ikke finne brukerident');
  });

  it('skal vise saksbehandler', () => {
    const saksbehandler = {
      brukerIdent: 'P039283',
      navn: 'Brukernavn',
      avdelingsnavn: ['Avdelingsnavn'],
    };
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {},
    };

    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig
        saksbehandler={saksbehandler}
      />,
    ).find(Form).first().drill(props => props.render(formProps))
      .shallow();

    const tekst = wrapper.find(Normaltekst);
    expect(tekst).has.length(1);
    expect(tekst.childAt(0).text()).is.eql('Brukernavn, Avdelingsnavn');
  });

  it('skal vise søkeknapp som enablet når en har skrive inn minst ett tegn og en ikke har startet søket', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
      },
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
      />,
    ).find(Form).first().drill(props => props.render(formProps))
      .shallow();

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.first().prop('disabled')).is.false;
  });

  it('skal vise søkeknapp som disablet når en ikke har skrevet noe i brukerident-feltet', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {},
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
      />,
    ).find(Form).first().drill(props => props.render(formProps))
      .shallow();

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.first().prop('disabled')).is.true;
  });

  it('skal vise søkeknapp som disablet når søk er startet', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
      },
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet
        erSaksbehandlerSokFerdig={false}
      />,
    ).find(Form).first().drill(props => props.render(formProps))
      .shallow();

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.first().prop('disabled')).is.true;
  });

  it('skal vise ok-knapp som enablet når en har saksbehandler og begrunnelsen er minst tre bokstaver', () => {
    const saksbehandler = {
      brukerIdent: 'P039283',
      navn: 'Brukernavn',
      avdelingsnavn: ['Avdelingsnavn'],
    };
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
        begrunnelse: 'oki',
      },
    };

    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
        saksbehandler={saksbehandler}
      />,
    ).find(Form).last().drill(props => props.render(formProps))
      .shallow();

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.last().prop('disabled')).is.false;
  });

  it('skal vise ok-knapp som disablet når en ikke har saksbehandler', () => {
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
        begrunnelse: 'oki',
      },
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
      />,
    ).find(Form).last().drill(props => props.render(formProps))
      .shallow();

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.last().prop('disabled')).is.true;
  });

  it('skal vise ok-knapp som disablet når begrunnelsen er mindre enn tre bokstaver', () => {
    const saksbehandler = {
      brukerIdent: 'P039283',
      navn: 'Brukernavn',
      avdelingsnavn: ['Avdelingsnavn'],
    };
    const formProps = {
      handleSubmit: sinon.spy(),
      values: {
        brukerIdent: '1',
        begrunnelse: 'ok',
      },
    };
    const wrapper = shallowWithIntl(
      <FlyttReservasjonModal
        intl={intlMock}
        showModal
        oppgave={oppgave}
        closeModal={sinon.spy()}
        submit={sinon.spy()}
        finnSaksbehandler={sinon.spy()}
        resetSaksbehandler={sinon.spy()}
        erSaksbehandlerSokStartet={false}
        erSaksbehandlerSokFerdig={false}
        saksbehandler={saksbehandler}
      />,
    ).find(Form).last().drill(props => props.render(formProps))
      .shallow();

    const knapper = wrapper.find(Hovedknapp);
    expect(knapper).has.length(1);
    expect(knapper.last().prop('disabled')).is.true;
  });
});
