
import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { lagStateMedAksjonspunkterOgFaktaOmBeregning } from '@fpsak-frontend/utils-test/src/beregning-test-helper';
import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Table, TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import { InputField, SelectField } from '@fpsak-frontend/form';
import ArbeidsforholdField from './ArbeidsforholdField';
import InntektFieldArray, { mapStateToProps, InntektFieldArrayImpl } from './InntektFieldArray';

const arbeidsforhold1 = {
  arbeidsgiverNavn: 'Sopra Steria AS',
  arbeidsgiverId: '233647823',
  startdato: '01.01.1967',
  opphoersdato: null,
  arbeidsforholdId: null,
  arbeidsforholdType: '',
  aktørId: null,
};

const andel1 = {
  fastsattBelopPrMnd: null,
  andelsnr: 1,
  arbeidsforhold: arbeidsforhold1,
  inntektskategori: { kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' },
  aktivitetStatus: { kode: 'AT', navn: 'Arbeidstaker' },
  lagtTilAvSaksbehandler: false,
  fastsattAvSaksbehandler: false,
  andelIArbeid: [],

};
const aksjonspunkter = [
  {
    definisjon: { kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN },
    status: { kode: 'OPPR' },
  },
];


describe('<InntektFieldArray>', () => {
  it('skal mappe state til props for ikkje kun ytelse', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING }],
    };
    const ownProps = {};
    ownProps.andeler = [andel1];
    const state = lagStateMedAksjonspunkterOgFaktaOmBeregning(aksjonspunkter, faktaOmBeregning);
    const props = mapStateToProps(state, ownProps);
    expect(props.arbeidsforholdList.length).to.eql(1);
    expect(props.isBeregningFormDirty).to.eql(false);
    expect(props.isAksjonspunktClosed).to.eql(false);
    expect(props.aktivitetStatuser.length).to.eql(13);
    expect(props.inntektskategoriKoder.length).to.eql(2);
    expect(props.erKunYtelse).to.eql(false);
  });

  it('skal mappe state til props for kun ytelse', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE }],
    };
    const ownProps = {};
    ownProps.andeler = [andel1];
    const state = lagStateMedAksjonspunkterOgFaktaOmBeregning(aksjonspunkter, faktaOmBeregning);
    const props = mapStateToProps(state, ownProps);
    expect(props.erKunYtelse).to.eql(true);
  });


  const andelField = {
    nyAndel: false,
    andel: 'Sopra Steria AS (233647823)',
    andelsnr: 1,
    fastsattBeløp: '0',
    lagtTilAvSaksbehandler: false,
    inntektskategori: 'ARBEIDSTAKER',
  };

  const fields = new MockFieldsWithContent('fieldArrayName', [andelField]);

  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING }],
  };
  const ownProps = {};
  ownProps.andeler = [andel1];
  ownProps.readOnly = false;
  ownProps.skalHaBesteberegning = false;
  ownProps;
  const initial = {};
  initial.fieldArrayName = [andelField];
  const state = lagStateMedAksjonspunkterOgFaktaOmBeregning(aksjonspunkter, faktaOmBeregning, initial, initial);
  const props = mapStateToProps(state, ownProps);

  it('skal vise komponent', () => {
    const wrapper = shallowWithIntl(<InntektFieldArrayImpl
      intl={intlMock}
      fields={fields}
      meta={{}}
      {...ownProps}
      {...props}
    />);
    const table = wrapper.find(Table);
    expect(table.length).to.eql(1);
    const rows = table.find(TableRow);
    expect(rows.length).to.eql(2);
    const columns = rows.first().find(TableColumn);
    expect(columns.length).to.eql(4);
    expect(columns.first().find(ArbeidsforholdField).length).to.eql(1);
    expect(columns.at(1).find(InputField).length).to.eql(1);
    expect(columns.at(2).find(SelectField).length).to.eql(1);
  });

  it('skal validere eksisterende andeler uten errors', () => {
    const values = [];
    const andel2 = {
      fastsattBeløp: '10 000',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      inntektskategori: 'ARBEIDSTAKER',
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false);
    expect(errors).to.equal(null);
  });

  it('skal returnerer errors for fastsattbeløp når ikkje oppgitt', () => {
    const values = [];
    const andel2 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      inntektskategori: 'ARBEIDSTAKER',
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false);
    expect(errors[0].fastsattBeløp).to.have.length(1);
    expect(errors[0].fastsattBeløp[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal gi error om inntektkategori ikkje er oppgitt', () => {
    const values = [];
    const andel2 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      inntektskategori: '',
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false);
    expect(errors[0].inntektskategori).to.have.length(1);
    expect(errors[0].inntektskategori[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal gi error om andel ikkje er valgt for nye andeler', () => {
    const values = [];
    const andel2 = {
      refusjonskrav: '10 000',
      fastsattBeløp: '100 000',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      inntektskategori: '',
      nyAndel: true,
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false);
    expect(errors[0].andel).to.have.length(1);
    expect(errors[0].andel[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal ikkje bygge initial values om ingen andeler', () => {
    const iv = InntektFieldArray.buildInitialValues([]);
    expect(iv).to.be.empty;
  });

  it('skal ikkje kunne endre aktivitet om status dagpenger', () => {
    const andel = {
      andelsnr: 1,
      aktivitetStatus: { kode: 'DP' },
      inntektskategori: { kode: 'DAGPENGER' },
      lagtTilAvSaksbehandler: true,
    };
    const iv = InntektFieldArray.buildInitialValues([andel]);
    expect(iv.length).to.equal(1);
    expect(iv[0].skalKunneEndreAktivitet).to.equal(false);
  });
});
