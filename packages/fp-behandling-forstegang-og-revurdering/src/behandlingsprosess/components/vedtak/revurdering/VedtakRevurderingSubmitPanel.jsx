import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import {
  getBehandlingResultatstruktur, getHaveSentVarsel, erArsakTypeBehandlingEtterKlage,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getResultatstrukturFraOriginalBehandling } from 'behandlingForstegangOgRevurdering/src/selectors/originalBehandlingSelectors';
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

export const getSubmitKnappTekst = createSelector(
  [behandlingSelectors.getAksjonspunkter],
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
  ytelseType,
  readOnly,
  erBehandlingEtterKlage,
  submitKnappTextId,
  begrunnelse,
  brodtekst,
  overskrift,
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
      {ytelseType === fagsakYtelseType.ENGANGSSTONAD
          && skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel) && skalBrukeOverstyrendeFritekstBrev && (
          <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />
      )}
      {ytelseType === fagsakYtelseType.ENGANGSSTONAD
          && skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel) && !skalBrukeOverstyrendeFritekstBrev
          && !erBehandlingEtterKlage && (
          <ForhaandsvisningsKnapp previewFunction={previewBrev} />
      )}
      {(ytelseType === fagsakYtelseType.FORELDREPENGER || ytelseType === fagsakYtelseType.SVANGERSKAPSPENGER) && skalBrukeOverstyrendeFritekstBrev && (
        <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />
      )}
      {(ytelseType === fagsakYtelseType.FORELDREPENGER || ytelseType === fagsakYtelseType.SVANGERSKAPSPENGER)
          && !skalBrukeOverstyrendeFritekstBrev && !erBehandlingEtterKlage && (
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
  ytelseType: PropTypes.string.isRequired,
  submitKnappTextId: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  brodtekst: PropTypes.string,
  overskrift: PropTypes.string,
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

const mapStateToProps = (state) => ({
  submitKnappTextId: getSubmitKnappTekst(state),
  beregningResultat: getBehandlingResultatstruktur(state),
  originaltBeregningResultat: getResultatstrukturFraOriginalBehandling(state),
  haveSentVarsel: getHaveSentVarsel(state),
  erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
