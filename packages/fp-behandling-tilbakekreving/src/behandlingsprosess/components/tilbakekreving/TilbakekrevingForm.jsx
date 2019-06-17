import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { createSelector } from 'reselect';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { FaktaGruppe, BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  FadingPanel, VerticalSpacer, AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { omit } from '@fpsak-frontend/utils';

import foreldelseVurderingType from 'behandlingTilbakekreving/src/kodeverk/foreldelseVurderingType';
import tilbakekrevingKodeverkTyper from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingKodeverkTyper';
import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting, getBehandlingFormValues,
} from 'behandlingTilbakekreving/src/behandlingForm';
import {
  getBehandlingVersjon, getBehandlingVilkarsvurderingsperioder, getBehandlingVilkarsvurderingsRettsgebyr, getBehandlingVilkarsvurdering,
  getMerknaderFraBeslutter, getForeldelsePerioder,
} from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId, getFagsakPerson, getTilbakekrevingKodeverk } from 'behandlingTilbakekreving/src/duckTilbake';
import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import TilbakekrevingTimelinePanel from '../felles/timelineV2/TilbakekrevingTimelinePanel';
import TilbakekrevingPeriodeForm, { TILBAKEKREVING_PERIODE_FORM_NAME } from './TilbakekrevingPeriodeForm';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';

const TILBAKEKREVING_FORM_NAME = 'TilbakekrevingForm';

const tilbakekrevingAksjonspunkter = [tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING];

const sortPeriods = (periode1, periode2) => new Date(periode1.fom) - new Date(periode2.fom);

const harApentAksjonspunkt = periode => (!periode.erForeldet && (periode.begrunnelse === undefined || periode.erSplittet));

const emptyFeltverdiOmFinnes = (periode) => {
  const valgtVilkarResultatType = periode[periode.valgtVilkarResultatType];
  const handletUaktsomhetGrad = valgtVilkarResultatType[valgtVilkarResultatType.handletUaktsomhetGrad];

  if (valgtVilkarResultatType.tilbakekrevdBelop) {
    return {
      ...periode,
      [periode.valgtVilkarResultatType]: {
        ...omit(valgtVilkarResultatType, 'tilbakekrevdBelop'),
      },
    };
  }
  if (handletUaktsomhetGrad && handletUaktsomhetGrad.belopSomSkalTilbakekreves) {
    return {
      ...periode,
      [periode.valgtVilkarResultatType]: {
        ...valgtVilkarResultatType,
        [valgtVilkarResultatType.handletUaktsomhetGrad]: {
          ...omit(handletUaktsomhetGrad, 'belopSomSkalTilbakekreves'),
        },
      },
    };
  }
  return periode;
};

const formaterPerioderForTidslinje = (perioder = [], vilkarsVurdertePerioder) => perioder
    .map((periode, index) => {
      const erBelopetIBehold = periode.vilkarResultatInfo
      ? periode.vilkarResultatInfo.erBelopetIBehold : undefined;
      const per = vilkarsVurdertePerioder.find(p => p.fom === periode.fom && p.tom === periode.tom);
      const erSplittet = per ? !!per.erSplittet : false;
      return {
        fom: periode.fom,
        tom: periode.tom,
        isAksjonspunktOpen: !periode.erForeldet && (per.begrunnelse === undefined || erSplittet),
        isGodkjent: !(periode.erForeldet || erBelopetIBehold === false),
        id: index,
      };
    });

/**
 * TilbakekrevingForm
 *
 * Behandlingspunkt Tilbakekreving. Setter opp en tidslinje som lar en velge periode. Ved valg blir et detaljevindu vist.
 */
