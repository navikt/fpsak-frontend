import fpsakApi from 'data/fpsakApi';
import { ApiStateBuilder } from '@fpsak-frontend/assets/testHelpers/data-test-helper';
import fpsakBehandlingApi from 'behandlingFpsak/src/data/fpsakBehandlingApi';
import { formName } from './BeregningFormUtils';


const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };

const fagsak = {
  antallBarn: 1,
  barnFodt: true,
  kanRevurderingOpprettes: false,
  saksnummer: 1,
  sakstype: {
    kode: 'FP',
    navn: 'Foreldrepenger',
    kodeverk: 'FAGSAK_YTELSE',
  },
  skalBehandlesAvInfotrygd: false,
  status: {
    kode: 'UBEH',
    navn: 'Under behandling',
    kodeverk: 'FAGSAK_STATUS',
  },
};

const behandlingFormName = 'behandling_1000051_v1';

export const getBehandlingFormName = () => behandlingFormName;


export const lagStateMedAksjonspunkterOgFaktaOmBeregning = (aksjonspunkter, faktaOmBeregning, values = {}, initial = {}) => {
  const data = {
    id: 1000051,
    versjon: 1,
    beregningsgrunnlag: { faktaOmBeregning },
    aksjonspunkter,
  };
  const dataState = new ApiStateBuilder()
    .withData(fpsakApi.NAV_ANSATT.name, navAnsatt)
    .withData(fpsakApi.FETCH_FAGSAK.name, fagsak)
    .withData(fpsakBehandlingApi.BEHANDLING.name, data, 'dataContextFpsakBehandling')
    .withData(fpsakBehandlingApi.ORIGINAL_BEHANDLING.name, {}, 'dataContextFpsakBehandling')
    .build();

  const state = {
    default: {
      ...dataState.default,
      fagsak: {
        selectedSaksnummer: 1,
      },
      fpsakBehandling: {
        behandlingId: 1000051,
      },
      behandling: {
        behandlingInfoHolder: {},
      },
    },
    form: {},
  };
  state.form[behandlingFormName] = {};
  state.form[behandlingFormName][formName] = {
    values,
    initial,
  };
  return state;
};
