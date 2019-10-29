import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import sarligGrunn from '../kodeverk/sarligGrunn';
import aktsomhet from '../kodeverk/aktsomhet';
import ForeldetFormPanel from './tilbakekrevingPeriodePaneler/ForeldetFormPanel';
import { TilbakekrevingPeriodeFormImpl } from './TilbakekrevingPeriodeForm';

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

  it('skal vis panel for foreldet periode', () => {
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
      {...reduxFormPropsMock}
    />);

    expect(wrapper.find(ForeldetFormPanel)).to.have.length(1);
  });

  // TODO (TOR) Skriv fleire testar
});
