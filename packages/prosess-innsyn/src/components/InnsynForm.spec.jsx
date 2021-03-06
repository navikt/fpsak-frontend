import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import innsynResultatTyperKV from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import { InnsynFormImpl } from './InnsynForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-innsyn';

describe('<InnsynForm>', () => {
  it('skal vise radioknapper for valg av sett på vent når innvilget', () => {
    const wrapper = shallowWithIntl(<InnsynFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
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
      readOnlySubmitButton={false}
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
