import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getBehandlingIsOnHold } from 'behandlingFpsak/behandlingSelectors';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Row, Column } from 'nav-frontend-grid';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { medholdIKlage } from '../VedtakHelper';

import styles from '../vedtakForm.less';

export const isMedholdIKlage = (
  klageVurderingResultatNFP, klageVurderingResultatNK,
) => medholdIKlage(klageVurderingResultatNFP) || medholdIKlage(klageVurderingResultatNK);

const getBrevKode = (klageVurdering, klageVurdertAvKa) => {
  switch (klageVurdering) {
    case klageVurderingType.STADFESTE_YTELSESVEDTAK:
      return klageVurdertAvKa ? dokumentMalType.KLAGE_YTELSESVEDTAK_STADFESTET_DOK : dokumentMalType.KLAGE_OVERSENDT_KLAGEINSTANS_DOK;
    case klageVurderingType.OPPHEVE_YTELSESVEDTAK:
      return dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
    case klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE:
      return dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
    case klageVurderingType.MEDHOLD_I_KLAGE:
      return dokumentMalType.VEDTAK_MEDHOLD;
    case klageVurderingType.AVVIS_KLAGE:
      return dokumentMalType.KLAGE_AVVIST_DOK;
    default:
      return null;
  }
};

const getPreviewCallback = (formProps, begrunnelse, previewVedtakCallback, klageVurdering, aksjonspunktCode) => (e) => {
  const klageVurdertAv = aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? 'NK' : 'NFP';
  const data = {
    fritekst: begrunnelse || '',
    mottaker: '',
    brevmalkode: getBrevKode(klageVurdering, klageVurdertAv === 'NK'),
    klageVurdertAv,
    erOpphevet: klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK,
  };
  if (formProps.valid || formProps.pristine) {
    previewVedtakCallback(data);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

export const VedtakKlageSubmitPanelImpl = ({
  intl,
  behandlingPaaVent,
  previewVedtakCallback,
  begrunnelse,
  klageVurdering,
  aksjonspunktCode,
  formProps,
  readOnly,
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewVedtakCallback, klageVurdering, aksjonspunktCode);

  return (
    <Row>
      <Column xs="6">
        {!readOnly
        && (
        <Hovedknapp
          mini
          className={styles.mainButton}
          onClick={formProps.handleSubmit}
          disabled={behandlingPaaVent || formProps.submitting}
          spinner={formProps.submitting}
        >
          {intl.formatMessage({ id: 'VedtakKlageForm.TilGodkjenning' })}
        </Hovedknapp>
        )
        }
        <a
          href=""
          onClick={previewBrev}
          onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          <FormattedMessage id="VedtakKlageForm.ForhandvisBrev" />
        </a>
      </Column>
    </Row>
  );
};

VedtakKlageSubmitPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
  klageVurdering: PropTypes.string,
  aksjonspunktCode: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
};

VedtakKlageSubmitPanelImpl.defaultProps = {
  begrunnelse: undefined,
  klageVurdering: undefined,
  aksjonspunktCode: undefined,
};


const mapStateToProps = state => ({
  behandlingPaaVent: getBehandlingIsOnHold(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakKlageSubmitPanelImpl));
