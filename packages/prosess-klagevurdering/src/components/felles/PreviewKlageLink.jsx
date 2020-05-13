import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import styles from './previewKlageLink.less';

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
    default:
      return null;
  }
};

const getBrevData = (klageVurdering, aksjonspunktCode, fritekstTilBrev, skalBenytteFritekstBrevmal) => {
  const klageVurdertAv = aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? 'NK' : 'NFP';
  const data = {
    fritekst: fritekstTilBrev || '',
    mottaker: '',
    dokumentMal: getBrevKode(klageVurdering, klageVurdertAv === 'NK', skalBenytteFritekstBrevmal),
    klageVurdertAv,
    erOpphevetKlage: klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK,
  };
  return data;
};

const PreviewKlageLink = ({
  previewCallback,
  fritekstTilBrev,
  klageVurdering,
  aksjonspunktCode,
  skalBenytteFritekstBrevmal,
}) => {
  const previewMessage = (e) => {
    previewCallback(getBrevData(klageVurdering, aksjonspunktCode, fritekstTilBrev, skalBenytteFritekstBrevmal));
    e.preventDefault();
  };
  return (
    <a
      href=""
      onClick={(e) => { previewMessage(e); }}
      onKeyDown={(e) => (e.keyCode === 13 ? previewMessage(e) : null)}
      className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
    >
      <FormattedMessage id="PreviewKlageLink.ForhandvisBrev" />
    </a>
  );
};

PreviewKlageLink.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  fritekstTilBrev: PropTypes.string,
  klageVurdering: PropTypes.string,
  skalBenytteFritekstBrevmal: PropTypes.bool.isRequired,
};

PreviewKlageLink.defaultProps = {
  klageVurdering: null,
  fritekstTilBrev: null,
};

export default PreviewKlageLink;
