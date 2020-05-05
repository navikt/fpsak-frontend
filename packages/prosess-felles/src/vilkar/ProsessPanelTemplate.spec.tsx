import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { EtikettLiten } from 'nav-frontend-typografi';

import ProsessPanelTemplate from './ProsessPanelTemplate';

describe('<ProsessPanelTemplate>', () => {
  it('skal ikke vise lovreferanse når dette ikke finnes', () => {
    const wrapper = shallow(
      <ProsessPanelTemplate
        handleSubmit={sinon.spy()}
        titleCode="FodselVilkarForm.Fodsel"
        isAksjonspunktOpen
        formName="testnavn"
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
    const wrapper = shallow(
      <ProsessPanelTemplate
        handleSubmit={sinon.spy()}
        lovReferanse="test lovReferanse"
        titleCode="FodselVilkarForm.Fodsel"
        isAksjonspunktOpen
        formName="testnavn"
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
