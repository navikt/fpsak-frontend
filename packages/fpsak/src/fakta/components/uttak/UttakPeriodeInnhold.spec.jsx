import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import behandlingStatus from 'kodeverk/behandlingStatus';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { UttakPeriodeInnhold } from './UttakPeriodeInnhold';

const behandlingStatusKode = behandlingStatus.BEHANDLING_UTREDES;

const periode = {
  tom: '10-10-2017',
  fom: '01-10-2017',
};

describe('<UttakPeriodeInnhold>', () => {
  const arbeidsgiverNavn = 'Statoil';
  const utsettelseArsak = {};
  const fieldId = '';
  const id = '';
  const updatePeriode = sinon.spy();
  const cancelEditPeriode = sinon.spy();

  it('skal vise UttakPeriodeInnhold', () => {
    const wrapper = shallowWithIntl(<UttakPeriodeInnhold
      fieldId={fieldId}
      arbeidsgiverNavn={arbeidsgiverNavn}
      utsettelseArsak={utsettelseArsak}
      bekreftet
      uttakPeriodeType={{}}
      overforingArsak={{}}
      openForm
      id={id}
      updatePeriode={updatePeriode}
      cancelEditPeriode={cancelEditPeriode}
      readOnly
      fraDato={periode.fom}
      tilDato={periode.tom}
      behandlingStatusKode={behandlingStatusKode}
    />);

    const verticalSpacer = wrapper.find(VerticalSpacer);
    expect(verticalSpacer).to.have.length(1);
  });
});
