import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { Undertittel } from 'nav-frontend-typografi';

import { TilkjentYtelsePanelImpl } from './TilkjentYtelsePanel';

describe('<TilkjentYtelsePanelImpl>', () => {
  it('skall innehålla rätt undertekst', () => {
    const familieDate = new Date('2018-04-04');
    const wrapper = shallowWithIntl(<TilkjentYtelsePanelImpl
      intl={intlMock}
      readOnly
      beregningsresultatMedUttaksplan={null}
      hovedsokerKjonn="K"
      medsokerKjonn="M"
      soknadDato="2018-04-04"
      familiehendelseDato={familieDate}
      stonadskontoer={null}
    />);
    expect(wrapper.find(Undertittel)).to.have.length(1);
    expect(wrapper.find(Undertittel).props().children.props.id).to.equal('TilkjentYtelse.Title');
  });
});
