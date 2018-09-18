import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';

import SoknadData from 'papirsoknad/SoknadData';
import RadioOption from 'form/fields/RadioOption';
import { RettigheterPanel } from './RettigheterPanel';

describe('<RettigheterPanel>', () => {
  it('skal vise komponent som default', () => {
    const soknad = new SoknadData('FORELDREPENGER', 'FØDSEL', 'MOR', []);
    const wrapper = shallowWithIntl(<RettigheterPanel intl={intlMock} soknadData={soknad} />);
    const radio = wrapper.find(RadioOption);
    expect(radio).to.have.length(2);
  });

  it('skal vise komponent med ekstra valg for adopsjon', () => {
    const soknad = new SoknadData('FORELDREPENGER', 'FØDSEL', 'FAR', []);
    const wrapper = shallowWithIntl(<RettigheterPanel intl={intlMock} soknadData={soknad} adopsjon />);
    const radio = wrapper.find(RadioOption);
    expect(radio).to.have.length(3);
  });
});
