import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { UttakPeriode } from './UttakPeriode';
import UttakPeriodeType from './UttakPeriodeType';
import UttakPeriodeInnhold from './UttakPeriodeInnhold';

const getMockedFields = (fieldNames, perioder) => {
  const field = {
    get: idx => perioder[idx],
  };
  return {
    map: callback => fieldNames.map((fieldname, idx) => callback(fieldname, idx, field)),
  };
};

const getKodeverknavn = () => undefined;
const fieldNames = ['periode[0]', 'periode[1]'];
const perioder = [{
  id: '345435345-34235-344',
  tom: '2017-10-10',
  fom: '2017-01-01',
  uttakPeriodeType: {},
  bekreftet: true,
  utsettelseÅrsak: {},
  overføringÅrsak: {},
  oppholdÅrsak: {
    kode: '-',
  },
  openForm: false,
  isFromSøknad: true,
  erArbeidstaker: false,
  samtidigUttak: false,
  flerbarnsdager: false,
  arbeidsgiver: {},
}, {
  id: '32434-334534-222',
  tom: '2018-10-10',
  fom: '2018-10-01',
  uttakPeriodeType: {},
  bekreftet: false,
  utsettelseÅrsak: {},
  overføringÅrsak: {},
  oppholdÅrsak: {
    kode: '-',
  },
  openForm: true,
  isFromSøknad: true,
  erArbeidstaker: true,
  samtidigUttak: false,
  flerbarnsdager: false,
  arbeidsgiver: {},
}];
const inntektsmeldinger = [{
  arbeidsgiver: '',
}];
const openSlettPeriodeModalCallback = sinon.spy();
const updatePeriode = sinon.spy();
const editPeriode = sinon.spy();
const cancelEditPeriode = sinon.spy();
const isAnyFormOpen = sinon.spy();
const meta = {
  error: undefined,
};
const endringsdato = '2018-08-01';

describe('<UttakPeriode>', () => {
  it('skal vise UttakPeriode', () => {
    const wrapper = shallow(<UttakPeriode
      fields={getMockedFields(fieldNames, perioder)}
      inntektsmeldinger={inntektsmeldinger}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      updatePeriode={updatePeriode}
      editPeriode={editPeriode}
      cancelEditPeriode={cancelEditPeriode}
      isAnyFormOpen={isAnyFormOpen}
      isNyPeriodeFormOpen
      perioder={perioder}
      isFromSøknad={perioder[0].isFromSøknad}
      meta={meta}
      inntektsmeldingInfo={[]}
      readOnly
      samtidigUttak={perioder[0].samtidigUttak}
      flerbarnsdager={perioder[0].flerbarnsdager}
      endringsdato={endringsdato}
      getKodeverknavn={getKodeverknavn}
    />);
    const uttakPeriodeType = wrapper.find(UttakPeriodeType);
    expect(uttakPeriodeType).to.have.length(2);
    const uttakPeriodeInnhold = wrapper.find(UttakPeriodeInnhold);
    expect(uttakPeriodeInnhold).to.have.length(2);
  });

  it('skal ikke gi class active til perioder som er bekreftet,', () => {
    const wrapper = shallow(<UttakPeriode
      fields={getMockedFields(fieldNames, perioder)}
      inntektsmeldinger={inntektsmeldinger}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      updatePeriode={updatePeriode}
      editPeriode={editPeriode}
      cancelEditPeriode={cancelEditPeriode}
      isAnyFormOpen={isAnyFormOpen}
      isNyPeriodeFormOpen
      perioder={perioder}
      meta={meta}
      inntektsmeldingInfo={[]}
      readOnly
      isFromSøknad={perioder[0].isFromSøknad}
      samtidigUttak={perioder[0].samtidigUttak}
      flerbarnsdager={perioder[0].flerbarnsdager}
      endringsdato={endringsdato}
      getKodeverknavn={getKodeverknavn}
    />);

    const periodeContainer = wrapper.find('div.periodeContainer');
    expect(periodeContainer.at(0).hasClass('active')).to.equal(false);
  });

  it('skal gi class active til perioder som er ikke bekreftet og ikke readOnly,', () => {
    const wrapper = shallow(<UttakPeriode
      fields={getMockedFields(fieldNames, perioder)}
      inntektsmeldinger={inntektsmeldinger}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      updatePeriode={updatePeriode}
      editPeriode={editPeriode}
      cancelEditPeriode={cancelEditPeriode}
      isAnyFormOpen={isAnyFormOpen}
      isNyPeriodeFormOpen
      perioder={perioder}
      meta={meta}
      isFromSøknad={perioder[0].isFromSøknad}
      inntektsmeldingInfo={[]}
      readOnly={false}
      samtidigUttak={perioder[0].samtidigUttak}
      flerbarnsdager={perioder[0].flerbarnsdager}
      endringsdato={endringsdato}
      getKodeverknavn={getKodeverknavn}
    />);

    const periodeContainer = wrapper.find('div.periodeContainer');
    expect(periodeContainer.at(1).hasClass('active')).to.equal(true);
  });

  it('skal vise alert hvis det er noe error', () => {
    const otherProps = {
      meta: {
        error: 'Perioder overlapper',
      },
    };
    const wrapper = shallow(<UttakPeriode
      fields={getMockedFields(fieldNames, perioder)}
      inntektsmeldinger={inntektsmeldinger}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      updatePeriode={updatePeriode}
      editPeriode={editPeriode}
      cancelEditPeriode={cancelEditPeriode}
      isAnyFormOpen={isAnyFormOpen}
      perioder={perioder}
      meta={meta}
      isFromSøknad={perioder[0].isFromSøknad}
      inntektsmeldingInfo={[]}
      isNyPeriodeFormOpen
      readOnly={false}
      endringsdato={endringsdato}
      samtidigUttak={perioder[0].samtidigUttak}
      flerbarnsdager={perioder[0].flerbarnsdager}
      getKodeverknavn={getKodeverknavn}
      {...otherProps}
    />);

    const periodeContainer = wrapper.find('div.periodeContainer');
    const alertStripe = wrapper.find('AlertStripe');
    expect(periodeContainer.at(1).hasClass('active')).to.equal(true);
    expect(alertStripe).to.have.length(1);
  });
});
