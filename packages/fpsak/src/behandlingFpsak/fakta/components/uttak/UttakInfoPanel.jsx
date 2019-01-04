import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { behandlingForm } from 'behandlingFpsak/behandlingForm';
import FaktaEkspandertpanel from 'behandlingFelles/fakta/components/FaktaEkspandertpanel';
import withDefaultToggling from 'behandlingFpsak/fakta/withDefaultToggling';
import faktaPanelCodes from 'behandlingFpsak/fakta/faktaPanelCodes';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  getUttakPerioder,
  getAksjonspunkter,
  getBehandlingYtelseFordeling,
  getBehandlingIsManuellRevurdering,
  hasBehandlingUtredesStatus,
} from 'behandlingFpsak/behandlingSelectors';
import { guid, dateFormat } from '@fpsak-frontend/utils';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import UttakFaktaForm from './UttakFaktaForm';
import {
  sjekkOmfaktaOmUttakAksjonspunkt,
  sjekkArbeidsprosentOver100,
  sjekkOverlappendePerioder,
  sjekkEndretFørsteUttaksDato,
  sjekkNyFørsteUttakDatoStartErEtterSkjæringpunkt,
  sjekkNyFørsteUttakDatoStartErFørSkjæringpunkt,
} from './components/UttakPeriodeValidering';

const uttakAksjonspunkter = [
  aksjonspunktCodes.AVKLAR_UTTAK,
  aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO,
  aksjonspunktCodes.AVKLAR_ANNEN_PART_RETT,
];

const leggTilKlasseHvisAp = annenPartHarRettApOpen => (annenPartHarRettApOpen ? 'aksjonspunkt--5086' : undefined);

export const UttakInfoPanelImpl = ({
  intl,
  toggleInfoPanelCallback,
  openInfoPanels,
  readOnly,
  hasOpenAksjonspunkter,
  aksjonspunkter,
  isRevurdering,
  hasStatusUtredes,
  førsteUttaksDato,
  annenPartHarRettAp,
  annenPartHarRettApOpen,
  handleSubmit,
  ...formProps
}) => {
  const ekstraClass = leggTilKlasseHvisAp(annenPartHarRettApOpen);
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'UttakInfoPanel.FaktaUttak' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.UTTAK)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.UTTAK}
      readOnly={readOnly}
      disabledTextCode="UttakInfoPanel.Uttak"
      ekstraClass={ekstraClass}
    >
      <form onSubmit={handleSubmit}>
        <UttakFaktaForm
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          readOnly={readOnly && (!isRevurdering || !hasStatusUtredes)}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          aksjonspunkter={aksjonspunkter}
          førsteUttaksDato={førsteUttaksDato}
          annenPartHarRettAp={annenPartHarRettAp}
          annenPartHarRettApOpen={annenPartHarRettApOpen}
          submitting={formProps.submitting}
        />
        {formProps.error
      && (
      <span>
        {formProps.error}
      </span>
      )}
      </form>
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
  handleSubmit: PropTypes.func.isRequired,
  førsteUttaksDato: PropTypes.string,
  isRevurdering: PropTypes.bool.isRequired,
  hasStatusUtredes: PropTypes.bool.isRequired,
  annenPartHarRettAp: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  annenPartHarRettApOpen: PropTypes.bool.isRequired,
};

UttakInfoPanelImpl.defaultProps = {
  førsteUttaksDato: undefined,
};

const validateUttakForm = (values, originalPerioder, aksjonspunkter, førsteUttaksDato) => { // NOSONAR må ha disse sjekkene
  const errors = {};

  if (sjekkOmfaktaOmUttakAksjonspunkt(aksjonspunkter)) {
    const originalStartDato = (originalPerioder[0] || []).fom;
    const nyStartDato = (values.perioder[0] || []).fom;

    if (values.perioder.length === 0) {
      errors.perioder = {
        _error: <FormattedMessage id="UttakInfoPanel.IngenPerioder" />,
      };
    } else {
      values.perioder.forEach((periode, index) => {
        const forrigePeriode = values.perioder[index - 1];
        const nestePeriode = periode;

        if (sjekkArbeidsprosentOver100(periode)) {
          errors.perioder = {
            _error: <FormattedMessage id="UttakInfoPanel.ForHoyArbeidstidsprosent" />,
          };
        }

        if (sjekkOverlappendePerioder(index, nestePeriode, forrigePeriode)) {
          errors.perioder = {
            _error: <FormattedMessage id="UttakInfoPanel.OverlappendePerioder" />,
          };
        }
      });
      if (sjekkEndretFørsteUttaksDato(originalStartDato, nyStartDato, aksjonspunkter)) {
        errors.perioder = {
          _error: <FormattedMessage
            id="UttakInfoPanel.OrginaleStartdatoKanIkkeEndres"
            values={{ originalStartDato: dateFormat(originalStartDato) }}
          />,
        };
      }

      if (sjekkNyFørsteUttakDatoStartErEtterSkjæringpunkt(nyStartDato, førsteUttaksDato, aksjonspunkter)) {
        errors.perioder = {
          _error: <FormattedMessage
            id="UttakInfoPanel.manglerPeriodeEtterFørsteUttaksdag"
            values={{ førsteUttaksDato: dateFormat(førsteUttaksDato) }}
          />,
        };
      }
      if (sjekkNyFørsteUttakDatoStartErFørSkjæringpunkt(nyStartDato, førsteUttaksDato, aksjonspunkter)) {
        errors.perioder = {
          _error: <FormattedMessage
            id="UttakInfoPanel.periodeFørFørsteUttaksdag"
            values={{ førsteUttaksDato: dateFormat(førsteUttaksDato) }}
          />,
        };
      }
    }
  }

  return errors;
};

