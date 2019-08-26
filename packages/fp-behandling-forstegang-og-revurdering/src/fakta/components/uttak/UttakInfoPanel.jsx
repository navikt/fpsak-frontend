import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { getBehandlingIsManuellRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import AnnenForelderHarRettForm from './AnnenForelderHarRettForm';
import UttakFaktaForm from './UttakFaktaForm';

const uttakAksjonspunkter = [
  aksjonspunktCodes.AVKLAR_UTTAK,
  aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO,
  aksjonspunktCodes.ANNEN_FORELDER_IKKE_RETT_OG_LØPENDE_VEDTAK,
  aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT,
  aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK,
  aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK,
];

export const UttakInfoPanelImpl = ({
  intl,
  toggleInfoPanelCallback,
  openInfoPanels,
  readOnly,
  hasOpenAksjonspunkter,
  aksjonspunkter,
  isRevurdering,
  hasStatusUtredes,
  behandlingPaaVent,
  submitCallback,
}) => {
  const avklarAnnenForelderRettAp = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT);
  const uttakAp = aksjonspunkter.filter(ap => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT);
  const uttakApOpen = uttakAp.some(ap => isAksjonspunktOpen(ap.status.kode));
  const overrideReadOnly = readOnly || (!uttakAp.length && !uttakAp.some(ap => ap.kanLoses));

  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'UttakInfoPanel.FaktaUttak' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.UTTAK)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.UTTAK}
      readOnly={readOnly}
      disabledTextCode="UttakInfoPanel.Uttak"
    >
      {avklarAnnenForelderRettAp
      && (
        <React.Fragment>
          <AnnenForelderHarRettForm
            hasOpenAksjonspunkter={isAksjonspunktOpen(avklarAnnenForelderRettAp.status.kode)}
            hasOpenUttakAksjonspunkter={uttakApOpen}
            readOnly={readOnly}
            toggleInfoPanelCallback={toggleInfoPanelCallback}
            aksjonspunkter={[avklarAnnenForelderRettAp]}
            submitCallback={submitCallback}
          />
          <VerticalSpacer twentyPx />
        </React.Fragment>
      )
      }

      {(!avklarAnnenForelderRettAp || !isAksjonspunktOpen(avklarAnnenForelderRettAp.status.kode))
      && (
      <UttakFaktaForm
        hasOpenAksjonspunkter={uttakApOpen}
        readOnly={overrideReadOnly && (!isRevurdering || !hasStatusUtredes || behandlingPaaVent)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        aksjonspunkter={uttakAp}
        submitCallback={submitCallback}
      />
      )
    }

    </FaktaEkspandertpanel>
  );
};

UttakInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitCallback: PropTypes.func.isRequired,
  isRevurdering: PropTypes.bool.isRequired,
  hasStatusUtredes: PropTypes.bool.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
};


const mapStateToProps = state => ({
  isRevurdering: getBehandlingIsManuellRevurdering(state),
  hasStatusUtredes: behandlingSelectors.hasBehandlingUtredesStatus(state),
  behandlingPaaVent: behandlingSelectors.getBehandlingIsOnHold(state) || false,
});

const ConnectedComponent = injectIntl(UttakInfoPanelImpl);

const UttakInfoPanel = withDefaultToggling(faktaPanelCodes.UTTAK, uttakAksjonspunkter)(ConnectedComponent);

UttakInfoPanel.supports = (personopplysninger, ytelsesType, ytelsefordeling = {}) => personopplysninger !== null
    && personopplysninger !== undefined
    && ytelsesType.kode === fagsakYtelseType.FORELDREPENGER
    && ytelsefordeling.endringsdato;

export default connect(mapStateToProps)(UttakInfoPanel);
