import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import BeregningsresultatTable from './BeregningsresultatTable';

const tableData = {
  rows: [['Brutto', 400], ['Avkortet', 400], ['Redusert', 400]],
  dagsatser: ['Dagsats', 100],
  headers: ['Beregningsgrunnlag.AarsinntektPanel.TomString'],
};

describe('<BeregningsresultatTable>', () => {
  it('Skal se tabellen får korrekt antall rader', () => {
    const wrapper = shallowWithIntl(<BeregningsresultatTable.WrappedComponent
      intl={intlMock}
      isVilkarOppfylt
      tableData={tableData}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows).to.have.length(4);
    const cols = wrapper.find('TableColumn');
    expect(cols).to.have.length(9);
  });
});
