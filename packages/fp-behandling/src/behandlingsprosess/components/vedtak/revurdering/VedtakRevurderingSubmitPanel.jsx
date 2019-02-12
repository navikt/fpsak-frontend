import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import {
  getBehandlingResultatstruktur, getHaveSentVarsel,
  getAksjonspunkter, getBehandlingStatus,
} from 'behandlingFpsak/src/behandlingSelectors';
import { getResultatstrukturFraOriginalBehandling } from 'behandlingFpsak/src/selectors/originalBehandlingSelectors';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import styles from '../vedtakForm.less';
import { ForhaandsvisningsKnapp } from '../VedtakForm';

const getPreviewCallback = (formProps, begrunnelse, previewVedtakCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    previewVedtakCallback(begrunnelse || ' ');
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const getPreviewManueltBrevCallback = (formProps, behandlingIkkeAktiv, skalOverstyre, previewManueltBrevCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    const {
      begrunnelse, brødtekst, overskrift,
    } = formProps;
    const formValues = {
      fritekst: begrunnelse,
      skalBrukeOverstyrendeFritekstBrev: skalOverstyre,
      fritekstBrev: brødtekst,
      finnesAllerede: behandlingIkkeAktiv,
      overskrift,
      begrunnelse,
    };
    previewManueltBrevCallback(formValues);
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
  } return erSendtVarsel;
};

export const getSubmitKnappTekst = createSelector(
  [getAksjonspunkter],
  aksjonspunkter => (aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true
    && ap.toTrinnsBehandling === true) ? 'VedtakForm.TilGodkjenning' : 'VedtakForm.FattVedtak'),
);

export const VedtakRevurderingSubmitPanelImpl = ({
  intl,
  beregningResultat,
  previewVedtakCallback,
  previewManueltBrevCallback,
  behandlingStatusKode,
  begrunnelse,
  formProps,
  haveSentVarsel,
  originaltBeregningResultat,
  skalBrukeOverstyrendeFritekstBrev,
  ytelseType,
  readOnly,
  submitKnappTextId,
}) => {
  const behandlingIkkeAktiv = (behandlingStatusCode.BEHANDLING_UTREDES !== behandlingStatusKode);
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewVedtakCallback);
  const previewOverstyrtBrev = getPreviewManueltBrevCallback(formProps, behandlingIkkeAktiv, true, previewManueltBrevCallback);

  return (
    <div>
      <div className={styles.margin} />
      {!readOnly
      && (
        <Hovedknapp
          mini
          className={styles.mainButton}
          onClick={formProps.handleSubmit}
          disabled={formProps.submitting}
          spinner={formProps.submitting}
        >
          {intl.formatMessage({ id: skalBrukeOverstyrendeFritekstBrev ? 'VedtakForm.TilGodkjenning' : submitKnappTextId })}
        </Hovedknapp>
      )
      }
      {ytelseType === fagsakYtelseType.ENGANGSSTONAD
           && skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel) && skalBrukeOverstyrendeFritekstBrev
                   && (
                   <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />
                   )
                 }
      {ytelseType === fagsakYtelseType.ENGANGSSTONAD
                 && skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel) && !skalBrukeOverstyrendeFritekstBrev
        && (
        <ForhaandsvisningsKnapp previewFunction={previewBrev} />
        )
      }
      {ytelseType === fagsakYtelseType.FORELDREPENGER && skalBrukeOverstyrendeFritekstBrev
      && (
        <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />
      )
      }
      {ytelseType === fagsakYtelseType.FORELDREPENGER && !skalBrukeOverstyrendeFritekstBrev
        && (
        <ForhaandsvisningsKnapp previewFunction={previewBrev} />
        )
      }
    </div>
  );
};

VedtakRevurderingSubmitPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  previewManueltBrevCallback: PropTypes.func.isRequired,
  beregningResultat: PropTypes.shape(),
  begrunnelse: PropTypes.string,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  originaltBeregningResultat: PropTypes.shape(),
  haveSentVarsel: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
  ytelseType: PropTypes.string.isRequired,
  submitKnappTextId: PropTypes.string.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
};

VedtakRevurderingSubmitPanelImpl.defaultProps = {
  begrunnelse: undefined,
  haveSentVarsel: false,
  beregningResultat: undefined,
  originaltBeregningResultat: undefined,
  skalBrukeOverstyrendeFritekstBrev: undefined,
};

const mapStateToProps = state => ({
  submitKnappTextId: getSubmitKnappTekst(state),
  beregningResultat: getBehandlingResultatstruktur(state),
  originaltBeregningResultat: getResultatstrukturFraOriginalBehandling(state),
  haveSentVarsel: getHaveSentVarsel(state),
  behandlingStatusKode: getBehandlingStatus(state).kode,
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
