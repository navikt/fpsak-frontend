import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import { VilkarPanels } from './VilkarPanels';
import VilkarresultatMedOverstyringForm from './VilkarresultatMedOverstyringForm';
import SokersOpplysningspliktForm from './sokersOpplysningsplikt/SokersOpplysningspliktForm';

describe('<VilkarPanels>', () => {
  it('skal rendre panelet med visning av vilkårsresultat når det ikke finnes aksjonspunkter', () => {
    const wrapper = shallow(<VilkarPanels
      aksjonspunktCodes={[]}
      vilkarTypeCodes={[]}
      behandlingspunkt={behandlingspunktCodes.ADOPSJON}
      isAksjonspunktOpen={false}
      readOnly={false}
      readOnlySubmitButton={false}
      submitCallback={sinon.spy()}
    />);

    expect(wrapper.find(VilkarresultatMedOverstyringForm)).to.have.length(1);
  });

  it('skal rendre panel for søkers opplysningsplikt når dette finnes', () => {
    const wrapper = shallow(<VilkarPanels
      aksjonspunktCodes={[aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU]}
      vilkarTypeCodes={[]}
      behandlingspunkt={behandlingspunktCodes.OPPLYSNINGSPLIKT}
      isAksjonspunktOpen={false}
      readOnly={false}
      readOnlySubmitButton={false}
      submitCallback={sinon.spy()}
    />);

    expect(wrapper.find(SokersOpplysningspliktForm)).to.have.length(1);
  });
});
