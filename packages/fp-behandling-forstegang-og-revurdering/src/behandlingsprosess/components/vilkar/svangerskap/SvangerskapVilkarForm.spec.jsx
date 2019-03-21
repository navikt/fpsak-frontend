import React from 'react';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
// import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
// import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
// import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
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
    />);

    const readonlyForm = wrapper.find(BehandlingspunktBegrunnelseTextField);
    expect(readonlyForm).to.have.length(0);
  });
});
