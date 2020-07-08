import React from 'react';
import { expect } from 'chai';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';
import { FormattedMessage } from 'react-intl';
import IngenArbeidsforholdRegistrert from './IngenArbeidsforholdRegistrert';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';

describe('<IngenArbeidsforholdRegistrert>', () => {
  const headerColumnContent = [
    <span>PersonArbeidsforholdTable.Arbeidsforhold</span>,
    <span>PersonArbeidsforholdTable.Periode</span>,
    <span>PersonArbeidsforholdTable.Kilde</span>,
    <span>PersonArbeidsforholdTable.Stillingsprosent</span>,
    <span>PersonArbeidsforholdTable.MottattDato</span>,
    <></>,
  ];
  it('Skal sjekke at IngenArbeidsforholdRegistrert rendrer korrekt', () => {
    const wrapper = shallowWithIntl(
      <IngenArbeidsforholdRegistrert
        headerColumnContent={headerColumnContent}
      />,
    );
    expect(wrapper.find(TableColumn)).has.length(6);
    expect(wrapper.find(FormattedMessage).props().id).to.eql('PersonArbeidsforholdTable.IngenArbeidsforholdRegistrert');
  });
});
