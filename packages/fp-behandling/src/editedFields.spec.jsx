import { expect } from 'chai';

import editedFields from './editedFields';

const personopplysning = {
  fnr: '24069305012',
  aktoerId: '9000000028435',
  diskresjonskode: {
    kode: 'UDEF',
    navn: 'Udefiniert',
    kodeverk: 'DISKRESJONSKODE',
  },
  nummer: null,
  navBrukerKjonn: {
    kode: 'K',
    navn: 'Kvinne',
    kodeverk: 'BRUKER_KJOENN',
  },
  statsborgerskap: {
    kode: 'NOR',
    kodeverk: 'LANDKODER',
    navn: 'Norge',
  },
  avklartPersonstatus: {
    orginalPersonstatus: null,
    overstyrtPersonstatus: {
      kode: 'BOSA',
      navn: 'Bosatt',
      kodeverk: 'PERSONSTATUS_TYPE',
    },
  },
  personstatus: {
    kode: 'BOSA',
    navn: 'Bosatt',
    kodeverk: 'PERSONSTATUS_TYPE',
  },
  sivilstand: {
    kode: 'UGIF',
    navn: 'Ugift',
    kodeverk: 'SIVILSTAND_TYPE',
  },
  navn: 'Qvspistv Vnrtm',
  dodsdato: null,
  fodselsdato: '1993-06-24',
  adresser: [
    {
      adresseType: {
        kode: 'BOSTEDSADRESSE',
        navn: 'Bostedsadresse',
        kodeverk: 'ADRESSE_TYPE',
      },
      mottakerNavn: 'Qvspistv Vnrtm',
      adresselinje1: 'Ankerv 360',
      adresselinje2: null,
      adresselinje3: null,
      postNummer: '1359',
      poststed: 'Eiksmarka',
      land: 'NOR',
    },
  ],
  region: {
    kode: 'NORDEN',
    navn: 'Nordisk',
    kodeverk: 'REGION',
  },
  annenPart: null,
  ektefelle: null,
  barn: [],
  barnSoktFor: [
    {
      fnr: null,
      aktoerId: null,
      diskresjonskode: null,
      nummer: 1,
      navBrukerKjonn: null,
      statsborgerskap: null,
      avklartPersonstatus: null,
      personstatus: null,
      sivilstand: null,
      navn: null,
      dodsdato: null,
      fodselsdato: '2018-05-30',
      adresser: [],
      region: null,
      annenPart: null,
      ektefelle: null,
      barn: [],
      barnSoktFor: [],
      barnFraTpsRelatertTilSoknad: [],
      opplysningsKilde: {
        kode: 'UDEFINERT',
        navn: null,
        kodeverk: 'OPPLYSNINGSKILDE',
      },
      harVerge: false,
    },
  ],
  barnFraTpsRelatertTilSoknad: [],
  opplysningsKilde: {
    kode: 'TPS',
    navn: 'Kilden er TPS',
    kodeverk: 'OPPLYSNINGSKILDE',
  },
  harVerge: false,
};

const soknad = {
  soknadType: {
    kode: 'ST-001',
    navn: 'Fødsel',
  },
  mottattDato: '2018-07-05',
  tilleggsopplysninger: null,
  begrunnelseForSenInnsending: null,
  annenPartNavn: null,
  antallBarn: 1,
  dekningsgrad: 100,
  oppgittTilknytning: {
    oppholdNorgeNa: true,
    oppholdSistePeriode: false,
    oppholdNestePeriode: false,
    utlandsoppholdFor: [],
    utlandsoppholdEtter: [],
  },
  manglendeVedlegg: [],
  oppgittRettighet: {
    omsorgForBarnet: true,
    aleneomsorgForBarnet: false,
  },
  oppgittFordeling: {
    startDatoForPermisjon: '2018-07-06',
  },
  utstedtdato: '2018-06-25',
  termindato: '2018-07-27',
  farSokerType: null,
  fodselsdatoer: {
    1: '2018-05-30',
  },
};

