import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';

import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';
import { DocumentIndex } from './DocumentIndex';

describe('<DocumentIndex>', () => {
  const documents = [{
    journalpostId: '1',
    dokumentId: '1',
    tittel: 'dok',
    tidspunkt: '10.10.2017 10:23',
    kommunikasjonsretning: 'Inn',
  }, {
    journalpostId: '2',
    dokumentId: '2',
    tittel: 'dok1',
    tidspunkt: '10.10.2019 10:23',
    kommunikasjonsretning: 'Inn',
  }, {
    journalpostId: '3',
    dokumentId: '3',
    tittel: 'dok2',
    tidspunkt: '10.10.2018 10:23',
    kommunikasjonsretning: 'Inn',
  }];

  it('skal vise liste med sorterte dokumenter', () => {
    requestApi.mock(FpsakApiKeys.ALL_DOCUMENTS, documents);

    const wrapper = shallow(<DocumentIndex
      behandlingId={1}
      behandlingVersjon={2}
      saksnummer={123}
    />);

    const index = wrapper.find(DokumenterSakIndex);
    expect(index).to.have.length(1);

    const dokumenter = index.prop('documents');

    expect(dokumenter[0].journalpostId).to.eql('2');
    expect(dokumenter[1].journalpostId).to.eql('3');
    expect(dokumenter[2].journalpostId).to.eql('1');
  });
});
