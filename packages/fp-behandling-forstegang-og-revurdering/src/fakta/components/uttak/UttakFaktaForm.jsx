import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { behandlingForm, getBehandlingFormPrefix } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import {
  getBehandlingVersjon,
  getUttakPerioder,
  getBehandlingYtelseFordeling,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { getSelectedBehandlingId } from 'behandlingForstegangOgRevurdering/src/duck';
import { guid, dateFormat } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import UttakPerioder from './UttakPerioder';
import {
  sjekkOmfaktaOmUttakAksjonspunkt,
  sjekkArbeidsprosentOver100,
  sjekkOverlappendePerioder,
  sjekkEndretFørsteUttaksdato,
} from './components/UttakPeriodeValidering';

export const UttakFaktaForm = ({
  readOnly,
  hasOpenAksjonspunkter,
  aksjonspunkter,
  hasRevurderingOvertyringAp,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <UttakPerioder
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      readOnly={readOnly}
      aksjonspunkter={aksjonspunkter}
      submitting={formProps.submitting}
      hasRevurderingOvertyringAp={hasRevurderingOvertyringAp}
    />
    {formProps.error
      && (
      <span>
        {formProps.error}
      </span>
      )}
  </form>

);

UttakFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hasRevurderingOvertyringAp: PropTypes.bool.isRequired,
};

const validateUttakForm = (values, originalPerioder, aksjonspunkter) => { // NOSONAR må ha disse sjekkene
  const errors = {};

  if (sjekkOmfaktaOmUttakAksjonspunkt(aksjonspunkter) || values.manuellOverstyring) {
    const originalStartDato = (originalPerioder[0] || []).fom;
    const nyStartDato = (values.perioder[0] || []).fom;
    const { førsteUttaksdato, endringsdato } = values;

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
      // todo, denne skal bort
      if (sjekkEndretFørsteUttaksdato(originalStartDato, nyStartDato, førsteUttaksdato, endringsdato)) {
        errors.perioder = {
          _error: <FormattedMessage
            id="UttakInfoPanel.OrginaleStartdatoKanIkkeEndres"
            values={{ originalStartDato: dateFormat(originalStartDato) }}
          />,
        };
      }
    }
  }

  return errors;
};

const buildInitialValues = createSelector(
  [getUttakPerioder, getBehandlingYtelseFordeling],
  (perioder, ytelseFordeling) => {
    if (perioder) {
      return {
        førsteUttaksdato: ytelseFordeling && ytelseFordeling.førsteUttaksdato ? ytelseFordeling.førsteUttaksdato : undefined,
        endringsdato: ytelseFordeling && ytelseFordeling.endringsdato ? ytelseFordeling.endringsdato : undefined,
        perioder: perioder.map(periode => ({
          ...periode,
          id: guid(),
          openForm: periode.bekreftet === false,
          updated: false,
          isFromSøknad: true,
        })),
      };
    }

    return undefined;
  },
);

const getOriginalPeriodeId = (origPeriode) => {
  if (origPeriode) {
    return origPeriode.id;
  }

  return null;
};

const manueltEllerOverstyring = (manuellOverstyring, erManuellOverstyrApErOpprettet) => (
  manuellOverstyring || erManuellOverstyrApErOpprettet ? aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK : aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK
);

export const transformValues = (values, initialValues, aksjonspunkter) => { // NOSONAR
  const overstyringAp = [aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK, aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK];
  const erManuellOverstyrApErOpprettet = aksjonspunkter
    .some(ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_FAKTA_UTTAK);
  const aksjonspunktUtenOverstyr = aksjonspunkter.filter(ap => !overstyringAp.includes(ap.definisjon.kode));

  const apCodes = aksjonspunktUtenOverstyr.length
    ? aksjonspunktUtenOverstyr.map(ap => ap.definisjon.kode)
    : [manueltEllerOverstyring(values.manuellOverstyring, erManuellOverstyrApErOpprettet)];
  return apCodes.map(ap => ({
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
    begrunnelse: '',
  }));
};

const mapStateToProps = (state, initialProps) => {
  const behandlingFormPrefix = getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state));
  const initialValues = buildInitialValues(state);

  const orginalePerioder = getUttakPerioder(state);
  const hasRevurderingOvertyringAp = !!initialProps.aksjonspunkter.includes(
    ap => ap.definisjon.kode === aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK,
  );
  return {
    initialValues,
    behandlingFormPrefix,
    hasRevurderingOvertyringAp,
    validate: values => validateUttakForm(values, orginalePerioder, initialProps.aksjonspunkter),
    onSubmit: values => initialProps.submitCallback(transformValues(values, initialValues, initialProps.aksjonspunkter)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'UttakFaktaForm',
  enableReinitialize: true,
})(UttakFaktaForm));
