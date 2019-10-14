import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { RadioGroupField } from '@fpsak-frontend/form';
import {
  Table, TableRow, TableColumn, EditedIcon,
} from '@fpsak-frontend/shared-components';
import VurderAktiviteterTabell, { VurderAktiviteterTabellImpl, lagAktivitetFieldId, skalVurdereAktivitet } from './VurderAktiviteterTabell';


const aktivitet1 = {
  arbeidsgiverNavn: 'Arbeidsgiveren',
  arbeidsgiverId: '384723894723',
  fom: '2019-01-01',
  tom: null,
  skalBrukes: null,
  arbeidsforholdType: { kode: 'ARBEID' },
};

const aktivitet2 = {
  arbeidsgiverNavn: 'Arbeidsgiveren2',
  arbeidsgiverId: '334534623342',
  arbeidsforholdId: 'efj8343f34f',
  eksternArbeidsforholdId: '123456',
  fom: '2019-01-01',
  tom: '2019-02-02',
  skalBrukes: true,
  arbeidsforholdType: { kode: 'ARBEID' },
};

const aktivitet3 = {
  arbeidsgiverNavn: 'Arbeidsgiveren3',
  aktørId: { aktørId: '324234234234' },
  arbeidsgiverId: '1960-01-01',
  arbeidsforholdId: 'efj8343f34f',
  eksternArbeidsforholdId: '56789',
  fom: '2019-01-01',
  tom: '2019-02-02',
  skalBrukes: false,
  arbeidsforholdType: { kode: 'ARBEID' },
};


const aktivitetAAP = {
  arbeidsgiverNavn: null,
  arbeidsgiverId: null,
  arbeidsforholdType: { kode: 'AAP' },
  fom: '2019-01-01',
  tom: '2020-02-02',
  skalBrukes: null,
};

const aktivitetVentelonnVartpenger = {
  arbeidsgiverNavn: null,
  arbeidsgiverId: null,
  arbeidsforholdType: { kode: 'VENTELØNN_VARTPENGER' },
  fom: '2019-01-01',
  tom: '2020-02-02',
  skalBrukes: null,
};

const aktiviteter = [
  aktivitet1,
  aktivitet2,
  aktivitet3,
  aktivitetAAP,
];

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === 'ARBEID') {
    return 'Arbeid';
  }
  if (kodeverk.kode === 'AAP') {
    return 'Arbeidsavklaringspenger';
  }
  return '';
};

