import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT, omit } from '@fpsak-frontend/utils';
import { BehandlingspunktSubmitButton, FaktaGruppe } from '@fpsak-frontend/fp-behandling-felles';
import {
  AksjonspunktHelpText, FadingPanel, FlexColumn, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { behandlingspunktCodes, getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import foreldelseVurderingType from 'behandlingTilbakekreving/src/kodeverk/foreldelseVurderingType';
import {
  behandlingFormTilbakekreving,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from 'behandlingTilbakekreving/src/behandlingFormTilbakekreving';
import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getFagsakPerson, getSelectedBehandlingId } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import ForeldelsePeriodeForm, { FORELDELSE_PERIODE_FORM_NAME } from './ForeldelsePeriodeForm';
import TilbakekrevingTimelinePanel from '../felles/timeline/TilbakekrevingTimelinePanel';
import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';
import tilbakekrevingAksjonspunktCodes from '../../../kodeverk/tilbakekrevingAksjonspunktCodes';

import styles from './foreldelseForm.less';

const FORELDELSE_FORM_NAME = 'ForeldelseForm';
const foreldelseAksjonspunkter = [
  tilbakekrevingAksjonspunktCodes.VURDER_FORELDELSE,
];

const sortPeriods = (periode1, periode2) => new Date(periode1.fom) - new Date(periode2.fom);

const getDate = () => moment().subtract(30, 'months').format(DDMMYYYY_DATE_FORMAT);
const getApTekst = (apCode) => (apCode
  ? [<FormattedMessage id={`Foreldelse.AksjonspunktHelpText.${apCode}`} key="vurderForeldelse" values={{ dato: getDate() }} />]
  : []);

const harApentAksjonspunkt = (periode) => ((!periode.foreldelseVurderingType || periode.foreldelseVurderingType.kode === foreldelseVurderingType.UDEFINERT)
  && (periode.begrunnelse === undefined || periode.erSplittet));

const formaterPerioderForTidslinje = (perioder = []) => perioder
  .map((periode, index) => ({
    fom: periode.fom,
    tom: periode.tom,
    isAksjonspunktOpen: periode.foreldelseVurderingType.kode === foreldelseVurderingType.UDEFINERT,
    isGodkjent: foreldelseVurderingType.FORELDET !== periode.foreldet,
    id: index,
  }));

export class ForeldelseFormImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valgtPeriode: null,
    };
  }

  componentDidMount() {
    const { foreldelsesresultatActivity } = this.props;
    if (foreldelsesresultatActivity) {
      this.setPeriode(foreldelsesresultatActivity.find(harApentAksjonspunkt));
    }
  }

  componentDidUpdate(prevProps) {
    const { foreldelsesresultatActivity } = this.props;
    if (!prevProps.foreldelsesresultatActivity && foreldelsesresultatActivity) {
      this.setPeriode(foreldelsesresultatActivity.find(harApentAksjonspunkt));
    }
  }

  setPeriode = (periode) => {
    const { foreldelsesresultatActivity } = this.props;
    const valgt = periode ? foreldelsesresultatActivity.find((p) => p.fom === periode.fom && p.tom === periode.tom) : undefined;
    this.setState((state) => ({ ...state, valgtPeriode: valgt }));
    this.initializeValgtPeriodeForm(valgt);
  }

  togglePeriode = () => {
    const { foreldelsesresultatActivity } = this.props;
    const { valgtPeriode } = this.state;
    const periode = valgtPeriode ? undefined : foreldelsesresultatActivity[0];
    this.setPeriode(periode);
  }

  setNestePeriode = () => {
    const { foreldelsesresultatActivity } = this.props;
    const { valgtPeriode } = this.state;
    const index = foreldelsesresultatActivity.findIndex((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    this.setPeriode(foreldelsesresultatActivity[index + 1]);
  }

  setForrigePeriode = () => {
    const { foreldelsesresultatActivity } = this.props;
    const { valgtPeriode } = this.state;
    const index = foreldelsesresultatActivity.findIndex((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    this.setPeriode(foreldelsesresultatActivity[index - 1]);
  }

  oppdaterPeriode = (values) => {
    const {
      foreldelsesresultatActivity, reduxFormChange: formChange, behandlingFormPrefix,
    } = this.props;
    const { ...verdier } = omit(values, 'erSplittet');

    const otherThanUpdated = foreldelsesresultatActivity.filter((o) => o.fom !== verdier.fom && o.tom !== verdier.tom);
    const sortedActivities = otherThanUpdated.concat(verdier).sort(sortPeriods);
    formChange(`${behandlingFormPrefix}.${FORELDELSE_FORM_NAME}`, 'foreldelsesresultatActivity', sortedActivities);
    this.togglePeriode();

    const periodeMedApenAksjonspunkt = sortedActivities.find(harApentAksjonspunkt);
    if (periodeMedApenAksjonspunkt) {
      this.setPeriode(periodeMedApenAksjonspunkt);
    }
  }

  initializeValgtPeriodeForm = (valgtPeriode) => {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix } = this.props;
    formInitialize(`${behandlingFormPrefix}.${FORELDELSE_PERIODE_FORM_NAME}`, valgtPeriode);
  }

  oppdaterSplittedePerioder = (perioder) => {
    const {
      foreldelsesresultatActivity, reduxFormChange: formChange, behandlingFormPrefix,
    } = this.props;
    const { valgtPeriode } = this.state;

    const periode = foreldelsesresultatActivity.find((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom);
    const nyePerioder = perioder.map((p) => ({
      ...periode,
      ...p,
      erSplittet: true,
    }));

    const otherThanUpdated = foreldelsesresultatActivity.filter((o) => o.fom !== valgtPeriode.fom && o.tom !== valgtPeriode.tom);
    const sortedActivities = otherThanUpdated.concat(nyePerioder).sort(sortPeriods);

    this.togglePeriode();
    formChange(`${behandlingFormPrefix}.${FORELDELSE_FORM_NAME}`, 'foreldelsesresultatActivity', sortedActivities);
    this.setPeriode(nyePerioder[0]);
  }

  render() {
    const {
      foreldelsesresultatActivity,
      behandlingFormPrefix,
      kjonn,
      apCodes,
      readOnlySubmitButton,
      readOnly,
      merknaderFraBeslutter,
      ...formProps
    } = this.props;
    const {
      valgtPeriode,
    } = this.state;

    const perioderFormatertForTidslinje = formaterPerioderForTidslinje(foreldelsesresultatActivity);
    const isApOpen = perioderFormatertForTidslinje.some(harApentAksjonspunkt);
    const valgtPeriodeFormatertForTidslinje = valgtPeriode
      ? perioderFormatertForTidslinje.find((p) => p.fom === valgtPeriode.fom && p.tom === valgtPeriode.tom)
      : undefined;

    return (
      <form onSubmit={formProps.handleSubmit}>
        <FadingPanel>
          <FaktaGruppe
            aksjonspunktCode={tilbakekrevingAksjonspunktCodes.VURDER_FORELDELSE}
            merknaderFraBeslutter={merknaderFraBeslutter}
            withoutBorder
          >
            <Undertittel>
              <FormattedMessage id="Behandlingspunkt.Foreldelse" />
            </Undertittel>
            <VerticalSpacer twentyPx />
            {!apCodes[0] && (
              <div className={styles.bold}>
                <FlexRow>
                  <FlexColumn>
                    <FormattedMessage id="Foreldelse.Foreldelsesloven" />
                  </FlexColumn>
                </FlexRow>
                <VerticalSpacer eightPx />
                <FlexRow>
                  <FlexColumn>
                    <FormattedMessage id="Foreldelse.AutomatiskVurdert" />
                  </FlexColumn>
                </FlexRow>
              </div>
            )}
            {foreldelsesresultatActivity && apCodes[0] && (
              <>
                <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
                  { getApTekst(apCodes[0]) }
                </AksjonspunktHelpText>
                <VerticalSpacer twentyPx />
                <TilbakekrevingTimelinePanel
                  perioder={perioderFormatertForTidslinje}
                  valgtPeriode={valgtPeriodeFormatertForTidslinje}
                  setPeriode={this.setPeriode}
                  toggleDetaljevindu={this.togglePeriode}
                  hjelpetekstKomponent={<ForeldelseTidslinjeHjelpetekster />}
                  kjonn={kjonn}
                />
                {valgtPeriode && (
                  <ForeldelsePeriodeForm
                    periode={valgtPeriode}
                    behandlingFormPrefix={behandlingFormPrefix}
                    setNestePeriode={this.setNestePeriode}
                    setForrigePeriode={this.setForrigePeriode}
                    oppdaterPeriode={this.oppdaterPeriode}
                    oppdaterSplittedePerioder={this.oppdaterSplittedePerioder}
                    skjulPeriode={this.togglePeriode}
                    readOnly={readOnly}
                  />
                )}
                <VerticalSpacer twentyPx />
                <BehandlingspunktSubmitButton
                  formName={FORELDELSE_FORM_NAME}
                  isReadOnly={readOnly}
                  isDirty={(isApOpen && valgtPeriode) || formProps.error ? false : undefined}
                  isSubmittable={!isApOpen && !valgtPeriode && !readOnlySubmitButton && !formProps.error}
                  isBehandlingFormSubmitting={isBehandlingFormSubmitting}
                  isBehandlingFormDirty={isBehandlingFormDirty}
                  hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
                />
              </>
            )}
          </FaktaGruppe>
        </FadingPanel>
      </form>
    );
  }
}

ForeldelseFormImpl.propTypes = {
  foreldelsesresultatActivity: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  kjonn: PropTypes.string.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string),
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  merknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool.isRequired,
  }).isRequired,
};

