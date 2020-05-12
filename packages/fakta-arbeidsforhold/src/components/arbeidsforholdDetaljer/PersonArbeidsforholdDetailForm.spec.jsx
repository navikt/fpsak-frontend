import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { TextAreaField } from '@fpsak-frontend/form';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import PersonNyttEllerErstattArbeidsforholdPanel from './PersonNyttEllerErstattArbeidsforholdPanel';
import { PersonArbeidsforholdDetailForm } from './PersonArbeidsforholdDetailForm';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';
import arbeidsforholdHandling from '../../kodeverk/arbeidsforholdHandling';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';

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
  it('skal ikke vise tekstfelt for begrunnelse når form ikke er dirty og begrunnelse ikke har verdi', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);
    expect(wrapper.find(TextAreaField)).has.length(0);
  });
  it('skal vise panel for å velge nytt eller erstatte når behandling er i bruk og en har gamle arbeidsforhold for samme org', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);
    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel).to.be.length(1);
  });
  it('skal ikke vise panel for å velge nytt eller erstatte når behandling ikke er i bruk', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);
    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel).to.be.length(0);
  });
  it('skal ikke vise panel for å velge nytt eller erstatte når behandling ikke har gamle arbeidsforhold for samme org', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);
    const panel = wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel);
    expect(panel).to.be.length(0);
  });
  it('skal vise tekst for å erstatte alle tidligere arbeidsforhold når behandling er i bruk og flagget harErstattetEttEllerFlere er satt', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);

    expect(wrapper.find('[id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod"]')).has.length(1);
  });
  it('skal ikke vise tekst for å erstatte alle tidligere arbeidsforhold når behandling ikke er i bruk', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);

    expect(wrapper.find('[id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod"]')).has.length(0);
  });
  it('skal ikke vise tekst for å erstatte alle tidligere arbeidsforhold når flagget harErstattetEttEllerFlere ikke er satt', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);
    expect(wrapper.find('[id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod"]')).has.length(0);
  });
  it('skal vise LeggTilArbeidsforholdFelter ', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);
    const radiogroup = wrapper.find(LeggTilArbeidsforholdFelter);
    expect(radiogroup).has.length(1);
  });
  it('skal ikke vise LeggTilArbeidsforholdFelter ', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
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
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);
    const radiogroup = wrapper.find(LeggTilArbeidsforholdFelter);
    expect(radiogroup).has.length(0);
  });
  it('skal ikke vise tekst for å erstatte alle tidligere arbeidsforhold eller NyttEllerErstattPanel når handlingen er undefined', () => {
    const wrapper = shallowWithIntl(<PersonArbeidsforholdDetailForm
      {...reduxFormPropsMock}
      intl={intlMock}
      cancelArbeidsforhold={sinon.spy()}
      arbeidsforholdHandlingVerdi={undefined}
      isErstattArbeidsforhold
      hasReceivedInntektsmelding={false}
      harErstattetEttEllerFlere
      readOnly={false}
      vurderOmSkalErstattes={false}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      initialValues={{
        begrunnelse: '',
        replaceOptions: [],
      }}
      behandlingId={1}
      behandlingVersjon={1}
      alleKodeverk={{}}
    />);
    expect(wrapper.find('[id="PersonArbeidsforholdDetailForm.ErstatteTidligereArbeidsforhod"]')).has.length(0);
    expect(wrapper.find(PersonNyttEllerErstattArbeidsforholdPanel)).has.length(0);
  });
});
