import React from 'react';
import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import familieHendelseType from '@fpsak-frontend/kodeverk/familieHendelseType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import foreldreType from '@fpsak-frontend/kodeverk/foreldreType';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import SoknadData from '../../SoknadData';
import OmsorgOgAdopsjonPanel from '../commonPanels/omsorgOgAdopsjon/OmsorgOgAdopsjonPanel';
import TerminFodselDatoPanel from '../commonPanels/fodsel/TerminFodselDatoPanel';
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
