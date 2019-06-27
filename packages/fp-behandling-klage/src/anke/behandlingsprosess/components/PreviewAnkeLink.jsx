import React from 'react';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './behandleAnkeForm.less';

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
    default:
      return null;
  }
};

const getBrevData = (klageVurdering, aksjonspunktCode, fritekstTilBrev) => {
  const klageVurdertAv = aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? 'NK' : 'NFP';
  const data = {
    fritekst: fritekstTilBrev || '',
    mottaker: '',
    brevmalkode: getBrevKode(klageVurdering, klageVurdertAv === 'NK'),
    klageVurdertAv,
    erOpphevet: klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK,
  };
  return data;
};

const PreviewAnkeLink = ({
  previewCallback,
  fritekstTilBrev,
  klageVurdering,
  aksjonspunktCode,
  readOnly,
}) => {
  const previewMessage = (e) => {
    previewCallback(getBrevData(klageVurdering, aksjonspunktCode, fritekstTilBrev));
    e.preventDefault();
  };
  if (readOnly) {
    return (
      <span
        className={classNames(styles.previewLinkDisabled)}
      >
        <FormattedMessage id="VedtakForm.ForhandvisBrev" />
      </span>
    );
  }
  return (
    <a
      href=""
      onClick={(e) => { previewMessage(e); }}
      onKeyDown={e => (e.keyCode === 13 ? previewMessage(e) : null)}
      className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
    >
      <FormattedMessage id="VedtakForm.ForhandvisBrev" />
    </a>
  );
};

PreviewAnkeLink.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  fritekstTilBrev: PropTypes.string,
  klageVurdering: PropTypes.string,
  readOnly: PropTypes.bool,
};

PreviewAnkeLink.defaultProps = {
  klageVurdering: null,
  fritekstTilBrev: null,
  readOnly: false,
};

export default PreviewAnkeLink;
