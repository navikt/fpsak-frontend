import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';
import EngangsstonadForm from '@fpsak-frontend/papirsoknad-es';
import ForeldrepengerForm from '@fpsak-frontend/papirsoknad-fp';
import SvangerskapspengerForm from '@fpsak-frontend/papirsoknad-svp';

import { RegistrerPapirsoknad } from './RegistrerPapirsoknad';
import SoknadTypePickerForm from './SoknadTypePickerForm';

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
    expect(wrapper.find(SvangerskapspengerForm)).to.have.length(0);
  });

  it('skal vise svangerskapspenger-form', () => {
    const wrapper = shallow(<RegistrerPapirsoknad
      onSubmitUfullstendigsoknad={sinon.spy()}
      submitPapirsoknad={sinon.spy()}
      setSoknadData={sinon.spy()}
      readOnly
      soknadData={new SoknadData(fagsakYtelseType.SVANGERSKAPSPENGER, 'TEST', [])}
    />);
    expect(wrapper.find(ForeldrepengerForm)).to.have.length(0);
    expect(wrapper.find(EngangsstonadForm)).to.have.length(0);
    expect(wrapper.find(SvangerskapspengerForm)).to.have.length(1);
  });
});
