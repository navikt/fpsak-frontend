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
import { omit, isObjectEmpty } from '@fpsak-frontend/utils';

import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting, getBehandlingFormValues,
} from 'behandlingTilbakekreving/src/behandlingForm';
import {
  getBehandlingVersjon, getBehandlingVilkarsvurderingsperioder, getBehandlingVilkarsvurderingsRettsgebyr, getBehandlingVilkarsvurdering,
  getMerknaderFraBeslutter,
} from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId, getFagsakPerson } from 'behandlingTilbakekreving/src/duckTilbake';
import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import TilbakekrevingTimelinePanel from '../felles/timelineV2/TilbakekrevingTimelinePanel';
import TilbakekrevingPeriodeForm, { TILBAKEKREVING_PERIODE_FORM_NAME } from './TilbakekrevingPeriodeForm';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';

const TILBAKEKREVING_FORM_NAME = 'TilbakekrevingForm';

const tilbakekrevingAksjonspunkter = [tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING];

const sortPeriods = (periode1, periode2) => new Date(periode1.fom) - new Date(periode2.fom);

export class TilbakekrevingFormImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valgtPeriode: null,
    };
  }

  setPeriode = (periode) => {
    this.setState(state => ({ ...state, valgtPeriode: periode }));
  }

  togglePeriode = () => {
    const {
      tidsserieForTimeline,
    } = this.props;
    const {
      valgtPeriode,
    } = this.state;
    const periode = valgtPeriode ? undefined : tidsserieForTimeline[0];
    this.setState(state => ({ ...state, valgtPeriode: periode }));
  }

  setNestePeriode = () => {
    const {
      tidsserieForTimeline,
    } = this.props;
    const {
      valgtPeriode,
    } = this.state;
    const index = tidsserieForTimeline.findIndex(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    this.setState(state => ({ ...state, valgtPeriode: tidsserieForTimeline[index + 1] }));
  }

  setForrigePeriode = () => {
    const {
      tidsserieForTimeline,
    } = this.props;
    const {
      valgtPeriode,
    } = this.state;
    const index = tidsserieForTimeline.findIndex(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    this.setState(state => ({ ...state, valgtPeriode: tidsserieForTimeline[index - 1] }));
  }

  oppdaterPeriode = (values) => {
    const { vilkarsVurdertePerioder, reduxFormChange: formChange, behandlingFormPrefix } = this.props;
    const { ...verdier } = values;

    const otherThanUpdated = vilkarsVurdertePerioder.filter(o => o.fom !== verdier.fom && o.tom !== verdier.tom);
    const sortedActivities = otherThanUpdated.concat(verdier).sort(sortPeriods);
    formChange(`${behandlingFormPrefix}.${TILBAKEKREVING_FORM_NAME}`, 'vilkarsVurdertePerioder', sortedActivities);
    this.togglePeriode();
  }

  oppdaterPerioder = (perioder) => {
    const {
      vilkarsVurdertePerioder, reduxFormChange: formChange, behandlingFormPrefix, tidsserieForTimeline,
    } = this.props;
    const { valgtPeriode } = this.state;

    const periode = vilkarsVurdertePerioder.find(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    const nyePerioder = perioder.map(p => ({
      ...periode,
      ...p,
    }));


    const otherThanUpdated = vilkarsVurdertePerioder.filter(o => o.fom !== valgtPeriode.fom && o.tom !== valgtPeriode.tom);
    const sortedActivities = otherThanUpdated.concat(nyePerioder).sort(sortPeriods);

    this.togglePeriode();
    formChange(`${behandlingFormPrefix}.${TILBAKEKREVING_FORM_NAME}`, 'vilkarsVurdertePerioder', sortedActivities);

    this.setPeriode({
      ...tidsserieForTimeline.find(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom),
      ...perioder[0],
    });
  }

  render() {
    const {
      perioderFormatertForDetailForm,
      tidsserieForTimeline,
      behandlingFormPrefix,
      isApOpen,
      readOnly,
      readOnlySubmitButton,
      antallPerioderMedAksjonspunkt,
      isDetailFormOpen,
      merknaderFraBeslutter,
      kjonn,
      ...formProps
    } = this.props;
    const {
      valgtPeriode,
    } = this.state;
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
            {perioderFormatertForDetailForm && (
            <>
              <TilbakekrevingTimelinePanel
                perioder={tidsserieForTimeline}
                valgtPeriode={valgtPeriode}
                setPeriode={this.setPeriode}
                toggleDetaljevindu={this.togglePeriode}
                hjelpetekstKomponent={TilbakekrevingTidslinjeHjelpetekster}
                kjonn={kjonn}
              />
              {valgtPeriode && (
                <TilbakekrevingPeriodeForm
                  period={perioderFormatertForDetailForm.find(p => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom)}
                  behandlingFormPrefix={behandlingFormPrefix}
                  antallPerioderMedAksjonspunkt={antallPerioderMedAksjonspunkt}
                  formName={TILBAKEKREVING_FORM_NAME}
                  readOnly={readOnly}
                  setNestePeriode={this.setNestePeriode}
                  setForrigePeriode={this.setForrigePeriode}
                  skjulPeriode={this.togglePeriode}
                  oppdaterPeriode={this.oppdaterPeriode}
                  oppdaterSplittedePerioder={this.oppdaterPerioder}
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
              isSubmittable={!readOnlySubmitButton && !isDetailFormOpen}
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
  perioderFormatertForDetailForm: PropTypes.arrayOf(PropTypes.shape()),
  vilkarsVurdertePerioder: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  kjonn: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  isDetailFormOpen: PropTypes.bool.isRequired,
  antallPerioderMedAksjonspunkt: PropTypes.number.isRequired,
  merknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool.isRequired,
  }).isRequired,
  tidsserieForTimeline: PropTypes.arrayOf(PropTypes.shape()),
};

TilbakekrevingFormImpl.defaultProps = {
  perioderFormatertForDetailForm: undefined,
  tidsserieForTimeline: undefined,
};

export const transformValues = values => [{
  kode: tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING,
  vilkarsVurdertePerioder: values.vilkarsVurdertePerioder
    .map(periode => ({
      ...periode.storedData,
      fom: periode.fom,
      tom: periode.tom,
    }))
    .filter(storedData => !isObjectEmpty(omit(storedData, 'fom', 'tom'))),
}];

const finnOriginalPeriode = (lagretPeriode, perioder) => perioder
  .find(periode => !moment(lagretPeriode.fom).isBefore(moment(periode.fom)) && !moment(lagretPeriode.tom).isAfter(moment(periode.tom)));

const erIkkeLagret = (periode, lagredePerioder) => lagredePerioder
  .every((lagretPeriode) => {
    const isOverlapping = moment(periode.fom).isSameOrBefore(moment(lagretPeriode.tom)) && moment(lagretPeriode.fom).isSameOrBefore(moment(periode.tom));
    return !isOverlapping;
  });

export const buildInitialValues = createSelector([getBehandlingVilkarsvurderingsperioder, getBehandlingVilkarsvurdering,
  getBehandlingVilkarsvurderingsRettsgebyr], (perioder, vilkarsvurdering, rettsgebyr) => {
  const totalbelop = perioder.reduce((acc, periode) => acc + periode.feilutbetaling, 0);
  const erTotalBelopUnder4Rettsgebyr = totalbelop < (rettsgebyr * 4);
  const lagredeVilkarsvurdertePerioder = vilkarsvurdering.vilkarsVurdertePerioder;

  const lagredePerioder = lagredeVilkarsvurdertePerioder
    .map(lagretPeriode => ({
      ...finnOriginalPeriode(lagretPeriode, perioder),
      fom: lagretPeriode.fom,
      tom: lagretPeriode.tom,
      storedData: lagretPeriode,
      erTotalBelopUnder4Rettsgebyr,
    }));

  const originaleUrortePerioder = perioder
    .filter(periode => erIkkeLagret(periode, lagredePerioder))
    .map(periode => ({
      ...periode,
      storedData: {},
      erTotalBelopUnder4Rettsgebyr,
    }));

  return {
    vilkarsVurdertePerioder: originaleUrortePerioder.concat(lagredePerioder),
  };
});

const settOppPeriodeDataForDetailForm = createSelector([state => behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')],
  (perioder) => {
    if (!perioder) {
      return undefined;
    }

    return perioder.map((periode) => {
      const erForeldet = periode.erForeldet !== undefined ? periode.erForeldet : periode.foreldet;
      return {
        storedData: periode.storedData,
        redusertBeloper: periode.redusertBeloper,
        ytelser: periode.ytelser,
        feilutbetaling: periode.feilutbetaling,
        erTotalBelopUnder4Rettsgebyr: periode.erTotalBelopUnder4Rettsgebyr,
        fom: periode.fom,
        tom: periode.tom,
        årsak: periode.årsak,
        begrunnelse: periode.begrunnelse,
        erForeldet,
      };
    });
});

const leggTidsserierTilTimeline = createSelector([state => behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')],
  (perioder) => {
    if (!perioder) {
      return undefined;
    }
    return perioder.map((periode, index) => {
    const erForeldet = periode.erForeldet !== undefined ? periode.erForeldet : periode.foreldet;
    const erBelopetIBehold = periode.storedData && periode.storedData.vilkarResultatInfo
    ? periode.storedData.vilkarResultatInfo.erBelopetIBehold : undefined;
    return {
      fom: periode.fom,
      tom: periode.tom,
      isAksjonspunktOpen: periode.storedData.begrunnelse === undefined,
      isGodkjent: !(erForeldet || erBelopetIBehold === false),
      id: index,
    };
  });
});

const getAntallPerioderMedAksjonspunkt = createSelector([state => behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')],
  (perioder = []) => perioder.reduce((sum, periode) => (periode.erForeldet ? sum + 1 : sum), 0));

const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = values => ownProps.submitCallback(transformValues(values));
  return (state) => {
    const periodFormValues = getBehandlingFormValues(TILBAKEKREVING_PERIODE_FORM_NAME)(state) || {};
    return {
      initialValues: buildInitialValues(state),
      kjonn: getFagsakPerson(state).erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
      perioderFormatertForDetailForm: settOppPeriodeDataForDetailForm(state),
      vilkarsVurdertePerioder: behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder'),
      tidsserieForTimeline: leggTidsserierTilTimeline(state),
      behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
      onSubmit: submitCallback,
      isDetailFormOpen: periodFormValues !== undefined && !isObjectEmpty(periodFormValues),
      readOnly: ownProps.readOnly || periodFormValues.erForeldet === true,
      antallPerioderMedAksjonspunkt: getAntallPerioderMedAksjonspunkt(state),
      merknaderFraBeslutter: getMerknaderFraBeslutter(tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING)(state),
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
  const antallPerioderMedAksjonspunkt = perioder.reduce((sum, periode) => (periode.erForeldet ? sum + 1 : sum), 0);
  if (antallPerioderMedAksjonspunkt < 2) {
    return errors;
  }

  const antallValgt = perioder.reduce((sum, periode) => {
    if (!periode.storedData) {
      return sum;
    }
    const { vilkarResultatInfo } = periode.storedData;
    const info = vilkarResultatInfo ? vilkarResultatInfo.aktsomhetInfo : undefined;
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
