import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TextAreaField from '@fpsak-frontend/form/src/TextAreaField';
import { ArbeidsforholdBegrunnelse } from './ArbeidsforholdBegrunnelse';

describe('<ArbeidsforholdBegrunnelse>', () => {
  it('skal ikke vise begrunnelsesfelt når ikke dirty, uten begrunnelse, og ikke avslå ytelse', () => {
    const wrapper = shallow(<ArbeidsforholdBegrunnelse
      readOnly={false}
      formName=""
      isDirty={false}
      harBegrunnelse={false}
      skalAvslaaYtelse={false}
      behandlingId={1}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(TextAreaField)).has.length(0);
  });
  it('skal ikke vise begrunnelsesfelt når ikke dirty, uten begrunnelse, og avslå ytelse', () => {
    const wrapper = shallow(<ArbeidsforholdBegrunnelse
      readOnly={false}
      formName=""
      isDirty={false}
      harBegrunnelse={false}
      skalAvslaaYtelse
      behandlingId={1}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(TextAreaField)).has.length(0);
  });
  it('skal ikke vise begrunnelsesfelt når dirty, uten begrunnelse, og avslå ytelse', () => {
    const wrapper = shallow(<ArbeidsforholdBegrunnelse
      readOnly={false}
      formName=""
      isDirty
      harBegrunnelse={false}
      skalAvslaaYtelse
      behandlingId={1}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(TextAreaField)).has.length(0);
  });
  it('skal ikke vise begrunnelsesfelt når dirty, med begrunnelse, og avslå ytelse', () => {
    const wrapper = shallow(<ArbeidsforholdBegrunnelse
      readOnly={false}
      formName=""
      isDirty
      harBegrunnelse
      skalAvslaaYtelse
      behandlingId={1}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(TextAreaField)).has.length(0);
  });
  it('skal vise begrunnelsesfelt når dirty, med begrunnelse, og ikke avslå ytelse', () => {
    const wrapper = shallow(<ArbeidsforholdBegrunnelse
      readOnly={false}
      formName=""
      isDirty
      harBegrunnelse
      skalAvslaaYtelse={false}
      behandlingId={1}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(TextAreaField)).has.length(1);
  });
  it('skal vise begrunnelsesfelt når dirty, uten begrunnelse, og ikke avslå ytelse', () => {
    const wrapper = shallow(<ArbeidsforholdBegrunnelse
      readOnly={false}
      formName=""
      isDirty
      harBegrunnelse={false}
      skalAvslaaYtelse={false}
      behandlingId={1}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(TextAreaField)).has.length(1);
  });
  it('skal vise begrunnelsesfelt når ikke dirty, med begrunnelse, og ikke avslå ytelse', () => {
    const wrapper = shallow(<ArbeidsforholdBegrunnelse
      readOnly={false}
      formName=""
      isDirty={false}
      harBegrunnelse
      skalAvslaaYtelse={false}
      behandlingId={1}
      behandlingVersjon={1}
    />);
    expect(wrapper.find(TextAreaField)).has.length(1);
  });
});
