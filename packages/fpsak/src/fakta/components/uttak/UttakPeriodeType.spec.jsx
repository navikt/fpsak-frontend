import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Image from 'sharedComponents/Image';
import UttakPeriodeType from './UttakPeriodeType';

describe('<UttakPeriodeType>', () => {
  const tilDato = '2018-01-10';
  const fraDato = '2018-02-31';
  const id = '7845345-34324-324234-342';
  const arbeidstidprosent = 50;
  const uttakPeriodeType = {};
  const utsettelseArsak = {};
  const openSlettPeriodeModalCallback = sinon.spy();
  const editPeriode = sinon.spy();
  const isAnyFormOpen = sinon.spy();
  const flerbarnsdager = false;
  const samtidigUttak = false;
  const arbeidsgiver = {
    identifikator: '1234567890',
    navn: 'Statoil',
  };

  it('skal vise redigere og slett periode hvis manuellOverstyring er true og readOnly er false', () => {
    const wrapper = shallow(<UttakPeriodeType
      tilDato={tilDato}
      fraDato={fraDato}
      id={id}
      uttakPeriodeType={uttakPeriodeType}
      utsettelseArsak={utsettelseArsak}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      editPeriode={editPeriode}
      isAnyFormOpen={isAnyFormOpen}
      overforingArsak={{}}
      readOnly={false}
      manuellOverstyring
      isNyPeriodeFormOpen={false}
      erArbeidstaker={false}
      samtidigUttak={samtidigUttak}
      flerbarnsdager={flerbarnsdager}
      isFromSøknad
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(2);
  });

  it('skal ikke vise redigere og slett periode hvis det er readonly', () => {
    const wrapper = shallow(<UttakPeriodeType
      tilDato={tilDato}
      fraDato={fraDato}
      id={id}
      uttakPeriodeType={uttakPeriodeType}
      utsettelseArsak={utsettelseArsak}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      editPeriode={editPeriode}
      isAnyFormOpen={isAnyFormOpen}
      overforingArsak={{}}
      readOnly
      manuellOverstyring={false}
      isNyPeriodeFormOpen={false}
      samtidigUttak={samtidigUttak}
      flerbarnsdager={flerbarnsdager}
      erArbeidstaker
      isFromSøknad
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(0);
  });

  it('skal vise frilans/selvstending næringsdrivene hvis ikke erArbeidstaker', () => {
    const wrapper = shallow(<UttakPeriodeType
      tilDato={tilDato}
      fraDato={fraDato}
      id={id}
      uttakPeriodeType={uttakPeriodeType}
      utsettelseArsak={utsettelseArsak}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      editPeriode={editPeriode}
      isAnyFormOpen={isAnyFormOpen}
      overforingArsak={{}}
      readOnly
      manuellOverstyring={false}
      isNyPeriodeFormOpen={false}
      erArbeidstaker={false}
      samtidigUttak={samtidigUttak}
      flerbarnsdager={flerbarnsdager}
      arbeidstidprosent={arbeidstidprosent}
      isFromSøknad
    />);

    expect(wrapper.find('FormattedMessage').last().prop('id')).to.eql('UttakInfoPanel.FrilansSelvstendignæringsdrivende');
  });

  it('skal vise arbeidsgiver og arbeidsgiverIdentifikator hvis erArbeidstaker', () => {
    const wrapper = shallow(<UttakPeriodeType
      tilDato={tilDato}
      fraDato={fraDato}
      id={id}
      uttakPeriodeType={uttakPeriodeType}
      utsettelseArsak={utsettelseArsak}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      editPeriode={editPeriode}
      isAnyFormOpen={isAnyFormOpen}
      overforingArsak={{}}
      readOnly
      manuellOverstyring={false}
      isNyPeriodeFormOpen={false}
      samtidigUttak={samtidigUttak}
      flerbarnsdager={flerbarnsdager}
      erArbeidstaker
      arbeidstidprosent={arbeidstidprosent}
      arbeidsgiver={arbeidsgiver}
      isFromSøknad
    />);

    expect(wrapper.find('Element').last().childAt(0).text()).to.eql(`${arbeidsgiver.navn} ${arbeidsgiver.identifikator}`);
  });
});
