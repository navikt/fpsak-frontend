import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { VilkarPanels } from './VilkarPanels';
import VilkarresultatMedOverstyringForm from './VilkarresultatMedOverstyringForm';
import DataFetcherWithCache from '../../../DataFetcherWithCache';

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
      behandlingspunktAksjonspunkter={[]}
      behandlingspunktStatus=""
      behandlingspunktVilkar={[]}
      alleKodeverk={{}}
      fagsakInfo={{}}
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
      behandlingspunktAksjonspunkter={[]}
      behandlingspunktStatus=""
      behandlingspunktVilkar={[]}
      alleKodeverk={{}}
      fagsakInfo={{}}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCache);
    expect(dataFetchers).to.have.length(1);

    const sokersOpplysningPanel = dataFetchers.renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      soknad: {},
    }).find(SokersOpplysningspliktVilkarProsessIndex);
    expect(sokersOpplysningPanel).to.have.length(1);
  });
});
