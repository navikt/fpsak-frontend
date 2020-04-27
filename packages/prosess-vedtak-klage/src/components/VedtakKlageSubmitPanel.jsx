import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

import styles from './vedtakKlageSubmitPanel.less';

const medholdIKlage = (klageVurderingResultat) => (klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE);

export const isMedholdIKlage = (
  klageVurderingResultatNFP, klageVurderingResultatNK,
) => medholdIKlage(klageVurderingResultatNFP) || medholdIKlage(klageVurderingResultatNK);

const finnKaKode = (skalBenytteFritekstBrevmal) => (skalBenytteFritekstBrevmal
  ? dokumentMalType.KLAGE_STADFESTET : dokumentMalType.KLAGE_YTELSESVEDTAK_STADFESTET_DOK);

const finnKode = (skalBenytteFritekstBrevmal) => (skalBenytteFritekstBrevmal
  ? dokumentMalType.KLAGE_OVERSENDT_KLAGEINSTANS : dokumentMalType.KLAGE_OVERSENDT_KLAGEINSTANS_DOK);

const getBrevKode = (klageVurdering, klageVurdertAvKa, skalBenytteFritekstBrevmal) => {
  switch (klageVurdering) {
    case klageVurderingType.STADFESTE_YTELSESVEDTAK:
      return klageVurdertAvKa ? finnKaKode(skalBenytteFritekstBrevmal) : finnKode(skalBenytteFritekstBrevmal);
    case klageVurderingType.OPPHEVE_YTELSESVEDTAK:
      return skalBenytteFritekstBrevmal ? dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET : dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
    case klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE:
      return skalBenytteFritekstBrevmal ? dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET : dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
    case klageVurderingType.MEDHOLD_I_KLAGE:
      return skalBenytteFritekstBrevmal ? dokumentMalType.KLAGE_OMGJORING : dokumentMalType.VEDTAK_MEDHOLD;
    case klageVurderingType.AVVIS_KLAGE:
      return skalBenytteFritekstBrevmal ? dokumentMalType.KLAGE_AVVIST : dokumentMalType.KLAGE_AVVIST_DOK;
    default:
      return null;
  }
};

const getPreviewCallback = (formProps, begrunnelse, previewVedtakCallback, klageResultat, skalBenytteFritekstBrevmal) => (e) => {
  const klageVurdertAvNK = klageResultat.klageVurdertAv === 'NFP';
  const data = {
    fritekst: begrunnelse || '',
    mottaker: '',
    brevmalkode: getBrevKode(klageResultat.klageVurdering, klageVurdertAvNK, skalBenytteFritekstBrevmal),
    klageVurdertAv: klageResultat.klageVurdertAv,
    erOpphevet: klageResultat.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK,
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
  klageResultat,
  formProps,
  readOnly,
  skalBenytteFritekstBrevmal,
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewVedtakCallback, klageResultat, skalBenytteFritekstBrevmal);

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
        )}
        <a
          href=""
          onClick={previewBrev}
          onKeyDown={(e) => (e.keyCode === 13 ? previewBrev(e) : null)}
          className={classNames('lenke lenke--frittstaende')}
        >
          <FormattedMessage id="VedtakKlageForm.ForhandvisBrev" />
        </a>
      </Column>
    </Row>
  );
};

VedtakKlageSubmitPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
  klageResultat: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  formProps: PropTypes.shape().isRequired,
  skalBenytteFritekstBrevmal: PropTypes.bool.isRequired,
};

VedtakKlageSubmitPanelImpl.defaultProps = {
  begrunnelse: undefined,
  klageResultat: undefined,
};

export default injectIntl(VedtakKlageSubmitPanelImpl);
