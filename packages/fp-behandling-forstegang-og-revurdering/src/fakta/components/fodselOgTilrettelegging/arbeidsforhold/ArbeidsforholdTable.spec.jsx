import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';

import ArbeidsforholdTable from './ArbeidsforholdTable';

describe('<ArbeidsforholdTable>', () => {
  it('skal vise tabell med arbeidsforhold', () => {
    const arbeidsforhold = [{
      tilretteleggingId: 1,
      arbeidsgiverNavn: 'Espen Solstråle',
      arbeidsgiverIdent: 'ES',
      tilretteleggingBehovFom: '2019-01-01',
      kopiertFraTidligereBehandling: true,
    }];
    const wrapper = shallow(<ArbeidsforholdTable
      arbeidsforhold={arbeidsforhold}
      selectArbeidsforholdCallback={sinon.spy()}
      selectedArbeidsforhold={arbeidsforhold[0].tilretteleggingId}
    />);

    const rows = wrapper.find(TableRow);
    expect(rows).has.length(1);

    const cols = rows.find(TableColumn);
    expect(cols).has.length(3);
    expect(cols.first().find(Normaltekst).childAt(0).text()).is.eql('Espen Solstråle');
    expect(cols.at(1).find(Normaltekst).childAt(0).text()).is.eql('01.01.2019');
    expect(cols.at(2).find(FormattedMessage).prop('id')).is.eql('ArbeidsforholdTable.Nei');
  });
});
