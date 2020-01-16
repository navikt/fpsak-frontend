import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Image } from '@fpsak-frontend/shared-components';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { UttakPeriodeType } from './UttakPeriodeType';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-uttak';

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
    const wrapper = shallowWithIntl(<UttakPeriodeType
      editPeriode={editPeriode}
      flerbarnsdager={flerbarnsdager}
      fraDato={fraDato}
      getKodeverknavn={getKodeverknavn}
      id={id}
      intl={intlMock}
      isAnyFormOpen={isAnyFormOpen}
      isFromSøknad
      isNyPeriodeFormOpen={false}
      manuellOverstyring
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      oppholdArsak={oppholdArsak}
      overforingArsak={{}}
      readOnly={false}
      samtidigUttak={samtidigUttak}
      tilDato={tilDato}
      utsettelseArsak={utsettelseArsak}
      uttakPeriodeType={uttakPeriodeType}
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(2);
  });

  it('skal ikke vise redigere og slett periode hvis det er readonly', () => {
    const wrapper = shallowWithIntl(<UttakPeriodeType
      editPeriode={editPeriode}
      flerbarnsdager={flerbarnsdager}
      fraDato={fraDato}
      getKodeverknavn={getKodeverknavn}
      id={id}
      intl={intlMock}
      isAnyFormOpen={isAnyFormOpen}
      isFromSøknad
      isNyPeriodeFormOpen={false}
      manuellOverstyring={false}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      oppholdArsak={oppholdArsak}
      overforingArsak={{}}
      readOnly
      samtidigUttak={samtidigUttak}
      tilDato={tilDato}
      utsettelseArsak={utsettelseArsak}
      uttakPeriodeType={uttakPeriodeType}
    />);

    const image = wrapper.find(Image);
    expect(image).to.have.length(0);
  });

  it('skal vise frilans når erFrilans er true', () => {
    const wrapper = shallowWithIntl(<UttakPeriodeType
      arbeidstidprosent={arbeidstidprosent}
      editPeriode={editPeriode}
      erFrilanser
      erSelvstendig={false}
      flerbarnsdager={flerbarnsdager}
      fraDato={fraDato}
      getKodeverknavn={getKodeverknavn}
      id={id}
      intl={intlMock}
      isAnyFormOpen={isAnyFormOpen}
      isFromSøknad
      isNyPeriodeFormOpen={false}
      manuellOverstyring={false}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      oppholdArsak={oppholdArsak}
      overforingArsak={{}}
      readOnly
      samtidigUttak={samtidigUttak}
      tilDato={tilDato}
      utsettelseArsak={utsettelseArsak}
      uttakPeriodeType={uttakPeriodeType}
    />);

    expect(wrapper.find('FormattedMessage').last().prop('id')).to.eql('UttakInfoPanel.Frilans');
  });

  it('skal vise arbeidsgiver og arbeidsgiverIdentifikator hvis erArbeidstaker', () => {
    const wrapper = shallowWithIntl(<UttakPeriodeType
      arbeidsgiver={arbeidsgiver}
      arbeidstidprosent={arbeidstidprosent}
      editPeriode={editPeriode}
      flerbarnsdager={flerbarnsdager}
      fraDato={fraDato}
      getKodeverknavn={getKodeverknavn}
      id={id}
      intl={intlMock}
      isAnyFormOpen={isAnyFormOpen}
      isFromSøknad
      isNyPeriodeFormOpen={false}
      manuellOverstyring={false}
      openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
      oppholdArsak={oppholdArsak}
      overforingArsak={{}}
      readOnly
      samtidigUttak={samtidigUttak}
      tilDato={tilDato}
      utsettelseArsak={utsettelseArsak}
      uttakPeriodeType={uttakPeriodeType}
    />);

    expect(wrapper.find('Element').last().childAt(0).text()).to.eql(`${arbeidsgiver.navn} (${arbeidsgiver.identifikator})`);
  });
});
