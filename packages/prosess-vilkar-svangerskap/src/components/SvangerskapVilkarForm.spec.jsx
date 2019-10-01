import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import { SvangerskapVilkarFormImpl as UnwrappedForm } from './SvangerskapVilkarForm';

describe('<SvangerskapVilkarForm>', () => {
  it('skal vise readonly-form med utgråete knapper når readonly og vilkåret ikke er vurdert', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      lovReferanse="test"
      readOnly
      readOnlySubmitButton
      erVilkarOk={undefined}
      status={vilkarUtfallType.OPPFYLT}
      isAksjonspunktOpen
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const readonlyForm = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(readonlyForm).to.have.length(0);
  });
});
