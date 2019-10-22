import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { createSelector } from 'reselect';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import FodselVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-fodsel';
import SvangerskapVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-svangerskap';
import OmsorgVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-omsorg';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import SoknadsfristVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-soknadsfrist';
import ForeldreansvarVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-foreldreansvar';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import AdopsjonVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-adopsjon';
import AksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import fpsakApi from 'behandlingForstegangOgRevurdering/src/data/fpsakBehandlingApi';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import OpptjeningVilkarForm from './opptjening/OpptjeningVilkarForm';
import DataFetcherWithCache from '../../../DataFetcherWithCache';
import {
  hentAlleOverstyringAksjonspunktKoderFor, hentOverstyringAksjonspunktKodeFor, getVilkarKodeFor, getFiltrerteAvslagsarsaker,
} from './vilkarOverstyringHjelper';

const fodselData = [fpsakApi.BEHANDLING];
const adopsjonData = [fpsakApi.BEHANDLING];
const svangerskapData = [fpsakApi.BEHANDLING];
const omsorgData = [fpsakApi.BEHANDLING];
const soknadsfristData = [fpsakApi.BEHANDLING, fpsakApi.VILKAR, fpsakApi.SOKNAD, fpsakApi.FAMILIEHENDELSE];
const sokersOpplysningspliktData = [fpsakApi.BEHANDLING, fpsakApi.SOKNAD];
const foreldreansvarData = [fpsakApi.BEHANDLING];
const vilkarresultatMedOverstyringData = [fpsakApi.BEHANDLING, fpsakApi.MEDLEMSKAP];

/*
 * VilkarPanels
 *
 * Presentasjonskomponent.
 */
