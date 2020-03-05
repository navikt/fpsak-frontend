import { Aksjonspunkt, Kodeverk } from '@fpsak-frontend/types';

import PerioderForeldelse from './perioderForeldelseTsType';
import Beregningsresultat from './beregningsresultatTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  perioderForeldelse: PerioderForeldelse;
  beregningsresultat: Beregningsresultat;
  feilutbetalingFakta: {
    behandlingFakta: {
      tidligereVarseltBeløp?: number;
      aktuellFeilUtbetaltBeløp: number;
      datoForRevurderingsvedtak: string;
      totalPeriodeFom: string;
      totalPeriodeTom: string;
      perioder: {
        fom: string;
        tom: string;
        belop: number;
        feilutbetalingÅrsakDto?: {
          hendelseType: Kodeverk & { navn: string };
          hendelseUndertype: Kodeverk & { navn: string };
        };
      }[];
      behandlingsresultat: {
        type: Kodeverk;
        konsekvenserForYtelsen: Kodeverk[];
      };
      behandlingÅrsaker: {
        behandlingArsakType: Kodeverk[];
      };
      tilbakekrevingValg?: {
        videreBehandling: Kodeverk;
      };
      begrunnelse?: string;
    };
  };
}

export default FetchedData;
