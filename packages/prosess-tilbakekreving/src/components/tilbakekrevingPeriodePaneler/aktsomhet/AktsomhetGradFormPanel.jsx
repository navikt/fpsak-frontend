import React from 'react';
import PropTypes from 'prop-types';

import aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetGradForsettFormPanel from './AktsomhetGradForsettFormPanel';
import AktsomhetGradUaktsomhetFormPanel from './AktsomhetGradUaktsomhetFormPanel';

const AktsomhetGradFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  erValgtResultatTypeForstoBurdeForstaatt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
  andelSomTilbakekreves,
}) => (
  <>
    { handletUaktsomhetGrad === aktsomhet.FORSETT && (
      <AktsomhetGradForsettFormPanel
        readOnly={readOnly}
        erValgtResultatTypeForstoBurdeForstaatt={erValgtResultatTypeForstoBurdeForstaatt}
      />
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
        andelSomTilbakekreves={andelSomTilbakekreves}
      />
    )}
  </>
);

AktsomhetGradFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  erSerligGrunnAnnetValgt: PropTypes.bool.isRequired,
  erValgtResultatTypeForstoBurdeForstaatt: PropTypes.bool,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  erTotalBelopUnder4Rettsgebyr: PropTypes.bool.isRequired,
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
  andelSomTilbakekreves: PropTypes.string,
};

AktsomhetGradFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
  andelSomTilbakekreves: undefined,
};

export default AktsomhetGradFormPanel;
