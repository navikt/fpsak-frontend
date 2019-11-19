import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes, { isVilkarForSykdomOppfylt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import behandlingTyper from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatuser from '@fpsak-frontend/kodeverk/src/behandlingStatus';
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

const getBehandlingArsakTyper = (behandlingArsaker) => {
  if (behandlingArsaker) {
    return behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType);
  }

  return undefined;
};

const getErManueltOpprettet = (behandlingArsaker = []) => behandlingArsaker.some((ba) => ba.manueltOpprettet === true);

const getErArsakTypeHendelseFodsel = (behandlingArsakTyper = []) => behandlingArsakTyper.some((bt) => bt.kode === 'RE-HENDELSE-FØDSEL');

const sortUttaksperioder = (p1, p2) => moment(p1.tom).diff(moment(p2.tom));

export const UttakInfoPanelImpl = ({
  intl,
  toggleInfoPanelCallback,
  openInfoPanels,
  readOnly,
  hasOpenAksjonspunkter,
  aksjonspunkter,
  behandlingPaaVent,
  behandlingType,
  behandlingArsaker,
  behandlingStatus,
  behandlingId,
  behandlingVersjon,
  ytelsefordeling,
  uttakPerioder,
  alleKodeverk,
  faktaArbeidsforhold,
  personopplysninger,
  familiehendelse,
  kanOverstyre,
  submitCallback,
}) => {
  const avklarAnnenForelderRettAp = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT);
  const uttakAp = aksjonspunkter.filter((ap) => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT);
  const vilkarForSykdomExists = aksjonspunkter.filter((ap) => isVilkarForSykdomOppfylt(ap)).length > 0;
  const uttakApOpen = uttakAp.some((ap) => isAksjonspunktOpen(ap.status.kode));
  const overrideReadOnly = readOnly || (!uttakAp.length && !uttakAp.some((ap) => ap.kanLoses));
  const behandlingArsakTyper = getBehandlingArsakTyper(behandlingArsaker);
  const behandlingIsRevurdering = behandlingType.kode === behandlingTyper.REVURDERING;
  const erManueltOpprettet = getErManueltOpprettet(behandlingArsaker);
  const erArsakTypeHendelseFodsel = getErArsakTypeHendelseFodsel(behandlingArsakTyper);
  const isRevurdering = behandlingIsRevurdering && (erManueltOpprettet || erArsakTypeHendelseFodsel);
  const behandlingUtredes = behandlingStatus.kode === behandlingStatuser.BEHANDLING_UTREDES;
  const sortedUttakPerioder = [...uttakPerioder.sort(sortUttaksperioder)];

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
        <>
          <AnnenForelderHarRettForm
            hasOpenAksjonspunkter={isAksjonspunktOpen(avklarAnnenForelderRettAp.status.kode)}
            hasOpenUttakAksjonspunkter={uttakApOpen}
            readOnly={readOnly}
            toggleInfoPanelCallback={toggleInfoPanelCallback}
            aksjonspunkter={[avklarAnnenForelderRettAp]}
            submitCallback={submitCallback}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            ytelsefordeling={ytelsefordeling}
          />
          <VerticalSpacer twentyPx />
        </>
      )}

      {(!avklarAnnenForelderRettAp || !isAksjonspunktOpen(avklarAnnenForelderRettAp.status.kode))
      && (
      <UttakFaktaForm
        hasOpenAksjonspunkter={uttakApOpen}
        readOnly={overrideReadOnly && (!isRevurdering || !behandlingUtredes || behandlingPaaVent)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        aksjonspunkter={uttakAp}
        submitCallback={submitCallback}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        behandlingStatus={behandlingStatus}
        ytelsefordeling={ytelsefordeling}
        uttakPerioder={sortedUttakPerioder}
        alleKodeverk={alleKodeverk}
        kanOverstyre={kanOverstyre}
        faktaArbeidsforhold={faktaArbeidsforhold}
        personopplysninger={personopplysninger}
        familiehendelse={familiehendelse}
        vilkarForSykdomExists={vilkarForSykdomExists}
      />
      )}

    </FaktaEkspandertpanel>
  );
};

UttakInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingType: PropTypes.shape().isRequired,
  behandlingArsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingStatus: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ytelsefordeling: PropTypes.shape().isRequired,
  uttakPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  faktaArbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  familiehendelse: PropTypes.shape().isRequired,
  behandlingPaaVent: PropTypes.bool,
};

UttakInfoPanelImpl.defaultProps = {
  behandlingPaaVent: false,
};

const UttakInfoPanel = withDefaultToggling(faktaPanelCodes.UTTAK, uttakAksjonspunkter)(injectIntl(UttakInfoPanelImpl));

export default UttakInfoPanel;
