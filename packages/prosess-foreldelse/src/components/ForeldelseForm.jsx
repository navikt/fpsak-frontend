import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT, omit } from '@fpsak-frontend/utils';
import {
  AksjonspunktHelpTextTemp, FadingPanel, FlexColumn, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, FaktaGruppe, BehandlingspunktSubmitButton,
  hasBehandlingFormErrorsOfType, isBehandlingFormDirty, isBehandlingFormSubmitting,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';

import ForeldelsePeriodeForm, { FORELDELSE_PERIODE_FORM_NAME } from './ForeldelsePeriodeForm';
import TilbakekrevingTimelinePanel from './timeline/TilbakekrevingTimelinePanel';
import ForeldelseTidslinjeHjelpetekster from './ForeldelseTidslinjeHjelpetekster';

import styles from './foreldelseForm.less';

const FORELDELSE_FORM_NAME = 'ForeldelseForm';

const sortPeriods = (periode1, periode2) => new Date(periode1.fom) - new Date(periode2.fom);

const getDate = () => moment().subtract(30, 'months').format(DDMMYYYY_DATE_FORMAT);
const getApTekst = (apCode) => (apCode
  ? [<FormattedMessage id={`ForeldelseForm.AksjonspunktHelpText.${apCode}`} key="vurderForeldelse" values={{ dato: getDate() }} />]
  : []);

const harApentAksjonspunkt = (periode) => ((!periode.foreldelseVurderingType || periode.foreldelseVurderingType.kode === foreldelseVurderingType.UDEFINERT)
  && (periode.begrunnelse === null || periode.begrunnelse === undefined || periode.erSplittet));

const formaterPerioderForTidslinje = (perioder = []) => perioder
  .map((periode, index) => ({
    fom: periode.fom,
    tom: periode.tom,
    isAksjonspunktOpen: harApentAksjonspunkt(periode),
    isGodkjent: foreldelseVurderingType.FORELDET !== periode.foreldet,
    id: index,
  }));

export class ForeldelseForm extends Component {
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
      navBrukerKjonn,
      apCodes,
      readOnlySubmitButton,
      readOnly,
      merknaderFraBeslutter,
      alleKodeverk,
      beregnBelop,
      behandlingId,
      behandlingVersjon,
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
            aksjonspunktCode={aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE}
            merknaderFraBeslutter={merknaderFraBeslutter}
            withoutBorder
          >
            <Undertittel>
              <FormattedMessage id="ForeldelseForm.Foreldelse" />
            </Undertittel>
            <VerticalSpacer twentyPx />
            {!apCodes[0] && (
              <div className={styles.bold}>
                <FlexRow>
                  <FlexColumn>
                    <FormattedMessage id="ForeldelseForm.Foreldelsesloven" />
                  </FlexColumn>
                </FlexRow>
                <VerticalSpacer eightPx />
                <FlexRow>
                  <FlexColumn>
                    <FormattedMessage id="ForeldelseForm.AutomatiskVurdert" />
                  </FlexColumn>
                </FlexRow>
              </div>
            )}
            {foreldelsesresultatActivity && apCodes[0] && (
              <>
                <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>
                  { getApTekst(apCodes[0]) }
                </AksjonspunktHelpTextTemp>
                <VerticalSpacer twentyPx />
                <TilbakekrevingTimelinePanel
                  perioder={perioderFormatertForTidslinje}
                  valgtPeriode={valgtPeriodeFormatertForTidslinje}
                  setPeriode={this.setPeriode}
                  toggleDetaljevindu={this.togglePeriode}
                  hjelpetekstKomponent={<ForeldelseTidslinjeHjelpetekster />}
                  kjonn={navBrukerKjonn}
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
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    alleKodeverk={alleKodeverk}
                    beregnBelop={beregnBelop}
                  />
                )}
                <VerticalSpacer twentyPx />
                <BehandlingspunktSubmitButton
                  formName={FORELDELSE_FORM_NAME}
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
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

ForeldelseForm.propTypes = {
  foreldelsesresultatActivity: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  navBrukerKjonn: PropTypes.string.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string),
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  merknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool.isRequired,
  }),
  beregnBelop: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

ForeldelseForm.defaultProps = {
  foreldelsesresultatActivity: undefined,
  apCodes: [],
  merknaderFraBeslutter: undefined,
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

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const submitCallback = (values) => initialOwnProps.submitCallback(transformValues(values, initialOwnProps.apCodes[0]));
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps.perioderForeldelse.perioder),
    foreldelsesresultatActivity: behandlingFormValueSelector(FORELDELSE_FORM_NAME,
      ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'foreldelsesresultatActivity'),
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
    merknaderFraBeslutter: ownProps.alleMerknaderFraBeslutter[aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE],
    onSubmit: submitCallback,
  });
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

export default connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: FORELDELSE_FORM_NAME,
})(ForeldelseForm)));
