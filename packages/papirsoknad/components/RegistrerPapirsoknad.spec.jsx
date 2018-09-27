import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AksjonspunktHelpText from '@fpsak-frontend/shared-components/AksjonspunktHelpText';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import SoknadData from '../SoknadData';
import ForeldrepengerForm from './foreldrepenger/ForeldrepengerForm';
import EndringForeldrepengerForm from './foreldrepenger/EndringForeldrepengerForm';
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
    const wrapper = shallow(<RegistrerPapirsoknadPersonIndex
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
