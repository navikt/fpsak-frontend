import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ElementWrapper } from '@fpsak-frontend/shared-components';
import FodselVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-fodsel';
import AksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';

import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import fpsakApi from 'behandlingForstegangOgRevurdering/src/data/fpsakBehandlingApi';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import ErOmsorgVilkaarOppfyltForm from './omsorg/ErOmsorgVilkaarOppfyltForm';
import ErSoknadsfristVilkaretOppfyltForm from './soknadsfrist/ErSoknadsfristVilkaretOppfyltForm';
import ErForeldreansvar2LeddVilkaarOppfyltForm from './foreldreansvar/ErForeldreansvar2LeddVilkaarOppfyltForm';
import ErForeldreansvar4LeddVilkaarOppfyltForm from './foreldreansvar/ErForeldreansvar4LeddVilkaarOppfyltForm';
import SokersOpplysningspliktForm from './sokersOpplysningsplikt/SokersOpplysningspliktForm';
import SvangerskapVilkarForm from './svangerskap/SvangerskapVilkarForm';
import AdopsjonVilkarForm from './adopsjon/AdopsjonVilkarForm';
import OpptjeningVilkarForm from './opptjening/OpptjeningVilkarForm';
import VilkarresultatMedOverstyringForm from './VilkarresultatMedOverstyringForm';
import DataFetcherWithCache from '../../../DataFetcherWithCache';

const fodselData = [fpsakApi.BEHANDLING];

/*
 * VilkarPanels
 *
 * Presentasjonskomponent.
 */
export const VilkarPanels = ({
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
  alleKodeverk,
  fagsakInfo,
}) => (
  <ElementWrapper>
    {VilkarresultatMedOverstyringForm.supports(aksjonspunktCodes, behandlingspunkt)
      && <VilkarresultatMedOverstyringForm key={behandlingspunkt} submitCallback={submitCallback} />}
    {SokersOpplysningspliktForm.supports(behandlingspunkt)
      && (
      <SokersOpplysningspliktForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
    {ErSoknadsfristVilkaretOppfyltForm.supports(aksjonspunktCodes)
    && (
    <ErSoknadsfristVilkaretOppfyltForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
    />
    )}
    {ErOmsorgVilkaarOppfyltForm.supports(behandlingspunkt, aksjonspunktCodes)
      && <ErOmsorgVilkaarOppfyltForm submitCallback={submitCallback} readOnly={readOnly} readOnlySubmitButton={readOnlySubmitButton} />}
    {ErForeldreansvar2LeddVilkaarOppfyltForm.supports(behandlingspunkt, aksjonspunktCodes, vilkarTypeCodes)
      && (
      <ErForeldreansvar2LeddVilkaarOppfyltForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
    {ErForeldreansvar4LeddVilkaarOppfyltForm.supports(behandlingspunkt, aksjonspunktCodes, vilkarTypeCodes)
      && (
      <ErForeldreansvar4LeddVilkaarOppfyltForm
        submitCallback={submitCallback}
        behandlingspunkt={behandlingspunkt}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}

    {SvangerskapVilkarForm.supports(behandlingspunkt)
      && (
      <SvangerskapVilkarForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        isAksjonspunktOpen={isAksjonspunktOpen}
      />
      )}
    {(behandlingspunkt === behandlingspunktCodes.FOEDSEL
      && (aksjonspunktCodes.includes(AksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN)
      || aksjonspunktCodes.includes(AksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN))) && (
      <DataFetcherWithCache
        behandlingVersjon={1}
        data={fodselData}
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
    )}
    {AdopsjonVilkarForm.supports(behandlingspunkt, aksjonspunktCodes)
      && (
      <AdopsjonVilkarForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        isAksjonspunktOpen={isAksjonspunktOpen}
      />
      )}
    {OpptjeningVilkarForm.supports(behandlingspunkt)
      && (
      <OpptjeningVilkarForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        isAksjonspunktOpen={isAksjonspunktOpen}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
  </ElementWrapper>
);

VilkarPanels.propTypes = {
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
};

const mapStateToProps = (state) => ({
  vilkarTypeCodes: behandlingSelectors.getBehandlingVilkarCodes(state),
  behandlingspunktStatus: behandlingsprosessSelectors.getSelectedBehandlingspunktStatus(state),
  behandlingspunktVilkar: behandlingsprosessSelectors.getSelectedBehandlingspunktVilkar(state),
});

export default connect(mapStateToProps)(VilkarPanels);
