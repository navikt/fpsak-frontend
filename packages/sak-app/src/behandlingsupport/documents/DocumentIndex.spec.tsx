import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';

import DataFetcher from '../../app/DataFetcher';
import { DocumentIndex } from './DocumentIndex';

describe('<DocumentIndex>', () => {
  const documents = [{
    journalpostId: '1',
    dokumentId: '1',
    tittel: 'dok',
    tidspunkt: '10.10.2017 10:23',
    kommunikasjonsretning: 'Inn',
  }];

  it('skal vise documentList med dokumenter', () => {
    const wrapper = shallow(<DocumentIndex behandlingId={1} saksNr={123} />);

    const dataFetcher = wrapper.find(DataFetcher);
    const documentList = dataFetcher.renderProp('render')({
      allDocuments: documents,
    }).find(DokumenterSakIndex);
    expect(documentList).to.have.length(1);
    expect(documentList.prop('documents')).to.eql(documents);
    expect(documentList.prop('selectDocumentCallback')).is.not.null;
  });
});
