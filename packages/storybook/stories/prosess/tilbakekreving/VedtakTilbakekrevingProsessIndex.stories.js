import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';
import aktsomhet from '@fpsak-frontend/prosess-tilbakekreving/src/kodeverk/aktsomhet';

import vedtakResultatType from './vedtakResultatType';
import withReduxProvider from '../../../decorators/withRedux';

const vedtaksbrev = {
  avsnittsliste: [{
    overskrift: 'Du må betale tilbake foreldrepenger',
    underavsnittsliste: [{
      brødtekst: 'Vi varslet deg 31. oktober 2019 om at du har fått 49863 kroner for mye. Du må betale tilbake 22950 kroner, '
      + 'som er deler av det feilutbetalte beløpet.',
      fritekstTillatt: true,
      fritekstPåkrevet: false,
    }],
    avsnittstype: 'OPPSUMMERING',
  }, {
    overskrift: 'Gjelder perioden fra og med 16. mars 2016 til og med 26. mai 2016',
    underavsnittsliste: [{
      brødtekst: 'Du er ikke medlem av folketrygden. Fordi du ikke har jobbet eller hatt familie som forsørget deg i Norge, har '
       + 'du ikke rett til opphold etter EØS avtalen. Derfor har du ikke rett til foreldrepenger.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
      underavsnittstype: 'FAKTA',
    }, {
      brødtekst: 'Derfor har du fått 51000 kroner for mye utbetalt i denne perioden.',
      fritekstTillatt: true,
      fritekstPåkrevet: true,
      underavsnittstype: 'FAKTA',
    }, {
      overskrift: 'Hvordan har vi kommet fram til at du må betale tilbake?',
      brødtekst: 'Du har fått vite om du har rett til foreldrepenger og hvor mye du har rett til. Selv om du har meldt fra til oss, kan '
       + 'vi kreve tilbake det du har fått for mye dersom du må ha forstått at beløpet var feil.',
      fritekstTillatt: true,
      fritekstPåkrevet: false,
      underavsnittstype: 'VILKÅR',
    }, {
      brødtekst: 'Ut fra informasjonen du har fått, må du etter vår vurdering ha forstått at du fikk for mye utbetalt. Derfor kan vi kreve tilbake.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
      underavsnittstype: 'VILKÅR',
    }, {
      overskrift: 'Er det særlige grunner til å redusere beløpet?',
      fritekstTillatt: true,
      fritekstPåkrevet: false,
      underavsnittstype: 'SÆRLIGEGRUNNER',
    }, {
      brødtekst: 'Vi har lagt vekt på at du må ha forstått at du fikk penger du ikke har rett til. Vi vurderer likevel at uaktsomheten din '
      + 'har vært så liten at vi har redusert beløpet du må betale tilbake. Det er i vurderingen også lagt vekt på ',
      fritekstTillatt: true,
      fritekstPåkrevet: true,
      underavsnittstype: 'SÆRLIGEGRUNNER_ANNET',
    }, {
      brødtekst: 'Du må betale 22950 kroner.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
      underavsnittstype: 'SÆRLIGEGRUNNER_ANNET',
    }],
    avsnittstype: 'PERIODE',
    fom: '2016-03-16',
    tom: '2016-05-26',
  }, {
    underavsnittsliste: [{
      brødtekst: 'Vedtaket er gjort etter folketrygdloven § 22-15 og foreldelsesloven §§ 2 og 3.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }, {
      overskrift: 'Skatt',
      brødtekst: 'NAV gir opplysninger til skatteetaten når det feilutbetalte beløpet er tilbakebetalt. Skatteetaten vil da vurdere om det er '
      + 'grunnlag for å endre tidligere skatteoppgjør.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }, {
      overskrift: 'Hvordan betale tilbake pengene du skylder',
      brødtekst: 'Vi har overført beløpet du skylder til NAV Innkreving, som vil sende deg et krav om å betale tilbake det feilutbetalte beløpet. '
      + 'Har du spørsmål om dette, kan du kontakte NAV Innkreving på telefon 21 05 11 00.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }, {
      overskrift: 'Du har rett til å klage',
      brødtekst: 'Du kan klage innen 6 uker fra den datoen du mottok vedtaket. Du finner skjema og informasjon på nav.no/klage.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }, {
      brødtekst: 'Du må som hovedregel begynne å betale beløpet tilbake, selv om du klager på dette vedtaket. Dette følger av forvaltningsloven § 42. '
      + 'Hvis du får vedtak om at du ikke trengte å betale tilbake hele eller deler av beløpet du skyldte, betaler vi pengene tilbake til deg.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }, {
      overskrift: 'Du har rett til innsyn',
      brødtekst: 'På nav.no/dittnav kan du se dokumentene i saken din.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }, {
      overskrift: 'Har du spørsmål?',
      brødtekst: 'Du finner nyttig informasjon på nav.no/familie. Du kan også kontakte oss på telefon 55 55 33 33.',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }, {
      brødtekst: 'Med vennlig hilsen',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }, {
      brødtekst: 'NAV Familie- og pensjonsytelser',
      fritekstTillatt: false,
      fritekstPåkrevet: false,
    }],
    avsnittstype: 'TILLEGGSINFORMASJON',
  }],
};

const beregningsresultat = {
  beregningResultatPerioder: [{
    periode: {
      fom: '2018-10-01',
      tom: '2019-01-01',
    },
    feilutbetaltBeløp: 10000,
    vurdering: {
      kode: aktsomhet.FORSETT,
      kodeverk: 'AKTSOMHET',
    },
    andelAvBeløp: 50,
    renterProsent: 0,
    tilbakekrevingBeløp: 5000,
    tilbakekrevingBeløpEtterSkatt: 4000,
  }, {
    periode: {
      fom: '2018-01-01',
      tom: '2019-01-01',
    },
    feilutbetaltBeløp: 1000,
    vurdering: {
      kode: aktsomhet.FORSETT,
      kodeverk: 'AKTSOMHET',
    },
    andelAvBeløp: 50,
    renterProsent: 80,
    tilbakekrevingBeløp: 500,
    tilbakekrevingBeløpEtterSkatt: 400,
  }],
  vedtakResultatType: {
    kode: vedtakResultatType.DELVIS_TILBAKEBETALING,
    kodeverk: 'VEDTAK_RESULTAT_TYPE',
  },
};

const alleKodeverk = {
  [kodeverkTyper.VEDTAK_RESULTAT_TYPE]: [{
    kode: vedtakResultatType.DELVIS_TILBAKEBETALING,
    navn: 'Delvis tilbakebetaling',
    kodeverk: 'VEDTAK_RESULTAT_TYPE',
  }],
  [kodeverkTyper.AKTSOMHET]: [{
    kode: aktsomhet.FORSETT,
    navn: 'Forsett',
    kodeverk: 'AKTSOMHET',
  }],
};

export default {
  title: 'prosess/tilbakekreving/prosess-vedtak-tilbakekreving',
  component: VedtakTilbakekrevingProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visVedtakspanel = () => (
  <VedtakTilbakekrevingProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    beregningsresultat={beregningsresultat}
    vedtaksbrev={vedtaksbrev}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isBehandlingHenlagt={boolean('isBehandlingHenlagt', false)}
    alleKodeverk={alleKodeverk}
    fetchPreviewVedtaksbrev={action('button-click')}
    aksjonspunktKodeForeslaVedtak={aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK}
  />
);
