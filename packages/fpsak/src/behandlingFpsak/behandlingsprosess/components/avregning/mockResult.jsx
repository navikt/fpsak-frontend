export const flereYtelser = {
  periodeFom: '2018-10-01',
  periodeTom: '2018-11-30',
  nesteUtbPeriodeFom: '2018-12-01',
  nestUtbPeriodeTom: '2018-12-31',
  sumEtterbetaling: 0,
  sumFeilutbetaling: 49863,
  sumInntrekk: 0,
  perioderPerMottaker: [
    {
      mottakerType: {
        kode: 'BRUKER',
        navn: null,
        kodeverk: 'MOTTAKER_TYPE',
      },
      mottakerNummer: null,
      mottakerNavn: null,
      resultatPerFagområde: [
        {
          fagOmrådeKode: {
            kode: 'FP',
            navn: 'Foreldrepenger',
            kodeverk: 'FAG_OMRAADE_KODE',
          },
          rader: [
            {
              feltnavn: 'nyttBeløp',
              resultaterPerMåned: [
                {
                  periode: {
                    fom: '2018-10-01',
                    tom: '2018-10-31',
                  },
                  beløp: -10795,
                },
                {
                  periode: {
                    fom: '2018-11-01',
                    tom: '2018-11-30',
                  },
                  beløp: -8009,
                },
                {
                  periode: {
                    fom: '2018-12-01',
                    tom: '2018-12-31',
                  },
                  beløp: 4851,
                },
              ],
            },
            {
              feltnavn: 'tidligereUtbetalt',
              resultaterPerMåned: [
                {
                  periode: {
                    fom: '2018-10-01',
                    tom: '2018-10-31',
                  },
                  beløp: 15691,
                },
                {
                  periode: {
                    fom: '2018-11-01',
                    tom: '2018-11-30',
                  },
                  beløp: 20306,
                },
                {
                  periode: {
                    fom: '2018-12-01',
                    tom: '2018-12-31',
                  },
                  beløp: 0,
                },
              ],
            },
            {
              feltnavn: 'differanse',
              resultaterPerMåned: [
                {
                  periode: {
                    fom: '2018-10-01',
                    tom: '2018-10-31',
                  },
                  beløp: -26486,
                },
                {
                  periode: {
                    fom: '2018-11-01',
                    tom: '2018-11-30',
                  },
                  beløp: -28315,
                },
                {
                  periode: {
                    fom: '2018-12-01',
                    tom: '2018-12-31',
                  },
                  beløp: 4851,
                },
              ],
            },
          ],
        },
        {
          fagOmrådeKode: {
            kode: 'SP',
            navn: 'Sykepenger',
            kodeverk: 'FAG_OMRAADE_KODE',
          },
          rader: [
            {
              feltnavn: 'nyttBeløp',
              resultaterPerMåned: [
                {
                  periode: {
                    fom: '2018-12-01',
                    tom: '2018-12-31',
                  },
                  beløp: 18888,
                },
              ],
            },
          ],
        },
      ],
      resultatOgMotregningRader: [
        {
          feltnavn: 'resultatEtterMotregning',
          resultaterPerMåned: [
            {
              periode: {
                fom: '2018-10-01',
                tom: '2018-10-31',
              },
              beløp: -26486,
            },
            {
              periode: {
                fom: '2018-11-01',
                tom: '2018-11-30',
              },
              beløp: -28315,
            },
            {
              periode: {
                fom: '2018-12-01',
                tom: '2018-12-31',
              },
              beløp: 23739,
            },
          ],
        },
        {
          feltnavn: 'inntrekkNesteMåned',
          resultaterPerMåned: [
            {
              periode: {
                fom: '2018-10-01',
                tom: '2018-10-31',
              },
              beløp: 0,
            },
            {
              periode: {
                fom: '2018-11-01',
                tom: '2018-11-30',
              },
              beløp: 0,
            },
            {
              periode: {
                fom: '2018-12-01',
                tom: '2018-12-31',
              },
              beløp: 0,
            },
          ],
        },
        {
          feltnavn: 'resultat',
          resultaterPerMåned: [
            {
              periode: {
                fom: '2018-10-01',
                tom: '2018-10-31',
              },
              beløp: -26486,
            },
            {
              periode: {
                fom: '2018-11-01',
                tom: '2018-11-30',
              },
              beløp: -23377,
            },
            {
              periode: {
                fom: '2018-12-01',
                tom: '2018-12-31',
              },
              beløp: 23739,
            },
          ],
        },
      ],
    },
  ],
};
