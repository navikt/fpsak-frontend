import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AlertStripe from 'nav-frontend-alertstriper';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import BpTimelinePanel from '../felles/behandlingspunktTimelineSkjema/BpTimelinePanel';
import { TilbakekrevingFormImpl } from './TilbakekrevingForm';
import TilbakekrevingPeriodeForm from './TilbakekrevingPeriodeForm';

describe('<TilbakekrevingForm>', () => {
  it('skal vise tidslinje når en har perioder', () => {
    const perioder = [{
    }];
    const wrapper = shallow(<TilbakekrevingFormImpl
      perioderFormatertForTimeline={perioder}
      behandlingFormPrefix="behandling_V1"
      isApOpen
      kjonn={navBrukerKjonn.KVINNE}
      readOnly={false}
      readOnlySubmitButton={false}
      reduxFormChange={() => undefined}
      reduxFormInitialize={() => undefined}
      antallPerioderMedAksjonspunkt={2}
      isDetailFormOpen
      handleSubmit={() => undefined}
    />);

    expect(wrapper.find(TilbakekrevingPeriodeForm)).to.have.length(1);
    expect(wrapper.find(BpTimelinePanel)).to.have.length(1);
  });

  it('skal ikke vise tidslinje når en har perioder', () => {
    const perioder = undefined;
    const wrapper = shallow(<TilbakekrevingFormImpl
      perioderFormatertForTimeline={perioder}
      behandlingFormPrefix="behandling_V1"
      isApOpen
      kjonn={navBrukerKjonn.KVINNE}
      readOnly={false}
      readOnlySubmitButton={false}
      reduxFormChange={() => undefined}
      reduxFormInitialize={() => undefined}
      antallPerioderMedAksjonspunkt={2}
      isDetailFormOpen
      handleSubmit={() => undefined}
    />);

    expect(wrapper.find(TilbakekrevingPeriodeForm)).to.have.length(0);
    expect(wrapper.find(BpTimelinePanel)).to.have.length(0);
    expect(wrapper.find(AlertStripe)).to.have.length(0);
  });

  it('skal vise feilmelding når en har dette', () => {
    const perioder = undefined;
    const wrapper = shallow(<TilbakekrevingFormImpl
      perioderFormatertForTimeline={perioder}
      behandlingFormPrefix="behandling_V1"
      isApOpen
      kjonn={navBrukerKjonn.KVINNE}
      readOnly={false}
      readOnlySubmitButton={false}
      reduxFormChange={() => undefined}
      reduxFormInitialize={() => undefined}
      antallPerioderMedAksjonspunkt={2}
      isDetailFormOpen
      handleSubmit={() => undefined}
      error="TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr"
    />);

    expect(wrapper.find(AlertStripe)).to.have.length(1);
  });

  // TODO (TOR) Test validateForm
  // TODO (TOR) Test mapStateToPropsFactory
  // TODO (TOR) Test leggTilTimelineData
  // TODO (TOR) Test buildInitialValues
});
