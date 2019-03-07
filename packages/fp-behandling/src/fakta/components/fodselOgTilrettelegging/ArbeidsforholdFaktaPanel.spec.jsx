import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';

import { ArbeidsforholdFaktaPanel } from './ArbeidsforholdFaktaPanel';
import ArbeidsforholdTable from './ArbeidsforholdTable';
import ArbeidsforholdInnhold from './ArbeidsforholdInnhold';

describe('<ArbeidsforholdFaktaPanel>', () => {
  const tilrettelegging = {
    termindato: '2019-08-01',
    arbforhold: [{
      id: 123,
      jordmor: {
        tilretteleggingFra: '2019-04-18',
      },
      navn: 'Xansen flyttebyrå AS',
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
      id: 456,
      jordmor: {
        tilretteleggingFra: '2019-06-20',
      },
      navn: 'Rema 100',
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
      arbforhold={tilrettelegging.arbforhold}
      readOnly
      behandlingFormPrefix=""
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
    />);
    const faktaGruppe = wrapper.find(FaktaGruppe);
    expect(faktaGruppe).has.length(1);
    expect(faktaGruppe.prop('titleCode')).to.eql('ArbeidsforholdFaktaPanel.Faktagruppe');
    const arbforholdTable = faktaGruppe.find(ArbeidsforholdTable);
    expect(arbforholdTable).has.length(1);
    const arbforholdInnhold = wrapper.find(ArbeidsforholdInnhold);
    expect(arbforholdInnhold).has.length(0);
  });
  it('skal vise ArbeidsforholdInnhold for arbforholdet som er valgt', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdFaktaPanel
      arbforhold={tilrettelegging.arbforhold}
      readOnly
      behandlingFormPrefix=""
      reduxFormChange={sinon.spy()}
      reduxFormInitialize={sinon.spy()}
    />);
    wrapper.setState({ selectedArbeidsforhold: tilrettelegging.arbforhold[0] });
    const faktaGruppe = wrapper.find(FaktaGruppe);
    expect(faktaGruppe).has.length(1);
    expect(faktaGruppe.prop('titleCode')).to.eql('ArbeidsforholdFaktaPanel.Faktagruppe');
    const arbforholdTable = faktaGruppe.find(ArbeidsforholdTable);
    expect(arbforholdTable).has.length(1);
    const arbforholdInnhold = wrapper.find(ArbeidsforholdInnhold);
    expect(arbforholdInnhold).has.length(1);
  });
});