const buildInitialValues = createSelector([getUttakPerioder, getBehandlingYtelseFordeling, getAksjonspunkter],
  (perioder, ytelseFordeling, aksjonspunkter) => {
    const annenPartHarRett = !!(ytelseFordeling && (ytelseFordeling.annenforelderHarRettPerioder || []).length > 0);
    const { begrunnelse } = aksjonspunkter.filter(ap => ap.definisjon.kode
      === aksjonspunktCodes.AVKLAR_ANNEN_PART_RETT)[0] || [];
    if (perioder) {
      return ({
        annenPartHarRett,
        begrunnelse,
        perioder: perioder.map(periode => ({
          ...periode,
          id: guid(),
          openForm: periode.bekreftet === false,
          updated: false,
          isFromSøknad: true,
        })),
      });
    }

    return undefined;
  });

const getOriginalPeriodeId = (origPeriode) => {
  if (origPeriode) {
    return origPeriode.id;
  }

  return null;
};

const transformValues = (values, initialValues, aksjonspunkter) => { // NOSONAR
  const aktiveUttakAksjonspunkter = aksjonspunkter.filter(ap => uttakAksjonspunkter.includes(ap.definisjon.kode));
  const apCodes = aktiveUttakAksjonspunkter.length
    ? aktiveUttakAksjonspunkter.map(ap => ap.definisjon.kode)
    : [aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK];
  return apCodes.map((ap) => {
    const annenforelderHarRett = ap === aksjonspunktCodes.AVKLAR_ANNEN_PART_RETT ? values.annenPartHarRett : null;

    return ({
      kode: ap,
      bekreftedePerioder: values.perioder.map((periode) => {
        const {
          id, openForm, updated, kontoType, isFromSøknad, ...bekreftetPeriode // NOSONAR
        } = periode;
        const origPeriode = initialValues.perioder.filter(p => p.id === id);
        return {
          bekreftetPeriode,
          orginalFom: origPeriode[0] ? origPeriode[0].fom : null,
          orginalTom: origPeriode[0] ? origPeriode[0].tom : null,
          originalArbeidstidsprosent: origPeriode[0] ? origPeriode[0].arbeidstidsprosent : null,
          originalBegrunnelse: origPeriode[0] ? origPeriode[0].begrunnelse : null,
          originalResultat: origPeriode[0] ? origPeriode[0].resultat : null,
        };
      }),
      slettedePerioder: values.slettedePerioder
        ? values.slettedePerioder.map((periode) => {
          const { id, begrunnelse, ...slettetPeriode } = periode;
          const origPeriode = initialValues.perioder.filter(p => p.id === id);

          return {
            ...slettetPeriode,
            begrunnelse: id === getOriginalPeriodeId(origPeriode[0]) ? begrunnelse : null,
          };
        })
        : [],
      annenforelderHarRett,
      begrunnelse: values.begrunnelse || '',
    });
  });
};

const mapStateToProps = (state, initialProps) => {
  const ytelseFordeling = getBehandlingYtelseFordeling(state);
  const førsteUttaksDato = ytelseFordeling && ytelseFordeling.førsteUttaksDato ? ytelseFordeling.førsteUttaksDato : undefined;
  const initialValues = buildInitialValues(state);
  const isRevurdering = getBehandlingIsManuellRevurdering(state);
  const hasStatusUtredes = hasBehandlingUtredesStatus(state);
  const annenPartHarRettAp = initialProps.aksjonspunkter.filter(ap => ap.definisjon.kode
    === aksjonspunktCodes.AVKLAR_ANNEN_PART_RETT);
  const annenPartHarRettApOpen = (annenPartHarRettAp.filter(ap => isAksjonspunktOpen(ap.status.kode)) || []).length > 0;
  const perioder = getUttakPerioder(state);
  return {
    initialValues,
    førsteUttaksDato,
    isRevurdering,
    hasStatusUtredes,
    annenPartHarRettAp,
    annenPartHarRettApOpen,
    validate: values => validateUttakForm(values, perioder, initialProps.aksjonspunkter, førsteUttaksDato),
    onSubmit: values => initialProps.submitCallback(transformValues(values, initialValues, initialProps.aksjonspunkter)),
  };
};

const UttakInfoPanel = connect(mapStateToProps)(behandlingForm({
  form: 'UttakInfoPanel',
  enableReinitialize: true,
})(injectIntl(withDefaultToggling(faktaPanelCodes.UTTAK,
  [aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK, ...uttakAksjonspunkter])(UttakInfoPanelImpl))));

UttakInfoPanel.supports = (personopplysninger, ytelsesType) => personopplysninger !== null
    && personopplysninger !== undefined
    && ytelsesType.kode === fagsakYtelseType.FORELDREPENGER;

export default UttakInfoPanel;
