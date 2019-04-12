import React from 'react';
import PropTypes from 'prop-types';

import aktsomhet from 'behandlingTilbakekreving/src/kodeverk/aktsomhet';
import AktsomhetGradForsettFormPanel from './AktsomhetGradForsettFormPanel';
import AktsomhetGradUaktsomhetFormPanel from './AktsomhetGradUaktsomhetFormPanel';

const AktsomhetGradFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
}) => (
  <>
    { handletUaktsomhetGrad === aktsomhet.FORSETT && (
      <AktsomhetGradForsettFormPanel />
    )}
    { handletUaktsomhetGrad !== aktsomhet.FORSETT && (
      <AktsomhetGradUaktsomhetFormPanel
        harGrunnerTilReduksjon={harGrunnerTilReduksjon}
        readOnly={readOnly}
        handletUaktsomhetGrad={handletUaktsomhetGrad}
        erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse={harMerEnnEnYtelse}
        feilutbetalingBelop={feilutbetalingBelop}
        erTotalBelopUnder4Rettsgebyr={erTotalBelopUnder4Rettsgebyr}
      />
    )}
  </>
);

AktsomhetGradFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  erSerligGrunnAnnetValgt: PropTypes.bool.isRequired,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  erTotalBelopUnder4Rettsgebyr: PropTypes.bool.isRequired,
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
};

AktsomhetGradFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
};

export default AktsomhetGradFormPanel;
