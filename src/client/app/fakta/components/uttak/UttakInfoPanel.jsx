import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { behandlingForm } from 'behandling/behandlingForm';
import { guid, dateFormat } from '@fpsak-frontend/utils';
import moment from 'moment';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import withDefaultToggling from 'fakta/withDefaultToggling';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/aksjonspunktCodes';
import {
  getUttakPerioder,
  getBehandlingYtelseFordeling,
  getBehandlingIsRevurdering,
} from 'behandling/behandlingSelectors';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import UttakFaktaForm from './UttakFaktaForm';

const uttakAksjonspunkter = [aksjonspunktCodes.AVKLAR_UTTAK, aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO];

export const UttakInfoPanelImpl = ({
  intl,
  toggleInfoPanelCallback,
  openInfoPanels,
  readOnly,
  hasOpenAksjonspunkter,
  aksjonspunkter,
  isRevurdering,
  endringsDato,
  handleSubmit,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'UttakInfoPanel.FaktaUttak' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.UTTAK)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.UTTAK}
    readOnly={readOnly}
    disabledTextCode="UttakInfoPanel.Uttak"
  >
    <form onSubmit={handleSubmit}>
      <UttakFaktaForm
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnly}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        aksjonspunkter={aksjonspunkter}
        endringsDato={endringsDato}
        isRevurdering={isRevurdering}
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

UttakInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  endringsDato: PropTypes.string,
  isRevurdering: PropTypes.bool.isRequired,
};

UttakInfoPanelImpl.defaultProps = {
  endringsDato: undefined,
};

const sjekkOmfaktaOmUttakAksjonspunkt = aksjonspunkter => aksjonspunkter.some(ap => uttakAksjonspunkter.includes(ap.definisjon.kode));

const sjekkArbeidsprosentOver100 = periode => periode.arbeidstidsprosent > 100;

const sjekkOverlappendePerioder = (index, nestePeriode, forrigePeriode) => index !== 0 && moment(nestePeriode.fom) < moment(forrigePeriode.tom);

const sjekkOmEndretFørsteUttaksDato = (originalStartDato, nyStartDato, aksjonspunkter) => moment(originalStartDato).diff(moment(nyStartDato)) !== 0
    && !aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO);

const sjekkOmNyFørsteUttakDatoStartErLikSkjæringpunkt = (nyStartDato, endringsDato, aksjonspunkter) => moment(nyStartDato) > (moment(endringsDato))
  && aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO);

const validateUttakForm = (values, originalPerioder, aksjonspunkter, endringsDato) => { // NOSONAR TODO legge validateuttakform i egen component
  const errors = {};

  if (sjekkOmfaktaOmUttakAksjonspunkt(aksjonspunkter)) {
    const originalStartDato = originalPerioder[0].fom;
    const nyStartDato = values.perioder[0].fom;

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
      if (sjekkOmEndretFørsteUttaksDato(originalStartDato, nyStartDato, aksjonspunkter)) {
        errors.perioder = {
          _error: <FormattedMessage
            id="UttakInfoPanel.OrginaleStartdatoKanIkkeEndres"
            values={{ originalStartDato: dateFormat(originalStartDato) }}
          />,
        };
      }

      if (sjekkOmNyFørsteUttakDatoStartErLikSkjæringpunkt(nyStartDato, endringsDato, aksjonspunkter)) {
        errors.perioder = {
          _error: <FormattedMessage
            id="UttakInfoPanel.manglerPeriodeEtterFørsteUttaksdag"
            values={{ endringsDato: dateFormat(endringsDato) }}
          />,
        };
      }
    }
  }

  return errors;
};

const buildInitialValues = createSelector([getUttakPerioder], (perioder) => {
  if (perioder) {
    return ({
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

const transformValues = (values, initialValues, aksjonspunkter) => {
  const apCodes = aksjonspunkter.filter(ap => uttakAksjonspunkter.includes(ap.definisjon.kode)).map(ap => ap.definisjon.kode);

  return apCodes.map(ap => ({
    kode: ap,
    bekreftedePerioder: values.perioder.map((periode) => {
      const {
        id, openForm, updated, kontoType, virksomhetNavn, isFromSøknad, ...bekreftetPeriode // NOSONAR
      } = periode;
      const origPeriode = initialValues.perioder.filter(p => p.id === id);

      return {
        bekreftetPeriode,
        orginalFom: origPeriode[0] ? origPeriode[0].fom : null,
        orginalTom: origPeriode[0] ? origPeriode[0].tom : null,
        originalArbeidstidsprosent: origPeriode[0] ? origPeriode[0].arbeidstidsprosent : null,
        originalBegrunnelse: origPeriode[0] ? origPeriode[0].begrunnelse : null,
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
  const initialValues = buildInitialValues(state);
  const ytelseFordeling = getBehandlingYtelseFordeling(state);
  const endringsDato = ytelseFordeling && ytelseFordeling.endringsDato ? ytelseFordeling.endringsDato : undefined;
  const isRevurdering = getBehandlingIsRevurdering(state);
  return {
    initialValues,
    endringsDato,
    isRevurdering,
    validate: values => validateUttakForm(values, getUttakPerioder(state), initialProps.aksjonspunkter, endringsDato),
    onSubmit: values => initialProps.submitCallback(transformValues(values, initialValues, initialProps.aksjonspunkter)),
  };
};

const UttakInfoPanel = connect(mapStateToProps)(behandlingForm({
  form: 'UttakInfoPanel',
  enableReinitialize: true,
})(injectIntl(withDefaultToggling(faktaPanelCodes.UTTAK, uttakAksjonspunkter)(UttakInfoPanelImpl))));

UttakInfoPanel.supports = (personopplysninger, ytelsesType) => personopplysninger !== null
    && personopplysninger !== undefined
    && ytelsesType.kode === fagsakYtelseType.FORELDREPENGER;

export default UttakInfoPanel;
