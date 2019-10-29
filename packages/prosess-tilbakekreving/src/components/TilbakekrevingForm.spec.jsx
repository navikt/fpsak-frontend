import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AlertStripe from 'nav-frontend-alertstriper';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import TilbakekrevingTimelinePanel from './timeline/TilbakekrevingTimelinePanel';
import VilkarResultat from '../kodeverk/vilkarResultat';
import { slaSammenOriginaleOgLagredePeriode, TilbakekrevingFormImpl } from './TilbakekrevingForm';
import TilbakekrevingPeriodeForm from './TilbakekrevingPeriodeForm';

describe('<TilbakekrevingForm>', () => {
  it('skal vise tidslinje når en har perioder', () => {
    const perioder = [{
      fom: '2019-01-01',
      tom: '2019-01-10',
      isAksjonspunktOpen: false,
      isGodkjent: false,
    }];
    const wrapper = shallow(<TilbakekrevingFormImpl
      vilkarsVurdertePerioder={perioder}
      dataForDetailForm={perioder}
      behandlingFormPrefix="behandling_V1"
      isApOpen
      navBrukerKjonn={navBrukerKjonn.KVINNE}
      readOnly={false}
      readOnlySubmitButton={false}
      reduxFormChange={() => undefined}
      reduxFormInitialize={() => undefined}
      antallPerioderMedAksjonspunkt={2}
      isDetailFormOpen
      handleSubmit={() => undefined}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
      behandlingId={1}
      behandlingVersjon={2}
      alleKodeverk={{}}
      beregnBelop={() => undefined}
    />);

    wrapper.setState({ valgtPeriode: perioder[0] });

    expect(wrapper.find(TilbakekrevingPeriodeForm)).to.have.length(1);
    expect(wrapper.find(TilbakekrevingTimelinePanel)).to.have.length(1);
  });

  it('skal ikke vise tidslinje når en har perioder', () => {
    const perioder = undefined;
    const wrapper = shallow(<TilbakekrevingFormImpl
      vilkarsVurdertePerioder={perioder}
      dataForDetailForm={perioder}
      behandlingFormPrefix="behandling_V1"
      isApOpen
      navBrukerKjonn={navBrukerKjonn.KVINNE}
      readOnly={false}
      readOnlySubmitButton={false}
      reduxFormChange={() => undefined}
      reduxFormInitialize={() => undefined}
      antallPerioderMedAksjonspunkt={2}
      isDetailFormOpen
      handleSubmit={() => undefined}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
      behandlingId={1}
      behandlingVersjon={2}
      alleKodeverk={{}}
      beregnBelop={() => undefined}
    />);

    expect(wrapper.find(TilbakekrevingPeriodeForm)).to.have.length(0);
    expect(wrapper.find(TilbakekrevingTimelinePanel)).to.have.length(0);
    expect(wrapper.find(AlertStripe)).to.have.length(0);
  });

  it('skal vise feilmelding når en har dette', () => {
    const perioder = undefined;
    const wrapper = shallow(<TilbakekrevingFormImpl
      vilkarsVurdertePerioder={perioder}
      dataForDetailForm={perioder}
      behandlingFormPrefix="behandling_V1"
      isApOpen
      navBrukerKjonn={navBrukerKjonn.KVINNE}
      readOnly={false}
      readOnlySubmitButton={false}
      reduxFormChange={() => undefined}
      reduxFormInitialize={() => undefined}
      antallPerioderMedAksjonspunkt={2}
      isDetailFormOpen
      handleSubmit={() => undefined}
      merknaderFraBeslutter={{
        notAccepted: false,
      }}
      behandlingId={1}
      behandlingVersjon={2}
      alleKodeverk={{}}
      beregnBelop={() => undefined}
      error="TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr"
    />);

    expect(wrapper.find(AlertStripe)).to.have.length(1);
  });

  it('skal lage initial values til form der en har lagret en periode og den andre er foreldet', () => {
    const arsak = {
      kodeverk: 'MORS_AKTIVITET_KRAV',
      underÅrsaker: [{
        kodeverk: 'MORS_AKTIVITET_TYPE',
        underÅrsak: 'Mor ikke arbeidet heltid',
        underÅrsakKode: 'IKKE_ARBEIDET_HELTID',
      }],
      årsak: 'Aktivitetskrav $14-33',
      årsakKode: 'MORS_AKTIVITET_TYPE',
    };
    const oppfyltValg = {
      kode: '-',
      kodeverk: 'VILKAAR_RESULTAT',
    };
    const ytelser = [{
      aktivitet: 'Arbeidstakar',
      belop: 19000,
    }];
    const originalePerioder = [{
      feilutbetaling: 32000,
      fom: '2016-03-16',
      tom: '2016-05-01',
      foreldet: true,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
    }, {
      feilutbetaling: 19000,
      fom: '2016-05-02',
      tom: '2016-05-26',
      foreldet: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
    }];
    const lagredePerioder = {
      vilkarsVurdertePerioder: [{
        feilutbetalingBelop: 19000,
        begrunnelse: '3434',
        fom: '2016-05-02',
        tom: '2016-05-26',
        vilkarResultat: {
          kode: VilkarResultat.GOD_TRO,
          kodeverk: 'VILKAAR_RESULTAT',
          navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
        },
        vilkarResultatInfo: {
          begrunnelse: '34344',
          erBelopetIBehold: true,
          tilbakekrevesBelop: 3434,
        },
      }],
    };
    const rettsgebyr = 1000;

    const resultat = slaSammenOriginaleOgLagredePeriode.resultFunc(originalePerioder, lagredePerioder, rettsgebyr);

    expect(resultat.perioder).to.have.length(2);
    expect(resultat.perioder[0]).to.eql({
      feilutbetaling: 32000,
      fom: '2016-03-16',
      tom: '2016-05-01',
      foreldet: true,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
      erTotalBelopUnder4Rettsgebyr: false,
    });
    expect(resultat.perioder[1]).to.eql({
      feilutbetaling: 19000,
      fom: '2016-05-02',
      tom: '2016-05-26',
      foreldet: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
      begrunnelse: '3434',
      vilkarResultat: {
        kode: VilkarResultat.GOD_TRO,
        kodeverk: 'VILKAAR_RESULTAT',
        navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
      },
      vilkarResultatInfo: {
        begrunnelse: '34344',
        erBelopetIBehold: true,
        tilbakekrevesBelop: 3434,
      },
      erTotalBelopUnder4Rettsgebyr: false,
    });
  });

  it('skal lage initial values til form der en har splittet en periode i to', () => {
    const arsak = {
      kodeverk: 'MORS_AKTIVITET_KRAV',
      underÅrsaker: [{
        kodeverk: 'MORS_AKTIVITET_TYPE',
        underÅrsak: 'Mor ikke arbeidet heltid',
        underÅrsakKode: 'IKKE_ARBEIDET_HELTID',
      }],
      årsak: 'Aktivitetskrav $14-33',
      årsakKode: 'MORS_AKTIVITET_TYPE',
    };
    const oppfyltValg = {
      kode: '-',
      kodeverk: 'VILKAAR_RESULTAT',
    };
    const ytelser = [{
      aktivitet: 'Arbeidstakar',
      belop: 19000,
    }];
    const originalePerioder = [{
      feilutbetaling: 32000,
      fom: '2016-03-16',
      tom: '2016-05-26',
      foreldet: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
    }];
    const lagredePerioder = {
      vilkarsVurdertePerioder: [{
        begrunnelse: '3434',
        fom: '2016-03-16',
        tom: '2016-04-03',
        feilutbetalingBelop: 10000,
        vilkarResultat: {
          kode: VilkarResultat.GOD_TRO,
          kodeverk: 'VILKAAR_RESULTAT',
          navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
        },
        vilkarResultatInfo: {
          begrunnelse: '34344',
          erBelopetIBehold: true,
          tilbakekrevesBelop: 2312,
        },
      }, {
        begrunnelse: 'test',
        fom: '2016-04-04',
        tom: '2016-05-26',
        feilutbetalingBelop: 22000,
        vilkarResultat: {
          kode: VilkarResultat.GOD_TRO,
          kodeverk: 'VILKAAR_RESULTAT',
          navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
        },
        vilkarResultatInfo: {
          begrunnelse: '34344',
          erBelopetIBehold: true,
          tilbakekrevesBelop: 3434,
        },
      }],
    };
    const rettsgebyr = 1000;

    const resultat = slaSammenOriginaleOgLagredePeriode.resultFunc(originalePerioder, lagredePerioder, rettsgebyr);

    expect(resultat.perioder).to.have.length(2);
    expect(resultat.perioder[0]).to.eql({
      feilutbetaling: 10000,
      fom: '2016-03-16',
      tom: '2016-04-03',
      foreldet: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
      begrunnelse: '3434',
      vilkarResultat: {
        kode: VilkarResultat.GOD_TRO,
        kodeverk: 'VILKAAR_RESULTAT',
        navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
      },
      vilkarResultatInfo: {
        begrunnelse: '34344',
        erBelopetIBehold: true,
        tilbakekrevesBelop: 2312,
      },
      erTotalBelopUnder4Rettsgebyr: false,
    });
    expect(resultat.perioder[1]).to.eql({
      feilutbetaling: 22000,
      fom: '2016-04-04',
      tom: '2016-05-26',
      foreldet: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
      begrunnelse: 'test',
      vilkarResultat: {
        kode: VilkarResultat.GOD_TRO,
        kodeverk: 'VILKAAR_RESULTAT',
        navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
      },
      vilkarResultatInfo: {
        begrunnelse: '34344',
        erBelopetIBehold: true,
        tilbakekrevesBelop: 3434,
      },
      erTotalBelopUnder4Rettsgebyr: false,
    });
  });

  // TODO (TOR) Test validateForm
  // TODO (TOR) Test mapStateToPropsFactory
  // TODO (TOR) Test leggTilTimelineData
});
