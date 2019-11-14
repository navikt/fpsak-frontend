import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import BeregningsresultatTable2 from './BeregningsresultatTable_V2';

const tableData = {
  rows: [['Brutto', 400], ['Avkortet', 400], ['Redusert', 400]],
  dagsatser: ['Dagsats', 100],
  headers: ['Beregningsgrunnlag.AarsinntektPanel.TomString'],
};
const vilkaarBG = {
  vilkarStatus: {
    kode: 'IKKE_VURDERT',
    kodeverk: 'vilkarStatus',
  },
  vilkarType: {
    kode: 'FP_VK_41',
    kodeverk: 'vilkarType',
  },
};
describe('<BeregningsresultatTable2>', () => {
  it('Skal se tabellen får korrekt antall rader', () => {
    const wrapper = shallowWithIntl(<BeregningsresultatTable2.WrappedComponent
      intl={intlMock}
      isVilkarOppfylt
      tableData={tableData}
      vilkaarBG={vilkaarBG}
    />);
    const panel = wrapper.find('PanelBase');
    const rows = panel.find('Row');
    // TODO: Denne testen returnerer true, her må det teatet på mer
    expect(rows).to.have.length(1);
  });
});
