import React from 'react';
import { expect } from 'chai';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { shallow } from 'enzyme';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { OverstyrVurderingVelger } from '@fpsak-frontend/fp-felles';

import VilkarresultatMedBegrunnelse from './VilkarresultatMedBegrunnelse';
import { VilkarresultatMedOverstyringForm } from './VilkarresultatMedOverstyringForm';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    const wrapper = shallow(<VilkarresultatMedOverstyringForm
      {...reduxFormPropsMock}
      behandlingspunktTitleCode="Behandlingspunkt.Fodselsvilkaret"
      isOverstyrt
      erVilkarOk
      isReadOnly
      overstyringApKode="5011"
      avslagsarsaker={[{ kode: 'test1', navn: 'test' }, { kode: 'test2', navn: 'test' }]}
      lovReferanse="§23"
      hasAksjonspunkt
      behandlingspunkt="foedsel"
      overrideReadOnly={false}
      kanOverstyreAccess={{
        isEnabled: true,
      }}
      aksjonspunktCodes={[]}
      toggleOverstyring={() => undefined}
      erMedlemskapsPanel={false}
      panelTittel="Fødsel"
    />);

    const undertittel = wrapper.find(Undertittel);
    expect(undertittel).to.have.length(1);
    expect(undertittel.childAt(0).text()).to.eql('Fødsel');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.childAt(0).text()).to.eql('§23');

    const checker = wrapper.find(OverstyrVurderingVelger);
    expect(checker).to.have.length(1);
    expect(checker.prop('aksjonspunktCode')).is.eql('5011');

    const vilkarResultatMedBegrunnelse = wrapper.find(VilkarresultatMedBegrunnelse);
    expect(vilkarResultatMedBegrunnelse).to.have.length(1);
  });
});
