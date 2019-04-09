import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  FadingPanel, VerticalSpacer, AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { removeSpacesFromNumber } from '@fpsak-frontend/utils';

import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingTilbakekreving/src/behandlingForm';
import { getSelectedBehandlingId, getFagsakPerson } from 'behandlingTilbakekreving/src/duckTilbake';
import foreldelseCodes from '../../foreldelseCodes';
import BpTimelinePanel from '../felles/behandlingspunktTimelineSkjema/BpTimelinePanel';
import { getBehandlingVersjon, getBehandlingVilkarsvurderingsperioder } from '../../../selectors/tilbakekrevingBehandlingSelectors';
import TilbakekrevingPeriodeForm, { TILBAKEKREVING_PERIODE_FORM_NAME } from './TilbakekrevingPeriodeForm';
import tilbakekrevingAksjonspunktCodes from '../../../kodeverk/tilbakekrevingAksjonspunktCodes';
import vilkarResultat from '../../../kodeverk/vilkarResultat';
import aktsomhet from '../../../kodeverk/aktsomhet';

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

const getAktsomhetData = (period) => {
  if (period.handletUaktsomhetGrad === aktsomhet.FORSETT) {
    return {};
  }
  if (period.handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM) {
    return { saerligGrunner: period.sarligGrunner };
  }
  return {};
};

const getVilkarResultatData = (period) => {
  if (period.valgtVilkarResultatType === vilkarResultat.GOD_TRO) {
    return {
      vilkarResultatInfo: {
        '@type': 'godTro',
        begrunnelse: period.godTroBegrunnelse,
        erBelopetIBehold: period.erBelopetIBehold,
        tilbakekrevesBelop: removeSpacesFromNumber(period.tilbakekrevdBelop),
      },
    };
  }
    return {
      vilkarResultatInfo: {
        '@type': 'annet',
        begrunnelse: period.aktsomhetBegrunnelse,
        aktsomhet: period.handletUaktsomhetGrad,
        ...getAktsomhetData(period),
      },
    };
  };

export const transformValues = (values) => {
  const vilkarsVurdertePerioder = values.vilkarsVurdertePerioder.map(v => ({
    fom: v.fom,
    tom: v.tom,
    vilkarResultat: v.valgtVilkarResultatType,
    begrunnelse: v.begrunnelse,
    ...getVilkarResultatData(v),
  }));
  return [{
    kode: tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING,
    vilkarsVurdertePerioder,
  }];
};

export const buildInitialValues = perioder => ({
  vilkarsVurdertePerioder: perioder.map((periode, index) => ({
    ...periode,
    id: index + 1,
    group: 1,
    arsak: periode.årsak.årsak,
    erTotalBelopUnder4Rettsgebyr: true,
  })),
});

const addClassname = (perioder) => {
  if (!perioder) {
    return undefined;
  }
  // TODO (TOR) treng ein foreldet her. Om ikkje, endre i BpTimelinePanel
  return perioder.map((p) => {
    const erBehandlet = p.begrunnelse ? 'godkjentPeriode' : 'undefined';
    const statusClassName = p.erForeldet || p.erBelopetIBehold === false ? 'avvistPeriode' : erBehandlet;
    return {
      ...p,
      className: statusClassName,
      foreldet: p.begrunnelse ? undefined : foreldelseCodes.MANUELL_BEHANDLING,
    };
  });
};

const mapStateToProps = (state, ownProps) => ({
  initialValues: buildInitialValues(getBehandlingVilkarsvurderingsperioder(state)),
  kjonn: getFagsakPerson(state).erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
  vilkarsVurdertePerioder: addClassname(behandlingFormValueSelector(TILBAKEKREVING_FORM_NAME)(state, 'vilkarsVurdertePerioder')),
  behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
  onSubmit: values => ownProps.submitCallback(transformValues(values)),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const TilbakekrevingForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: TILBAKEKREVING_FORM_NAME,
})(TilbakekrevingFormImpl)));

TilbakekrevingForm.supports = (bp, apCodes) => bp === behandlingspunktCodes.TILBAKEKREVING || tilbakekrevingAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingForm;
