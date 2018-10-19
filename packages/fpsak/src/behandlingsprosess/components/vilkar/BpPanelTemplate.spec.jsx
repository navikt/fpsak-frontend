import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Normaltekst } from 'nav-frontend-typografi';

import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import VilkarResultPanel from 'behandlingsprosess/components/vilkar/VilkarResultPanel';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import BpPanelTemplate from './BpPanelTemplate';

describe('<BpPanelTemplate>', () => {
  it('skal ikke vise lovreferanse når dette ikke finnes', () => {
    const wrapper = shallowWithIntl(
      <BpPanelTemplate.WrappedComponent
        intl={intlMock}
        handleSubmit={sinon.spy()}
        titleCode="FodselVilkarForm.Fodsel"
        aksjonspunktHelpTexts={['FodselVilkarForm.VurderGjelderSammeBarn']}
        isAksjonspunktOpen
        formProps={{ form: 'testnavn' }}
        readOnlySubmitButton={false}
        isDirty
        readOnly={false}
      >
        <div>test</div>
      </BpPanelTemplate.WrappedComponent>,
    );

    expect(wrapper.find(Normaltekst)).to.have.length(0);
  });

  it('skal vise lovreferanse når dette finnes', () => {
    const wrapper = shallowWithIntl(
      <BpPanelTemplate.WrappedComponent
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
      >
        <div>test</div>
      </BpPanelTemplate.WrappedComponent>,
    );

    expect(wrapper.find(Normaltekst)).to.have.length(1);
  });

  it('skal vise vilkår-resultat når status er satt og aksjonspunkt er åpent', () => {
    const wrapper = shallowWithIntl(
      <BpPanelTemplate.WrappedComponent
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
      >
        <div>test</div>
      </BpPanelTemplate.WrappedComponent>,
    );

    expect(wrapper.find(VilkarResultPanel)).to.have.length(1);
  });

  it('skal ikke vise vilkår-resultat når aksjonspunkt er lukket', () => {
    const wrapper = shallowWithIntl(
      <BpPanelTemplate.WrappedComponent
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
      >
        <div>test</div>
      </BpPanelTemplate.WrappedComponent>,
    );

    expect(wrapper.find(VilkarResultPanel)).to.have.length(0);
  });

  it('skal vise hjelpetekst for åpent aksjonspunkt', () => {
    const wrapper = shallowWithIntl(
      <BpPanelTemplate.WrappedComponent
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
      >
        <div>test</div>
      </BpPanelTemplate.WrappedComponent>,
    );

    const ap = wrapper.find(AksjonspunktHelpText);
    expect(ap).to.have.length(1);
    expect(ap.prop('isAksjonspunktOpen')).is.true;
    expect(ap.childAt(0).text()).is.eql('Vurder om tidligere utbetalt foreldrepenger eller engangsstønad'
    + ' gjelder for samme barn. Dersom det gjelder for samme barn er dette vilkåret ikke oppfylt.');
  });
});
