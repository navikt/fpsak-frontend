import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';

import vedtakBehandlingPropType from '../propTypes/vedtakBehandlingPropType';
import vedtakBeregningsresultatPropType from '../propTypes/vedtakBeregningsresultatPropType';
import vedtakVilkarPropType from '../propTypes/vedtakVilkarPropType';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakFellesPanel from './VedtakFellesPanel';
import { getTilbakekrevingText } from './VedtakHelper';
import VedtakFritekstbrevModal from './svp/VedtakFritekstbrevModal';

const getPreviewManueltBrevCallback = (formProps, begrunnelse, brodtekst, overskrift, skalOverstyre, previewCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    const data = {
      fritekst: skalOverstyre ? brodtekst : begrunnelse,
      dokumentMal: skalOverstyre ? 'FRITKS' : undefined,
      tittel: overskrift,
      gjelderVedtak: true,
    };

    previewCallback(data);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const isVedtakSubmission = true;

const getPreviewAutomatiskBrevCallback = (begrunnelse, previewCallback) => (e) => {
  const formValues = {
    fritekst: begrunnelse,
    gjelderVedtak: true,
    vedtaksbrev: {
      kode: 'AUTOMATISK',
    },
  };
  previewCallback(formValues);
  e.preventDefault();
};

export const VedtakForm = ({
  behandling,
  readOnly,
  behandlingStatusKode,
  aksjonspunkter,
  antallBarn,
  previewCallback,
  begrunnelse,
  brødtekst,
  overskrift,
  aksjonspunktKoder,
  kanOverstyre,
  erBehandlingEtterKlage,
  ytelseTypeKode,
  resultatstruktur,
  alleKodeverk,
  tilbakekrevingvalg,
  simuleringResultat,
  vilkar,
  beregningErManueltFastsatt,
  ...formProps
}) => {
  const { behandlingsresultat } = behandling;
  const previewAutomatiskBrev = getPreviewAutomatiskBrevCallback(begrunnelse, previewCallback);
  const previewOverstyrtBrev = getPreviewManueltBrevCallback(formProps, begrunnelse, brødtekst, overskrift, true, previewCallback);
  // const previewDefaultBrev = getPreviewManueltBrevCallback(formProps, begrunnelse, brødtekst, overskrift, false, previewCallback);

  const tilbakekrevingtekst = getTilbakekrevingText(simuleringResultat, tilbakekrevingvalg, alleKodeverk);

  return (
    <>
      {ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER && (
        <VedtakFritekstbrevModal
          readOnly={readOnly}
          behandlingsresultat={behandlingsresultat}
        />
      )}
      <VedtakFellesPanel
        behandlingsresultat={behandlingsresultat}
        ytelseTypeKode={ytelseTypeKode}
        behandlingStatusKode={behandlingStatusKode}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={readOnly}
        kanOverstyre={kanOverstyre}
        sprakkode={behandling.sprakkode}
        previewAutomatiskBrev={previewAutomatiskBrev}
        previewOverstyrtBrev={previewOverstyrtBrev}
        tilbakekrevingtekst={tilbakekrevingtekst}
        erBehandlingEtterKlage={erBehandlingEtterKlage}
        handleSubmit={formProps.handleSubmit}
        submitting={formProps.submitting}
        resetForm={formProps.reset}
        behandlingPaaVent={behandling.behandlingPaaVent}
        renderPanel={(skalBrukeOverstyrendeFritekstBrev, erInnvilget, erAvslatt) => {
          if (erInnvilget) {
            return (
              <VedtakInnvilgetPanel
                antallBarn={antallBarn}
                behandlingsresultat={behandlingsresultat}
                readOnly={readOnly}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
                ytelseTypeKode={ytelseTypeKode}
                sprakkode={behandling.sprakkode}
                beregningResultat={resultatstruktur}
                beregningErManueltFastsatt={beregningErManueltFastsatt}
              />
            );
          }

          return erAvslatt ? (
            <VedtakAvslagPanel
              behandlingStatusKode={behandlingStatusKode}
              aksjonspunkter={aksjonspunkter}
              behandlingsresultat={behandlingsresultat}
              readOnly={readOnly}
              ytelseTypeKode={ytelseTypeKode}
              sprakkode={behandling.sprakkode}
              alleKodeverk={alleKodeverk}
              tilbakekrevingvalg={tilbakekrevingvalg}
              simuleringResultat={simuleringResultat}
              vilkar={vilkar}
              beregningErManueltFastsatt={beregningErManueltFastsatt}
            />
          ) : null;
        }}
      />
    </>
  );
};

VedtakForm.propTypes = {
  behandling: vedtakBehandlingPropType.isRequired,
  resultatstruktur: vedtakBeregningsresultatPropType,
  begrunnelse: PropTypes.string,
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  antallBarn: PropTypes.number,
  behandlingStatusKode: PropTypes.string.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  simuleringResultat: PropTypes.shape(),
  beregningErManueltFastsatt: PropTypes.bool.isRequired,
  vilkar: PropTypes.arrayOf(vedtakVilkarPropType.isRequired),
  ...formPropTypes,
};

VedtakForm.defaultProps = {
  antallBarn: undefined,
  begrunnelse: undefined,
  brødtekst: undefined,
  overskrift: undefined,
  kanOverstyre: undefined,
  resultatstruktur: undefined,
};

export const buildInitialValues = createSelector(
  [(ownProps) => ownProps.resultatstruktur,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.behandling],
  (beregningResultat, aksjonspunkter, behandling) => ({
    antallBarn: beregningResultat ? beregningResultat.antallBarn : undefined,
    aksjonspunktKoder: aksjonspunkter.filter((ap) => ap.kanLoses)
      .map((ap) => ap.definisjon.kode),
    overskrift: decodeHtmlEntity(behandling.behandlingsresultat.overskrift),
    brødtekst: decodeHtmlEntity(behandling.behandlingsresultat.fritekstbrev),
  }),
);

export const getAksjonspunktKoder = createSelector(
  [(ownProps) => ownProps.aksjonspunkter], (aksjonspunkter) => aksjonspunkter.map((ap) => ap.definisjon.kode),
);

const transformValues = (values) => values.aksjonspunktKoder.map((apCode) => ({
  kode: apCode,
  begrunnelse: values.begrunnelse,
  fritekstBrev: values.brødtekst,
  skalBrukeOverstyrendeFritekstBrev: !!values.brødtekst,
  overskrift: values.overskrift,
  isVedtakSubmission,
}));

const formName = 'VedtakForm';

const erArsakTypeBehandlingEtterKlage = createSelector([(ownProps) => ownProps
  .behandling.behandlingArsaker], (behandlingArsakTyper = []) => behandlingArsakTyper
  .map(({ behandlingArsakType }) => behandlingArsakType)
  .some((bt) => bt.kode === klageBehandlingArsakType.ETTER_KLAGE || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK));


const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
    ...behandlingFormValueSelector(formName, ownProps.behandling.id, ownProps.behandling.versjon)(
      state,
      'antallBarn',
      'begrunnelse',
      'aksjonspunktKoder',
      'overskrift',
      'brødtekst',
    ),
    behandlingStatusKode: ownProps.behandling.status.kode,
    aksjonspunktKoder: getAksjonspunktKoder(ownProps),
    erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(VedtakForm));
