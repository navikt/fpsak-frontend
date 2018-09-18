import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  FodselSammenligningOtherPanel, getTerminFodselLabel, getAntallBarn, getTerminOrFodselDate, getTerminFodselHeader,
}
  from './FodselSammenligningOtherPanel';

describe('<FodselSammenligningOtherPanel>', () => {
  it('skal vise utstedt dato når denne finnes', () => {
    const wrapper = shallow(<FodselSammenligningOtherPanel
      terminOrFodselLabel="FodselsammenligningPanel.Fodselsdato"
      terminOrFodselDate="2018-10-10"
      terminFodselHeader="FodselsammenligningPanel.OpplysningerISoknad"
      antallBarnSoknad={1}
      utstedtdato="2018-08-10"
    />);

    expect(wrapper.find("[id='FodselsammenligningPanel.UstedtDato']")).to.have.length(1);
    const normaltekstFields = wrapper.find(Normaltekst);
    expect(normaltekstFields).to.have.length(6);
    expect(normaltekstFields.at(3).childAt(0).text()).to.eql('10.08.2018');
  });

  it('skal ikke vise utstedt dato når denne ikke finnes', () => {
    const wrapper = shallow(<FodselSammenligningOtherPanel
      terminOrFodselLabel="FodselsammenligningPanel.Fodselsdato"
      terminOrFodselDate="2018-10-10"
      terminFodselHeader="FodselsammenligningPanel.OpplysningerISoknad"
      antallBarnSoknad={1}
    />);

    expect(wrapper.find("[id='FodselsammenligningPanel.UstedtDato']")).to.have.length(0);
    const normaltekstFields = wrapper.find(Normaltekst);
    expect(normaltekstFields).to.have.length(4);
  });

  it('skal vise fødselstekst når en har minst en fødselsdato', () => {
    const fodselsdatoer = {
      1: '2017-10-10',
    };
    const textCode = getTerminFodselLabel.resultFunc(fodselsdatoer);
    expect(textCode).to.eql('FodselsammenligningPanel.Fodselsdato');
  });

  it('skal vise termindatotekst når en ikke har fødselsdato', () => {
    const fodselsdatoer = {};
    const textCode = getTerminFodselLabel.resultFunc(fodselsdatoer);
    expect(textCode).to.eql('FodselsammenligningPanel.Termindato');
  });

  it('skal vise termindato fra familiehendelse når denne finnes', () => {
    const hasSoknad = false;
    const termindatoSoknad = undefined;
    const fodselsdatoerSoknad = undefined;
    const termindato = '2017-10-10';

    const date = getTerminOrFodselDate.resultFunc(hasSoknad, termindatoSoknad, fodselsdatoerSoknad, termindato);
    expect(date).to.eql('10.10.2017');
  });

  it('skal returnere null når en ikke har familiehendelse og heller ikke søknad', () => {
    const hasSoknad = false;
    const termindatoSoknad = undefined;
    const fodselsdatoerSoknad = undefined;
    const termindato = undefined;

    const date = getTerminOrFodselDate.resultFunc(hasSoknad, termindatoSoknad, fodselsdatoerSoknad, termindato);
    expect(date).is.null;
  });

  it('skal vise fødselsdato fra søknad når denne finnes og en ikke har familiehendelse', () => {
    const hasSoknad = true;
    const termindatoSoknad = undefined;
    const fodselsdatoerSoknad = {
      1: '2017-10-10',
    };
    const termindato = undefined;

    const date = getTerminOrFodselDate.resultFunc(hasSoknad, termindatoSoknad, fodselsdatoerSoknad, termindato);
    expect(date).to.eql('10.10.2017');
  });

  it('skal vise termindato fra søknad når denne finnes og en ikke har familiehendelse', () => {
    const hasSoknad = true;
    const termindatoSoknad = '2017-02-01';
    const fodselsdatoerSoknad = {};
    const termindato = undefined;

    const date = getTerminOrFodselDate.resultFunc(hasSoknad, termindatoSoknad, fodselsdatoerSoknad, termindato);
    expect(date).to.eql('01.02.2017');
  });

  it('skal vise antall barn fra søknad når familiehendelse ikke finnes', () => {
    const antallBarnSoknad = 1;
    const antallBarnTermin = undefined;
    const antallBarn = getAntallBarn.resultFunc(antallBarnSoknad, antallBarnTermin);
    expect(antallBarn).to.eql(1);
  });

  it('skal vise fødselsdato fra søknad når en har minst en fødselsdato', () => {
    const fodselsdatoer = {
      1: '2017-10-10',
    };
    const textCode = getTerminFodselHeader.resultFunc(fodselsdatoer);
    expect(textCode).to.eql('FodselSammenligningOtherPanel.OpplysningerISoknad');
  });

  it('skal vise termindato fra søknad når en ikke har fødselsdato', () => {
    const fodselsdatoer = {};
    const textCode = getTerminFodselHeader.resultFunc(fodselsdatoer);
    expect(textCode).to.eql('FodselSammenligningOtherPanel.TerminISoknad');
  });
});
