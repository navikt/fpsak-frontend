import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';

import OverstyrVurderingChecker from 'behandlingsprosess/components/OverstyrVurderingChecker';
import VilkarResultPicker from 'behandlingsprosess/components/vilkar/VilkarResultPicker';
import OverstyrConfirmationForm from 'behandlingsprosess/components/OverstyrConfirmationForm';
import { VilkarresultatMedOverstyringFormImpl } from './VilkarresultatMedOverstyringForm';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    const wrapper = shallowWithIntl(<VilkarresultatMedOverstyringFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingspunktTitleCode="Behandlingspunkt.Fodselsvilkaret"
      isOverstyrt
      erVilkarOk
      isReadOnly
      apCode="5011"
      avslagsarsaker={[{ kode: 'test1', navn: 'test' }, { kode: 'test2', navn: 'test' }]}
      lovReferanse="§23"
      hasAksjonspunkt
    />);

    const undertittel = wrapper.find('Undertittel');
    expect(undertittel).to.have.length(1);
    expect(undertittel.childAt(0).text()).to.eql('Fødsel');

    const normaltekst = wrapper.find('Normaltekst');
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).to.eql('§23');

    const checker = wrapper.find(OverstyrVurderingChecker);
    expect(checker).to.have.length(1);
    expect(checker.prop('aksjonspunktCode')).is.eql('5011');

    const selector = wrapper.find(VilkarResultPicker);
    expect(selector).to.have.length(1);
    expect(selector.prop('avslagsarsaker')).is.eql([{ kode: 'test1', navn: 'test' }, { kode: 'test2', navn: 'test' }]);
    expect(selector.prop('erVilkarOk')).is.true;
    expect(selector.prop('readOnly')).is.true;
    expect(selector.prop('hasAksjonspunkt')).is.true;

    const form = wrapper.find(OverstyrConfirmationForm);
    expect(form).to.have.length(1);
  });

  it('skal rendre form uten knapp når vilkåret ikke er overstyrt', () => {
    const wrapper = shallowWithIntl(<VilkarresultatMedOverstyringFormImpl
      {...reduxFormPropsMock}
      intl={intlMock}
      behandlingspunktTitleCode="Behandlingspunkt.Fodselsvilkaret"
      isOverstyrt={false}
      erVilkarOk
      isReadOnly
      apCode="5011"
      avslagsarsaker={[{ kode: 'test1', navn: 'test' }, { kode: 'test2', navn: 'test' }]}
      lovReferanse="§23"
      hasAksjonspunkt
    />);

    const form = wrapper.find(OverstyrConfirmationForm);
    expect(form).to.have.length(0);
  });
});
