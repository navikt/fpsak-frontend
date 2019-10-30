import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';

import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';
import { TilbakekrevingBehandlingspunktInfoPanel } from './TilbakekrevingBehandlingspunktInfoPanel';

describe('<TilbakekrevingBehandlingspunktInfoPanel>', () => {
  it('skal vise tilbakekrevingspanel', () => {
    const wrapper = shallow(<TilbakekrevingBehandlingspunktInfoPanel
      openAksjonspunkt
      readOnly={false}
      isApSolvable
      submitCallback={() => undefined}
      selectedBehandlingspunkt={behandlingspunktCodes.TILBAKEKREVING}
      apCodes={[aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING]}
      readOnlySubmitButton={false}
      isBehandlingHenlagt={false}
      alleKodeverk={{}}
      fetchPreviewVedtaksbrev={() => undefined}
      navBrukerKjonn={NavBrukerKjonn.KVINNE}
      alleMerknaderFraBeslutter={{}}
      beregnBelop={() => undefined}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCacheTemp);
    expect(dataFetchers.at(1).prop('showComponent')).to.be.true;

    const tilbakekrevingPanel = dataFetchers.at(1).renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      perioderForeldelse: {
        perioder: [],
      },
      vilkarvurderingsperioder: {
        perioder: [],
        rettsgebyr: 1000,
      },
      vilkarvurdering: {
        vilkarsVurdertePerioder: [],
      },
    }).find(TilbakekrevingProsessIndex);
    expect(tilbakekrevingPanel).to.have.length(1);
  });
});
