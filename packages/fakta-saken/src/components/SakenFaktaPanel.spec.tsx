import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';


import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpTextHTML } from '@fpsak-frontend/shared-components';

import InnhentDokOpptjeningUtlandPanel from './innhentDok/InnhentDokOpptjeningUtlandPanel';
import SakenFaktaPanel from './SakenFaktaPanel';

describe('<SakenFaktaPanel>', () => {
  it('skal vise aksjonspunkt-hjelpetekst og innhent-panel når en har åpent aksjonspunkt for markering av utenlandssak', () => {
    const wrapper = shallow(<SakenFaktaPanel
      behandlingId={1}
      behandlingVersjon={1}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
          kodeverk: 'AP_DEF',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'AP_STATUS',
        },
        kanLoses: true,
        erAktivt: true,
      }]}
      harApneAksjonspunkter
      submitCallback={() => undefined}
      readOnly={false}
      submittable
    />);
    expect(wrapper.find(AksjonspunktHelpTextHTML)).to.have.length(1);
    expect(wrapper.find(InnhentDokOpptjeningUtlandPanel)).to.have.length(1);
  });

  it('skal vise ikke vise aksjonspunkt-hjelpetekst når en har lukket aksjonspunkt for markering av utenlandssak', () => {
    const wrapper = shallow(<SakenFaktaPanel
      behandlingId={1}
      behandlingVersjon={1}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
          kodeverk: 'AP_DEF',
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
          kodeverk: 'AP_STATUS',
        },
        kanLoses: true,
        erAktivt: true,
      }]}
      harApneAksjonspunkter={false}
      submitCallback={() => undefined}
      readOnly={false}
      submittable
    />);
    expect(wrapper.find(AksjonspunktHelpTextHTML)).to.have.length(0);
    expect(wrapper.find(InnhentDokOpptjeningUtlandPanel)).to.have.length(1);
  });

  it('skal ikke vise aksjonspunkt-hjelpetekst eller innhent-panel når en ikke har aksjonspunkt for markering av utenlandssak', () => {
    const wrapper = shallow(<SakenFaktaPanel
      behandlingId={1}
      behandlingVersjon={1}
      aksjonspunkter={[]}
      harApneAksjonspunkter={false}
      submitCallback={() => undefined}
      readOnly={false}
      submittable
    />);
    expect(wrapper.find(AksjonspunktHelpTextHTML)).to.have.length(0);
    expect(wrapper.find(InnhentDokOpptjeningUtlandPanel)).to.have.length(0);
  });
});