export const VilkarPanels = ({
  intl,
  aksjonspunktCodes,
  vilkarTypeCodes,
  behandlingspunkt,
  isAksjonspunktOpen,
  readOnly,
  readOnlySubmitButton,
  submitCallback,
  behandlingspunktAksjonspunkter,
  behandlingspunktStatus,
  behandlingspunktVilkar,
  behandlingspunktOverridden,
  behandlingspunktOverrideReadOnly,
  behandlingspunktTitleCode,
  kanOverstyreAccess,
  alleKodeverk,
  fagsakInfo,
  toggleOverstyring,
  avslagsarsaker,
  harVilkarresultatMedOverstyring,
}) => (
  <>
    <DataFetcherWithCache
      behandlingVersjon={1}
      data={vilkarresultatMedOverstyringData}
      showComponent={harVilkarresultatMedOverstyring}
      render={(props) => {
        const vilkarKode = getVilkarKodeFor(behandlingspunkt, behandlingspunktVilkar);
        const vilkar = vilkarKode ? behandlingspunktVilkar.find((v) => v.vilkarType.kode === vilkarKode) : behandlingspunktVilkar[0];
        return (
          <VilkarresultatMedOverstyringProsessIndex
            key={behandlingspunkt}
            submitCallback={submitCallback}
            kanOverstyreAccess={kanOverstyreAccess}
            toggleOverstyring={toggleOverstyring}
            status={behandlingspunktStatus}
            aksjonspunkter={behandlingspunktAksjonspunkter}
            erOverstyrt={behandlingspunktOverridden}
            overrideReadOnly={behandlingspunktOverrideReadOnly}
            panelTittel={intl.formatMessage({ id: behandlingspunktTitleCode })}
            avslagsarsaker={getFiltrerteAvslagsarsaker(vilkar.vilkarType.kode, fagsakInfo.ytelseType, avslagsarsaker)}
            lovReferanse={vilkar.lovReferanse}
            overstyringApKode={hentOverstyringAksjonspunktKodeFor(behandlingspunkt, fagsakInfo.ytelseType, behandlingspunktVilkar)}
            erMedlemskapsPanel={behandlingspunkt === behandlingspunktCodes.FORTSATTMEDLEMSKAP}
            {...props}
          />
        );
      }}
    />

    <DataFetcherWithCache
      behandlingVersjon={1}
      data={sokersOpplysningspliktData}
      showComponent={behandlingspunkt === behandlingspunktCodes.OPPLYSNINGSPLIKT}
      render={(props) => (
        <SokersOpplysningspliktVilkarProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          aksjonspunkter={behandlingspunktAksjonspunkter}
          status={behandlingspunktStatus}
          alleKodeverk={alleKodeverk}
          {...props}
        />
      )}
    />

    <DataFetcherWithCache
      behandlingVersjon={1}
      data={soknadsfristData}
      showComponent={aksjonspunktCodes.includes(AksjonspunktCodes.SOKNADSFRISTVILKARET)}
      render={(props) => (
        <SoknadsfristVilkarProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          aksjonspunkter={behandlingspunktAksjonspunkter}
          status={behandlingspunktStatus}
          alleKodeverk={alleKodeverk}
          {...props}
        />
      )}
    />

    <DataFetcherWithCache
      behandlingVersjon={1}
      data={omsorgData}
      showComponent={behandlingspunkt === behandlingspunktCodes.OMSORG
        && (aksjonspunktCodes.includes(AksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET)
        || aksjonspunktCodes.includes(AksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
        || aksjonspunktCodes.includes(AksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN))}
      render={(props) => (
        <OmsorgVilkarProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          aksjonspunkter={behandlingspunktAksjonspunkter}
          status={behandlingspunktStatus}
          alleKodeverk={alleKodeverk}
          {...props}
        />
      )}
    />

    <DataFetcherWithCache
      behandlingVersjon={1}
      data={foreldreansvarData}
      showComponent={behandlingspunkt === behandlingspunktCodes.FORELDREANSVAR}
      render={(props) => (
        <ForeldreansvarVilkarProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          aksjonspunkter={behandlingspunktAksjonspunkter}
          isEngangsstonad={fagsakInfo.ytelseType.kode === FagsakYtelseType.ENGANGSSTONAD}
          status={behandlingspunktStatus}
          alleKodeverk={alleKodeverk}
          vilkarTypeCodes={vilkarTypeCodes}
          {...props}
        />
      )}
    />

    <DataFetcherWithCache
      behandlingVersjon={1}
      data={svangerskapData}
      showComponent={behandlingspunkt === behandlingspunktCodes.SVANGERSKAP}
      render={(props) => (
        <SvangerskapVilkarProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          isAksjonspunktOpen={isAksjonspunktOpen}
          aksjonspunkter={behandlingspunktAksjonspunkter}
          status={behandlingspunktStatus}
          vilkar={behandlingspunktVilkar}
          alleKodeverk={alleKodeverk}
          {...props}
        />
      )}
    />

    <DataFetcherWithCache
      behandlingVersjon={1}
      data={fodselData}
      showComponent={behandlingspunkt === behandlingspunktCodes.FOEDSEL
        && (aksjonspunktCodes.includes(AksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
        || aksjonspunktCodes.includes(AksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN))}
      render={(props) => (
        <FodselVilkarProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          isAksjonspunktOpen={isAksjonspunktOpen}
          aksjonspunkter={behandlingspunktAksjonspunkter}
          status={behandlingspunktStatus}
          vilkar={behandlingspunktVilkar}
          ytelseTypeKode={fagsakInfo.ytelseType.kode}
          alleKodeverk={alleKodeverk}
          {...props}
        />
      )}
    />

    <DataFetcherWithCache
      behandlingVersjon={1}
      data={adopsjonData}
      showComponent={behandlingspunkt === behandlingspunktCodes.ADOPSJON
        && (aksjonspunktCodes.includes(AksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
        || aksjonspunktCodes.includes(AksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN))}
      render={(props) => (
        <AdopsjonVilkarProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          isAksjonspunktOpen={isAksjonspunktOpen}
          aksjonspunkter={behandlingspunktAksjonspunkter}
          status={behandlingspunktStatus}
          vilkar={behandlingspunktVilkar}
          alleKodeverk={alleKodeverk}
          {...props}
        />
      )}
    />

    {OpptjeningVilkarForm.supports(behandlingspunkt, aksjonspunktCodes)
      && (
      <OpptjeningVilkarForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        isAksjonspunktOpen={isAksjonspunktOpen}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
  </>
);

VilkarPanels.propTypes = {
  intl: PropTypes.shape().isRequired,
  aksjonspunktCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingspunkt: PropTypes.string.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  vilkarTypeCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingspunktAksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingspunktStatus: PropTypes.string.isRequired,
  behandlingspunktVilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  fagsakInfo: PropTypes.shape().isRequired,
  kanOverstyreAccess: PropTypes.shape().isRequired,
  behandlingspunktOverridden: PropTypes.bool.isRequired,
  behandlingspunktOverrideReadOnly: PropTypes.bool.isRequired,
  behandlingspunktTitleCode: PropTypes.string.isRequired,
  toggleOverstyring: PropTypes.func.isRequired,
  avslagsarsaker: PropTypes.shape().isRequired,
  harVilkarresultatMedOverstyring: PropTypes.bool.isRequired,
};

const harVilkarresultatMedOverstyring = createSelector(
  [behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes, behandlingsprosessSelectors.getSelectedBehandlingspunkt],
  (apKoder, behandlingspunkt) => {
    const overstyringApKoder = hentAlleOverstyringAksjonspunktKoderFor(behandlingspunkt);
    const harIngenApOgMulighetTilOverstyring = apKoder.length === 0 && overstyringApKoder.length > 0;
    const harApSomErOverstyringAp = apKoder.some((apCode) => overstyringApKoder.includes(apCode));
    return harIngenApOgMulighetTilOverstyring || harApSomErOverstyringAp;
  },
);

const mapStateToProps = (state) => ({
  behandlingspunkt: behandlingsprosessSelectors.getSelectedBehandlingspunkt(state),
  vilkarTypeCodes: behandlingSelectors.getBehandlingVilkarCodes(state),
  behandlingspunktStatus: behandlingsprosessSelectors.getSelectedBehandlingspunktStatus(state),
  behandlingspunktVilkar: behandlingsprosessSelectors.getSelectedBehandlingspunktVilkar(state),
  behandlingspunktOverridden: behandlingsprosessSelectors.getIsSelectedBehandlingspunktOverridden(state),
  behandlingspunktOverrideReadOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktOverrideReadOnly(state),
  behandlingspunktTitleCode: behandlingsprosessSelectors.getSelectedBehandlingspunktTitleCode(state),
  aksjonspunktCodes: behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  behandlingspunktAksjonspunkter: behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
  avslagsarsaker: getKodeverk(kodeverkTyper.AVSLAGSARSAK)(state),
  harVilkarresultatMedOverstyring: harVilkarresultatMedOverstyring(state),
});

export default connect(mapStateToProps)(injectIntl(VilkarPanels));
