import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import SoknadData from 'papirsoknad/SoknadData';
import ForeldrepengerForm from 'papirsoknad/components/foreldrepenger/ForeldrepengerForm';
import EndringForeldrepengerForm from 'papirsoknad/components/foreldrepenger/EndringForeldrepengerForm';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { RegistrerPapirsoknad } from './RegistrerPapirsoknad';
import SoknadTypePickerForm from './SoknadTypePickerForm';
import EngangsstonadForm from './engangsstonad/EngangsstonadForm';


describe('<RegistrerPapirsoknad>', () => {
  it('skal vise aksjonspunkt-hjelpetekst og form for engangsstønad', () => {
    const wrapper = shallow(<RegistrerPapirsoknad
      onSubmitUfullstendigsoknad={sinon.spy()}
      submitPapirsoknad={sinon.spy()}
      setSoknadData={sinon.spy()}
      readOnly={false}
      soknadData={new SoknadData('ES', 'TEST', 'TEST', [])}
    />);
    expect(wrapper.find(AksjonspunktHelpText)).to.have.length(1);
    expect(wrapper.find(SoknadTypePickerForm)).to.have.length(1);
    expect(wrapper.find(EngangsstonadForm)).to.have.length(1);
    expect(wrapper.find(ForeldrepengerForm)).to.have.length(0);
    expect(wrapper.find(EndringForeldrepengerForm)).to.have.length(0);
  });

  it('skal vise foreldrepenger-form', () => {
    const wrapper = shallow(<RegistrerPapirsoknad
      onSubmitUfullstendigsoknad={sinon.spy()}
      submitPapirsoknad={sinon.spy()}
      setSoknadData={sinon.spy()}
      readOnly
      soknadData={new SoknadData(fagsakYtelseType.FORELDREPENGER, 'TEST', 'TEST', [])}
    />);
    expect(wrapper.find(ForeldrepengerForm)).to.have.length(1);
    expect(wrapper.find(EngangsstonadForm)).to.have.length(0);
    expect(wrapper.find(EndringForeldrepengerForm)).to.have.length(0);
  });


  it('skal vise endring-foreldrepenger-form', () => {
    const wrapper = shallow(<RegistrerPapirsoknad
      onSubmitUfullstendigsoknad={sinon.spy()}
      submitPapirsoknad={sinon.spy()}
      setSoknadData={sinon.spy()}
      readOnly
      soknadData={new SoknadData(fagsakYtelseType.ENDRING_FORELDREPENGER, 'TEST', 'TEST', [])}
    />);

    expect(wrapper.find(ForeldrepengerForm)).to.have.length(0);
    expect(wrapper.find(EndringForeldrepengerForm)).to.have.length(1);
    expect(wrapper.find(EngangsstonadForm)).to.have.length(0);
  });
});