ForeldelseFormImpl.defaultProps = {
  foreldelsesresultatActivity: undefined,
  apCodes: [],
};

export const transformValues = (values, apCode) => {
  const foreldelsePerioder = values.foreldelsesresultatActivity.map((period) => ({
    fraDato: period.fom,
    tilDato: period.tom,
    begrunnelse: period.begrunnelse,
    foreldelseVurderingType: period.foreldet,
  }));
  return [{
    foreldelsePerioder,
    kode: apCode,
  }];
};
export const buildInitialValues = (foreldelsePerioder) => ({
  foreldelsesresultatActivity: foreldelsePerioder.map((p) => ({
    ...p,
    feilutbetaling: p.belop,
    foreldet: p.foreldelseVurderingType.kode,
  })),
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = (values) => ownProps.submitCallback(transformValues(values, ownProps.apCodes[0]));
  return (state) => ({
    initialValues: buildInitialValues(behandlingSelectors.getForeldelsePerioder(state).perioder),
    foreldelsesresultatActivity: behandlingFormValueSelector(FORELDELSE_FORM_NAME)(state, 'foreldelsesresultatActivity'),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), behandlingSelectors.getBehandlingVersjon(state)),
    kjonn: getFagsakPerson(state).erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
    merknaderFraBeslutter: behandlingSelectors.getMerknaderFraBeslutter(tilbakekrevingAksjonspunktCodes.VURDER_FORELDELSE)(state),
    onSubmit: submitCallback,
  });
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const ForeldelseForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingFormTilbakekreving({
  form: FORELDELSE_FORM_NAME,
})(ForeldelseFormImpl)));

ForeldelseForm.supports = (bp, apCodes) => bp === behandlingspunktCodes.FORELDELSE || foreldelseAksjonspunkter.some((ap) => apCodes.includes(ap));

export default ForeldelseForm;
