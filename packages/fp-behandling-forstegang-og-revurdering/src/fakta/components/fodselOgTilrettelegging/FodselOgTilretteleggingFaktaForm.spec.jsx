import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';

import { FodselOgTilretteleggingFaktaForm } from './FodselOgTilretteleggingFaktaForm';
import ArbeidsforholdFaktaPanel from './ArbeidsforholdFaktaPanel';

describe('<FodselOgTilretteleggingFaktaForm>', () => {
  it('skal vise faktaform uten begrunnelsefelt', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingFaktaForm
      hasOpenAksjonspunkter={false}
      readOnly
      visBegrunnelse={false}
    />);

    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(1);
    const begrunnelsefelt = wrapper.find(TextAreaField);
    expect(begrunnelsefelt).has.length(0);
    const arbforholdFaktaPanel = wrapper.find(ArbeidsforholdFaktaPanel);
    expect(arbforholdFaktaPanel).has.length(1);
    const submitButton = wrapper.find(FaktaSubmitButton);
    expect(submitButton).has.length(1);
  });
  it('skal vise faktaform uten begrunnelsefelt', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingFaktaForm
      hasOpenAksjonspunkter={false}
      readOnly
      visBegrunnelse
    />);

    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(1);
    const begrunnelsefelt = wrapper.find(TextAreaField);
    expect(begrunnelsefelt).has.length(1);
    const arbforholdFaktaPanel = wrapper.find(ArbeidsforholdFaktaPanel);
    expect(arbforholdFaktaPanel).has.length(1);
    const submitButton = wrapper.find(FaktaSubmitButton);
    expect(submitButton).has.length(1);
  });
});
