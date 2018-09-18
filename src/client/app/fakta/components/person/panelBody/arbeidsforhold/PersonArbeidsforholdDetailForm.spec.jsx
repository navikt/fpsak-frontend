import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { TextAreaField } from 'form/Fields';
import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';
import { PersonArbeidsforholdDetailForm, showBegrunnelse } from './PersonArbeidsforholdDetailForm';

describe('<PersonArbeidsforholdDetailForm>', () => {
  it('skal vise radioknapper for om en vil fortsette behandling eller ikke når behandling er i bruk og inntektmelding ikke er mottatt', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling
      isErstattArbeidsforhold
      hasReceivedInntektsmelding={false}
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);

    const radiogroup = wrapper.find('[name=\'fortsettBehandlingUtenInntektsmelding\']');
    expect(radiogroup).has.length(1);
  });

  it('skal ikke vise radioknapper for om en vil fortsette behandling eller ikke når behandling ikke er i bruk', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling={false}
      isErstattArbeidsforhold
      hasReceivedInntektsmelding={false}
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);

    const radiogroup = wrapper.find('[name=\'fortsettBehandlingUtenInntektsmelding\']');
    expect(radiogroup).has.length(0);
  });

  it('skal ikke vise radioknapper for om en vil fortsette behandling eller ikke når inntektmelding er mottatt', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);

    const radiogroup = wrapper.find('[name=\'fortsettBehandlingUtenInntektsmelding\']');
    expect(radiogroup).has.length(0);
  });

  it('skal vise tekstfelt for begrunnelse når form er dirty', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
      showBegrunnelse
    />);

    expect(wrapper.find(TextAreaField)).has.length(1);
  });

  it('skal ikke vise tekstfelt for begrunnelse når form ikke er dirty og begrunnelse ikke har verdi', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);

    expect(wrapper.find(TextAreaField)).has.length(0);
  });

  it('skal vise panel for å velge nytt eller erstatte når behandling er i bruk og en har gamle arbeidsforhold for samme org', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere={false}
      readOnly={false}
      vurderOmSkalErstattes
      initialValues={{
        begrunnelse: '',
        replaceOptions: [{ id: 2 }],
      }}
    />);

    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel.prop('showContent')).is.true;
  });

  it('skal ikke vise panel for å velge nytt eller erstatte når behandling ikke er i bruk', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling={false}
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [{ id: 2 }],
      }}
    />);

    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel.prop('showContent')).is.false;
  });

  it('skal ikke vise panel for å velge nytt eller erstatte når behandling ikke har gamle arbeidsforhold for samme org', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);

    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel.prop('showContent')).is.false;
  });

  it('skal vise tekst for å erstatte alle tidligere arbeidsforhold når behandling er i bruk og flagget harErstattetEttEllerFlere er satt', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);

    expect(wrapper.find('[id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod"]')).has.length(1);
  });

  it('skal ikke vise tekst for å erstatte alle tidligere arbeidsforhold når behandling ikke er i bruk', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling={false}
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);

    expect(wrapper.find('[id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod"]')).has.length(0);
  });

  it('skal ikke vise tekst for å erstatte alle tidligere arbeidsforhold når flagget harErstattetEttEllerFlere ikke er satt', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      shouldUseBehandling
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere={false}
      readOnly={false}
      vurderOmSkalErstattes={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);

    expect(wrapper.find('[id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod"]')).has.length(0);
  });

  it('skal ikke vise begrunnelsefelt når form ikke er dirty og begrunnelse ikke er lagret fra før', () => {
    const dirty = false;
    const values = {};
    const initialValues = {};
    expect(showBegrunnelse.resultFunc(dirty, values, initialValues)).is.false;
  });

  it('skal ikke vise begrunnelsefelt når form er dirty og en har valgt å ikke fortsette uten inntektsmelding', () => {
    const dirty = true;
    const values = {
      fortsettBehandlingUtenInntektsmelding: false,
    };
    const initialValues = {};
    expect(showBegrunnelse.resultFunc(dirty, values, initialValues)).is.false;
  });

  it('skal vise begrunnelsefelt når form er dirty og en har valgt å fortsette uten inntektsmelding', () => {
    const dirty = true;
    const values = {
      fortsettBehandlingUtenInntektsmelding: true,
    };
    const initialValues = {};
    expect(showBegrunnelse.resultFunc(dirty, values, initialValues)).is.true;
  });

  it('skal vise begrunnelsefelt når form ikke er dirty men beskrivelse finnes', () => {
    const dirty = false;
    const values = {};
    const initialValues = {
      begrunnelse: 'test',
    };
    expect(showBegrunnelse.resultFunc(dirty, values, initialValues)).is.true;
  });
});
