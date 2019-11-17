import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Normaltekst } from 'nav-frontend-typografi';

import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import ProsessPanelTemplate from './ProsessPanelTemplate';
import VilkarResultPanel from './VilkarResultPanel';

describe('<BpPanelTemplate>', () => {
  it('skal ikke vise lovreferanse når dette ikke finnes', () => {
    const wrapper = shallowWithIntl(
      <ProsessPanelTemplate.WrappedComponent
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
      </ProsessPanelTemplate.WrappedComponent>,
    );

    expect(wrapper.find(Normaltekst)).to.have.length(0);
  });

  it('skal vise lovreferanse når dette finnes', () => {
    const wrapper = shallowWithIntl(
      <ProsessPanelTemplate.WrappedComponent
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
      </ProsessPanelTemplate.WrappedComponent>,
    );

    expect(wrapper.find(Normaltekst)).to.have.length(1);
  });

  it('skal vise vilkår-resultat når status er satt og aksjonspunkt er åpent', () => {
    const wrapper = shallowWithIntl(
      <ProsessPanelTemplate.WrappedComponent
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
        bpStatus={vilkarUtfallType.OPPFYLT}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </ProsessPanelTemplate.WrappedComponent>,
    );

    expect(wrapper.find(VilkarResultPanel)).to.have.length(1);
  });

  it('skal ikke vise vilkår-resultat når aksjonspunkt er lukket', () => {
    const wrapper = shallowWithIntl(
      <ProsessPanelTemplate.WrappedComponent
        intl={intlMock}
        handleSubmit={sinon.spy()}
        lovReferanse="test lovReferanse"
        titleCode="FodselVilkarForm.Fodsel"
        aksjonspunktHelpTexts={['FodselVilkarForm.VurderGjelderSammeBarn']}
        isAksjonspunktOpen={false}
        formProps={{ form: 'testnavn' }}
        readOnlySubmitButton={false}
        isDirty
        readOnly={false}
        bpStatus={vilkarUtfallType.OPPFYLT}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </ProsessPanelTemplate.WrappedComponent>,
    );

    expect(wrapper.find(VilkarResultPanel)).to.have.length(0);
  });

  it('skal vise hjelpetekst for åpent aksjonspunkt', () => {
    const wrapper = shallowWithIntl(
      <ProsessPanelTemplate.WrappedComponent
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
        bpStatus={vilkarUtfallType.OPPFYLT}
        behandlingId={1}
        behandlingVersjon={1}
      >
        <div>test</div>
      </ProsessPanelTemplate.WrappedComponent>,
    );

    const ap = wrapper.find(AksjonspunktHelpText);
    expect(ap).to.have.length(1);
    expect(ap.prop('isAksjonspunktOpen')).is.true;
    expect(ap.childAt(0).text()).is.eql('FodselVilkarForm.VurderGjelderSammeBarn');
  });
});