describe('<VurderAktiviteterTabell>', () => {
  it('skal vise tabell', () => {
    const wrapper = shallow(<VurderAktiviteterTabellImpl
      readOnly={false}
      isAksjonspunktClosed
      aktiviteter={aktiviteter}
      skjaeringstidspunkt="2019-02-01"
      getKodeverknavn={getKodeverknavn}
      erOverstyrt={false}
      harAksjonspunkt
    />);

    const heading = wrapper.find(FormattedMessage).first();
    expect(heading.props().id).to.equal('VurderAktiviteterTabell.FullAAPKombinert.Overskrift');

    const table = wrapper.find(Table);
    expect(table).has.length(1);
    const rows = table.find(TableRow);
    expect(rows).has.length(4);

    const cols = rows.first().find(TableColumn);
    expect(cols).has.length(4);
    const radios1 = rows.first().find(RadioGroupField);
    expect(radios1).has.length(2);
    radios1.forEach((radio) => {
      expect(radio.props().readOnly).to.equal(false);
    });

    const cols2 = rows.at(1).find(TableColumn);
    expect(cols2).has.length(4);
    const radios2 = rows.at(1).find(RadioGroupField);
    expect(radios2).has.length(2);
    radios2.forEach((radio) => {
      expect(radio.props().readOnly).to.equal(false);
    });

    const cols3 = rows.last().find(TableColumn);
    expect(cols3).has.length(4);
    const radios3 = rows.last().find(RadioGroupField);
    expect(radios3).has.length(2);
    radios3.forEach((radio) => {
      expect(radio.props().readOnly).to.equal(true);
    });
  });

  it('skal vise tabell med ventelønn/vartpenger overskrift', () => {
    const utenAAP = [
      aktivitet1,
      aktivitet2,
      aktivitetVentelonnVartpenger,
    ];
    const wrapper = shallow(<VurderAktiviteterTabellImpl
      readOnly={false}
      isAksjonspunktClosed
      aktiviteter={utenAAP}
      skjaeringstidspunkt="2019-02-01"
      getKodeverknavn={getKodeverknavn}
      erOverstyrt={false}
      harAksjonspunkt
    />);

    const heading = wrapper.find(FormattedMessage).first();
    expect(heading.props().id).to.equal('VurderAktiviteterTabell.VentelonnVartpenger.Overskrift');

    const table = wrapper.find(Table);
    expect(table).has.length(1);
    const rows = table.find(TableRow);
    expect(rows).has.length(3);

    rows.forEach((row) => {
      const radios = row.find(RadioGroupField);
      expect(radios).has.length(2);
      radios.forEach((radio) => {
        expect(radio.props().readOnly).to.equal(false);
      });
    });
  });

  it('skal vise tabell med gul mann kolonne for alle rader unntatt AAP', () => {
    const wrapper = shallow(<VurderAktiviteterTabellImpl
      readOnly
      isAksjonspunktClosed
      aktiviteter={aktiviteter}
      skjaeringstidspunkt="2019-02-01"
      getKodeverknavn={getKodeverknavn}
      erOverstyrt={false}
      harAksjonspunkt
    />);

    const heading = wrapper.find(FormattedMessage).first();
    expect(heading.props().id).to.equal('VurderAktiviteterTabell.FullAAPKombinert.Overskrift');


    const table = wrapper.find(Table);
    expect(table).has.length(1);
    const rows = table.find(TableRow);
    expect(rows).has.length(4);

    const cols = rows.first().find(TableColumn);
    expect(cols).has.length(5);
    const radios1 = rows.first().find(RadioGroupField);
    expect(radios1).has.length(2);
    radios1.forEach((radio) => {
      expect(radio.props().readOnly).to.equal(true);
    });
    const edited1 = rows.first().find(EditedIcon);
    expect(edited1).has.length(1);

    const cols2 = rows.at(1).find(TableColumn);
    expect(cols2).has.length(5);
    const radios2 = rows.at(1).find(RadioGroupField);
    expect(radios2).has.length(2);
    radios2.forEach((radio) => {
      expect(radio.props().readOnly).to.equal(true);
    });
    const edited2 = rows.at(1).find(EditedIcon);
    expect(edited2).has.length(1);

    const cols3 = rows.last().find(TableColumn);
    expect(cols3).has.length(5);
    const radios3 = rows.last().find(RadioGroupField);
    expect(radios3).has.length(2);
    radios3.forEach((radio) => {
      expect(radio.props().readOnly).to.equal(true);
    });
    const edited3 = rows.last().find(EditedIcon);
    expect(edited3).has.length(0);
  });

  const id1 = '3847238947232019-01-01';
  it('skal lage id for arbeid', () => {
    const idArbeid = lagAktivitetFieldId(aktivitet1);
    expect(idArbeid).to.equal(id1);
  });

  const id2 = '334534623342efj8343f34f2019-01-01';
  it('skal lage id for arbeid med arbeidsforholdId', () => {
    const idArbeid = lagAktivitetFieldId(aktivitet2);
    expect(idArbeid).to.equal(id2);
  });

  const id3 = '1960-01-01efj8343f34f2019-01-01';
  it('skal lage id for arbeid med aktørId', () => {
    const idArbeid = lagAktivitetFieldId(aktivitet3);
    expect(idArbeid).to.equal(id3);
  });

  const idAAP = 'AAP2019-01-01';
  it('skal lage id for AAP', () => {
    const idArbeid = lagAktivitetFieldId(aktivitetAAP);
    expect(idArbeid).to.equal(idAAP);
  });

  it('skal bygge initial values', () => {
    const initialValues = VurderAktiviteterTabell.buildInitialValues(aktiviteter, getKodeverknavn, false, true);
    expect(initialValues[id1].beregningAktivitetNavn).to.equal('Arbeidsgiveren (384723894723)');
    expect(initialValues[id1].fom).to.equal('2019-01-01');
    expect(initialValues[id1].tom).to.equal(null);
    expect(initialValues[id1].skalBrukes).to.equal(null);

    expect(initialValues[id2].beregningAktivitetNavn).to.equal('Arbeidsgiveren2 (334534623342)...3456');
    expect(initialValues[id2].fom).to.equal('2019-01-01');
    expect(initialValues[id2].tom).to.equal('2019-02-02');
    expect(initialValues[id2].skalBrukes).to.equal(true);

    expect(initialValues[id3].beregningAktivitetNavn).to.equal('Arbeidsgiveren3 (1960-01-01)...6789');
    expect(initialValues[id3].fom).to.equal('2019-01-01');
    expect(initialValues[id3].tom).to.equal('2019-02-02');
    expect(initialValues[id3].skalBrukes).to.equal(false);

    expect(initialValues[idAAP].beregningAktivitetNavn).to.equal('Arbeidsavklaringspenger');
    expect(initialValues[idAAP].fom).to.equal('2019-01-01');
    expect(initialValues[idAAP].tom).to.equal('2020-02-02');
    expect(initialValues[idAAP].skalBrukes).to.equal(true);
  });

  it('skal bygge initial values for overstyrer', () => {
    const initialValues = VurderAktiviteterTabell.buildInitialValues(aktiviteter, getKodeverknavn, false, false);
    expect(initialValues[id1].beregningAktivitetNavn).to.equal('Arbeidsgiveren (384723894723)');
    expect(initialValues[id1].fom).to.equal('2019-01-01');
    expect(initialValues[id1].tom).to.equal(null);
    expect(initialValues[id1].skalBrukes).to.equal(true);

    expect(initialValues[id2].beregningAktivitetNavn).to.equal('Arbeidsgiveren2 (334534623342)...3456');
    expect(initialValues[id2].fom).to.equal('2019-01-01');
    expect(initialValues[id2].tom).to.equal('2019-02-02');
    expect(initialValues[id2].skalBrukes).to.equal(true);

    expect(initialValues[id3].beregningAktivitetNavn).to.equal('Arbeidsgiveren3 (1960-01-01)...6789');
    expect(initialValues[id3].fom).to.equal('2019-01-01');
    expect(initialValues[id3].tom).to.equal('2019-02-02');
    expect(initialValues[id3].skalBrukes).to.equal(false);

    expect(initialValues[idAAP].beregningAktivitetNavn).to.equal('Arbeidsavklaringspenger');
    expect(initialValues[idAAP].fom).to.equal('2019-01-01');
    expect(initialValues[idAAP].tom).to.equal('2020-02-02');
    expect(initialValues[idAAP].skalBrukes).to.equal(true);
  });

  it('skal transform values', () => {
    const values = {};
    values[id1] = { skalBrukes: true };
    values[id2] = { skalBrukes: false };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: true };
    const transformed = VurderAktiviteterTabell.transformValues(values, aktiviteter);
    expect(transformed.length).to.equal(2);
    expect(transformed[0].oppdragsgiverOrg).to.equal('334534623342');
    expect(transformed[0].arbeidsforholdRef).to.equal(aktivitet2.arbeidsforholdId);
    expect(transformed[0].fom).to.equal('2019-01-01');
    expect(transformed[0].tom).to.equal('2019-02-02');
    expect(transformed[0].arbeidsgiverIdentifikator).to.equal(null);
    expect(transformed[0].skalBrukes).to.equal(false);

    expect(transformed[1].oppdragsgiverOrg).to.equal(null);
    expect(transformed[1].arbeidsforholdRef).to.equal(aktivitet3.arbeidsforholdId);
    expect(transformed[1].fom).to.equal('2019-01-01');
    expect(transformed[1].tom).to.equal('2019-02-02');
    expect(transformed[1].arbeidsgiverIdentifikator).to.equal('324234234234');
    expect(transformed[1].skalBrukes).to.equal(false);
  });

  it('skal ikkje vurdere AAP for ikkje overstyring', () => {
    const skalVurderes = skalVurdereAktivitet(aktivitetAAP, false, true);
    expect(skalVurderes).to.equal(false);
  });

  it('skal vurdere annen aktivitet for overstyring', () => {
    const skalVurderes = skalVurdereAktivitet(aktivitet1, true, true);
    expect(skalVurderes).to.equal(true);
  });

  it('skal vurdere annen aktivitet for ikkje overstyring', () => {
    const skalVurderes = skalVurdereAktivitet(aktivitet1, false, true);
    expect(skalVurderes).to.equal(true);
  });

  it('skal ikkje vurdere annen aktivitet for ikkje overstyring uten aksjonspunkt', () => {
    const skalVurderes = skalVurdereAktivitet(aktivitet1, false, false);
    expect(skalVurderes).to.equal(false);
  });
});
