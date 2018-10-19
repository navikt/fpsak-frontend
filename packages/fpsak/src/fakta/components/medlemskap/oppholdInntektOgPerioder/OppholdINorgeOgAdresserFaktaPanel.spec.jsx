import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import personstatusType from 'kodeverk/personstatusType';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import opplysningAdresseType from 'kodeverk/opplysningAdresseType';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';

describe('<OppholdINorgeOgAdresserFaktaPanel>', () => {
  const opphold = {
    oppholdNorgeNa: true,
    oppholdSistePeriode: true,
    utlandsoppholdFor: [{
      landNavn: 'SVERIGE',
      fom: '2017-07-20',
      tom: '2017-07-31',
    }],
    utlandsoppholdEtter: [],
    oppholdNestePeriode: false,
  };

  const foreldre = [{
    isApplicant: true,
    personopplysning: {
      navn: 'Espen Utvikler',
    },
  }, {
    isApplicant: false,
    personopplysning: {
      navn: 'Petra Tester',
    },
  }];

  it('skal vise info om opphold', () => {
    const wrapper = shallowWithIntl(<OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
      intl={intlMock}
      readOnly={false}
      hasAksjonspunkt={false}
      isBosattAksjonspunktClosed={false}
      opphold={opphold}
      foreldre={foreldre}
    />);
    const felter = wrapper.find('Normaltekst');
    expect(felter).to.have.length(5);
    expect(felter.first().childAt(0).text()).to.eql('Ja');
    expect(felter.at(1).childAt(0).text()).to.eql('Ja');
    expect(felter.at(2).childAt(0).text()).to.eql('Sverige');
    expect(felter.at(4).childAt(0).text()).to.eql('Nei');
  });

  it('skal rendre form som viser bosatt informasjon', () => {
    const wrapper = shallowWithIntl(<OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
      intl={intlMock}
      readOnly={false}
      hasAksjonspunkt={false}
      isBosattAksjonspunktClosed={false}
      opphold={opphold}
      foreldre={foreldre}
    />);
    const foreldreDivs = wrapper.find('div');
    expect(foreldreDivs).to.have.length(3);
  });

  it('skal rendre form som lar NAV-ansatt velge om barnet er ektefelles barn eller ei', () => {
    const toForeldre = [{
      isApplicant: true,
      personopplysning: {
        navn: 'Espen Utvikler',
      },
    }, {
      isApplicant: false,
      personopplysning: {
        navn: 'Petra Tester',
      },
    }];

    const wrapper = shallowWithIntl(<OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
      intl={intlMock}
      readOnly={false}
      hasAksjonspunkt
      isBosattAksjonspunktClosed={false}
      opphold={opphold}
      foreldre={toForeldre}
    />);

    const radioFields = wrapper.find('RadioOption');
    expect(radioFields).to.have.length(2);
    expect(radioFields.first().prop('label').id).to.eql('OppholdINorgeOgAdresserFaktaPanel.ResidingInNorway');
  });

  it('skal sette initielle verdier', () => {
    const medlem = {
      bosattVurdering: true,
    };
    const soknad = {
      oppgittTilknytning: opphold,
    };
    const personopplysning = {
      navn: 'Espen Utvikler',
      personstatus: {
        personstatus: {
          kode: 'UTVANDRET',
          navn: 'Utvandret',
        },
      },
      avklartPersonstatus: {
        overstyrtPersonstatus: {
          kode: personstatusType.BOSATT,
          navn: 'Bosatt',
        },
      },
      adresser: [{
        adresselinje1: 'Vei 1',
        postNummer: '1000',
        poststed: 'Oslo',
        opplysningAdresseType: {
          kode: opplysningAdresseType.POSTADRESSE,
          navn: 'Bostedsadresse',
        },
      }],
      annenPart: {
        navn: 'Petra Tester',
        personstatus: {
          personstatus: {
            kode: 'UTVANDRET',
            navn: 'Utvandret',
          },
        },
        adresser: [{
          adresselinje1: 'Vei 2',
          postNummer: '2000',
          poststed: 'Stockholm',
          opplysningAdresseType: {
            kode: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
            navn: 'Bostedsadresse',
          },
        }],
      },
    };

    const aksjonspunkter = [{
      definisjon: {
        kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    }];

    const initialValues = OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, personopplysning, medlem, aksjonspunkter);

    expect(initialValues).to.eql({
      foreldre: [{
        isApplicant: true,
        personopplysning: {
          navn: 'Espen Utvikler',
          personstatus: {
            personstatus: {
              kode: 'UTVANDRET',
              navn: 'Utvandret',
            },
          },
          avklartPersonstatus: {
            overstyrtPersonstatus: {
              kode: personstatusType.BOSATT,
              navn: 'Bosatt',
            },
          },
          adresser: [{
            adresselinje1: 'Vei 1',
            postNummer: '1000',
            poststed: 'Oslo',
            opplysningAdresseType: {
              kode: opplysningAdresseType.POSTADRESSE,
              navn: 'Bostedsadresse',
            },
          }],
          annenPart: {
            navn: 'Petra Tester',
            personstatus: {
              personstatus: {
                kode: 'UTVANDRET',
                navn: 'Utvandret',
              },
            },
            adresser: [{
              adresselinje1: 'Vei 2',
              postNummer: '2000',
              poststed: 'Stockholm',
              opplysningAdresseType: {
                kode: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
                navn: 'Bostedsadresse',
              },
            }],
          },
        },
      }, {
        isApplicant: false,
        personopplysning: {
          navn: 'Petra Tester',
          personstatus: {
            personstatus: {
              kode: 'UTVANDRET',
              navn: 'Utvandret',
            },
          },
          adresser: [{
            adresselinje1: 'Vei 2',
            postNummer: '2000',
            poststed: 'Stockholm',
            opplysningAdresseType: {
              kode: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
              navn: 'Bostedsadresse',
            },
          }],
        },
      }],
      bosattVurdering: true,
      hasBosattAksjonspunkt: true,
      isBosattAksjonspunktClosed: false,
      opphold: {
        oppholdNorgeNa: true,
        oppholdSistePeriode: true,
        utlandsoppholdFor: [{
          landNavn: 'SVERIGE',
          fom: '2017-07-20',
          tom: '2017-07-31',
        }],
        utlandsoppholdEtter: [],
        oppholdNestePeriode: false,
      },
    });
  });
});
