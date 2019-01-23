import React from 'react';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import HistorikkDokumentLenke from './HistorikkDokumentLenke';

const saksNr = 123;
const dokumentLenke = {
  tag: 'Inntektsmelding',
  journalpostId: 123456,
  dokumentId: 123445,
  utgått: true,
};

describe('HistorikkDokumentLenke', () => {
  it('skal vise at dokument er utgått', () => {
    const wrapper = shallowWithIntl(<HistorikkDokumentLenke.WrappedComponent
      dokumentLenke={dokumentLenke}
      saksNr={saksNr}
    />);

    expect(wrapper.find('FormattedMessage').at(0).prop('id')).to.eql('Historikk.Utgått');
  });
});
