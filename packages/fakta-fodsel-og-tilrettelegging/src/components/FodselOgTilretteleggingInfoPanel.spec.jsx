import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { faktaPanelCodes, FaktaEkspandertpanel } from '@fpsak-frontend/fp-felles';

import { FodselOgTilretteleggingInfoPanel } from './FodselOgTilretteleggingInfoPanel';

const svangerskapspengerTilrettelegging = {
  termindato: '2020-02-27',
  arbeidsforholdListe: [{
    tilretteleggingId: 1008653,
    tilretteleggingBehovFom: '2019-10-01',
    tilretteleggingDatoer: [{
      fom: '2019-10-01',
      type: {
        kode: tilretteleggingType.INGEN_TILRETTELEGGING,
      },
    }],
    arbeidsgiverNavn: 'Frilanser, samlet aktivitet',
    kopiertFraTidligereBehandling: false,
    mottattTidspunkt: '2019-10-24T12:06:36.548',
    skalBrukes: true,
  }],
};

describe('<FodselOgTilretteleggingInfoPanel>', () => {
  it('skal vise gammelt panel med toggle disabled', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingInfoPanel
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={1}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      aksjonspunkter={[]}
      openInfoPanels={['fodseltilrettelegging']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      readOnly
      submitCallback={sinon.spy()}
      submittable
      toggle={false}
    />);

    const faktaEkspandertpanel = wrapper.find(FaktaEkspandertpanel);
    expect(faktaEkspandertpanel).to.have.length(1);
    expect(faktaEkspandertpanel.prop('title')).to.eql('FodselOgTilretteleggingInfoPanel.FaktaFodselOgTilrettelegging');
    expect(faktaEkspandertpanel.prop('faktaId')).to.eql(faktaPanelCodes.FODSELTILRETTELEGGING);

    const faktaForm = faktaEkspandertpanel.find('Connect(Connect(ComponentWithRequiredProps(WithBehandlingForm)))');
    expect(faktaForm).to.have.length(1);
  });
  it('skal vise nytt panel med toggle enabled', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingInfoPanel
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={1}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      aksjonspunkter={[]}
      openInfoPanels={['fodseltilrettelegging']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      readOnly
      submitCallback={sinon.spy()}
      submittable
      toggle
    />);

    const faktaEkspandertpanel = wrapper.find(FaktaEkspandertpanel);
    expect(faktaEkspandertpanel).to.have.length(1);
    expect(faktaEkspandertpanel.prop('title')).to.eql('FodselOgTilretteleggingInfoPanel.FaktaFodselOgTilrettelegging');
    expect(faktaEkspandertpanel.prop('faktaId')).to.eql(faktaPanelCodes.FODSELTILRETTELEGGING);

    const faktaForm = faktaEkspandertpanel.find('Connect(Connect(ComponentWithRequiredProps(WithBehandlingForm)))');
    expect(faktaForm).to.have.length(1);
  });
});
