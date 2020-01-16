import React from 'react';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { RadioOption } from '@fpsak-frontend/form';

import SoknadData from '../../SoknadData';
import { RettigheterPanel } from './RettigheterPanel';

describe('<RettigheterPanel>', () => {
  it('skal vise komponent som default', () => {
    const soknad = new SoknadData('FORELDREPENGER', 'FØDSEL', 'MOR', []);
    const wrapper = shallowWithIntl(<RettigheterPanel intl={intlMock} soknadData={soknad} />);
    const radio = wrapper.find(RadioOption);
    expect(radio).to.have.length(3);
  });

  it('skal vise komponent med ekstra valg for adopsjon', () => {
    const soknad = new SoknadData('FORELDREPENGER', 'FØDSEL', 'FAR', []);
    const wrapper = shallowWithIntl(<RettigheterPanel intl={intlMock} soknadData={soknad} adopsjon />);
    const radio = wrapper.find(RadioOption);
    expect(radio).to.have.length(4);
  });
});
