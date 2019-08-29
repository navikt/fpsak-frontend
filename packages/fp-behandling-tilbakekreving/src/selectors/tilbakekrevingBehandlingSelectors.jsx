import { createSelector } from 'reselect';

import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';
import { allAccessRights } from '@fpsak-frontend/fp-felles';

import tilbakekrevingBehandlingApi from '../data/tilbakekrevingBehandlingApi';
import {
  getSelectedBehandlingId, getNavAnsatt, getFagsakStatus, getFagsakYtelseType, getKanRevurderingOpprettes, getSkalBehandlesAvInfotrygd,
} from '../duckBehandlingTilbakekreving';

const commonBehandlingSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, tilbakekrevingBehandlingApi);

// INNTEKT - ARBEID - YTELSE
const getBehandlingInntektArbeidYtelse = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling['inntekt-arbeid-ytelse']);
const getBehandlingRelatertTilgrensendeYtelserForSoker = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker,
);
const getBehandlingRelatertTilgrensendeYtelserForAnnenForelder = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder,
);
const getBehandlingArbeidsforhold = createSelector(
  [getBehandlingInntektArbeidYtelse], (inntektArbeidYtelse = {}) => inntektArbeidYtelse.arbeidsforhold,
);

// FEILUTBETALING
const getFeilutbetalingFakta = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.feilutbetalingFakta);

// FORELDELSE
const getForeldelsePerioder = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.perioderForeldelse);
const getFeilutbetalingAarsaker = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.feilutbetalingAarsak);

// VILKÅRSVURDERING
const getBehandlingVilkarsvurderingsperioder = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.vilkarvurderingsperioder.perioder);
const getBehandlingVilkarsvurderingsRettsgebyr = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.vilkarvurderingsperioder.rettsgebyr);
const getBehandlingVilkarsvurdering = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.vilkarvurdering);

// BEREGNINGSRESULTAT
const getBeregningsresultat = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.beregningsresultat);

// VEDTAK
const getVedtaksbrevAvsnitt = createSelector([commonBehandlingSelectors.getSelectedBehandling], (
  selectedBehandling = {},
) => selectedBehandling.vedtaksbrev.avsnittsliste);

const getRettigheter = createSelector([
  getNavAnsatt,
  getFagsakStatus,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
  getFagsakYtelseType,
  commonBehandlingSelectors.getBehandlingStatus,
  commonBehandlingSelectors.getSoknad,
  commonBehandlingSelectors.getAksjonspunkter,
  commonBehandlingSelectors.getBehandlingType,
  commonBehandlingSelectors.getBehandlingAnsvarligSaksbehandler,
], allAccessRights);

const tilbakekrevingBehandlingSelectors = {
  ...omit(commonBehandlingSelectors, 'getSelectedBehandling'),
  getBehandlingRelatertTilgrensendeYtelserForSoker,
  getBehandlingRelatertTilgrensendeYtelserForAnnenForelder,
  getBehandlingArbeidsforhold,
  getFeilutbetalingFakta,
  getForeldelsePerioder,
  getFeilutbetalingAarsaker,
  getBehandlingVilkarsvurderingsperioder,
  getBehandlingVilkarsvurderingsRettsgebyr,
  getBehandlingVilkarsvurdering,
  getBeregningsresultat,
  getVedtaksbrevAvsnitt,
  getRettigheter,
};

export default tilbakekrevingBehandlingSelectors;
