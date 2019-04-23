
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { Form } from 'react-final-form';

import behandlingStatus from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { TextAreaField } from '@fpsak-frontend/form-final';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import behandlingType from 'kodeverk/behandlingType';
import { OpphevReservasjonModal } from './OpphevReservasjonModal';

describe('<OpphevReservasjonModal>', () => {
  const oppgave = {
    id: 1,
    status: {
      erReservert: false,
      reservertTilTidspunkt: '2017-08-02T00:54:25.455',
    },
    saksnummer: 1,
    behandlingId: 2,
    personnummer: '1234567',
    navn: 'Espen Utvikler',
    behandlingstype: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      navn: '',
    },
    opprettetTidspunkt: '2017-01-01',
    behandlingsfrist: '2017-01-01',
    erTilSaksbehandling: true,
    fagsakYtelseType: {
      kode: fagsakYtelseType.ENGANGSSTONAD,
      navn: '',
    },
    behandlingStatus: {
      kode: behandlingStatus.OPPRETTET,
      navn: '',
    },
  };

  it('skal rendre modal for å oppgi begrunnelse for oppheving av reservasjon', () => {
    const wrapper = shallowWithIntl(
      <OpphevReservasjonModal
        intl={intlMock}
        oppgave={oppgave}
        showModal
        cancel={sinon.spy()}
        submit={sinon.spy()}
      />,
    );

    const form = wrapper.find(Form);
    expect(form).has.length(1);

    const handleSubmitFn = sinon.spy();
    const formWrapper = shallowWithIntl(form.prop('render')({
      handleSubmit: handleSubmitFn,
    }));

    expect(formWrapper.find(TextAreaField)).has.length(1);

    formWrapper.find('form').simulate('submit');

    expect(handleSubmitFn.calledOnce).to.be.true;
  });
});
