import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import AnkeResultatProsessIndex from '@fpsak-frontend/prosess-anke-resultat';

import { BehandlingspunktAnkeInfoPanel } from './BehandlingspunktAnkeInfoPanel';
import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';

describe('<BehandlingspunktAnkeInfoPanel>', () => {
  it('skal rendre panelet for ankeresultat', () => {
    const wrapper = shallow(<BehandlingspunktAnkeInfoPanel
      selectedBehandlingspunkt={behandlingspunktCodes.ANKE_RESULTAT}
      saveTempAnke={sinon.spy()}
      submitCallback={sinon.spy()}
      previewCallback={sinon.spy()}
      previewCallbackAnke={sinon.spy()}
      openAksjonspunkt={false}
      readOnly={false}
      isApSolvable={false}
      readOnlySubmitButton={false}
      behandlingspunktAksjonspunkter={[]}
      behandlinger={[]}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCacheTemp);
    expect(dataFetchers.at(2).prop('showComponent')).to.be.true;

    const ankePanel = dataFetchers.at(2).renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      ankeVurdering: {
        ankeVurderingResultat: {
          ankeVurdering: ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK,
          ankeVurderingOmgjoer: 'test',
          ankeOmgjoerArsakNavn: 'test',
          begrunnelse: 'test',
          erAnkerIkkePart: false,
          erIkkeKonkret: false,
          erFristIkkeOverholdt: false,
          erIkkeSignert: false,
          erSubsidiartRealitetsbehandles: false,
        },
      },
    }).find(AnkeResultatProsessIndex);
    expect(ankePanel).to.have.length(1);
  });
});
