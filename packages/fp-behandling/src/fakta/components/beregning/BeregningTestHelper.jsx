import fpsakApi from 'data/fpsakApi';
import { ApiStateBuilder } from '@fpsak-frontend/assets/testHelpers/data-test-helper';
import fpsakBehandlingApi from 'behandlingFpsak/src/data/fpsakBehandlingApi';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
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


const kodeverk = {};
kodeverk[kodeverkTyper.AKTIVITET_STATUS] = [
  { kode: 'AT', navn: 'Arbeidstaker', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'FL', navn: 'Frilanser', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'TY', navn: 'Tilstøtende ytelse', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'SN', navn: 'Selvstendig næringsdrivende', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'AT_FL', navn: 'Kombinert arbeidstaker og frilanser', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'AT_SN', navn: 'Kombinert arbeidstaker og selvstendig næringsdrivende', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'FL_SN', navn: 'Kombinert frilanser og selvstendig næringsdrivende', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'AT_FL_SN', navn: 'Kombinert arbeidstaker, frilanser og selvstendig næringsdrivende', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'DP', navn: 'Dagpenger', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'AAP', navn: 'Arbeidsavklaringspenger', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'MS', navn: 'Militær eller sivil', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'KUN_YTELSE', navn: 'Kun ytelse', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
  { kode: 'VENTELØNN_VARTPENGER', navn: 'Ventelønn/vartpenger', kodeverk: kodeverkTyper.AKTIVITET_STATUS },
];

kodeverk[kodeverkTyper.INNTEKTSKATEGORI] = [
  { kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker', kodeverk: kodeverkTyper.INNTEKTSKATEGORI },
  { kode: 'FRILANSER', navn: 'Frilanser', kodeverk: kodeverkTyper.INNTEKTSKATEGORI },
];


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
        kodeverk,
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
