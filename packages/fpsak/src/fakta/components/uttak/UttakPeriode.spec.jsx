import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import UttakPeriode from './UttakPeriode';
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

const fieldNames = ['periode[0]', 'periode[1]'];
const perioder = [{
  id: '345435345-34235-344',
  tom: '2017-10-10',
  fom: '2017-01-01',
  uttakPeriodeType: {},
  bekreftet: true,
  utsettelseÅrsak: {},
  overføringÅrsak: {},
  openForm: false,
  isFromSøknad: true,
  erArbeidstaker: false,
  samtidigUttak: false,
  flerbarnsdager: false,
}, {
  id: '32434-334534-222',
  tom: '2018-10-10',
  fom: '2018-10-01',
  uttakPeriodeType: {},
  bekreftet: false,
  utsettelseÅrsak: {},
  overføringÅrsak: {},
  openForm: true,
  isFromSøknad: true,
  erArbeidstaker: true,
  samtidigUttak: false,
  flerbarnsdager: false,
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
const endringsDato = '2018-08-01';


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
      isRevurdering={false}
      samtidigUttak={perioder[0].samtidigUttak}
      flerbarnsdager={perioder[0].flerbarnsdager}
      endringsDato={endringsDato}
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
      isRevurdering={false}
      samtidigUttak={perioder[0].samtidigUttak}
      flerbarnsdager={perioder[0].flerbarnsdager}
      endringsDato={endringsDato}
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
      isRevurdering={false}
      samtidigUttak={perioder[0].samtidigUttak}
      flerbarnsdager={perioder[0].flerbarnsdager}
      endringsDato={endringsDato}
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
      endringsDato={endringsDato}
      isRevurdering={false}
      samtidigUttak={perioder[0].samtidigUttak}
      flerbarnsdager={perioder[0].flerbarnsdager}
      {...otherProps}
    />);

    const periodeContainer = wrapper.find('div.periodeContainer');
    const alertStripe = wrapper.find('AlertStripe');
    expect(periodeContainer.at(1).hasClass('active')).to.equal(true);
    expect(alertStripe).to.have.length(1);
  });
});
