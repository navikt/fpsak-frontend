import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import kommunikasjonsretning from 'kodeverk/kommunikasjonsretning';

import DocumentListVedtakInnsyn from './DocumentListVedtakInnsyn';


describe('<DocumentListVedtakInnsyn>', () => {
  it('skal vise tekst ved tom dokumentliste', () => {
    const wrapper = shallow(<DocumentListVedtakInnsyn
      documents={[]}
      saksNr={123}
      readOnly={false}
    />);
    expect(wrapper.find('FormattedMessage').prop('id')).is.equal('DocumentListVedtakInnsyn.NoDocuments');
  });

  it('skal inneholde ett document, med tittel Dok1', () => {
    const documents = [{
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Dok1',
      tidspunkt: '22.12.2017',
      kommunikasjonsretning: kommunikasjonsretning.INN,
    }];
    const wrapper = shallow(<DocumentListVedtakInnsyn
      saksNr={123}
      documents={documents}
    />);
    expect(wrapper.find('FormattedMessage').prop('id')).is.equal('DocumentListVedtakInnsyn.InnsynsDok');
    expect(wrapper.find('a').text()).is.equal('Dok1');
    expect(wrapper.find('Table')).to.have.length(1);
  });
});
