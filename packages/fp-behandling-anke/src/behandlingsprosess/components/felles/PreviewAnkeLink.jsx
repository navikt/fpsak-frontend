import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';


import ankeVurderingType from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import styles from './previewAnkeLink.less';

const getBrevKode = (ankeVurdering) => {
  switch (ankeVurdering) {
    case ankeVurderingType.ANKE_OMGJOER:
      return dokumentMalType.ANKE_VEDTAK_OMGJORING;
    case ankeVurderingType.ANKE_OPPHEVE_OG_HJEMSENDE:
      return dokumentMalType.ANKE_BESLUTNING_OM_OPPHEVING;
    default:
      return null;
  }
};

const getBrevData = (ankeVurdering, aksjonspunktCode, fritekstTilBrev) => {
  const data = {
    fritekst: fritekstTilBrev || '',
    mottaker: '',
    dokumentMal: getBrevKode(ankeVurdering),
  };
  return data;
};

const PreviewAnkeLink = ({
  previewCallback,
  fritekstTilBrev,
  ankeVurdering,
  aksjonspunktCode,
  readOnly,
}) => {
  const previewMessage = (e) => {
    e.preventDefault();
    previewCallback(getBrevData(ankeVurdering, aksjonspunktCode, fritekstTilBrev));
  };
  if (readOnly) {
    return (
      <span
        className={classNames(styles.previewLinkDisabled)}
      >
        <FormattedMessage id="PreviewAnkeLink.ForhandvisBrev" />
      </span>
    );
  }
  return (
    <a
      href=""
      onClick={(e) => { previewMessage(e); }}
      onKeyDown={(e) => (e.keyCode === 13 ? previewMessage(e) : null)}
      className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
    >
      <FormattedMessage id="PreviewAnkeLink.ForhandvisBrev" />
    </a>
  );
};

PreviewAnkeLink.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  fritekstTilBrev: PropTypes.string,
  ankeVurdering: PropTypes.string,
  readOnly: PropTypes.bool,
};

PreviewAnkeLink.defaultProps = {
  ankeVurdering: null,
  fritekstTilBrev: null,
  readOnly: false,
};

export default PreviewAnkeLink;
