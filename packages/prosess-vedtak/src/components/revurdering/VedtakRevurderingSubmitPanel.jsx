import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { ForhaandsvisningsKnapp } from '../VedtakForm';

import styles from '../vedtakForm.less';

const getPreviewCallback = (formProps, begrunnelse, previewCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    previewCallback({
      gjelderVedtak: true,
      fritekst: begrunnelse,
    });
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

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

const harTilkjentYtelseEndretSeg = (revResultat, orgResultat) => {
  if ((!revResultat && orgResultat) || (revResultat && !orgResultat)) {
    return true;
  }
  if (!revResultat) {
    return false;
  }
  return revResultat.beregnetTilkjentYtelse !== orgResultat.beregnetTilkjentYtelse;
};

const skalViseESBrev = (revResultat, orgResultat, erSendtVarsel) => {
  if (harTilkjentYtelseEndretSeg(revResultat, orgResultat)) {
    return true;
  }
  return erSendtVarsel;
};

const skalKunneForhåndsviseBrev = (behandlingResultat) => {
  if (!behandlingResultat) {
    return true;
  }
  const { konsekvenserForYtelsen } = behandlingResultat;
  if (!Array.isArray(konsekvenserForYtelsen) || konsekvenserForYtelsen.length !== 1) {
    return true;
  }
  return konsekvenserForYtelsen[0].kode !== 'ENDRING_I_FORDELING_AV_YTELSEN' && konsekvenserForYtelsen[0].kode !== 'INGEN_ENDRING';
};

export const getSubmitKnappTekst = createSelector(
  [(ownProps) => ownProps.aksjonspunkter],
  (aksjonspunkter) => (aksjonspunkter && aksjonspunkter.some((ap) => ap.erAktivt === true
    && ap.toTrinnsBehandling === true) ? 'VedtakForm.TilGodkjenning' : 'VedtakForm.FattVedtak'),
);

export const VedtakRevurderingSubmitPanelImpl = ({
  intl,
  beregningResultat,
  previewCallback,
  formProps,
  haveSentVarsel,
  originaltBeregningResultat,
  skalBrukeOverstyrendeFritekstBrev,
  ytelseTypeKode,
  readOnly,
  erBehandlingEtterKlage,
  submitKnappTextId,
  begrunnelse,
  brodtekst,
  overskrift,
  behandlingResultat,
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewCallback);
  const previewOverstyrtBrev = getPreviewManueltBrevCallback(formProps, begrunnelse, brodtekst, overskrift, true, previewCallback);

  return (
    <div>
      <div className={styles.margin} />
      {!readOnly && (
        <Hovedknapp
          mini
          className={styles.mainButton}
          onClick={formProps.handleSubmit}
          disabled={formProps.submitting}
          spinner={formProps.submitting}
        >
          {intl.formatMessage({ id: skalBrukeOverstyrendeFritekstBrev ? 'VedtakForm.TilGodkjenning' : submitKnappTextId })}
        </Hovedknapp>
      )}
      {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD
          && skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel) && skalBrukeOverstyrendeFritekstBrev && (
          <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />
      )}
      {ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD
          && skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel) && !skalBrukeOverstyrendeFritekstBrev
          && !erBehandlingEtterKlage && (
          <ForhaandsvisningsKnapp previewFunction={previewBrev} />
      )}
      {(ytelseTypeKode === fagsakYtelseType.FORELDREPENGER || ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER) && skalBrukeOverstyrendeFritekstBrev && (
        <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />
      )}
      {(ytelseTypeKode === fagsakYtelseType.FORELDREPENGER || ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER)
          && !skalBrukeOverstyrendeFritekstBrev && !erBehandlingEtterKlage && skalKunneForhåndsviseBrev(behandlingResultat) && (
          <ForhaandsvisningsKnapp previewFunction={previewBrev} />
      )}
    </div>
  );
};

VedtakRevurderingSubmitPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  previewCallback: PropTypes.func.isRequired,
  beregningResultat: PropTypes.shape(),
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  originaltBeregningResultat: PropTypes.shape(),
  haveSentVarsel: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  submitKnappTextId: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  brodtekst: PropTypes.string,
  overskrift: PropTypes.string,
  behandlingResultat: PropTypes.shape(),
};

VedtakRevurderingSubmitPanelImpl.defaultProps = {
  haveSentVarsel: false,
  beregningResultat: undefined,
  originaltBeregningResultat: undefined,
  skalBrukeOverstyrendeFritekstBrev: undefined,
  begrunnelse: undefined,
  brodtekst: undefined,
  overskrift: undefined,
};

const erArsakTypeBehandlingEtterKlage = createSelector([(ownProps) => ownProps.behandlingArsaker], (behandlingArsakTyper = []) => behandlingArsakTyper
  .map(({ behandlingArsakType }) => behandlingArsakType)
  .some((bt) => bt.kode === klageBehandlingArsakType.ETTER_KLAGE || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK));


const mapStateToProps = (state, ownProps) => ({
  submitKnappTextId: getSubmitKnappTekst(ownProps),
  erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
