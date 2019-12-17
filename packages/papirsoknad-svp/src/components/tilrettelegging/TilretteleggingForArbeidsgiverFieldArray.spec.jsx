import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Knapp } from 'nav-frontend-knapper';

import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import TilretteleggingForArbeidsgiverFieldArray from './TilretteleggingForArbeidsgiverFieldArray';

describe('<TilretteleggingForArbeidsgiverFieldArray>', () => {
  it('skal vise vertical skillelinje mellom arbeidsgivere og knapp etter siste arbeidsgiver', () => {
    const fields = new MockFieldsWithContent('arbeidsgiver', [{ arbeidsgiverOrgNr: 1 }, { arbeidsgiverOrgNr: 2 }]);
    const wrapper = shallow(<TilretteleggingForArbeidsgiverFieldArray
      fields={fields}
      readOnly={false}
    />);

    const containers = wrapper.find('div');
    expect(containers).to.have.length(2);
    const arbeidsgiverRad1 = containers.first();
    expect(arbeidsgiverRad1.find(Knapp)).to.have.length(0);
    expect(arbeidsgiverRad1.find(VerticalSpacer)).to.have.length(1);

    const arbeidsgiverRad2 = containers.last();
    expect(arbeidsgiverRad2.find(Knapp)).to.have.length(1);
    expect(arbeidsgiverRad2.find(VerticalSpacer)).to.have.length(0);
  });
});
