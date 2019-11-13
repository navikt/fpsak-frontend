import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';
import VurderSoknadsfristForeldrepengerIndex from '@fpsak-frontend/prosess-soknadsfrist';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { BehandlingspunktInfoPanel } from './BehandlingspunktInfoPanel';
import DataFetcherWithCache from '../../DataFetcherWithCache';

describe('<BehandlingspunktInfoPanel>', () => {
  it('skal rendre panelet for beregningsresultat', () => {
    const wrapper = shallow(<BehandlingspunktInfoPanel
      selectedBehandlingspunkt={behandlingspunktCodes.BEREGNING}
      submitCallback={sinon.spy()}
      previewCallback={sinon.spy()}
      previewFptilbakeCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      openAksjonspunkt={false}
      readOnly={false}
      isApSolvable={false}
      apCodes={[]}
      readOnlySubmitButton={false}
      fagsakInfo={{
        ytelseType: {
          kode: fagsakYtelseType.FORELDREPENGER,
        },
      }}
      featureToggles={{}}
      overrideReadOnly={false}
      kanOverstyreAccess={{ isEnabled: false }}
      behandlingspunktAksjonspunkter={[]}
      alleAksjonspunkter={[]}
      toggleOverstyring={sinon.spy()}
      tempUpdate={sinon.spy()}
      alleKodeverk={{}}
      behandlingspunktVilkar={[]}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCache);
    expect(dataFetchers.at(1).prop('showComponent')).to.be.true;

    const beregningPanel = dataFetchers.at(1).renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      beregningresultatEngangsstonad: {},
    }).find(BeregningsresultatProsessIndex);
    expect(beregningPanel).to.have.length(1);
  });

  it('skal rendre panelet for søknadsfrist ved aksjonspunkt', () => {
    const wrapper = shallow(<BehandlingspunktInfoPanel
      selectedBehandlingspunkt={behandlingspunktCodes.SOEKNADSFRIST}
      submitCallback={sinon.spy()}
      previewCallback={sinon.spy()}
      previewFptilbakeCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      openAksjonspunkt={false}
      readOnly={false}
      isApSolvable={false}
      apCodes={[aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER]}
      readOnlySubmitButton={false}
      fagsakInfo={{
        ytelseType: {
          kode: fagsakYtelseType.FORELDREPENGER,
        },
      }}
      featureToggles={{}}
      overrideReadOnly={false}
      kanOverstyreAccess={{ isEnabled: false }}
      behandlingspunktAksjonspunkter={[]}
      alleAksjonspunkter={[]}
      toggleOverstyring={sinon.spy()}
      tempUpdate={sinon.spy()}
      alleKodeverk={{}}
      behandlingspunktVilkar={[]}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCache);
    expect(dataFetchers.last().prop('showComponent')).to.be.true;

    const beregningPanel = dataFetchers.last().renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      uttakPeriodeGrense: {
        mottattDato: '2019-10-10',
        antallDagerLevertForSent: 2,
        soknadsperiodeStart: '2019-10-10',
        soknadsperiodeSlutt: '2019-10-11',
        soknadsfristForForsteUttaksdato: '2019-10-10',
      },
      soknad: { mottattDato: '2019-10-10' },
    }).find(VurderSoknadsfristForeldrepengerIndex);
    expect(beregningPanel).to.have.length(1);
  });
});