export class TilbakekrevingFormImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valgtPeriode: null,
    };
  }

  componentDidMount() {
    const { vilkarsVurdertePerioder } = this.props;
    if (vilkarsVurdertePerioder) {
      this.setPeriode(vilkarsVurdertePerioder.find(harApentAksjonspunkt));
    }
  }

  componentDidUpdate(prevProps) {
    const { vilkarsVurdertePerioder } = this.props;
    if (!prevProps.vilkarsVurdertePerioder && vilkarsVurdertePerioder) {
      const test = vilkarsVurdertePerioder.find(harApentAksjonspunkt);
      this.setPeriode(test);
    }
  }

  setPeriode = (periode) => {
    const { vilkarsVurdertePerioder } = this.props;
    const valgt = periode ? vilkarsVurdertePerioder.find(p => p.fom === periode.fom && p.tom === periode.tom) : undefined;
    this.setState(state => ({ ...state, valgtPeriode: valgt }));
    this.initializeValgtPeriodeForm(valgt);
  }

  togglePeriode = () => {
    const { vilkarsVurdertePerioder } = this.props;
    const { valgtPeriode } = this.state;
    const periode = valgtPeriode ? undefined : vilkarsVurdertePerioder[0];
    this.setPeriode(periode);
  }

  setNestePeriode = () => {
    const { vilkarsVurdertePerioder } = this.props;
    const { valgtPeriode } = this.state;
    const index = vilkarsVurdertePerioder.findIndex(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    this.setPeriode(vilkarsVurdertePerioder[index + 1]);
  }

  setForrigePeriode = () => {
    const { vilkarsVurdertePerioder } = this.props;
    const { valgtPeriode } = this.state;
    const index = vilkarsVurdertePerioder.findIndex(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    this.setPeriode(vilkarsVurdertePerioder[index - 1]);
  }

  oppdaterPeriode = (values) => {
    const {
     vilkarsVurdertePerioder, reduxFormChange: formChange, behandlingFormPrefix,
    } = this.props;
    const { ...verdier } = omit(values, 'erSplittet');

    const otherThanUpdated = vilkarsVurdertePerioder.filter(o => o.fom !== verdier.fom && o.tom !== verdier.tom);
    const sortedActivities = otherThanUpdated.concat(verdier).sort(sortPeriods);
    formChange(`${behandlingFormPrefix}.${TILBAKEKREVING_FORM_NAME}`, 'vilkarsVurdertePerioder', sortedActivities);
    this.togglePeriode();

    const periodeMedApenAksjonspunkt = sortedActivities.find(harApentAksjonspunkt);
    if (periodeMedApenAksjonspunkt) {
      this.setPeriode(periodeMedApenAksjonspunkt);
    }
  }

  initializeValgtPeriodeForm = (valgtPeriode) => {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix } = this.props;
    formInitialize(`${behandlingFormPrefix}.${TILBAKEKREVING_PERIODE_FORM_NAME}`, valgtPeriode);
  }

  oppdaterSplittedePerioder = (perioder) => {
    const {
      vilkarsVurdertePerioder, reduxFormChange: formChange, behandlingFormPrefix,
    } = this.props;
    const { valgtPeriode } = this.state;

    const periode = vilkarsVurdertePerioder.find(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    const nyePerioder = perioder.map(p => ({
      ...emptyFeltverdiOmFinnes(periode),
      ...p,
      erSplittet: true,
    }));

    const otherThanUpdated = vilkarsVurdertePerioder.filter(o => o.fom !== valgtPeriode.fom && o.tom !== valgtPeriode.tom);
    const sortedActivities = otherThanUpdated.concat(nyePerioder).sort(sortPeriods);

    this.togglePeriode();
    formChange(`${behandlingFormPrefix}.${TILBAKEKREVING_FORM_NAME}`, 'vilkarsVurdertePerioder', sortedActivities);
    this.setPeriode(nyePerioder[0]);
  }

  render() {
    const {
      behandlingFormPrefix,
      readOnly,
      readOnlySubmitButton,
      antallPerioderMedAksjonspunkt,
      merknaderFraBeslutter,
      vilkarsVurdertePerioder,
      dataForDetailForm,
      kjonn,
      ...formProps
    } = this.props;
    const {
      valgtPeriode,
    } = this.state;

    const perioderFormatertForTidslinje = formaterPerioderForTidslinje(dataForDetailForm, vilkarsVurdertePerioder);
    const isApOpen = perioderFormatertForTidslinje.some(harApentAksjonspunkt);
    const valgtPeriodeFormatertForTidslinje = valgtPeriode
      ? perioderFormatertForTidslinje.find(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom)
      : undefined;

    return (
      <form onSubmit={formProps.handleSubmit}>
        <FadingPanel>
          <FaktaGruppe
            aksjonspunktCode={tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING}
            merknaderFraBeslutter={merknaderFraBeslutter}
            withoutBorder
          >
            <Undertittel>
              <FormattedMessage id="Behandlingspunkt.Tilbakekreving" />
            </Undertittel>
            <VerticalSpacer twentyPx />
            <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
              {[<FormattedMessage key="AksjonspunktHjelpetekst" id="TilbakekrevingForm.AksjonspunktHjelpetekst" />] }
            </AksjonspunktHelpText>
            <VerticalSpacer twentyPx />
            {vilkarsVurdertePerioder && (
              <>
                <TilbakekrevingTimelinePanel
                  perioder={perioderFormatertForTidslinje}
                  valgtPeriode={valgtPeriodeFormatertForTidslinje}
                  setPeriode={this.setPeriode}
                  toggleDetaljevindu={this.togglePeriode}
                  hjelpetekstKomponent={TilbakekrevingTidslinjeHjelpetekster}
                  kjonn={kjonn}
                />
                {valgtPeriode && (
                  <TilbakekrevingPeriodeForm
                    key={valgtPeriodeFormatertForTidslinje.id}
                    periode={valgtPeriode}
                    data={dataForDetailForm.find(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom)}
                    behandlingFormPrefix={behandlingFormPrefix}
                    antallPerioderMedAksjonspunkt={antallPerioderMedAksjonspunkt}
                    readOnly={readOnly}
                    setNestePeriode={this.setNestePeriode}
                    setForrigePeriode={this.setForrigePeriode}
                    skjulPeriode={this.togglePeriode}
                    oppdaterPeriode={this.oppdaterPeriode}
                    oppdaterSplittedePerioder={this.oppdaterSplittedePerioder}
                  />
                )}
              </>
            )}
            <VerticalSpacer twentyPx />
            {formProps.error && (
              <>
                <AlertStripe type="feil">
                  <FormattedMessage id={formProps.error} />
                </AlertStripe>
                <VerticalSpacer twentyPx />
              </>
            )}
            <BehandlingspunktSubmitButton
              formName={TILBAKEKREVING_FORM_NAME}
              isReadOnly={readOnly}
              isDirty={(isApOpen && valgtPeriode) || formProps.error ? false : undefined}
              isSubmittable={!isApOpen && !valgtPeriode && !readOnlySubmitButton && !formProps.error}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
          </FaktaGruppe>
        </FadingPanel>
      </form>
    );
  }
}

TilbakekrevingFormImpl.propTypes = {
  vilkarsVurdertePerioder: PropTypes.arrayOf(PropTypes.shape()),
  dataForDetailForm: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  kjonn: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  antallPerioderMedAksjonspunkt: PropTypes.number.isRequired,
  merknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool.isRequired,
  }).isRequired,
};

