import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { EtikettLiten } from 'nav-frontend-typografi';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import ProsessPanelTemplate from './ProsessPanelTemplate';

describe('<ProsessPanelTemplate>', () => {
  it('skal ikke vise lovreferanse når dette ikke finnes', () => {
    const wrapper = shallowWithIntl(
      <ProsessPanelTemplate
        intl={intlMock}
        handleSubmit={sinon.spy()}
        titleCode="FodselVilkarForm.Fodsel"
        aksjonspunktHelpTexts={['FodselVilkarForm.VurderGjelderSammeBarn']}
        isAksjonspunktOpen
        formProps={{ form: 'testnavn' }}
        readOnlySubmitButton={false}
        isDirty
        readOnly={false}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </ProsessPanelTemplate>,
    );

    expect(wrapper.find(EtikettLiten)).to.have.length(0);
  });

  it('skal vise lovreferanse når dette finnes', () => {
    const wrapper = shallowWithIntl(
      <ProsessPanelTemplate
        intl={intlMock}
        handleSubmit={sinon.spy()}
        lovReferanse="test lovReferanse"
        titleCode="FodselVilkarForm.Fodsel"
        aksjonspunktHelpTexts={['FodselVilkarForm.VurderGjelderSammeBarn']}
        isAksjonspunktOpen
        formProps={{ form: 'testnavn' }}
        readOnlySubmitButton={false}
        isDirty
        readOnly={false}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </ProsessPanelTemplate>,
    );

    expect(wrapper.find(EtikettLiten)).to.have.length(1);
  });
});
