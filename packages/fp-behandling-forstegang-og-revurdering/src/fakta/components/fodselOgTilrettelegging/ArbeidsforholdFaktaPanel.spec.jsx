import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';

import { ArbeidsforholdFaktaPanel } from './ArbeidsforholdFaktaPanel';
import ArbeidsforholdTable from './ArbeidsforholdTable';
import ArbeidsforholdInnhold from './ArbeidsforholdInnhold';

describe('<ArbeidsforholdFaktaPanel>', () => {
  const tilrettelegging = {
    termindato: '2019-08-01',
    fødselsdato: null,
    begrunnelse: '',
    arbeidsforholdListe: [{
      tilretteleggingBehovFom: '2019-04-18',
      arbeidsgiverNavn: 'Xansen flyttebyrå AS',
      arbeidsgiverIdent: 1234,
      kanGjennomfores: {
        kanGjennomfores: true,
        dato: '2019-05-30',
      },
      kanIkkeGjennomfores: {
        kanIkkeGjennomfores: false,
        dato: '',
      },
      redusertArbeid: {
        redusertArbeid: true,
        dato: '2019-04-18',
        stillingsprosent: 50,
      },
      begrunnelse: '',
    }, {
      tilretteleggingBehovFom: '2019-06-20',
      arbeidsgiverNavn: 'Rema 100',
      arbeidsgiverIdent: 98754,
      kanGjennomfores: {
        kanGjennomfores: false,
        dato: '',
      },
      kanIkkeGjennomfores: {
        kanIkkeGjennomfores: true,
        dato: '2019-06-20',
      },
      redusertArbeid: {
        redusertArbeid: false,
        dato: '',
        stillingsprosent: null,
      },
      begrunnelse: '',
    }],
  };
  it('skal vise faktaform med liste av arbeidsforhold', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdFaktaPanel
      arbeidsforhold={tilrettelegging.arbeidsforholdListe}
      readOnly
      behandlingFormPrefix=""
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
    />);
    const faktaGruppe = wrapper.find(FaktaGruppe);
    expect(faktaGruppe).has.length(1);
    expect(faktaGruppe.prop('titleCode')).to.eql('ArbeidsforholdFaktaPanel.Faktagruppe');
    const arbforholdTable = wrapper.find(ArbeidsforholdTable);
    expect(arbforholdTable).has.length(1);
    const arbforholdInnhold = wrapper.find(ArbeidsforholdInnhold);
    expect(arbforholdInnhold).has.length(0);
  });
  it('skal vise ArbeidsforholdInnhold for arbforholdet som er valgt', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdFaktaPanel
      arbeidsforhold={tilrettelegging.arbeidsforholdListe}
      readOnly
      behandlingFormPrefix=""
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
    />);
    wrapper.setState({ selectedArbeidsforhold: tilrettelegging.arbeidsforholdListe[0] });
    const faktaGruppe = wrapper.find(FaktaGruppe);
    expect(faktaGruppe).has.length(1);
    expect(faktaGruppe.prop('titleCode')).to.eql('ArbeidsforholdFaktaPanel.Faktagruppe');
    const arbforholdTable = wrapper.find(ArbeidsforholdTable);
    expect(arbforholdTable).has.length(1);
    const arbforholdInnhold = wrapper.find(ArbeidsforholdInnhold);
    expect(arbforholdInnhold).has.length(1);
  });
});
