import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';

import { FodselOgTilretteleggingFaktaFormOld } from './FodselOgTilretteleggingFaktaFormOld';
import ArbeidsforholdFaktaPanel from './arbeidsforhold/ArbeidsforholdFaktaPanel';

describe('<FodselOgTilretteleggingFaktaFormOld>', () => {
  it('skal vise faktaform med begrunnelsefelt og fodseldato', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingFaktaFormOld
      hasOpenAksjonspunkter={false}
      readOnly
      fødselsdato=""
      submittable
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
  it('skal vise faktaform med fødelsedato', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingFaktaFormOld
      hasOpenAksjonspunkter={false}
      readOnly
      fødselsdato="20.10.2019"
      submittable
    />);

    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(2);
    const begrunnelsefelt = wrapper.find(TextAreaField);
    expect(begrunnelsefelt).has.length(1);
    const arbforholdFaktaPanel = wrapper.find(ArbeidsforholdFaktaPanel);
    expect(arbforholdFaktaPanel).has.length(1);
    const submitButton = wrapper.find(FaktaSubmitButton);
    expect(submitButton).has.length(1);
  });
});
