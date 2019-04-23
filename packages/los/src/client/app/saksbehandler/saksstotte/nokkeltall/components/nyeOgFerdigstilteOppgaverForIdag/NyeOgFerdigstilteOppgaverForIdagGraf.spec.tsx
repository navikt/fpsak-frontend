
import React from 'react';
import { expect } from 'chai';
import { XYPlot, Hint } from 'react-vis';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import behandlingType from 'kodeverk/behandlingType';
import {
  NyeOgFerdigstilteOppgaverForIdagGraf, isEmpty, lagDatastrukturForFerdigstilte, lagDatastrukturForNye,
} from './NyeOgFerdigstilteOppgaverForIdagGraf';

describe('<NyeOgFerdigstilteOppgaverForIdagGraf>', () => {
  const behandlingTyper = [{
    kode: behandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
  }, {
    kode: behandlingType.KLAGE,
    navn: 'Klage',
  }, {
    kode: behandlingType.DOKUMENTINNSYN,
    navn: 'Dokumentinnsyn',
  }, {
    kode: behandlingType.REVURDERING,
    navn: 'Revurdering',
  }];


  it('skal vise graf med 10 satt på x-linja når graf er tom', () => {
    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForIdagGraf
      intl={intlMock}
      width={300}
      height={200}
      behandlingTyper={behandlingTyper}
      ferdigstilteOppgaver={[]}
      nyeOppgaver={[]}
      isEmpty
    />);

    const xYPlot = wrapper.find(XYPlot);
    expect(xYPlot).to.have.length(1);
    expect(xYPlot.prop('xDomain')).to.eql([0, 10]);
  });

  it('skal vise graf med 7 satt på x-linja når data har maksverdi x=5', () => {
    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForIdagGraf
      intl={intlMock}
      width={300}
      height={200}
      behandlingTyper={behandlingTyper}
      ferdigstilteOppgaver={[{
        x: 5,
        y: 1,
      }]}
      nyeOppgaver={[{
        x: 1,
        y: 1,
      }]}
      isEmpty={false}
    />);

    const xYPlot = wrapper.find(XYPlot);
    expect(xYPlot).to.have.length(1);
    expect(xYPlot.prop('xDomain')).to.eql([0, 7]);
  });

  it('skal vise hint som viser at det er fem ferdigstilte behandlinger', () => {
    const wrapper = shallowWithIntl(<NyeOgFerdigstilteOppgaverForIdagGraf
      intl={intlMock}
      width={300}
      height={200}
      behandlingTyper={behandlingTyper}
      ferdigstilteOppgaver={[{
        x: 5,
        y: 1,
      }]}
      nyeOppgaver={[{
        x: 1,
        y: 1,
      }]}
      isEmpty={false}
    />);

    wrapper.setState({ hintVerdi: { x: 5, y: 1 } });

    const hint = wrapper.find(Hint);
    expect(hint).to.have.length(1);
    expect(hint.find('div').childAt(0).text()).is.eql('Antall ferdigstilte: 5');
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
      }, {
        behandlingType: {
          kode: behandlingType.KLAGE,
          nav: 'KLAGE',
        },
        antallNye: 10,
        antallFerdigstilte: 4,
      }],
    };

    const koordinater = lagDatastrukturForFerdigstilte.resultFunc(ownProps);

    expect(koordinater).to.eql([{
      x: 0,
      y: 0.5,
    }, {
      x: 9,
      y: 4.03,
      y0: 4.41,
    }, {
      x: 4,
      y: 2.03,
      y0: 2.41,
    }, {
      x: 0,
      y: 4.5,
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
      }, {
        behandlingType: {
          kode: behandlingType.KLAGE,
          nav: 'KLAGE',
        },
        antallNye: 2,
        antallFerdigstilte: 4,
      }],
    };

    const koordinater = lagDatastrukturForNye.resultFunc(ownProps);

    expect(koordinater).to.eql([{
      x: 0,
      y: 0.5,
    }, {
      x: 10,
      y: 4.35,
      y0: 3.97,
    }, {
      x: 2,
      y: 2.35,
      y0: 1.97,
    }, {
      x: 0,
      y: 4.5,
    }]);
  });
});
