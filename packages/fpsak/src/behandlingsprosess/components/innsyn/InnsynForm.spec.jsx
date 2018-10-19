import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import innsynResultatTyperKV from 'kodeverk/innsynResultatType';
import { InnsynFormImpl } from './InnsynForm';

describe('<InnsynForm>', () => {
  it('skal vise radioknapper for valg av sett på vent når innvilget', () => {
    const wrapper = shallowWithIntl(<InnsynFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      isSubmittable
      innsynResultatTyper={[{ kode: innsynResultatTyperKV.INNVILGET, navn: 'navnTest' }]}
      innsynResultatType={innsynResultatTyperKV.INNVILGET}
      behandlingTypes={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      saksNr={123}
      documents={[]}
      vedtaksdokumenter={[]}
      isApOpen
    />);

    const settPaVentRadio = wrapper.find('[name="sattPaVent"]');
    expect(settPaVentRadio).to.have.length(1);
  });

  it('skal ikke vise radioknapper for valg av sett på vent når innvilget', () => {
    const wrapper = shallowWithIntl(<InnsynFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      isSubmittable
      innsynResultatTyper={[{ kode: innsynResultatTyperKV.AVVIST, navn: 'navnTest' }]}
      innsynResultatType={innsynResultatTyperKV.AVVIST}
      behandlingTypes={[{ kode: 'kodeTest', navn: 'navnTest' }]}
      saksNr={123}
      documents={[]}
      vedtaksdokumenter={[]}
      isApOpen
    />);

    const settPaVentRadio = wrapper.find('[name="sattPaVent"]');
    expect(settPaVentRadio).to.have.length(0);
  });
});
