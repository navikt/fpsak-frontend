import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import {
  getBehandlingResultatstruktur, getHaveSentVarsel,
  getBehandlingsresultat,
} from 'behandling/behandlingSelectors';
import { getResultatstrukturFraOriginalBehandling } from 'behandling/selectors/originalBehandlingSelectors';
import classNames from 'classnames';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import vedtakbrevStatus from '@fpsak-frontend/kodeverk/vedtakbrevStatus';
import styles from '../vedtakForm.less';

const getPreviewCallback = (formProps, begrunnelse, previewVedtakCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    previewVedtakCallback(begrunnelse || ' ');
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const harTilkjentYtelseEndretSeg = (revResultat, orgResultat) => {
  if ((!revResultat && orgResultat) || (revResultat && !orgResultat)) {
    return true;
  } if (!revResultat && !orgResultat) {
    return false;
  }
  return revResultat.beregnetTilkjentYtelse !== orgResultat.beregnetTilkjentYtelse;
};

const skalViseESBrev = (revResultat, orgResultat, erSendtVarsel) => {
  if (harTilkjentYtelseEndretSeg(revResultat, orgResultat)) {
    return true;
  } return erSendtVarsel;
};

export const VedtakRevurderingSubmitPanelImpl = ({
  intl,
  beregningResultat,
  previewVedtakCallback,
  begrunnelse,
  formProps,
  haveSentVarsel,
  originaltBeregningResultat,
  brevStatus,
  ytelseType,
  readOnly,
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewVedtakCallback);

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
          {intl.formatMessage({ id: 'VedtakForm.TilGodkjenning' })}
        </Hovedknapp>
      )
      }
      {ytelseType === fagsakYtelseType.ENGANGSSTONAD
      && skalViseESBrev(beregningResultat, originaltBeregningResultat, haveSentVarsel)
        && (
        <a
          href=""
          onClick={previewBrev}
          onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          <FormattedMessage id="VedtakForm.ForhandvisBrev" />
        </a>
        )
      }
      {ytelseType === fagsakYtelseType.FORELDREPENGER && brevStatus.kode === vedtakbrevStatus.AUTOMATISK
      && (
      <a
        href=""
        onClick={previewBrev}
        onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
        className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
      >
        <FormattedMessage id="VedtakForm.ForhandvisBrev" />
      </a>
      )
      }
    </div>
  );
};

VedtakRevurderingSubmitPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  beregningResultat: PropTypes.shape(),
  begrunnelse: PropTypes.string,
  originaltBeregningResultat: PropTypes.shape(),
  haveSentVarsel: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
  ytelseType: PropTypes.string.isRequired,
  brevStatus: PropTypes.shape(),
};

VedtakRevurderingSubmitPanelImpl.defaultProps = {
  begrunnelse: undefined,
  haveSentVarsel: false,
  beregningResultat: undefined,
  originaltBeregningResultat: undefined,
  brevStatus: undefined,
};

const mapStateToProps = state => ({
  beregningResultat: getBehandlingResultatstruktur(state),
  originaltBeregningResultat: getResultatstrukturFraOriginalBehandling(state),
  haveSentVarsel: getHaveSentVarsel(state),
  brevStatus: getBehandlingsresultat(state) !== undefined
    ? getBehandlingsresultat(state).vedtaksbrev : undefined,
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
