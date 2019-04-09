import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer, ArrowBox } from '@fpsak-frontend/shared-components';
import { RadioOption, RadioGroupField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';

import UaktsomhetGradForsettPanel from './UaktsomhetGradForsettPanel';
import UaktsomhetSarligeGrunnerFormPanel from './UaktsomhetSarligeGrunnerFormPanel';
import aktsomhet from '../../../kodeverk/aktsomhet';

const UaktsomhetGradFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  annet,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
}) => (
  <>
    { handletUaktsomhetGrad === aktsomhet.FORSETT && (
      <UaktsomhetGradForsettPanel />
    )}
    { handletUaktsomhetGrad !== aktsomhet.FORSETT && (
      <ArrowBox alignOffset={handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM ? 120 : 285}>
        {(handletUaktsomhetGrad === aktsomhet.SIMPEL_UAKTSOM && erTotalBelopUnder4Rettsgebyr) && (
          <>
            <Undertekst><FormattedMessage id="UaktsomhetGradFormPanel.Tilbakekrev" /></Undertekst>
            <VerticalSpacer eightPx />
            <RadioGroupField
              validate={[required]}
              name="tilbakekrevSelvOmBeloepErUnder4Rettsgebyr"
              readOnly={readOnly}
            >
              <RadioOption label={<FormattedMessage id="UaktsomhetGradFormPanel.Ja" />} value>
                <UaktsomhetSarligeGrunnerFormPanel
                  harGrunnerTilReduksjon={harGrunnerTilReduksjon}
                  annet={annet}
                  sarligGrunnTyper={sarligGrunnTyper}
                  harMerEnnEnYtelse={harMerEnnEnYtelse}
                  feilutbetalingBelop={feilutbetalingBelop}
                  readOnly={readOnly}
                  handletUaktsomhetGrad={handletUaktsomhetGrad}
                />
              </RadioOption>
              <RadioOption label={<FormattedMessage id="UaktsomhetGradFormPanel.Nei" />} value={false}>
                <ArrowBox alignOffset={20}>
                  <FormattedMessage id="UaktsomhetGradFormPanel.AllePerioderBehandlesLikt" />
                </ArrowBox>
              </RadioOption>
            </RadioGroupField>
            <VerticalSpacer eightPx />
          </>
        )}
        {(handletUaktsomhetGrad !== aktsomhet.SIMPEL_UAKTSOM || !erTotalBelopUnder4Rettsgebyr) && (
          <UaktsomhetSarligeGrunnerFormPanel
            harGrunnerTilReduksjon={harGrunnerTilReduksjon}
            annet={annet}
            sarligGrunnTyper={sarligGrunnTyper}
            harMerEnnEnYtelse={harMerEnnEnYtelse}
            feilutbetalingBelop={feilutbetalingBelop}
            readOnly={readOnly}
            handletUaktsomhetGrad={handletUaktsomhetGrad}
          />
        )}
      </ArrowBox>
    )}
  </>
);

UaktsomhetGradFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  annet: PropTypes.bool.isRequired,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  erTotalBelopUnder4Rettsgebyr: PropTypes.bool.isRequired,
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
};

UaktsomhetGradFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
};

export default UaktsomhetGradFormPanel;
