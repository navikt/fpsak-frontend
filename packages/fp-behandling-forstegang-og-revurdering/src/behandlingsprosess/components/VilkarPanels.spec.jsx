import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { VilkarPanels } from './VilkarPanels';
import DataFetcherWithCache from '../../DataFetcherWithCache';

describe('<VilkarPanels>', () => {
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
      behandlingspunktOverridden
      behandlingspunktOverrideReadOnly
      behandlingspunktTitleCode=""
      kanOverstyreAccess={{}}
      alleKodeverk={{}}
      fagsakInfo={{}}
      overrideReadOnly={false}
      toggleOverstyring={sinon.spy()}
      avslagsarsaker={{}}
      harVilkarresultatMedOverstyring={false}
      intl={{}}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCache);
    expect(dataFetchers).to.have.length(9);

    const sokersOpplysningPanel = dataFetchers.at(1).renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      soknad: {},
    }).find(SokersOpplysningspliktVilkarProsessIndex);
    expect(sokersOpplysningPanel).to.have.length(1);
  });
});
