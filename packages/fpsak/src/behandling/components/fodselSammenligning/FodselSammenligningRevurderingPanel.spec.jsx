import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  FodselSammenligningRevurderingPanel, getIsTermin, getTerminDateOrFodselDate, getAntallBarn,
  showVedtaksdatoAsSvangerskapsuke,
} from './FodselSammenligningRevurderingPanel';

describe('<FodselSammenligningRevurderingPanel>', () => {
  it('skal vise vedtaksdato', () => {
    const wrapper = shallow(<FodselSammenligningRevurderingPanel
      vedtaksDato="2018-08-10"
      terminOrFodselLabel="FodselsammenligningPanel.Fodselsdato"
      terminOrFodselDate="2018-08-10"
      antallBarn={1}
      shouldShowVedtaksdatoAsSvangerskapsuke
    />);

    expect(wrapper.find("[id='FodselsammenligningPanel.Vedtaksdato']")).to.have.length(1);
    const normaltekstFields = wrapper.find(Normaltekst);
    expect(normaltekstFields).to.have.length(6);
    expect(normaltekstFields.at(3).childAt(0).text()).to.eql('2018-08-10');
  });

  it('skal ikke vise vedtaksdato', () => {
    const wrapper = shallow(<FodselSammenligningRevurderingPanel
      vedtaksDato="2018-08-10"
      terminOrFodselLabel="FodselsammenligningPanel.Fodselsdato"
      terminOrFodselDate="2018-08-10"
      antallBarn={1}
      shouldShowVedtaksdatoAsSvangerskapsuke={false}
    />);

    expect(wrapper.find("[id='FodselsammenligningPanel.Vedtaksdato']")).to.have.length(0);
    const normaltekstFields = wrapper.find(Normaltekst);
    expect(normaltekstFields).to.have.length(4);
  });

  it('skal være terminsøknad når original familiehendelse har termindato', () => {
    const originalSoknad = {};
    const orginalFamiliehendelse = {
      termindato: '2017-10-10',
    };

    const isTermin = getIsTermin.resultFunc(originalSoknad, orginalFamiliehendelse);

    expect(isTermin).is.true;
  });

  it('skal være terminsøknad når original søknad ikke har fødselsdatoer', () => {
    const originalSoknad = {
      fodselsdatoer: {},
    };
    const orginalFamiliehendelse = { };

    const isTermin = getIsTermin.resultFunc(originalSoknad, orginalFamiliehendelse);

    expect(isTermin).is.true;
  });

  it('skal ikke være terminsøknad når original søknad har fødselsdatoer', () => {
    const originalSoknad = {
      fodselsdatoer: {
        1: '2017-01-01',
      },
    };
    const orginalFamiliehendelse = { };

    const isTermin = getIsTermin.resultFunc(originalSoknad, orginalFamiliehendelse);

    expect(isTermin).is.false;
  });

  it('skal hente tom streng når en ikke har søknad eller familehendelse', () => {
    const isTermin = true;
    const originalSoknad = undefined;
    const orginalFamiliehendelse = undefined;

    const date = getTerminDateOrFodselDate.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(date).to.eql('');
  });

  it('skal hente termindato fra familehendelse når denne finnes', () => {
    const isTermin = true;
    const originalSoknad = {
      termindato: '2017-01-01',
    };
    const orginalFamiliehendelse = {
      termindato: '2017-02-02',
    };

    const date = getTerminDateOrFodselDate.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(date).to.eql('02.02.2017');
  });

  it('skal hente termindato fra søknad når familiehendelse ikke finnes', () => {
    const isTermin = true;
    const originalSoknad = {
      termindato: '2017-01-01',
    };
    const orginalFamiliehendelse = {};

    const date = getTerminDateOrFodselDate.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(date).to.eql('01.01.2017');
  });

  it('skal hente fødselsdato fra familehendelse når denne finnes', () => {
    const isTermin = false;
    const originalSoknad = {
      fodselsdatoer: {
        1: '2017-01-01',
      },
    };
    const orginalFamiliehendelse = {
      fodselsdato: '2017-02-02',
    };

    const date = getTerminDateOrFodselDate.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(date).to.eql('02.02.2017');
  });

  it('skal hente fødselsdato fra søknad når familiehendelse ikke finnes', () => {
    const isTermin = false;
    const originalSoknad = {
      fodselsdatoer: {
        1: '2017-01-01',
      },
    };
    const orginalFamiliehendelse = {};

    const date = getTerminDateOrFodselDate.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(date).to.eql('01.01.2017');
  });

  it('skal hente antall barn 0 når en ikke har søknad eller familehendelse', () => {
    const isTermin = true;
    const originalSoknad = undefined;
    const orginalFamiliehendelse = undefined;

    const antallBarn = getAntallBarn.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(antallBarn).to.eql(0);
  });

  it('skal hente antall barn termin fra familiehendelse når denne finnes', () => {
    const isTermin = true;
    const originalSoknad = {
      antallBarn: 1,
    };
    const orginalFamiliehendelse = {
      termindato: '2017-01-01',
      antallBarnTermin: 2,
    };

    const antallBarn = getAntallBarn.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(antallBarn).to.eql(2);
  });

  it('skal hente antall barn termin fra soknad når familiehendelse ikke finnes', () => {
    const isTermin = true;
    const originalSoknad = {
      antallBarn: 1,
    };
    const orginalFamiliehendelse = { };

    const antallBarn = getAntallBarn.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(antallBarn).to.eql(1);
  });

  it('skal hente antall barn fødsel fra familiehendelse når denne finnes', () => {
    const isTermin = false;
    const originalSoknad = {
      antallBarn: 1,
    };
    const orginalFamiliehendelse = {
      fodselsdato: '2017-01-01',
      antallBarnFodsel: 2,
    };

    const antallBarn = getAntallBarn.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(antallBarn).to.eql(2);
  });

  it('skal hente antall barn fødsel fra soknad når familiehendelse ikke finnes', () => {
    const isTermin = false;
    const originalSoknad = {
      antallBarn: 1,
    };
    const orginalFamiliehendelse = { };

    const antallBarn = getAntallBarn.resultFunc(isTermin, originalSoknad, orginalFamiliehendelse);

    expect(antallBarn).to.eql(1);
  });

  it('skal ikke vise vedtaksdato når en ikke har original familiehendelse', () => {
    const orginalFamiliehendelse = undefined;
    const vedtaksDato = '2017-01-01';

    const show = showVedtaksdatoAsSvangerskapsuke.resultFunc(orginalFamiliehendelse, vedtaksDato);

    expect(show).is.false;
  });

  it('skal ikke vise vedtaksdato når en har original familehendelse og fødselsdato', () => {
    const orginalFamiliehendelse = {
      fodselsdato: '2017-02-02',
    };
    const vedtaksDato = '2017-01-01';

    const show = showVedtaksdatoAsSvangerskapsuke.resultFunc(orginalFamiliehendelse, vedtaksDato);

    expect(show).is.false;
  });

  it('skal vise vedtaksdato når en har original familehendelse men ikke fødselsdato', () => {
    const orginalFamiliehendelse = { };
    const vedtaksDato = '2017-01-01';

    const show = showVedtaksdatoAsSvangerskapsuke.resultFunc(orginalFamiliehendelse, vedtaksDato);

    expect(show).is.true;
  });
});
