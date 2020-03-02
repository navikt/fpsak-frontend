import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import React from 'react';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import BeregningsresutatPanel from './BeregningsResultatPanel';


const tableData = {

  avkortetRad: { ledetekst: 'Avkortet beregningsgrunnlag (6G=599148)', verdi: '380' },
  redusertRad: { ledetekst: 'Redusert beregningsgrunnlag (80%)', verdi: '350' },
  bruttoRad: { ledetekst: 'Brutto beregningsgrunnlag', verdi: '400' },

  dagsatser: { verdi: '100', grunnlag: '400' },
  headers: ['Beregningsgrunnlag.AarsinntektPanel.TomString'],
  rowsAndeler: [{ ledetekst: 'Beregningsgrunnlag - fastsatt årsinntekt', verdi: 130250, skalFastsetteGrunnlag: false }],
  rowsForklaringer: [],
};
const vilkaarBG = {
  vilkarStatus: {
    kode: vilkarUtfallType.IKKE_VURDERT,
    kodeverk: 'VILKAR_UTFALL_TYPE',
  },
  vilkarType: {
    kode: 'FP_VK_41',
    kodeverk: 'vilkarType',
  },
};
describe('BeregningsresultatPanel', () => {
  it('Skal teste om tabellen får korrekt antall rader ved vilkarStatus:IKKE VURDERT', () => {
    tableData.rowsAndeler[0].skalFastsetteGrunnlag = true;
    const wrapper = shallowWithIntl(<BeregningsresutatPanel.WrappedComponent
      intl={intlMock}
      periodeResultatTabeller={[tableData]}
      vilkaarBG={vilkaarBG}
      halvGVerdi={98866}
    />);
    const panel = wrapper.find('PanelBase');
    const rows = panel.find('Row');
    expect(rows).to.have.length(3);
    const andelRow = rows.first();
    const andelText = andelRow.find('Normaltekst').first().childAt(0).text();
    const andelVerdi = andelRow.find('FormattedMessage').props().id;
    expect(andelText).to.equal(tableData.rowsAndeler[0].ledetekst);
    expect(andelVerdi).to.equal('Beregningsgrunnlag.BeregningTable.MåFastsettes');
    const sumRow = rows.last();
    const sumText = sumRow.find('FormattedMessage').props().id;
    expect(sumText).to.equal('Beregningsgrunnlag.BeregningTable.Dagsats.ikkeFastsatt');
  });
  it('Skal teste om tabellen får korrekt antall rader ved vilkarStatus:OPPFYLT', () => {
    vilkaarBG.vilkarStatus.kode = vilkarUtfallType.OPPFYLT;
    vilkaarBG.vilkarStatus.kodeverk = 'VILKAR_UTFALL_TYPE';
    const wrapper = shallowWithIntl(<BeregningsresutatPanel.WrappedComponent
      intl={intlMock}
      periodeResultatTabeller={[tableData]}
      vilkaarBG={vilkaarBG}
      halvGVerdi={98866}
    />);
    const panel = wrapper.find('PanelBase');
    const rows = panel.find('Row');
    expect(rows).to.have.length(5);
    const andelRow = rows.first();

    const andelText = andelRow.find('Normaltekst').first().childAt(0).text();
    const andelVerdi = andelRow.find('Normaltekst').at(1).childAt(0).text();
    expect(andelText).to.equal(tableData.rowsAndeler[0].ledetekst);
    expect(formatCurrencyNoKr(andelVerdi)).to.equal(formatCurrencyNoKr(tableData.rowsAndeler[0].verdi));
    const sumRow = rows.last();
    const sumText = sumRow.find('FormattedHTMLMessage').props().id;
    const sumTextTall = sumRow.find('FormattedHTMLMessage').props().values.dagSats;
    const sumVerdi = sumRow.find('Normaltekst').last().childAt(0).text();
    expect(sumText).to.equal('Beregningsgrunnlag.BeregningTable.DagsatsNy');
    expect(sumTextTall).to.equal(formatCurrencyNoKr(400));
    expect(sumVerdi).to.equal(formatCurrencyNoKr(tableData.dagsatser.verdi));
  });
});