export const transformValues = (values, sarligGrunnTyper) => [{
  kode: tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING,
  vilkarsVurdertePerioder: values.vilkarsVurdertePerioder
    .filter(p => !p.erForeldet)
    .map(p => TilbakekrevingPeriodeForm.transformValues(p, sarligGrunnTyper)),
}];

const finnOriginalPeriode = (lagretPeriode, perioder) => perioder
  .find(periode => !moment(lagretPeriode.fom).isBefore(moment(periode.fom)) && !moment(lagretPeriode.tom).isAfter(moment(periode.tom)));

const erIkkeLagret = (periode, lagredePerioder) => lagredePerioder
  .every((lagretPeriode) => {
    const isOverlapping = moment(periode.fom).isSameOrBefore(moment(lagretPeriode.tom)) && moment(lagretPeriode.fom).isSameOrBefore(moment(periode.tom));
    return !isOverlapping;
  });


export const slaSammenOriginaleOgLagredePeriode = createSelector([getBehandlingVilkarsvurderingsperioder, getBehandlingVilkarsvurdering,
  getBehandlingVilkarsvurderingsRettsgebyr], (perioder, vilkarsvurdering, rettsgebyr) => {
  const totalbelop = perioder.reduce((acc, periode) => acc + periode.feilutbetaling, 0);
  const erTotalBelopUnder4Rettsgebyr = totalbelop < (rettsgebyr * 4);
  const lagredeVilkarsvurdertePerioder = vilkarsvurdering.vilkarsVurdertePerioder;

  const lagredePerioder = lagredeVilkarsvurdertePerioder
    .map(lagretPeriode => ({
      ...finnOriginalPeriode(lagretPeriode, perioder),
      ...omit(lagretPeriode, 'feilutbetalingBelop'),
      feilutbetaling: lagretPeriode.feilutbetalingBelop,
      erTotalBelopUnder4Rettsgebyr,
    }));

  const originaleUrortePerioder = perioder
    .filter(periode => erIkkeLagret(periode, lagredePerioder))
    .map(periode => ({
      ...periode,
      erTotalBelopUnder4Rettsgebyr,
    }));

  return {
    perioder: originaleUrortePerioder.concat(lagredePerioder),
  };
});