describe('editedFields', () => {
  describe('termindato', () => {
    it('skal vise endret termindato', () => {
      const familiehendelse = {
        termindato: '2018-07-28',
      };

      const isTermindatoEdited = editedFields(soknad, familiehendelse, personopplysning).termindato;

      expect(isTermindatoEdited).to.be.true;
    });

    it('skal ikke vise uendret termindato', () => {
      const familiehendelse = {
        termindato: '2018-07-27',
      };

      const isTermindatoEdited = editedFields(soknad, familiehendelse, personopplysning).termindato;

      expect(isTermindatoEdited).to.be.false;
    });
  });

  describe('utstedtdato', () => {
    it('skal vise endret utstedtdato', () => {
      const familiehendelse = {
        utstedtdato: '2018-06-26',
      };

      const isUtstedtdatoEdited = editedFields(soknad, familiehendelse, personopplysning).utstedtdato;

      expect(isUtstedtdatoEdited).to.be.true;
    });

    it('skal ikke vise uendret utstedtdato', () => {
      const familiehendelse = {
        utstedtdato: '2018-06-25',
      };

      const isUtstedtdatoEdited = editedFields(soknad, familiehendelse, personopplysning).utstedtdato;

      expect(isUtstedtdatoEdited).to.be.false;
    });
  });

  describe('antallBarn', () => {
    it('skal vise endret antallBarn', () => {
      const familiehendelse = {
        antallBarnTermin: 2,
      };

      const isAntallBarnEdited = editedFields(soknad, familiehendelse, personopplysning).antallBarn;

      expect(isAntallBarnEdited).to.be.true;
    });

    it('skal ikke vise uendret antallBarn', () => {
      const familiehendelse = {
        antallBarnTermin: 1,
      };

      const isAntallBarnEdited = editedFields(soknad, familiehendelse, personopplysning).antallBarn;

      expect(isAntallBarnEdited).to.be.false;
    });
  });

  describe('vilkarType', () => {
    it('skal vise endret vilkarType', () => {
      const familiehendelse = {
        vilkarType: 'some value',
      };

      const isVilkarTypeEdited = editedFields(soknad, familiehendelse, personopplysning).vilkarType;

      expect(isVilkarTypeEdited).to.be.true;
    });
  });

  describe('adopsjonFodelsedatoer', () => {
    it('skal vise endret adopsjonFodelsedatoer', () => {
      const familiehendelse = {
        adopsjonFodelsedatoer: {
          1: '2018-01-01',
        },
      };

      const endretDato = {
        adopsjonFodelsedatoer: {
          1: '2018-01-10',
        },
      };

      const adopsjonsSoknad = { ...soknad, ...endretDato };

      const isAdopsjonFodelsedatoerEdited = editedFields(adopsjonsSoknad, familiehendelse, personopplysning).adopsjonFodelsedatoer;

      expect(isAdopsjonFodelsedatoerEdited[1]).to.be.true;
    });

    it('skal ikke vise uendret adopsjonFodelsedatoer', () => {
      const familiehendelse = {
        adopsjonFodelsedatoer: {
          1: '2018-01-01',
        },
      };

      const adopsjonsSoknad = { ...soknad, ...familiehendelse };

      const isAdopsjonFodelsedatoerEdited = editedFields(adopsjonsSoknad, familiehendelse, personopplysning).adopsjonFodelsedatoer;

      expect(isAdopsjonFodelsedatoerEdited[1]).to.be.false;
    });
  });

  describe('omsorgsovertakelseDato', () => {
    it('skal vise endret omsorgsovertakelseDato', () => {
      const familiehendelse = {
        omsorgsovertakelseDato: '2018-01-01',
      };

      const omsorgsSoknad = { ...soknad, omsorgsovertakelseDato: '2018-01-10' };

      const isOmsorgsovertakelseDatoEdited = editedFields(omsorgsSoknad, familiehendelse, personopplysning).omsorgsovertakelseDato;

      expect(isOmsorgsovertakelseDatoEdited).to.be.true;
    });

    it('skal ikke vise uendret omsorgsovertakelseDato', () => {
      const familiehendelse = {
        omsorgsovertakelseDato: '2018-01-01',
      };

      const omsorgsSoknad = { ...soknad, omsorgsovertakelseDato: '2018-01-01' };

      const isOmsorgsovertakelseDatoEdited = editedFields(omsorgsSoknad, familiehendelse, personopplysning).omsorgsovertakelseDato;

      expect(isOmsorgsovertakelseDatoEdited).to.be.false;
    });
  });

  describe('barnetsAnkomstTilNorgeDato', () => {
    it('skal vise endret barnetsAnkomstTilNorgeDato', () => {
      const familiehendelse = {
        barnetsAnkomstTilNorgeDato: '2018-01-01',
      };

      const ankomstSoknad = { ...soknad, barnetsAnkomstTilNorgeDato: '2018-01-10' };

      const isBarnetsAnkomstTilNorgeDatoEdited = editedFields(ankomstSoknad, familiehendelse, personopplysning).barnetsAnkomstTilNorgeDato;

      expect(isBarnetsAnkomstTilNorgeDatoEdited).to.be.true;
    });

    it('skal ikke vise uendret barnetsAnkomstTilNorgeDato', () => {
      const familiehendelse = {
        barnetsAnkomstTilNorgeDato: '2018-01-01',
      };

      const ankomstSoknad = { ...soknad, barnetsAnkomstTilNorgeDato: '2018-01-01' };

      const isBarnetsAnkomstTilNorgeDatoEdited = editedFields(ankomstSoknad, familiehendelse, personopplysning).barnetsAnkomstTilNorgeDato;

      expect(isBarnetsAnkomstTilNorgeDatoEdited).to.be.false;
    });
  });

  describe('antallBarnOmsorgOgForeldreansvar', () => {
    it('skal vise endret antallBarnOmsorgOgForeldreansvar', () => {
      const familiehendelse = {
        antallBarnTilBeregning: 2,
      };

      const isAntallBarnOmsorgOgForeldreansvarEdited = editedFields(soknad, familiehendelse, personopplysning).antallBarnOmsorgOgForeldreansvar;

      expect(isAntallBarnOmsorgOgForeldreansvarEdited).to.be.true;
    });

    it('skal ikke vise uendret antallBarnOmsorgOgForeldreansvar', () => {
      const familiehendelse = {
        antallBarnTilBeregning: 1,
      };

      const isAntallBarnOmsorgOgForeldreansvarEdited = editedFields(soknad, familiehendelse, personopplysning).antallBarnOmsorgOgForeldreansvar;

      expect(isAntallBarnOmsorgOgForeldreansvarEdited).to.be.false;
    });
  });

  describe('fodselsdatoer', () => {
    it('skal vise endret fodselsdatoer', () => {
      const familiehendelse = {};

      const isFodselsdatoerEdited = editedFields({ ...soknad, fodselsdatoer: { 1: '2018-06-30' } }, familiehendelse, personopplysning).fodselsdatoer;

      expect(isFodselsdatoerEdited[1]).to.be.true;
    });

    it('skal ikke vise uendret fodselsdatoer', () => {
      const familiehendelse = {};

      const isFodselsdatoerEdited = editedFields(soknad, familiehendelse, personopplysning).fodselsdatoer;

      expect(isFodselsdatoerEdited[1]).to.be.false;
    });
  });

  describe('ektefellesBarn', () => {
    it('skal vise endret ektefellesBarn', () => {
      const familiehendelse = {
        ektefellesBarn: 'some value',
      };

      const isEktefellesBarnEdited = editedFields(soknad, familiehendelse, personopplysning).ektefellesBarn;

      expect(isEktefellesBarnEdited).to.be.true;
    });

    it('skal ikke vise uendret ektefellesBarn', () => {
      const familiehendelse = {};

      const isEktefellesBarnEdited = editedFields(soknad, familiehendelse, personopplysning).ektefellesBarn;

      expect(isEktefellesBarnEdited).to.be.false;
    });
  });

  describe('mannAdoptererAlene', () => {
    it('skal vise endret mannAdoptererAlene', () => {
      const familiehendelse = {
        mannAdoptererAlene: 'some value',
      };

      const isMannAdoptererAleneEdited = editedFields(soknad, familiehendelse, personopplysning).mannAdoptererAlene;

      expect(isMannAdoptererAleneEdited).to.be.true;
    });

    it('skal ikke vise uendret mannAdoptererAlene', () => {
      const familiehendelse = {};

      const isMannAdoptererAleneEdited = editedFields(soknad, familiehendelse, personopplysning).mannAdoptererAlene;

      expect(isMannAdoptererAleneEdited).to.be.false;
    });
  });

  describe('dokumentasjonForeligger', () => {
    it('skal vise endret dokumentasjonForeligger', () => {
      const familiehendelse = {
        dokumentasjonForeligger: 'some value',
      };

      const isDokumentasjonForeliggerEdited = editedFields(soknad, familiehendelse, personopplysning).dokumentasjonForeligger;

      expect(isDokumentasjonForeliggerEdited).to.be.true;
    });

    it('skal ikke vise uendret dokumentasjonForeligger', () => {
      const familiehendelse = {};

      const isDokumentasjonForeliggerEdited = editedFields(soknad, familiehendelse, personopplysning).dokumentasjonForeligger;

      expect(isDokumentasjonForeliggerEdited).to.be.false;
    });
  });
});
