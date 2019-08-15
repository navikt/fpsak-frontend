import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import {
 TableColumn, TableRow, DateLabel, Image,
} from '@fpsak-frontend/shared-components';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

import TilretteleggingTable from './TilretteleggingTable';

describe('<TilretteleggingTable>', () => {
  it('skal vise melding om at en ikke har tilretteleggingsdatoer', () => {
    const tilretteleggingDatoer = [];
    const wrapper = shallow(<TilretteleggingTable
      tilretteleggingDatoer={tilretteleggingDatoer}
      settValgtTilrettelegging={sinon.spy()}
      slettTilrettelegging={sinon.spy()}
      valgtTilrettelegging={{}}
      readOnly={false}
    />);

    const message = wrapper.find(FormattedMessage);
    expect(message).has.length(1);
    expect(message.prop('id')).is.eql('TilretteleggingTable.IngenTilretteleggingDatoer');
  });

  it('skal vise tabell med tilretteleggingsdatoer', () => {
    const tilretteleggingDatoer = [{
      id: 1,
      fom: '2019-01-01',
      type: {
        kode: tilretteleggingType.DELVIS_TILRETTELEGGING,
      },
      stillingsprosent: 10,
    }, {
      id: 2,
      fom: '2019-01-10',
      type: {
        kode: tilretteleggingType.HEL_TILRETTELEGGING,
      },
    }];
    const wrapper = shallow(<TilretteleggingTable
      tilretteleggingDatoer={tilretteleggingDatoer}
      settValgtTilrettelegging={sinon.spy()}
      slettTilrettelegging={sinon.spy()}
      valgtTilrettelegging={{}}
      readOnly={false}
    />);

    const rows = wrapper.find(TableRow);
    expect(rows).has.length(2);

    const colsRow1 = rows.first().find(TableColumn);
    expect(colsRow1).has.length(4);
    expect(colsRow1.first().find(FormattedMessage).prop('id')).is.eql('ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid');
    expect(colsRow1.at(1).find(DateLabel).prop('dateString')).is.eql('2019-01-01');
    expect(colsRow1.at(2).find(Normaltekst).childAt(0).text()).is.eql('10%');
    expect(colsRow1.at(3).find(Image)).has.length(1);

    const colsRow2 = rows.last().find(TableColumn);
    expect(colsRow2).has.length(4);
    expect(colsRow2.first().find(FormattedMessage).prop('id')).is.eql('ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores');
    expect(colsRow2.at(1).find(DateLabel).prop('dateString')).is.eql('2019-01-10');
    expect(colsRow2.at(2).find(Normaltekst).childAt(0)).has.length(0);
    expect(colsRow2.at(3).find(Image)).has.length(1);
  });

  it('skal ikke vise bildeknapp for sletting når readOnly', () => {
    const tilretteleggingDatoer = [{
      id: 1,
      fom: '2019-01-01',
      type: {
        kode: tilretteleggingType.DELVIS_TILRETTELEGGING,
      },
      stillingsprosent: 10,
    }];
    const wrapper = shallow(<TilretteleggingTable
      tilretteleggingDatoer={tilretteleggingDatoer}
      settValgtTilrettelegging={sinon.spy()}
      slettTilrettelegging={sinon.spy()}
      valgtTilrettelegging={{}}
      readOnly
    />);

    const rows = wrapper.find(TableRow);
    expect(rows).has.length(1);

    const colsRow1 = rows.first().find(TableColumn);
    expect(colsRow1).has.length(4);
    expect(colsRow1.first().find(FormattedMessage).prop('id')).is.eql('ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid');
    expect(colsRow1.at(1).find(DateLabel).prop('dateString')).is.eql('2019-01-01');
    expect(colsRow1.at(2).find(Normaltekst).childAt(0).text()).is.eql('10%');
    expect(colsRow1.at(3).find(Image)).has.length(0);
  });
});
