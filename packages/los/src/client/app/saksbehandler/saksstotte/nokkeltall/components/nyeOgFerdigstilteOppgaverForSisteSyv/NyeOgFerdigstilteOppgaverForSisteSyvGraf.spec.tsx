
import React from 'react';
import { expect } from 'chai';
import {
  XYPlot, AreaSeries, Crosshair,
} from 'react-vis';
import moment from 'moment';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import behandlingType from 'kodeverk/behandlingType';
import {
  NyeOgFerdigstilteOppgaverForSisteSyvGraf, isEmpty, slaSammenBehandlingstyperOgFyllInnTomme, lagDatastrukturForFerdigstilte, lagDatastrukturForNye,
} from './NyeOgFerdigstilteOppgaverForSisteSyvGraf';

describe('<NyeOgFerdigstilteOppgaverForSisteSyvGraf>', () => {
  it('skal vise graf med default-verdier på x og y-aksen når datagrunnlaget er tom', () => {
    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForSisteSyvGraf
      intl={intlMock}
      width={300}
      height={200}
      ferdigstilteOppgaver={[]}
      nyeOppgaver={[]}
      isEmpty
    />);

    const xYPlot = wrapper.find(XYPlot);
    expect(xYPlot).to.have.length(1);
    expect(xYPlot.prop('xDomain')).to.eql([moment().subtract(7, 'd').startOf('day').toDate(), moment().subtract(1, 'd').startOf('day').toDate()]);
    expect(xYPlot.prop('yDomain')).to.eql([0, 50]);
  });

  it('skal vise graf med en kurve for ferdigstilte og en for nye oppgaver', () => {
    const ferdigstilteOppgaver = [{
      x: moment().subtract(1, 'd').toDate(),
      y: 1,
    }, {
      x: moment().subtract(2, 'd').toDate(),
      y: 2,
    }, {
      x: moment().subtract(3, 'd').toDate(),
      y: 3,
    }];

    const nyeOppgaver = [{
      x: moment().subtract(1, 'd').toDate(),
      y: 11,
    }, {
      x: moment().subtract(2, 'd').toDate(),
      y: 12,
    }, {
      x: moment().subtract(3, 'd').toDate(),
      y: 13,
    }];

    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForSisteSyvGraf
      intl={intlMock}
      width={300}
      height={200}
      ferdigstilteOppgaver={ferdigstilteOppgaver}
      nyeOppgaver={nyeOppgaver}
      isEmpty={false}
    />);

    const areaSeries = wrapper.find(AreaSeries);
    expect(areaSeries).to.have.length(2);

    const dataArea1 = areaSeries.first().prop('data');
    expect(dataArea1).to.eql(ferdigstilteOppgaver);

    const dataArea2 = areaSeries.last().prop('data');
    expect(dataArea2).to.eql(nyeOppgaver);
  });


  it('skal vise crosshair med antall nye og ferdigstilte for valgt dato', () => {
    const ferdigstilteOppgaver = [{
      x: moment().startOf('day').subtract(1, 'd').toDate(),
      y: 1,
    }, {
      x: moment().startOf('day').subtract(2, 'd').toDate(),
      y: 2,
    }, {
      x: moment().startOf('day').subtract(3, 'd').toDate(),
      y: 3,
    }];

    const nyeOppgaver = [{
      x: moment().startOf('day').subtract(1, 'd').toDate(),
      y: 11,
    }, {
      x: moment().startOf('day').subtract(2, 'd').toDate(),
      y: 12,
    }, {
      x: moment().startOf('day').subtract(3, 'd').toDate(),
      y: 13,
    }];

    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForSisteSyvGraf
      intl={intlMock}
      width={300}
      height={200}
      ferdigstilteOppgaver={ferdigstilteOppgaver}
      nyeOppgaver={nyeOppgaver}
      isEmpty={false}
    />);

    const areaSeries = wrapper.find(AreaSeries);
    expect(areaSeries).to.have.length(2);

    const valgtPunkt = { x: moment().startOf('day').subtract(1, 'd').toDate(), y: 1 };
    areaSeries.first().prop('onNearestX')(valgtPunkt);

    const crosshair = wrapper.find(Crosshair);
    expect(crosshair).to.have.length(1);

    expect(crosshair.find(Normaltekst).childAt(0).text()).to.eql(moment().subtract(1, 'd').format(DDMMYYYY_DATE_FORMAT));
    const tekst = crosshair.find(Undertekst);
    expect(tekst).to.have.length(2);
    expect(tekst.first().childAt(0).prop('values').antall).to.eql(1);
    expect(tekst.last().childAt(0).prop('values').antall).to.eql(11);
  });

  it('skal finne ut at oppgaveliste er tom', () => {
    const ownProps = { nyeOgFerdigstilteOppgaver: [] };
    expect(isEmpty.resultFunc(ownProps)).is.true;
  });

  it('skal finne ut at oppgaveliste ikke er tom', () => {
    const ownProps = { nyeOgFerdigstilteOppgaver: [{}] };
    expect(isEmpty.resultFunc(ownProps)).is.false;
  });

  it('skal lage koordinater for ferdigstilte oppgaver', () => {
    const ownProps = {
      nyeOgFerdigstilteOppgaver: [{
        behandlingType: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
          nav: 'FORSTEGANGSSOKNAD',
        },
        antallNye: 10,
        antallFerdigstilte: 9,
        dato: moment().subtract(1, 'd').format(ISO_DATE_FORMAT),
      }, {
        behandlingType: {
          kode: behandlingType.KLAGE,
          nav: 'KLAGE',
        },
        antallNye: 10,
        antallFerdigstilte: 4,
        dato: moment().subtract(2, 'd').format(ISO_DATE_FORMAT),
      }],
    };

    const koordinater = lagDatastrukturForFerdigstilte.resultFunc(slaSammenBehandlingstyperOgFyllInnTomme.resultFunc(ownProps));

    expect(koordinater).to.eql([{
      x: moment().subtract(7, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(6, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(5, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(4, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(3, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(2, 'd').startOf('day').toDate(),
      y: 4,
    }, {
      x: moment().subtract(1, 'd').startOf('day').toDate(),
      y: 9,
    }]);
  });

  it('skal lage koordinater for nye oppgaver', () => {
    const ownProps = {
      nyeOgFerdigstilteOppgaver: [{
        behandlingType: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
          nav: 'FORSTEGANGSSOKNAD',
        },
        antallNye: 10,
        antallFerdigstilte: 9,
        dato: moment().subtract(1, 'd').format(ISO_DATE_FORMAT),
      }, {
        behandlingType: {
          kode: behandlingType.KLAGE,
          nav: 'KLAGE',
        },
        antallNye: 10,
        antallFerdigstilte: 4,
        dato: moment().subtract(1, 'd').format(ISO_DATE_FORMAT),
      }, {
        behandlingType: {
          kode: behandlingType.KLAGE,
          nav: 'KLAGE',
        },
        antallNye: 10,
        antallFerdigstilte: 4,
        dato: moment().subtract(2, 'd').format(ISO_DATE_FORMAT),
      }, {
        behandlingType: {
          kode: behandlingType.KLAGE,
          nav: 'KLAGE',
        },
        antallNye: 1,
        antallFerdigstilte: 4,
        dato: moment().subtract(7, 'd').format(ISO_DATE_FORMAT),
      }],
    };

    const koordinater = lagDatastrukturForNye.resultFunc(slaSammenBehandlingstyperOgFyllInnTomme.resultFunc(ownProps));

    expect(koordinater).to.eql([{
      x: moment().subtract(7, 'd').startOf('day').toDate(),
      y: 1,
    }, {
      x: moment().subtract(6, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(5, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(4, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(3, 'd').startOf('day').toDate(),
      y: 0,
    }, {
      x: moment().subtract(2, 'd').startOf('day').toDate(),
      y: 10,
    }, {
      x: moment().subtract(1, 'd').startOf('day').toDate(),
      y: 20,
    }]);
  });
});
