import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Undertekst, Normaltekst } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';

import vedtaksbrevAvsnittPropType from '../propTypes/vedtaksbrevAvsnittPropType';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';

const TilbakekrevingVedtak = ({
  submitCallback,
  readOnly,
  resultat,
  perioder,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  avsnittsliste,
  fetchPreviewVedtaksbrev,
  aksjonspunktKodeForeslaVedtak,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="TilbakekrevingVedtak.Vedtak" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      <Undertekst>
        <FormattedMessage id="TilbakekrevingVedtak.Resultat" />
      </Undertekst>
      <Normaltekst>
        {getKodeverknavn(resultat)}
      </Normaltekst>
      <VerticalSpacer sixteenPx />
      <TilbakekrevingVedtakPeriodeTabell perioder={perioder} getKodeverknavn={getKodeverknavn} />
      <VerticalSpacer sixteenPx />
      <TilbakekrevingVedtakForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        avsnittsliste={avsnittsliste}
        fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
        aksjonspunktKodeForeslaVedtak={aksjonspunktKodeForeslaVedtak}
      />
    </FadingPanel>
  );
};

TilbakekrevingVedtak.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  resultat: kodeverkObjektPropType.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  avsnittsliste: PropTypes.arrayOf(vedtaksbrevAvsnittPropType).isRequired,
  fetchPreviewVedtaksbrev: PropTypes.func.isRequired,
  aksjonspunktKodeForeslaVedtak: PropTypes.string.isRequired,
};

export default TilbakekrevingVedtak;
