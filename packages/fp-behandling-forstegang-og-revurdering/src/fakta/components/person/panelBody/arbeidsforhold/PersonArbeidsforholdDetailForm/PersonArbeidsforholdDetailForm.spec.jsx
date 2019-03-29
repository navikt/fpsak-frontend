import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { TextAreaField } from '@fpsak-frontend/form';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aktivtArbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/aktivtArbeidsforholdHandling';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';
import { PersonArbeidsforholdDetailForm, showBegrunnelse } from './PersonArbeidsforholdDetailForm';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';

describe('<PersonArbeidsforholdDetailForm>', () => {
  const arbeidsforhold = {
    id: '1',
    arbeidsforholdId: '1231-2345',
    navn: 'Svendsen Eksos',
    arbeidsgiverIdentifikator: '1234567',
    arbeidsgiverIdentifiktorGUI: '1234567',
    fomDato: '2018-01-01',
    tomDato: '2018-10-10',
    kilde: {
      kode: 'INNTEKT',
      navn: '',
    },
    mottattDatoInntektsmelding: undefined,
    brukArbeidsforholdet: true,
    erNyttArbeidsforhold: undefined,
    erstatterArbeidsforholdId: undefined,
    tilVurdering: true,
  };
  it('skal vise tekstfelt for begrunnelse når form er dirty', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      skalBrukeUendretForhold
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
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
      skalBrukeUendretForhold
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
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
      skalBrukeUendretForhold
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere={false}
      readOnly={false}
      vurderOmSkalErstattes
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [{ id: 2 }],
      }}
    />);
    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel).to.be.length(1);
  });
  it('skal ikke vise panel for å velge nytt eller erstatte når behandling ikke er i bruk', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      skalBrukeUendretForhold={false}
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [{ id: 2 }],
      }}
    />);
    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel).to.be.length(0);
  });
  it('skal ikke vise panel for å velge nytt eller erstatte når behandling ikke har gamle arbeidsforhold for samme org', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      skalBrukeUendretForhold
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);
    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel).to.be.length(0);
  });
  it('skal vise tekst for å erstatte alle tidligere arbeidsforhold når behandling er i bruk og flagget harErstattetEttEllerFlere er satt', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      skalBrukeUendretForhold
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
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
      skalBrukeUendretForhold={false}
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
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
      skalBrukeUendretForhold
      isErstattArbeidsforhold
      hasReceivedInntektsmelding
      harErstattetEttEllerFlere={false}
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
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
      aktivtArbeidsforholdHandlingField: aktivtArbeidsforholdHandling.AVSLA_YTELSE,
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
  it('skal vise LeggTilArbeidsforholdFelter ', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      skalBrukeUendretForhold
      isErstattArbeidsforhold
      hasReceivedInntektsmelding={false}
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);
    const radiogroup = wrapper.find(LeggTilArbeidsforholdFelter);
    expect(radiogroup).has.length(1);
  });
  it('skal ikke vise LeggTilArbeidsforholdFelter ', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      skalBrukeUendretForhold
      isErstattArbeidsforhold
      hasReceivedInntektsmelding={false}
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
    />);
    const radiogroup = wrapper.find(LeggTilArbeidsforholdFelter);
    expect(radiogroup).has.length(0);
  });
});
