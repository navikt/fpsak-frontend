import { expect } from 'chai';
import { setFordelingForrigeYtelse, FordelingAvBruttoBgIKombinasjonImpl } from './FordelingAvBruttoBgIKombinasjon';
import { skalVereLikFordelingMessage } from '../ValidateAndelerUtils';

describe('<FordelingAvBruttoBgIKombinasjon>', () => {
  it('skal sette fordeling forrige ytelse når andel finnes i tilstøtende ytelse dto', () => {
    const endretBGAndel = { andelsnr: 2 };
    const tilstotendeYtelseAndeler = [{ andelsnr: 1, fordelingForrigeYtelse: 10000, lagtTilAvSaksbehandler: false },
      { andelsnr: 2, fordelingForrigeYtelse: 20000, lagtTilAvSaksbehandler: false },
      { andelsnr: 3, fordelingForrigeYtelse: 0, lagtTilAvSaksbehandler: true }];

    const fordelingForrigeYtelse = setFordelingForrigeYtelse(tilstotendeYtelseAndeler, endretBGAndel);

    expect(fordelingForrigeYtelse).to.equal('20 000');
  });

  it('skal sette fordeling forrige ytelse når andel finnes i tilstøtende ytelse dto, men er lagt til av saksbehandler', () => {
    const endretBGAndel = { andelsnr: 3 };
    const tilstotendeYtelseAndeler = [{ andelsnr: 1, fordelingForrigeYtelse: 10000, lagtTilAvSaksbehandler: false },
      { andelsnr: 2, fordelingForrigeYtelse: 20000, lagtTilAvSaksbehandler: false },
      { andelsnr: 3, fordelingForrigeYtelse: 0, lagtTilAvSaksbehandler: true }];

    const fordelingForrigeYtelse = setFordelingForrigeYtelse(tilstotendeYtelseAndeler, endretBGAndel);

    expect(fordelingForrigeYtelse).to.equal('');
  });


  it('skal sette fordeling forrige ytelse når andel ikkje finnes i tilstøtende ytelse dto', () => {
    const endretBGAndel = { andelsnr: 4 };
    const tilstotendeYtelseAndeler = [{ andelsnr: 1, fordelingForrigeYtelse: 10000, lagtTilAvSaksbehandler: false },
      { andelsnr: 2, fordelingForrigeYtelse: 20000, lagtTilAvSaksbehandler: false },
      { andelsnr: 3, fordelingForrigeYtelse: 0, lagtTilAvSaksbehandler: true }];

    const fordelingForrigeYtelse = setFordelingForrigeYtelse(tilstotendeYtelseAndeler, endretBGAndel);

    expect(fordelingForrigeYtelse).to.equal(0);
  });

  it('skal gi error når sum av fastsatt er ulik fordeling første periode', () => {
    const values = [{
      andelsnr: 1,
      fordelingForrigeYtelse: 10000,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '10 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 1',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      fastsattBeløp: '100 000',
    },
    {
      andelsnr: 2,
      fordelingForrigeYtelse: 20000,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '10 000',
      belopFraInntektsmelding: 150000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 2',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      fastsattBeløp: '150 000',
    },
    {
      andelsnr: 3,
      fordelingForrigeYtelse: 0,
      lagtTilAvSaksbehandler: true,
      refusjonskrav: '10 000',
      belopFraInntektsmelding: 200000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 3',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      fastsattBeløp: '200 000',
    }];

    const fordelingForstePeriode = 400000;

    const errors = FordelingAvBruttoBgIKombinasjonImpl.validate(values, fordelingForstePeriode);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(errors._error[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(errors._error[1].fordeling).to.equal('400 000');
  });

  it('skal ikkje gi error når sum av fastsatt er lik fordeling første periode', () => {
    const values = [{
      andelsnr: 1,
      fordelingForrigeYtelse: 10000,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '10 000',
      belopFraInntektsmelding: 100000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 1',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      fastsattBeløp: '100 000',
    },
    {
      andelsnr: 2,
      fordelingForrigeYtelse: 20000,
      lagtTilAvSaksbehandler: false,
      refusjonskrav: '10 000',
      belopFraInntektsmelding: 150000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 2',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      fastsattBeløp: '150 000',
    },
    {
      andelsnr: 3,
      fordelingForrigeYtelse: 0,
      lagtTilAvSaksbehandler: true,
      refusjonskrav: '10 000',
      belopFraInntektsmelding: 200000,
      skalKunneEndreRefusjon: true,
      aktivitetstatus: 'ARBEIDSTAKER',
      andel: 'Visningsnavn 3',
      harPeriodeAarsakGraderingEllerRefusjon: true,
      inntektskategori: 'ARBEIDSTAKER',
      refusjonskravFraInntektsmelding: 10000,
      fastsattBeløp: '200 000',
    }];

    const fordelingForstePeriode = 450000;

    const errors = FordelingAvBruttoBgIKombinasjonImpl.validate(values, fordelingForstePeriode);
    expect(errors).to.equal(null);
  });
});
