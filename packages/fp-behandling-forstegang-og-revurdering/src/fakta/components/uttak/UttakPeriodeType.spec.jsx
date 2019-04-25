import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Image } from '@fpsak-frontend/shared-components';
import { UttakPeriodeType } from './UttakPeriodeType';

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
    virksomhet: true,
  };
  const oppholdArsak = {
    kode: '-',
  };
  const getKodeverknavn = () => undefined;

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
      samtidigUttak={samtidigUttak}
      flerbarnsdager={flerbarnsdager}
      oppholdArsak={oppholdArsak}
      isFromSøknad
      getKodeverknavn={getKodeverknavn}
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
      oppholdArsak={oppholdArsak}
      isFromSøknad
      getKodeverknavn={getKodeverknavn}
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(0);
  });

  it('skal vise frilans når erFrilans er true', () => {
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
      erFrilanser
      erSelvstendig={false}
      samtidigUttak={samtidigUttak}
      flerbarnsdager={flerbarnsdager}
      arbeidstidprosent={arbeidstidprosent}
      oppholdArsak={oppholdArsak}
      isFromSøknad
      getKodeverknavn={getKodeverknavn}
    />);

    expect(wrapper.find('FormattedMessage').last().prop('id')).to.eql('UttakInfoPanel.Frilans');
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
      arbeidstidprosent={arbeidstidprosent}
      arbeidsgiver={arbeidsgiver}
      oppholdArsak={oppholdArsak}
      isFromSøknad
      getKodeverknavn={getKodeverknavn}
    />);

    expect(wrapper.find('Element').last().childAt(0).text()).to.eql(`${arbeidsgiver.navn} (${arbeidsgiver.identifikator})`);
  });
});
