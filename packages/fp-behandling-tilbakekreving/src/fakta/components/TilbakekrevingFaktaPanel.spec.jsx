import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';

import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';
import { TilbakekrevingFaktaPanel } from './TilbakekrevingFaktaPanel';

describe('TilbakekrevingFaktaPanel', () => {
  const feilutbetalingAarsak = [{
    ytelseType: {
      kode: fagsakYtelseType.FORELDREPENGER,
    },
    hendelseTyper: [],
  }];

  const feilutbetalingFakta = {
    behandlingFakta: {
      perioder: [{
        fom: '2018-01-01',
        tom: '2019-01-01',
        belop: 1000,
      }],
      totalPeriodeFom: '2019-01-01',
      totalPeriodeTom: '2019-01-02',
      aktuellFeilUtbetaltBeløp: 10000,
      tidligereVarseltBeløp: 5000,
      behandlingÅrsaker: [{
        behandlingArsakType: {
          kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
        },
      }],
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.INNVILGET,
        },
        konsekvenserForYtelsen: [{
          kode: konsekvensForYtelsen.FORELDREPENGER_OPPHØRER,
        }, {
          kode: konsekvensForYtelsen.ENDRING_I_BEREGNING,
        }],
      },
      tilbakekrevingValg: {
        videreBehandling: {
          kode: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
        },
      },
      datoForRevurderingsvedtak: '2019-01-01',
    },
  };


  it('skal vise panel for feilutbetaling når en har dette', () => {
    const wrapper = shallow(<TilbakekrevingFaktaPanel
      aksjonspunkter={[]}
      submitCallback={sinon.spy()}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      shouldOpenDefaultInfoPanels
      readOnly={false}
      fagsakPerson={{}}
      feilutbetaling={{}}
      alleMerknaderFraBeslutter={{}}
      alleKodeverk={{}}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCacheTemp);

    const feilutbetalingPanel = dataFetchers.first().renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      feilutbetalingFakta,
      feilutbetalingAarsak,
    }).find(FeilutbetalingFaktaIndex);
    expect(feilutbetalingPanel).to.have.length(1);
  });
});
