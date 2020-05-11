import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import sarligGrunn from '../kodeverk/sarligGrunn';
import aktsomhet from '../kodeverk/aktsomhet';
import ForeldetFormPanel from './tilbakekrevingPeriodePaneler/ForeldetFormPanel';
import { TilbakekrevingPeriodeFormImpl } from './TilbakekrevingPeriodeForm';
import vilkarResultat from '../kodeverk/vilkarResultat';

describe('<TilbakekrevingPeriodeForm>', () => {
  const sarligGrunnTyper = [{
    kode: sarligGrunn.GRAD_AV_UAKTSOMHET,
    navn: 'grad av uaktsomhet',
  }, {
    kode: sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
    navn: 'navs feil',
  }];
  const aktsomhetTyper = [{
    kode: aktsomhet.GROVT_UAKTSOM,
    navn: 'grovt',
  }, {
    kode: aktsomhet.SIMPEL_UAKTSOM,
    navn: 'simpel',
  }, {
    kode: aktsomhet.FORSETT,
    navn: 'forsett',
  }];

  it('skal vise panel for foreldet periode', () => {
    const periode = {
      erForeldet: true,
      ytelser: [],
    };
    const wrapper = shallow(<TilbakekrevingPeriodeFormImpl
      periode={periode}
      data={periode}
      behandlingFormPrefix="behandling_V1"
      skjulPeriode={() => undefined}
      readOnly={false}
      erBelopetIBehold
      formName="testForm"
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr
      oppdaterPeriode={() => undefined}
      oppdaterSplittedePerioder={() => undefined}
      setNestePeriode={() => undefined}
      setForrigePeriode={() => undefined}
      antallPerioderMedAksjonspunkt={2}
      vilkarResultatTyper={[]}
      aktsomhetTyper={aktsomhetTyper}
      sarligGrunnTyper={sarligGrunnTyper}
      reduserteBelop={[]}
      behandlingId={1}
      behandlingVersjon={1}
      beregnBelop={() => undefined}
      intl={intlMock}
      vilkarsVurdertePerioder={[]}
      {...reduxFormPropsMock}
    />);

    expect(wrapper.find(ForeldetFormPanel)).to.have.length(1);
  });

  it('skal vise panel for periode', () => {
    const periode = {
      erForeldet: false,
      begrunnelse: null,
      valgtVilkarResultatType: null,
      vurderingBegrunnelse: null,
      fom: '2020-04-01',
      tom: '2020-04-15',
      ytelser: [],
    };
    const vilkårsPerioder = [
      {
        erForeldet: false,
        begrunnelse: 'Begrunnelse periode 1',
        valgtVilkarResultatType: vilkarResultat.GOD_TRO,
        vurderingBegrunnelse: 'Vurdering periode 1',
        fom: '2020-03-01',
        tom: '2020-03-15',
        GOD_TRO: {
          erBelopetIBehold: false,
        },
      },
      {
        erForeldet: false,
        begrunnelse: 'Begrunnelse periode 2',
        valgtVilkarResultatType: vilkarResultat.FORSTO_BURDE_FORSTAATT,
        vurderingBegrunnelse: 'Vurdering periode 2',
        fom: '2020-03-15',
        tom: '2020-03-31',
        FORSTO_BURDE_FORSTAATT: {
          handletUaktsomhetGrad: aktsomhet.FORSETT,
          FORSETT: {
            skalDetTilleggesRenter: false,
          },
        },
      },
      {
        erForeldet: false,
        valgtVilkarResultatType: null,
        fom: '2020-04-01',
        tom: '2020-04-15',
      },
      {
        erForeldet: false,
        fom: '2020-04-15',
        tom: '2020-04-30',
      },
    ];

    const wrapper = shallow(<TilbakekrevingPeriodeFormImpl
      periode={periode}
      data={periode}
      behandlingFormPrefix="behandling_V1"
      skjulPeriode={() => undefined}
      readOnly={false}
      erBelopetIBehold
      formName="testForm"
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr
      oppdaterPeriode={() => undefined}
      oppdaterSplittedePerioder={() => undefined}
      setNestePeriode={() => undefined}
      setForrigePeriode={() => undefined}
      antallPerioderMedAksjonspunkt={2}
      vilkarResultatTyper={[]}
      aktsomhetTyper={aktsomhetTyper}
      sarligGrunnTyper={sarligGrunnTyper}
      reduserteBelop={[]}
      behandlingId={1}
      behandlingVersjon={1}
      beregnBelop={() => undefined}
      intl={intlMock}
      vilkarsVurdertePerioder={vilkårsPerioder}
      {...reduxFormPropsMock}
    />);

    // Tester om nedtrekksmenyen for perioder som kan kopieres vises
    const selectField = wrapper.find('[name="perioderForKopi"]');
    expect(selectField).to.have.lengthOf(1);
    const values = selectField.props().selectValues;
    expect(values).to.have.lengthOf(2);
  });

  // TODO (TOR) Skriv fleire testar
});
