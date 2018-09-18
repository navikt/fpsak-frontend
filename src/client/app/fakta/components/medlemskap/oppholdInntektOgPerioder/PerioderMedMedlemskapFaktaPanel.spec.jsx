import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import PerioderMedMedlemskapFaktaPanel, { PerioderMedMedlemskapFaktaPanelImpl as UndecoratedForm } from './PerioderMedMedlemskapFaktaPanel';

describe('<PerioderMedMedlemskapFaktaPanel>', () => {
  it('skal vise periode og manuelle-vurderingstyper i form', () => {
    const periods = [{
      fom: '2016-01-15',
      tom: '2016-10-15',
      dekning: 'testdekning',
      status: 'testStatus',
      beslutningsdato: '2016-10-16',
    }];
    const manuelleVurderingstyper = [{
      kode: 'test1',
      navn: 'navn1',
    }, {
      kode: 'test2',
      navn: 'navn2',
    }];

    const wrapper = shallowWithIntl(<UndecoratedForm
      intl={intlMock}
      hasPeriodeAksjonspunkt
      isPeriodAksjonspunktClosed={false}
      periods={periods}
      readOnly={false}
      vurderingTypes={manuelleVurderingstyper}
    />);

    const table = wrapper.find('Table');
    expect(table).to.have.length(1);
    const tableRows = table.find('TableRow');
    expect(tableRows).to.have.length(1);
    const tableColumns = table.find('TableColumn');
    expect(tableColumns).to.have.length(4);
    expect(tableColumns.at(1).html()).to.eql('<td>testdekning</td>');
    expect(tableColumns.at(2).html()).to.eql('<td>testStatus</td>');

    const radiofields = wrapper.find('RadioOption');
    expect(radiofields).to.have.length(2);
    expect(radiofields.first().prop('value')).to.eql('test1');
    expect(radiofields.first().prop('label')).to.eql('navn1');
    expect(radiofields.last().prop('value')).to.eql('test2');
    expect(radiofields.last().prop('label')).to.eql('navn2');
  });

  it('skal vise fødselsdato når en har dette', () => {
    const periods = [{
      fom: '2016-01-15',
      tom: '2016-10-15',
      dekning: 'testdekning',
      status: 'testStatus',
      beslutningsdato: '2016-10-16',
    }];

    const wrapper = shallowWithIntl(<UndecoratedForm
      intl={intlMock}
      hasPeriodeAksjonspunkt
      isPeriodAksjonspunktClosed={false}
      periods={periods}
      readOnly={false}
      fodselsdato="2016-10-16"
      vurderingTypes={[]}
    />);

    const message = wrapper.find('FormattedMessage');
    expect(message).to.have.length(1);
    expect(message.prop('id')).to.eql('PerioderMedMedlemskapFaktaPanel.Fodselsdato');
    expect(message.prop('values')).to.eql({ dato: '16.10.2016' });
  });

  it('skal vise termindato når en har dette', () => {
    const periods = [{
      fom: '2016-01-15',
      tom: '2016-10-15',
      dekning: 'testdekning',
      status: 'testStatus',
      beslutningsdato: '2016-10-16',
    }];

    const wrapper = shallowWithIntl(<UndecoratedForm
      intl={intlMock}
      hasPeriodeAksjonspunkt
      isPeriodAksjonspunktClosed={false}
      periods={periods}
      termindato="2016-10-16"
      readOnly={false}
      vurderingTypes={[]}
    />);

    const message = wrapper.find('FormattedMessage');
    expect(message).to.have.length(1);
    expect(message.prop('id')).to.eql('PerioderMedMedlemskapFaktaPanel.Termindato');
    expect(message.prop('values')).to.eql({ dato: '16.10.2016' });
  });

  it('skal vise omsorgsovertakelsedato når en har dette', () => {
    const periods = [{
      fom: '2016-01-15',
      tom: '2016-10-15',
      dekning: 'testdekning',
      status: 'testStatus',
      beslutningsdato: '2016-10-16',
    }];

    const wrapper = shallowWithIntl(<UndecoratedForm
      intl={intlMock}
      hasPeriodeAksjonspunkt
      isPeriodAksjonspunktClosed={false}
      periods={periods}
      omsorgsovertakelseDato="2016-10-16"
      readOnly={false}
      vurderingTypes={[]}
    />);

    const message = wrapper.find('FormattedMessage');
    expect(message).to.have.length(1);
    expect(message.prop('id')).to.eql('PerioderMedMedlemskapFaktaPanel.Omsorgsovertakelse');
    expect(message.prop('values')).to.eql({ dato: '16.10.2016' });
  });

  it('skal vise tabell med medlemskapsperioder', () => {
    const periods = [{
      fom: '2017-08-01',
      tom: '2017-08-31',
      dekning: 'testDekning',
      status: 'testStatus',
      beslutningsdato: '2017-06-01',
    }];

    const wrapper = shallowWithIntl(<UndecoratedForm
      intl={intlMock}
      hasPeriodeAksjonspunkt
      isPeriodAksjonspunktClosed={false}
      readOnly={false}
      periods={periods}
      vurderingTypes={[]}
    />);

    const table = wrapper.find('Table');
    expect(table).to.have.length(1);
    expect(table.find('TableRow')).to.length(1);
  });

  it('skal ikke vise tabell når det ikke finnes medlemskapsperioder', () => {
    const periods = [];

    const wrapper = shallowWithIntl(<UndecoratedForm
      intl={intlMock}
      hasPeriodeAksjonspunkt
      isPeriodAksjonspunktClosed={false}
      periods={periods}
      readOnly={false}
      vurderingTypes={[]}
    />);

    const table = wrapper.find('Table');
    expect(table).to.have.length(0);
  });

  it('skal sette opp initielle verdier og sorterte perioder etter periodestart', () => {
    const medlem = {
      medlemskapManuellVurderingType: 'manuellType',
      medlemskapPerioder: [{
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekningType: {
          navn: 'testdekning',
        },
        medlemskapType: {
          navn: 'testStatus',
        },
        beslutningsdato: '2016-10-16',
      }, {
        fom: '2017-01-15',
        tom: '2017-10-15',
        dekningType: {
          navn: 'testdekning2017',
        },
        medlemskapType: {
          navn: 'testStatus2017',
        },
        beslutningsdato: '2017-10-16',
      }],
    };
    const soknad = {
      fodselsdatoer: {
        1: '2017-10-15',
      },
    };

    const aksjonspunkter = [{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    }];

    const initialValues = PerioderMedMedlemskapFaktaPanel.buildInitialValues(medlem, soknad, aksjonspunkter);

    expect(initialValues).to.eql({
      periods: [{
        fom: '2017-01-15',
        tom: '2017-10-15',
        dekning: 'testdekning2017',
        status: 'testStatus2017',
        beslutningsdato: '2017-10-16',
      }, {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'testdekning',
        status: 'testStatus',
        beslutningsdato: '2016-10-16',
      }],
      isPeriodAksjonspunktClosed: false,
      manuellVurderingType: 'manuellType',
      fodselsdato: '2017-10-15',
      termindato: undefined,
      omsorgsovertakelseDato: undefined,
      hasPeriodeAksjonspunkt: true,
    });
  });
});
