import React from 'react';
import { expect } from 'chai';
import { FieldArray } from 'redux-form';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { CheckboxField } from '@fpsak-frontend/form';
import arbeidType from '@fpsak-frontend/kodeverk/src/arbeidType';

import AndreYtelserPanel, { AndreYtelserPanelImpl } from './AndreYtelserPanel';

describe('<AndreYtelserPanel>', () => {
  const andreYtelser = [
    { navn: 'Lønn under utdanning', kode: 'LONN_UTDANNING' },
    { navn: 'Etterlønn fr arbeidsgiver', kode: 'ETTERLONN_ARBEIDSGIVER' },
    { navn: 'Militær- eller siviltjeneste', kode: arbeidType.MILITÆR_ELLER_SIVILTJENESTE },
    { navn: 'Ventelønn', kode: 'VENTELONN' },
  ];

  it('skal vise andre ytelser panel', () => {
    const wrapper = shallowWithIntl(<AndreYtelserPanelImpl
      intl={intlMock}
      readOnly={false}
      andreYtelser={andreYtelser}
      selectedYtelser={{}}
    />);

    const checkboxes = wrapper.find(CheckboxField);
    expect(checkboxes).to.have.length(4);
  });

  it('skal kun vise checkbox for militær og siviltjeneste når prop er satt', () => {
    const wrapper = shallowWithIntl(<AndreYtelserPanelImpl
      intl={intlMock}
      readOnly={false}
      andreYtelser={andreYtelser}
      selectedYtelser={{}}
      kunMiliterEllerSiviltjeneste
    />);

    const checkboxes = wrapper.find(CheckboxField);
    expect(checkboxes).to.have.length(1);
  });

  it('skal vise andre ytelser panel med FieldArray når ytelse er valgt', () => {
    const wrapper = shallowWithIntl(<AndreYtelserPanelImpl
      intl={intlMock}
      readOnly={false}
      andreYtelser={andreYtelser}
      selectedYtelser={{ LONN_UTDANNING: true }}
    />);

    const checkboxes = wrapper.find(CheckboxField);
    expect(checkboxes).to.have.length(4);

    const fieldArray = wrapper.find(FieldArray);
    expect(fieldArray).has.length(1);
  });

  it('validering skal returnerer errors objekt på riktig format', () => {
    const values = { andreYtelser: { LONN_UTDANNING: true, LONN_UTDANNING_PERIODER: [{ periodeFom: 'abc', periodeTom: 'ads' }] } };

    const errorsWithInvalidDates = AndreYtelserPanel.validate(values, andreYtelser);
    expect(errorsWithInvalidDates).to.be.an('object');
    expect(errorsWithInvalidDates.andreYtelser).to.be.an('object');
    expect(errorsWithInvalidDates.andreYtelser.LONN_UTDANNING_PERIODER).to.be.an('array');
    expect(errorsWithInvalidDates.andreYtelser.ETTERLONN_ARBEIDSGIVER_PERIODER).to.not.exist;
  });


  it('transformValues skal returnerer ytelser på riktig format', () => {
    const values = {
      andreYtelser: {
        LONN_UTDANNING: true,
        LONN_UTDANNING_PERIODER: [{ periodeFom: 'abc', periodeTom: 'ads' }, { periodeFom: 'abc', periodeTom: 'ads' }],
        ETTERLONN_ARBEIDSGIVER: true,
        ETTERLONN_ARBEIDSGIVER_PERIODER: [{ periodeFom: 'ssa', periodeTom: 'fesfes' }],
        VENTELONN: true,
        VENTELONN_PERIODER: [{ periodeFom: 'ssa', periodeTom: 'fesfes' }],
      },
    };

    const errorsWithInvalidDates = AndreYtelserPanel.transformValues(values, andreYtelser);
    expect(errorsWithInvalidDates).to.be.an('array');
    expect(errorsWithInvalidDates).has.length(4);
  });
});
