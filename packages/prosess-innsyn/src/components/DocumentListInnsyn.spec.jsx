import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import {
  DateTimeLabel, Image, Table, TableRow,
} from '@fpsak-frontend/shared-components';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import DocumentListInnsyn from './DocumentListInnsyn';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-innsyn';

describe('<DocumentListInnsyn>', () => {
  it('skal vise tekst ved tom dokumentliste', () => {
    const wrapper = shallowWithIntl(<DocumentListInnsyn.WrappedComponent
      intl={intlMock}
      documents={[]}
      saksNr={123}
      readOnly={false}
    />);
    expect(wrapper.find(FormattedMessage).prop('id')).is.equal('DocumentListInnsyn.NoDocuments');
  });

  it('skal inneholde ett document, med tittel Dok1', () => {
    const documents = [{
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Dok1',
      tidspunkt: '22.12.2017',
      kommunikasjonsretning: kommunikasjonsretning.INN,
    }];
    const wrapper = shallowWithIntl(<DocumentListInnsyn.WrappedComponent
      intl={intlMock}
      documents={documents}
      saksNr={123}
      readOnly={false}
    />);
    expect(wrapper.find(FormattedMessage).prop('id')).is.equal('DocumentListInnsyn.VelgInnsynsDok');
    expect(wrapper.find('a').text()).is.equal('Dok1');
    expect(wrapper.find(Table)).to.have.length(1);
  });

  it('skal inneholde to documenter', () => {
    const documents = [{
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Dok1',
      tidspunkt: '22.12.2017-09:00',
      kommunikasjonsretning: kommunikasjonsretning.INN,
    }, {
      journalpostId: '2',
      dokumentId: '2',
      tittel: 'Dok2',
      tidspunkt: '22.12.2017-09:00',
      kommunikasjonsretning: kommunikasjonsretning.UT,
    }];
    const wrapper = shallowWithIntl(<DocumentListInnsyn.WrappedComponent
      intl={intlMock}
      documents={documents}
      saksNr={123}
      readOnly={false}
    />);
    expect(wrapper.find(TableRow)).to.have.length(2);
  });

  it('skal inneholde document med riktig kommunikasjonsretining: Send -> Ut', () => {
    const documents = [{
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Dok1',
      tidspunkt: '22.12.2017-09:00',
      kommunikasjonsretning: kommunikasjonsretning.UT,
    }];
    const wrapper = shallowWithIntl(<DocumentListInnsyn.WrappedComponent
      intl={intlMock}
      documents={documents}
      saksNr={123}
      readOnly={false}
    />);

    expect(wrapper.find(Image).prop('tooltip')).to.have.length.above(1);
  });

  it('skal inneholde document med riktig kommunikasjonsretining: Motta -> INN', () => {
    const documents = [{
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Dok1',
      tidspunkt: '22.12.2017-09:00',
      kommunikasjonsretning: kommunikasjonsretning.INN,
    }];
    const wrapper = shallowWithIntl(<DocumentListInnsyn.WrappedComponent
      intl={intlMock}
      documents={documents}
      saksNr={123}
      readOnly={false}
    />);
    expect(wrapper.find(Image).prop('tooltip')).to.have.length.above(1);
  });

  it('skal ikke inneholde dato', () => {
    const documents = [{
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Dok1',

      kommunikasjonsretning: kommunikasjonsretning.INN,
    }];
    const wrapper = shallowWithIntl(<DocumentListInnsyn.WrappedComponent
      intl={intlMock}
      documents={documents}
      saksNr={123}
      readOnly={false}
    />);
    expect(wrapper.find(FormattedMessage).last().prop('id')).is.equal('DocumentListInnsyn.IProduksjon');
  });

  it('skal inneholde dato', () => {
    const documents = [{
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Dok1',
      tidspunkt: '22.12.2017 - 09:00',
      kommunikasjonsretning: kommunikasjonsretning.INN,
    }];
    const wrapper = shallowWithIntl(<DocumentListInnsyn.WrappedComponent
      intl={intlMock}
      documents={documents}
      saksNr={123}
      readOnly={false}
    />);
    expect(wrapper.find(DateTimeLabel).prop('dateTimeString')).is.equal('22.12.2017 - 09:00');
  });
});
