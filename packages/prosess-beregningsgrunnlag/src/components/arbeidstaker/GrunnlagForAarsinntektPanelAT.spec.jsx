import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import GrunnlagForAarsinntektPanelAT, { GrunnlagForAarsinntektPanelATImpl as UnwrappedForm } from './GrunnlagForAarsinntektPanelAT';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

const bruttoBeregningBegrunnelse = 'Dette er en begrunnelse';

const mockAksjonspunkter = () => ([
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
]);

const mockAndel = (arbeidsgiverNavn, overstyrtPrAar, beregnetPrAar, erTilkommetAndel) => ({
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSTAKER,
  },
  arbeidsforhold: {
    arbeidsgiverNavn,
    arbeidsgiverId: '123',
    arbeidsforholdId: '123',
    eksternArbeidsforholdId: '345678',
  },
  beregnetPrAar,
  overstyrtPrAar,
  erTilkommetAndel,
});

const getKodeverknavn = () => undefined;

const perioder = [];

describe('<GrunnlagForAarsinntektPanelAT>', () => {
  it('Skal teste tabellen får korrekt antall rader', () => {
    const andeler = [mockAndel('Arbeidsgiver 1', 100, 200000, false), mockAndel('Arbeidsgiver 2', 200000, 100, false)];
    const wrapper = shallowWithIntl(<UnwrappedForm
      intl={intlMock}
      readOnly
      alleAndeler={andeler}
      isAksjonspunktClosed
      isKombinasjonsstatus={false}
      harAksjonspunkt={false}
      aksjonspunkter={[]}
      allePerioder={perioder}
      getKodeverknavn={getKodeverknavn}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows).to.have.length(3);
  });

  it('Skal teste at korrekte verdier settes i tabellen', () => {
    const andeler = [mockAndel('Arbeidsgiver 1', 100, 200000, false), mockAndel('Arbeidsgiver 2', 100, 100000, false)];
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly
      isKombinasjonsstatus={false}
      isAksjonspunktClosed
      allePerioder={perioder}
      alleAndeler={andeler}
      aksjonspunkter={[]}
      getKodeverknavn={getKodeverknavn}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows.find('Normaltekst').at(0).childAt(0).text()).to.equal('Arbeidsgiver 1 (123)...5678');
    expect(rows.find('Normaltekst').at(1).childAt(0).text()).to.equal(formatCurrencyNoKr(200000));
    expect(rows.find('Normaltekst').at(2).childAt(0).text()).to.equal('Arbeidsgiver 2 (123)...5678');
    expect(rows.find('Normaltekst').at(3).childAt(0).text()).to.equal(formatCurrencyNoKr(100000));
  });

  it('Skal teste rendering av komponent når vi ikke har aksjonspunkter', () => {
    const andeler = [mockAndel('Arbeidsgiver 1', 100, 200000, false), mockAndel('Arbeidsgiver 2', 100, 200000, false)];
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly
      isKombinasjonsstatus={false}
      isAksjonspunktClosed
      allePerioder={perioder}
      alleAndeler={andeler}
      aksjonspunkter={[]}
      getKodeverknavn={getKodeverknavn}
    />);
    const table = wrapper.find('Table');
    expect(table.props().headerTextCodes).to.have.length(2);
    expect(table.props().headerTextCodes[0]).to.equal('Beregningsgrunnlag.AarsinntektPanel.Arbeidsgiver');
    expect(table.props().headerTextCodes[1]).to.equal('Beregningsgrunnlag.AarsinntektPanel.Inntekt');
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(0);
  });

  it('Skal teste rendering av komponent når vi har aksjonspunkter', () => {
    const andeler = [mockAndel('Arbeidsgiver 1', 100, 200000, false), mockAndel('Arbeidsgiver 2', 100, 200000, false)];
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      isAksjonspunktClosed={false}
      readOnly={false}
      isKombinasjonsstatus={false}
      aksjonspunkter={mockAksjonspunkter()}
      alleAndeler={andeler}
      allePerioder={perioder}
      getKodeverknavn={getKodeverknavn}
    />);
    const table = wrapper.find('Table');
    expect(table.props().headerTextCodes).to.have.length(3);
    expect(table.props().headerTextCodes[0]).to.equal('Beregningsgrunnlag.AarsinntektPanel.Arbeidsgiver');
    expect(table.props().headerTextCodes[1]).to.equal('Beregningsgrunnlag.AarsinntektPanel.Inntekt');
    expect(table.props().headerTextCodes[2]).to.equal('Beregningsgrunnlag.AarsinntektPanel.FastsattInntekt');
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(2);
  });

  it('Skal teste at andeler som ikke skal vises blir filtrert ut fra tabellen', () => {
    const andeler = [mockAndel('Arbeidsgiver 1', null, 200000, true), mockAndel('Arbeidsgiver 2', 100, 200000, false)];
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      isAksjonspunktClosed={false}
      readOnly={false}
      isKombinasjonsstatus={false}
      aksjonspunkter={mockAksjonspunkter()}
      alleAndeler={andeler}
      allePerioder={perioder}
      getKodeverknavn={getKodeverknavn}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows).to.have.length(2);
    const inputField = wrapper.find('InputField');
    expect(inputField).to.have.length(1);
  });

  it('Skal teste at initial values bygges korrekt', () => {
    const andeler = [mockAndel('Arbeidsgiver 1', 100, false), mockAndel('Arbeidsgiver 2', 200, false)];
    const initialValues = GrunnlagForAarsinntektPanelAT.buildInitialValues(andeler, mockAksjonspunkter());
    expect(initialValues).to.eql({
      inntekt0: '100',
      inntekt1: '200',
    });
  });
});
