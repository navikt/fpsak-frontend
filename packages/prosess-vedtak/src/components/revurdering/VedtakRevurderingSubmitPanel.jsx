import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import styles from '../vedtakForm.less';


export const ForhaandsvisningsKnapp = (props) => {
  const { previewFunction } = props;
  return (
    <a
      href=""
      onClick={previewFunction}
      onKeyDown={(e) => (e.keyCode === 13 ? previewFunction(e) : null)}
      className={classNames(styles.buttonLink, 'lenke lenke--frittstaende')}
    >
      <FormattedMessage id="VedtakForm.ForhandvisBrev" />
    </a>
  );
};

ForhaandsvisningsKnapp.propTypes = {
  previewFunction: PropTypes.func.isRequired,
};

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

export const VedtakRevurderingSubmitPanelImpl = ({
  beregningResultat,
  previewCallback,
  formProps,
  haveSentVarsel,
  originaltBeregningResultat,
  skalBrukeOverstyrendeFritekstBrev,
  ytelseTypeKode,
  erBehandlingEtterKlage,
  begrunnelse,
  brodtekst,
  overskrift,
  behandlingResultat,
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewCallback);
  const previewOverstyrtBrev = getPreviewManueltBrevCallback(formProps, begrunnelse, brodtekst, overskrift, true, previewCallback);

  return (
    <div>
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
  previewCallback: PropTypes.func.isRequired,
  beregningResultat: PropTypes.shape(),
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  originaltBeregningResultat: PropTypes.shape(),
  haveSentVarsel: PropTypes.bool,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
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
  erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
