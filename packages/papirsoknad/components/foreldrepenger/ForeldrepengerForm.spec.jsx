import React from 'react';
import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import familieHendelseType from 'kodeverk/familieHendelseType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import foreldreType from 'kodeverk/foreldreType';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import SoknadData from 'papirsoknad/SoknadData';
import OmsorgOgAdopsjonPanel from 'papirsoknad/components/commonPanels/omsorgOgAdopsjon/OmsorgOgAdopsjonPanel';
import TerminFodselDatoPanel from 'papirsoknad/components/commonPanels/fodsel/TerminFodselDatoPanel';
import { ForeldrepengerForm } from './ForeldrepengerForm';

describe('<ForeldrepengerForm>', () => {
  it('skal vise fødselpaneler når familieHendelseType er lik fødsel', () => {
    const wrapper = shallowWithIntl(<ForeldrepengerForm
      {...reduxFormPropsMock}
      intl={intlMock}
      onSubmitUfullstendigsoknad={sinon.spy()}
      countryCodes={[]}
      readOnly={false}
      soknadData={new SoknadData(fagsakYtelseType.FORELDREPENGER, familieHendelseType.FODSEL, foreldreType.MOR, [])}
    />);
    expect(wrapper.find(TerminFodselDatoPanel)).has.length(1);
  });

  it('skal vise adopsjonspaneler når familieHendelseType er lik adopsjon', () => {
    const wrapper = shallowWithIntl(<ForeldrepengerForm
      {...reduxFormPropsMock}
      intl={intlMock}
      onSubmitUfullstendigsoknad={sinon.spy()}
      countryCodes={[]}
      readOnly={false}
      soknadData={new SoknadData(fagsakYtelseType.FORELDREPENGER, familieHendelseType.ADOPSJON, foreldreType.MOR, [])}
    />);
    expect(wrapper.find(OmsorgOgAdopsjonPanel)).has.length(1);
  });
});