export const buildInitialValues = createSelector([slaSammenOriginaleOgLagredePeriode, getForeldelsePerioder],
  (perioder, foreldelsePerioder) => ({
    vilkarsVurdertePerioder: perioder.perioder.map(p => ({
      ...TilbakekrevingPeriodeForm.buildInitialValues(p, foreldelsePerioder),
      fom: p.fom,
      tom: p.tom,
    })).sort(sortPeriods),
  }));

const settOppPeriodeDataForDetailForm = createSelector([slaSammenOriginaleOgLagredePeriode,
  state => behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')], (perioder, perioderFormState) => {
    if (!perioder || !perioderFormState) {
      return undefined;
    }

    return perioderFormState.map((periodeFormState) => {
      const periode = finnOriginalPeriode(periodeFormState, perioder.perioder);
      const erForeldet = periode.foreldelseVurderingType
        ? periode.foreldelseVurderingType.kode === foreldelseVurderingType.FORELDET : periode.foreldet;
      return {
        redusertBeloper: periode.redusertBeloper,
        ytelser: periode.ytelser,
        feilutbetaling: periodeFormState.feilutbetaling ? periodeFormState.feilutbetaling : periode.feilutbetaling,
        erTotalBelopUnder4Rettsgebyr: periode.erTotalBelopUnder4Rettsgebyr,
        fom: periodeFormState.fom,
        tom: periodeFormState.tom,
        årsak: periode.årsak,
        begrunnelse: periode.begrunnelse,
        erForeldet,
      };
    });
});

const getAntallPerioderMedAksjonspunkt = createSelector([state => behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')],
  (perioder = []) => perioder.reduce((sum, periode) => (!periode.erForeldet ? sum + 1 : sum), 0));

const mapStateToPropsFactory = (initialState, ownProps) => {
  const sarligGrunnTyper = getTilbakekrevingKodeverk(tilbakekrevingKodeverkTyper.SARLIG_GRUNN)(initialState);
  const submitCallback = values => ownProps.submitCallback(transformValues(values, sarligGrunnTyper));
  return (state) => {
    const periodFormValues = getBehandlingFormValues(TILBAKEKREVING_PERIODE_FORM_NAME)(state) || {};
    return {
      initialValues: buildInitialValues(state),
      dataForDetailForm: settOppPeriodeDataForDetailForm(state),
      vilkarsVurdertePerioder: behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder'),
      behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
      kjonn: getFagsakPerson(state).erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
      readOnly: ownProps.readOnly || periodFormValues.erForeldet === true,
      antallPerioderMedAksjonspunkt: getAntallPerioderMedAksjonspunkt(state),
      merknaderFraBeslutter: getMerknaderFraBeslutter(tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING)(state),
      onSubmit: submitCallback,
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const validateForm = (values) => {
  const errors = {};
  const perioder = values.vilkarsVurdertePerioder;
  const antallPerioderMedAksjonspunkt = perioder.reduce((sum, periode) => (!periode.erForeldet ? sum + 1 : sum), 0);
  if (antallPerioderMedAksjonspunkt < 2) {
    return errors;
  }

  const antallValgt = perioder.reduce((sum, periode) => {
    const { valgtVilkarResultatType } = periode;
    const vilkarResultatInfo = periode[valgtVilkarResultatType];
    const { handletUaktsomhetGrad } = vilkarResultatInfo;
    const info = vilkarResultatInfo[handletUaktsomhetGrad];
    if (info) {
      return info.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false ? sum + 1 : sum;
    }
    return sum;
  }, 0);
  if (antallValgt > 0 && antallValgt !== perioder.length) {
    // eslint-disable-next-line no-underscore-dangle
    errors._error = 'TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr';
  }
  return errors;
};

const TilbakekrevingForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: TILBAKEKREVING_FORM_NAME,
  validate: validateForm,
})(TilbakekrevingFormImpl)));

TilbakekrevingForm.supports = (bp, apCodes) => bp === behandlingspunktCodes.TILBAKEKREVING || tilbakekrevingAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingForm;
