import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils/currencyUtils';
import GrunnlagForAarsinntektPanelAT, { GrunnlagForAarsinntektPanelATImpl as UnwrappedForm } from './GrunnlagForAarsinntektPanelAT';

const bruttoBeregningBegrunnelse = 'Dette er en begrunnelse';
const getBehandling = () => ({
  id: 1,
  versjon: 123,
  type: {
    kode: '',
    navn: '',
  },
  status: {
    kode: 'FVED',
    navn: 'Fatter vedtak',
  },
  aksjonspunkter: [
    {
      id: 55,
      erAktivt: true,
      definisjon: {
        kode: '5038',
        navn: 'Fastsett varig brutto beregning',
      },
      toTrinnsBehandling: false,
      status: {
        kode: 'OPPR',
        navn: 'Opprettet',
      },
      begrunnelse: bruttoBeregningBegrunnelse,
      vilkarType: null,
      kanLoses: true,
    },
  ],
  behandlingsresultat: {
    id: 1,
    type: {
      navn: 'test',
      kode: '1',
    },
  },
  fagsakId: 1,
  opprettet: '15.10.2017',
  vilkar: [{
    vilkarType: {
      kode: '1',
      navn: 'test',
    },
    avslagKode: '2',
    lovReferanse: '§ 22-13, 2. ledd',
  }],
  resultatstruktur: {
    beregningsgrunnlag: {
      beregningsgrunnlagPeriode: [{
        beregningsgrunnlagPrStatusOgAndel: [{
          overstyrtPrAar: 100,
          aktivitetStatus: {
            kode: aktivitetStatus.ARBEIDSTAKER,
          },
        },
        {
          overstyrtPrAar: 200,
          aktivitetStatus: {
            kode: aktivitetStatus.ARBEIDSTAKER,
          },
        }],
      }],
    },
  },
});

const periode = {
  bruttoPrAar: 300000,
  beregningsgrunnlagPrStatusOgAndel: [
    {
      aktivitetStatus: {
        kode: aktivitetStatus.ARBEIDSTAKER,
      },
      virksomhetNavn: 'arbeidsgiver 1',
      virksomhetId: '123',
      arbeidsforholdId: '123',
      beregnetPrAar: 200000,
      overstyrtPrAar: 100,
    },
    {
      aktivitetStatus: {
        kode: aktivitetStatus.ARBEIDSTAKER,
      },
      virksomhetNavn: 'arbeidsgiver 2',
      virksomhetId: '123',
      arbeidsforholdId: '123',
      beregnetPrAar: 100000,
      overstyrtPrAar: 200,
    },
  ],
};
const perioder = [];
describe('<GrunnlagForAarsinntektPanelAT>', () => {
  it('Skal teste tabellen får korrekt antall rader', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      intl={intlMock}
      readOnly
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      isAksjonspunktClosed
      isKombinasjonsstatus={false}
      harAksjonspunkt={false}
      allePerioder={perioder}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows).to.have.length(3);
  });

  it('Skal teste at korrekte verdier settes i tabellen', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly
      isKombinasjonsstatus={false}
      isAksjonspunktClosed
      allePerioder={perioder}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows.find('Normaltekst').at(0).childAt(0).text()).to.equal('arbeidsgiver 1 (123) ...123');
    expect(rows.find('Normaltekst').at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(200000));
    expect(rows.find('Normaltekst').at(2).childAt(0).text()).to.equal('arbeidsgiver 2 (123) ...123');
    expect(rows.find('Normaltekst').at(3).childAt(0).text()).to.equal(formatCurrencyNoKr(100000));
  });

  it('Skal se at ingen input felter oppstor når vi ikke har aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly
      isKombinasjonsstatus={false}
      isAksjonspunktClosed
      allePerioder={perioder}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
    />);
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(0);
  });

  it('Skal teste at et input felt per inntekt oppstor når vi har aksjonspunkt', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      isAksjonspunktClosed={false}
      readOnly={false}
      isKombinasjonsstatus={false}
      aksjonspunkt={getBehandling().aksjonspunkter[0]}
      alleAndeler={periode.beregningsgrunnlagPrStatusOgAndel}
      allePerioder={perioder}
    />);
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(2);
  });

  it('Skal teste at initial values bygges korrekt', () => {
    const initialValues = GrunnlagForAarsinntektPanelAT.buildInitialValues(
      periode.beregningsgrunnlagPrStatusOgAndel,
      getBehandling().aksjonspunkter[0],
    );
    expect(initialValues).to.eql({
      inntekt0: '100',
      inntekt1: '200',
    });
  });
});
