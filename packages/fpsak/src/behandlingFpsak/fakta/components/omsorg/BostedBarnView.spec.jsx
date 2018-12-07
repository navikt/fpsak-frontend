import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import personstatusType from 'kodeverk/personstatusType';
import opplysningAdresseType from 'kodeverk/opplysningAdresseType';
import BostedBarnView from './BostedBarnView';

describe('<BostedBarnView>', () => {
  const barn = {
    navn: 'Espen Barn',
    aktoerId: '1',
    fodselsdato: '2016-02-03',
    personstatus: {
      kode: 'BOSA',
      navn: 'Bosatt',
    },
    avklartPersonstatus: {
      overstyrtPersonstatus: {
        kode: personstatusType.BOSATT,
        navn: 'Bosatt',
      },
      orginalPersonstatus: {
        kode: personstatusType.DOD,
        navn: 'Bosatt',
      },
    },
    navBrukerKjonn: {
      kode: '',
      navn: '',
    },
    statsborgerskap: {
      kode: '',
      navn: '',
    },
    diskresjonskode: {
      kode: '',
      navn: '',
    },
    sivilstand: {
      kode: 'UGIF',
      navn: 'Ugift',
    },
    region: {
      kode: '',
      navn: '',
    },
    opplysningsKilde: {
      kode: '',
      navn: '',
    },
    adresser: [{
      adresselinje1: 'Ringeriksveien 182',
      postNummer: '1339',
      poststed: 'Vøyenenga',
      adresseType: {
        kode: opplysningAdresseType.POSTADRESSE,
        navn: 'Bostedsadresse',
      },
    }],
  };

  it('skal vise barn nr', () => {
    const wrapper = shallow(<BostedBarnView
      barn={barn}
      barnNr={3}
    />);
    const undertekst = wrapper.find('Undertekst');
    const barnNr = undertekst.first();
    expect(barnNr.find('FormattedMessage').prop('id')).to.equal('BostedBarnView.Barn');
    expect(barnNr.find('FormattedMessage').prop('values').barnNr).to.equal(3);
  });

  it('skal vise navn', () => {
    const wrapper = shallow(<BostedBarnView
      barn={barn}
      barnNr={3}
    />);
    expect(wrapper.find('Element').childAt(0).text()).to.eql('Espen Barn');
  });

  it('skal vise fodselsdato og alder', () => {
    const wrapper = shallow(<BostedBarnView
      barn={barn}
      barnNr={3}
    />);
    const normalTekst = wrapper.find('Normaltekst');
    expect(normalTekst).to.have.length(2);
    const fodselsWrapper = normalTekst.first();
    expect(fodselsWrapper.find('FormattedMessage').prop('id')).to.eql('BostedBarnView.Age');
    expect(fodselsWrapper.find('FormattedMessage').prop('values').fodselsdato).to.eql('03.02.2016');
    expect(fodselsWrapper.find('FormattedMessage').prop('values').age).to.eql(2);
  });

  it('skal vise adresse', () => {
    const wrapper = shallow(<BostedBarnView
      barn={barn}
      barnNr={3}
    />);
    const normalTekst = wrapper.find('Normaltekst');
    const adresseWrapper = normalTekst.last();
    expect(adresseWrapper.childAt(0).text()).to.eql('Ringeriksveien 182, 1339 Vøyenenga');
  });
});
