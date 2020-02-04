import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import FodselOgTilretteleggingInfoPanel from './FodselOgTilretteleggingInfoPanel';
import FodselOgTilretteleggingFaktaForm from './FodselOgTilretteleggingFaktaForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-fodsel-og-tilrettelegging';

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
  it('skal vise panel', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingInfoPanel
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={1}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      aksjonspunkter={[]}
      iayArbeidsforhold={[]}
      hasOpenAksjonspunkter={false}
      readOnly
      submitCallback={sinon.spy()}
      submittable
      toggle
    />);

    const faktaForm = wrapper.find(FodselOgTilretteleggingFaktaForm);
    expect(faktaForm).to.have.length(1);
  });
});
