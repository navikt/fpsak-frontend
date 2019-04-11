import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  FadingPanel, VerticalSpacer, AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';

import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingTilbakekreving/src/behandlingForm';
import { getSelectedBehandlingId, getFagsakPerson } from 'behandlingTilbakekreving/src/duckTilbake';
import foreldelseCodes from '../../foreldelseCodes';
import BpTimelinePanel from '../felles/behandlingspunktTimelineSkjema/BpTimelinePanel';
import {
  getBehandlingVersjon, getBehandlingVilkarsvurderingsperioder, getBehandlingVilkarsvurderingsRettsgebyr, getBehandlingVilkarsvurdering,
} from '../../../selectors/tilbakekrevingBehandlingSelectors';
import TilbakekrevingPeriodeForm, { TILBAKEKREVING_PERIODE_FORM_NAME } from './TilbakekrevingPeriodeForm';
import tilbakekrevingAksjonspunktCodes from '../../../kodeverk/tilbakekrevingAksjonspunktCodes';

import styles from './tilbakekrevingForm.less';

const TILBAKEKREVING_FORM_NAME = 'TilbakekrevingForm';

const tilbakekrevingAksjonspunkter = [tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING];

const TilbakekrevingFormImpl = ({
  vilkarsVurdertePerioder,
  behandlingFormPrefix,
  isApOpen,
  kjonn,
  readOnly,
  readOnlySubmitButton,
  reduxFormChange: formChange,
  reduxFormInitialize: formInitialize,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="Behandlingspunkt.Tilbakekreving" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
        {[<FormattedMessage key="AksjonspunktHjelpetekst" id="TilbakekrevingPanel.AksjonspunktHjelpetekst" />] }
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />
      {vilkarsVurdertePerioder && (
        <BpTimelinePanel
          hovedsokerKjonnKode={kjonn}
          resultatActivity={vilkarsVurdertePerioder}
          behandlingFormPrefix={behandlingFormPrefix}
          reduxFormChange={formChange}
          reduxFormInitialize={formInitialize}
          formName={TILBAKEKREVING_FORM_NAME}
          detailPanelForm={TILBAKEKREVING_PERIODE_FORM_NAME}
          fieldNameToStoreDetailInfo="vilkarsVurdertePerioder"
          isTilbakekreving
        >
          <TilbakekrevingPeriodeForm
            behandlingFormPrefix={behandlingFormPrefix}
            aktiviteter={vilkarsVurdertePerioder}
            formName={TILBAKEKREVING_FORM_NAME}
            readOnly={readOnly}
          />
        </BpTimelinePanel>
      )}
      <VerticalSpacer twentyPx />
      {formProps.error && (
        <>
          <Normaltekst className={styles.error}>
            <FormattedMessage id={formProps.error} />
          </Normaltekst>
          <VerticalSpacer twentyPx />
        </>
      )}
      <BehandlingspunktSubmitButton
        formNames={[TILBAKEKREVING_FORM_NAME, TILBAKEKREVING_PERIODE_FORM_NAME]}
        isReadOnly={readOnly}
        isSubmittable={!readOnlySubmitButton}
        isBehandlingFormSubmitting={isBehandlingFormSubmitting}
        isBehandlingFormDirty={isBehandlingFormDirty}
        hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
      />
    </FadingPanel>
  </form>
);

TilbakekrevingFormImpl.propTypes = {
  vilkarsVurdertePerioder: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  kjonn: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
};

TilbakekrevingFormImpl.defaultProps = {
  vilkarsVurdertePerioder: undefined,
};

export const transformValues = values => [{
  kode: tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING,
  vilkarsVurdertePerioder: values.vilkarsVurdertePerioder.map(v => v.storedData),
}];

const addFigureData = (periode, index) => ({
  id: index + 1,
  group: 1,
  arsak: periode.årsak.årsak,
});

export const buildInitialValues = (perioder, vilkarsvurdering, rettsgebyr) => {
  const totalbelop = perioder.reduce((acc, periode) => acc + periode.feilutbetaling, 0);
  const lagredeVilkarsvurdertePerioder = vilkarsvurdering.vilkarsVurdertePerioder;

  return {
    vilkarsVurdertePerioder: perioder.map((periode, index) => {
      const lagretPeriode = lagredeVilkarsvurdertePerioder.find(p => p.fom === periode.fom && p.tom === periode.tom);
      return {
        ...periode,
        storedData: lagretPeriode,
        ...addFigureData(periode, index),
        erTotalBelopUnder4Rettsgebyr: totalbelop > rettsgebyr * 4,
      };
    }),
  };
};

// TODO (TOR) Endre til selectors
const addClassname = (perioder) => {
  if (!perioder) {
    return undefined;
  }
  // TODO (TOR) treng ein foreldet her. Om ikkje, endre i BpTimelinePanel
  return perioder.map((p) => {
    const erBehandlet = p.storedData.begrunnelse ? 'godkjentPeriode' : 'undefined';
    const statusClassName = p.erForeldet || p.erBelopetIBehold === false ? 'avvistPeriode' : erBehandlet;
    return {
      ...p,
      className: statusClassName,
      foreldet: p.storedData.begrunnelse ? undefined : foreldelseCodes.MANUELL_BEHANDLING,
    };
  });
};

const validateForm = (values) => {
  const antall = values.vilkarsVurdertePerioder.reduce((sum, periode) => (periode.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr === false ? sum + 1 : sum), 0);
  const errors = {};
  if (antall > 0 && antall !== values.vilkarsVurdertePerioder.length) {
    // eslint-disable-next-line no-underscore-dangle
    errors._error = 'TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr';
  }
  return errors;
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = values => ownProps.submitCallback(transformValues(values));
  return state => ({
    initialValues: buildInitialValues(getBehandlingVilkarsvurderingsperioder(state), getBehandlingVilkarsvurdering(state),
      getBehandlingVilkarsvurderingsRettsgebyr(state)),
    kjonn: getFagsakPerson(state).erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
    vilkarsVurdertePerioder: addClassname(behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    onSubmit: submitCallback,
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const TilbakekrevingForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: TILBAKEKREVING_FORM_NAME,
  validate: validateForm,
})(TilbakekrevingFormImpl)));

TilbakekrevingForm.supports = (bp, apCodes) => bp === behandlingspunktCodes.TILBAKEKREVING || tilbakekrevingAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingForm;
