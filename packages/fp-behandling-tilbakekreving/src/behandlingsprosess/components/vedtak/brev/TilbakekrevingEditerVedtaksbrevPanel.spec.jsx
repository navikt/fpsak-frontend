import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import TilbakekrevingEditerVedtaksbrevPanel from './TilbakekrevingEditerVedtaksbrevPanel';

describe('<TilbakekrevingEditerVedtaksbrevPanel>', () => {
  it('skal vise tekstfelt for begrunnelse og godkjenningsknapp', () => {
    const periode = {
      brodtekst1: 'Både du og den andre forelderen har fått foreldrepenger for samme periode fordi du var innlagt i helseinstitusjon. '
        + 'Du kan ikke overføre kvoten din til den andre forelderen og i tillegg få utbetal foreldrepenger for samme periode. Du har '
        + 'derfor fått 2500 kroner for mye utbetalt i denne perioden.',
      fritekst1: undefined,
      underoverskrift: 'Hvordan vi har kommet fram til beløpet du må betale tilbake',
      brodtekst2: 'Du har ikke fått rett informasjon fra NAV, og vi mener at du ikke kunne forstå at beløpet du fikk utbetalt var feil.',
      fritekst2: undefined,
      brodtekst3: 'Vi har ikke opplysninger om at det er noe igjen av det feilutbetalte beløpet. Derfor må du ikke betale tilbake beløpet '
        + 'for denne perioden',
      fritekst3: undefined,
    };
    const vedtaksbravData = {
      oppsummering: {
        overskrift: 'Du må betale tilbake foreldrepenger',
        brodtekst: 'test brødtekst',
      },
      perioder: [{
        ...periode,
        overskrift: 'Perioden fra og med 10. april 2019 til og med 14. april 2019',
        fom: '10-04-2019',
        tom: '14-04-2019',
      }, {
        ...periode,
        overskrift: 'Perioden fra og med 14. april 2019 til og med 20. april 2019',
        fom: '14-04-2019',
        tom: '20-04-2019',
      }],
      ekstraInformasjon: {
        overskrift: 'Hvordan betale tilbake pengene du skylder',
        brodtekst: 'Vi har overført beløpet du skylder til NAV Innkreving, som vil sende deg et krav om å betale tilbake det feilutbetalte beløpet.'
          + ' Har du spørsmål om dette, kan du kontakte NAV Innkreving (tlf eller modia)?',
        skattOverskrift: 'Skatt - kommer senere',
        klageOverskrift: 'Du har rett til å klage',
        klageBrodtekst1: 'Du kan klage innen 12 uker fra den datoen du mottok vedtaket. Du finner skjema og informasjon på nav.no/klage.',
        klageBrodtekst2: 'Du må betale tilbake, selv om du klager på dette vedtaket. (Lovhjemmel?) Vi vil betale tilbake pengene du har betalt inn, '
          + 'om du får vedtak om at du ikke trengte å betale tilbake hele eller deler av beløpet du skyldte.',
        innsynOverskrift: 'Du har rett til innsyn',
        innsynBrodtekst: 'På nav.no/dittnav kan du se dokumentene i saken din.',
        sporsmalOverskrift: 'Har du spørsmål?',
        sporsmalBrodtekst: 'Du finner nyttig informasjon på nav.no/familie. Du kan også kontakte oss på telefon 55555555',
        hilsenBrodtekst: 'Med vennlig hilsen',
        hilsenNavn: 'navn på enhet',
      },
    };
    const wrapper = shallow(<TilbakekrevingEditerVedtaksbrevPanel
      vedtaksbrevData={vedtaksbravData}
      formName="testForm"
      readOnly={false}
    />);

    const paneler = wrapper.find(Ekspanderbartpanel);
    expect(paneler).to.have.length(4);
    expect(paneler.first().prop('tittel')).to.eql('Du må betale tilbake foreldrepenger');
    expect(paneler.at(1).prop('tittel')).to.eql('Perioden fra og med 10. april 2019 til og med 14. april 2019');
    expect(paneler.at(2).prop('tittel')).to.eql('Perioden fra og med 14. april 2019 til og med 20. april 2019');
    expect(paneler.last().prop('tittel')).to.eql('Hvordan betale tilbake pengene du skylder');
  });
});
