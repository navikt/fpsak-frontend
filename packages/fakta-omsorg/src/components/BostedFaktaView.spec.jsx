import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import BostedSokerFaktaIndex from '@fpsak-frontend/fakta-bosted-soker';

import BostedFaktaView from './BostedFaktaView';

describe('<BostedFaktaView>', () => {
  const barn = {
    navn: 'Barn Utvikler',
    aktoerId: '1',
    personstatus: {
      kode: 'BOSA',
      navn: 'Bosatt',
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
    adresser: [],
  };

  const soker = {
    navn: 'Kari Utvikler',
    aktoerId: '1',
    barn: [
      barn,
      barn,
    ],
    personstatus: {
      kode: 'BOSA',
      navn: 'Bosatt',
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
    adresser: [],
  };

  it('vise bostedBarn for hvert barn', () => {
    const wrapper = shallow(<BostedFaktaView
      personopplysning={soker}
      alleKodeverk={{}}
    />);
    const bostedBarnView = wrapper.find('BostedBarnView');
    expect(bostedBarnView).to.have.length(2);
    expect(bostedBarnView.first().prop('barn')).to.eql(barn);
    expect(bostedBarnView.first().prop('barnNr')).to.eql(1);
    expect(bostedBarnView.last().prop('barnNr')).to.eql(2);
  });

  it('vise bostedSoker for søker', () => {
    const wrapper = shallow(<BostedFaktaView
      personopplysning={soker}
      alleKodeverk={{}}
    />);
    const bostedSokerView = wrapper.find(BostedSokerFaktaIndex);
    expect(bostedSokerView).to.have.length(1);
    expect(bostedSokerView.first().prop('personopplysninger')).to.eql(soker);
  });

  it('vise bostedSoker for søker og annenpart/ektefelle?', () => {
    const ektefelle = {
      navn: 'Ola Utvikler',
      aktoerId: '1',
      personstatus: {
        kode: 'BOSA',
        navn: 'Bosatt',
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
      adresser: [],
    };
    const wrapper = shallow(<BostedFaktaView
      personopplysning={soker}
      ektefellePersonopplysning={ektefelle}
      alleKodeverk={{}}
    />);
    const bostedSokerView = wrapper.find(BostedSokerFaktaIndex);
    expect(bostedSokerView).to.have.length(2);
    expect(bostedSokerView.first().prop('personopplysninger')).to.eql(soker);
    expect(bostedSokerView.last().prop('personopplysninger')).to.eql(ektefelle);
  });
});
