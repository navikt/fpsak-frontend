
import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { lagStateMedAksjonspunkterOgBeregningsgrunnlag } from '@fpsak-frontend/utils-test/src/beregning-test-helper';
import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Table } from '@fpsak-frontend/shared-components';
import { besteberegningField } from './besteberegningFodendeKvinne/VurderBesteberegningForm';
import { AndelRow } from './InntektFieldArrayRow';
import SummaryRow from './SummaryRow';
import InntektFieldArray, { mapStateToProps, InntektFieldArrayImpl, leggTilDagpengerOmBesteberegning } from './InntektFieldArray';
import { formNameVurderFaktaBeregning } from '../BeregningFormUtils';

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
    const bg = {
      beregningsgrunnlagPeriode: [
        {},
      ],
      faktaOmBeregning,
    };
    const state = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, bg, formNameVurderFaktaBeregning);
    const props = mapStateToProps(state);
    expect(props.isBeregningFormDirty).to.eql(false);
    expect(props.aktivitetStatuser.length).to.eql(13);
    expect(props.erKunYtelse).to.eql(false);
  });


  it('skal med dagpengeandel lagt til tidligere', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING }],
    };
    const dagpengeAndel = { aktivitetStatus: { kode: aktivitetStatuser.DAGPENGER }, beregnetPrAar: 120000 };
    const bg = {
      beregningsgrunnlagPeriode: [
        {
          andelerLagtTilManueltIForrige: [
            dagpengeAndel,
          ],
        },
      ],
      faktaOmBeregning,
    };
    const state = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, bg, formNameVurderFaktaBeregning);
    const props = mapStateToProps(state);
    expect(props.isBeregningFormDirty).to.eql(false);
    expect(props.aktivitetStatuser.length).to.eql(13);
    expect(props.dagpengeAndelLagtTilIForrige).to.eql(dagpengeAndel);
  });

  it('skal mappe state til props for kun ytelse', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE }],
    };
    const bg = {
      beregningsgrunnlagPeriode: [
        {},
      ],
      faktaOmBeregning,
    };
    const state = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, bg, formNameVurderFaktaBeregning);
    const props = mapStateToProps(state);
    expect(props.erKunYtelse).to.eql(true);
  });


  const andelField = {
    nyAndel: false,
    andel: 'Sopra Steria AS (233647823)',
    andelsnr: 1,
    fastsattBelop: '0',
    lagtTilAvSaksbehandler: false,
    inntektskategori: 'ARBEIDSTAKER',
    arbeidsgiverId: '233647823',
    arbeidsperiodeFom: '01.01.2018',
    arbeidsperiodeTom: null,
    refusjonskrav: '10 000',
  };

  const fields = new MockFieldsWithContent('fieldArrayName', [andelField]);

  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING }],
  };
  const initial = {};
  initial.fieldArrayName = [andelField];
  initial[besteberegningField] = true;
  const bg = {
    beregningsgrunnlagPeriode: [
      {},
    ],
    faktaOmBeregning,
  };
  const state = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, bg, formNameVurderFaktaBeregning, initial, initial);
  const props = mapStateToProps(state);

  it('skal vise komponent', () => {
    const wrapper = shallowWithIntl(<InntektFieldArrayImpl
      intl={intlMock}
      fields={fields}
      meta={{}}
      readOnly={false}
      {...props}
    />);
    const table = wrapper.find(Table);
    expect(table.length).to.eql(1);
    const andelRows = table.find(AndelRow);
    expect(andelRows.length).to.eql(1);
    const summaryRow = table.find(SummaryRow);
    expect(summaryRow.length).to.eql(1);
  });


  it('skal legge til dagpengeandel', () => {
    const dagpengeAndel = { aktivitetStatus: { kode: aktivitetStatuser.DAGPENGER }, beregnetPrAar: 120000 };
    const newbg = {
      beregningsgrunnlagPeriode: [
        {
          andelerLagtTilManueltIForrige: [
            dagpengeAndel,
          ],
        },
      ],
      faktaOmBeregning,
    };
    const values = { [besteberegningField]: true };
    const newstate = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, newbg, formNameVurderFaktaBeregning, values);
    const newprops = mapStateToProps(newstate);
    const wrapper = shallowWithIntl(<InntektFieldArrayImpl
      intl={intlMock}
      fields={fields}
      meta={{}}
      readOnly={false}
      {...newprops}
    />);
    const table = wrapper.find(Table);
    expect(table.length).to.eql(1);
    const andelRows = table.find(AndelRow);
    expect(andelRows.length).to.eql(2);
    const summaryRow = table.find(SummaryRow);
    expect(summaryRow.length).to.eql(1);
  });

  it('skal fjerne dagpengeandel om dagpenger og lagt til manuelt', () => {
    const newfields = new MockFieldsWithContent('fieldArrayName', [{ aktivitetStatus: aktivitetStatuser.DAGPENGER, lagtTilAvSaksbehandler: true }]);
    leggTilDagpengerOmBesteberegning(newfields, false, [aktivitetStatuser.DAGPENGER], undefined);
    expect(newfields.length).to.equal(0);
  });

  it('skal ikkje fjerne dagpengeandel om dagpenger og ikkje lagt til manuelt', () => {
    const newfields = new MockFieldsWithContent('fieldArrayName', [{ aktivitetStatus: aktivitetStatuser.DAGPENGER, lagtTilAvSaksbehandler: false }]);
    leggTilDagpengerOmBesteberegning(newfields, false, [aktivitetStatuser.DAGPENGER], undefined);
    expect(newfields.length).to.equal(1);
  });

  it('skal legge til dagpengeandel med fastsatt belop', () => {
    const dagpengeAndel = { aktivitetStatus: { kode: aktivitetStatuser.DAGPENGER }, beregnetPrAar: 120000 };
    const newbg = {
      beregningsgrunnlagPeriode: [
        {
          andelerLagtTilManueltIForrige: [
            dagpengeAndel,
          ],
        },
      ],
      faktaOmBeregning,
    };
    const values = { [besteberegningField]: true };
    const newstate = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, newbg, formNameVurderFaktaBeregning, values);
    const newprops = mapStateToProps(newstate);
    const newfields = [];
    leggTilDagpengerOmBesteberegning(newfields, newprops.skalHaBesteberegning, newprops.aktivitetStatuser, newprops.dagpengeAndelLagtTilIForrige);
    expect(newfields.length).to.equal(1);
    expect(newfields[0].fastsattBelop).to.equal('10 000');
  });


  it('skal validere eksisterende andeler uten errors', () => {
    const skalRedigereInntekt = () => true;
    const values = [];
    const andel2 = {
      fastsattBelop: '10 000',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      inntektskategori: 'ARBEIDSTAKER',
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false, skalRedigereInntekt);
    expect(errors).to.equal(null);
  });

  it('skal returnerer errors for fastsattbeløp når ikkje oppgitt', () => {
    const skalRedigereInntekt = () => true;
    const values = [];
    const andel2 = {
      refusjonskrav: '10 000',
      fastsattBelop: '',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      inntektskategori: 'ARBEIDSTAKER',
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false, skalRedigereInntekt);
    expect(errors[0].fastsattBelop).to.have.length(1);
    expect(errors[0].fastsattBelop[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal ikkje returnerer errors når man ikkje skal redigere inntekt', () => {
    const skalRedigereInntekt = () => false;
    const values = [];
    const andel2 = {
      refusjonskrav: '10 000',
      fastsattBelop: '',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      inntektskategori: 'ARBEIDSTAKER',
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false, skalRedigereInntekt);
    expect(errors).to.equal(null);
  });

  it('skal gi error om inntektkategori ikkje er oppgitt', () => {
    const skalRedigereInntekt = () => true;
    const values = [];
    const andel2 = {
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn for virksomhet',
      inntektskategori: '',
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false, skalRedigereInntekt);
    expect(errors[0].inntektskategori).to.have.length(1);
    expect(errors[0].inntektskategori[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal gi error om andel ikkje er valgt for nye andeler', () => {
    const skalRedigereInntekt = () => true;
    const values = [];
    const andel2 = {
      refusjonskrav: '10 000',
      fastsattBelop: '100 000',
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: '',
      inntektskategori: 'ARBEIDSTAKER',
      nyAndel: true,
    };
    values.push(andel2);
    const errors = InntektFieldArray.validate(values, false, skalRedigereInntekt);
    expect(errors[0].andel).to.have.length(1);
    expect(errors[0].andel[0].id).to.equal(isRequiredMessage()[0].id);
  });

  const getKodeverknavn = () => undefined;

  it('skal ikkje bygge initial values om ingen andeler', () => {
    const iv = InntektFieldArray.buildInitialValues([], getKodeverknavn, {});
    expect(iv).to.be.empty;
  });

  it('skal ikkje kunne endre aktivitet om status dagpenger', () => {
    const andel = {
      andelsnr: 1,
      aktivitetStatus: { kode: 'DP' },
      inntektskategori: { kode: 'DAGPENGER' },
      lagtTilAvSaksbehandler: true,
    };
    const iv = InntektFieldArray.buildInitialValues([andel], getKodeverknavn, {});
    expect(iv.length).to.equal(1);
    expect(iv[0].skalKunneEndreAktivitet).to.equal(false);
  });
});
