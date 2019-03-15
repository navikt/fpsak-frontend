import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { lagStateMedAksjonspunkterOgBeregningsgrunnlag } from '@fpsak-frontend/utils-test/src/beregning-test-helper';
import { MockFieldsWithContent } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import { InputField, SelectField, PeriodpickerField } from '@fpsak-frontend/form';
import { AndelRowImpl, mapStateToProps } from './InntektFieldArrayRow';
import ArbeidsforholdField from './ArbeidsforholdField';


const aksjonspunkter = [
  {
    definisjon: { kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN },
    status: { kode: 'OPPR' },
  },
];

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
const state = lagStateMedAksjonspunkterOgBeregningsgrunnlag(aksjonspunkter, { faktaOmBeregning }, initial, initial);
const props = mapStateToProps(state, { fields, index: 0 });


it('skal vise komponent med arbeidsperiode og refusjonskrav', () => {
  const wrapper = shallowWithIntl(<AndelRowImpl
    intl={intlMock}
    fields={fields}
    readOnly={false}
    skalVisePeriode
    skalViseRefusjon
    skalViseSletteknapp={false}
    skalRedigereInntekt
    andelElementFieldId="fieldArrayName[0]"
    removeAndel={() => {}}
    index={0}
    {...props}
  />);
  const rows = wrapper.find(TableRow);
  expect(rows.length).to.eql(1);
  const columns = rows.first().find(TableColumn);
  expect(columns.length).to.eql(6);
  expect(columns.first().find(ArbeidsforholdField).length).to.eql(1);
  expect(columns.at(1).find(PeriodpickerField).length).to.eql(1);
  expect(columns.at(2).find(InputField).length).to.eql(1);
  expect(columns.at(3).find(InputField).length).to.eql(1);
  expect(columns.at(4).find(SelectField).length).to.eql(1);
  const btn = columns.at(3).find('button');
  expect(btn.length).to.eql(0);
});

it('skal vise komponent uten arbeidsperiode og refusjonskrav', () => {
  const andelField2 = {
    nyAndel: false,
    andel: 'Sopra Steria AS (233647823)',
    andelsnr: 1,
    fastsattBelop: '0',
    lagtTilAvSaksbehandler: false,
    inntektskategori: 'ARBEIDSTAKER',
    arbeidsgiverId: '',
    arbeidsperiodeFom: '',
    arbeidsperiodeTom: '',
  };

  const fields2 = new MockFieldsWithContent('fieldArrayName', [andelField2]);

  const wrapper = shallowWithIntl(<AndelRowImpl
    intl={intlMock}
    fields={fields2}
    readOnly={false}
    skalVisePeriode={false}
    skalViseSletteknapp={false}
    skalViseRefusjon={false}
    skalRedigereInntekt
    andelElementFieldId="fieldArrayName[0]"
    removeAndel={() => {}}
    index={0}
    {...props}
  />);
  const row = wrapper.find(TableRow);
  expect(row.length).to.eql(1);
  const columns = row.first().find(TableColumn);
  expect(columns.length).to.eql(4);
  expect(columns.first().find(ArbeidsforholdField).length).to.eql(1);
  expect(columns.at(1).find(InputField).length).to.eql(1);
  expect(columns.at(2).find(SelectField).length).to.eql(1);
  const btn = columns.at(3).find('button');
  expect(btn.length).to.eql(0);
});


it('skal vise komponent med sletteknapp', () => {
  const andelField2 = {
    nyAndel: false,
    andel: 'Sopra Steria AS (233647823)',
    andelsnr: 1,
    fastsattBelop: '0',
    lagtTilAvSaksbehandler: false,
    inntektskategori: 'ARBEIDSTAKER',
    arbeidsgiverId: '',
    arbeidsperiodeFom: '',
    arbeidsperiodeTom: '',
  };

  const fields2 = new MockFieldsWithContent('fieldArrayName', [andelField2]);

  const wrapper = shallowWithIntl(<AndelRowImpl
    intl={intlMock}
    fields={fields2}
    readOnly={false}
    skalVisePeriode={false}
    skalViseSletteknapp
    skalViseRefusjon={false}
    skalRedigereInntekt
    andelElementFieldId="fieldArrayName[0]"
    removeAndel={() => {}}
    index={0}
    {...props}
  />);
  const row = wrapper.find(TableRow);
  expect(row.length).to.eql(1);
  const columns = row.first().find(TableColumn);
  expect(columns.length).to.eql(4);
  expect(columns.first().find(ArbeidsforholdField).length).to.eql(1);
  expect(columns.at(1).find(InputField).length).to.eql(1);
  expect(columns.at(2).find(SelectField).length).to.eql(1);
  const btn = columns.at(3).find('button');
  expect(btn.length).to.eql(1);
});
