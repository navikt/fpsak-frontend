import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import vilkarUtfallType from 'kodeverk/vilkarUtfallType';

import VilkarResultPanel from 'behandlingsprosess/components/vilkar/VilkarResultPanel';
import { OpptjeningVilkarViewImpl } from './OpptjeningVilkarView';
import OpptjeningTimeLineLight from './OpptjeningTimeLineLight';

describe('<OpptjeningVilkarView>', () => {
  it('skal vise at vilkåret er oppfylt når en har aksjonspunkt og vilkårstatus er oppfylt', () => {
    const wrapper = shallowWithIntl(<OpptjeningVilkarViewImpl
      intl={intlMock}
      erVilkarOk
      fastsattOpptjeningActivities={[]}
      monthsAndDays={{}}
      opptjeningFomDate="2017-10-02"
      opptjeningTomDate="2018-02-02"
      opptjeningsperiode="2017-10-02 - 2018-02-02"
      readOnlySubmitButton
      readOnly
      isAksjonspunktOpen
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      status={vilkarUtfallType.OPPFYLT}
    />);

    const vilkarResultPanel = wrapper.find(VilkarResultPanel);
    expect(vilkarResultPanel).to.have.length(1);
    expect(vilkarResultPanel.prop('status')).to.eql(vilkarUtfallType.OPPFYLT);
  });

  it('skal vise at vilkåret ikke er oppfylt når en har aksjonspunkt og vilkårstatus er ikke oppfylt', () => {
    const wrapper = shallowWithIntl(<OpptjeningVilkarViewImpl
      intl={intlMock}
      erVilkarOk={false}
      fastsattOpptjeningActivities={[]}
      monthsAndDays={{}}
      opptjeningFomDate="2017-10-02"
      opptjeningTomDate="2018-02-02"
      opptjeningsperiode="2017-10-02 - 2018-02-02"
      readOnlySubmitButton
      readOnly
      isAksjonspunktOpen
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      status={vilkarUtfallType.OPPFYLT}
    />);

    const vilkarResultPanel = wrapper.find(VilkarResultPanel);
    expect(vilkarResultPanel).to.have.length(1);
    expect(vilkarResultPanel.prop('status')).to.eql(vilkarUtfallType.OPPFYLT);
  });

  it('skal ikke vise vilkårstatus når aksjonspunkt ikke finnes', () => {
    const wrapper = shallowWithIntl(<OpptjeningVilkarViewImpl
      intl={intlMock}
      erVilkarOk={false}
      fastsattOpptjeningActivities={[]}
      monthsAndDays={{}}
      opptjeningFomDate="2017-10-02"
      opptjeningTomDate="2018-02-02"
      opptjeningsperiode="2017-10-02 - 2018-02-02"
      readOnlySubmitButton
      readOnly
      isAksjonspunktOpen={false}
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      status={vilkarUtfallType.OPPFYLT}
    />);

    expect(wrapper.find(VilkarResultPanel)).to.have.length(0);
    expect(wrapper.find(OpptjeningTimeLineLight)).to.have.length(0);
  });

  it('skal vise tidslinje når en har aktiviteter', () => {
    const wrapper = shallowWithIntl(<OpptjeningVilkarViewImpl
      intl={intlMock}
      erVilkarOk={false}
      fastsattOpptjeningActivities={[{ test: 'test' }]}
      monthsAndDays={{}}
      opptjeningFomDate="2017-10-02"
      opptjeningTomDate="2018-02-02"
      opptjeningsperiode="2017-10-02 - 2018-02-02"
      readOnlySubmitButton
      readOnly
      isAksjonspunktOpen={false}
      avslagsarsaker={[{
        kode: 'TEST_KODE',
        navn: 'testnavn',
      }]}
      status={vilkarUtfallType.OPPFYLT}
    />);

    expect(wrapper.find(VilkarResultPanel)).to.have.length(0);
    expect(wrapper.find(OpptjeningTimeLineLight)).to.have.length(1);
  });
});
