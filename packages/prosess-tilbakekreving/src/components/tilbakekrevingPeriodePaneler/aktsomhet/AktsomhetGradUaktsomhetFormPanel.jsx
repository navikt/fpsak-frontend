import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';

import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';

import aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const sarligGrunnerBegrunnelseDiv = (readOnly) => (
  <div>
    <Element>
      <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.SærligGrunner" />
    </Element>
    <VerticalSpacer eightPx />
    <TextAreaField
      name="sarligGrunnerBegrunnelse"
      label={{ id: 'AktsomhetGradUaktsomhetFormPanel.VurderSærligGrunner' }}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
    />
    <VerticalSpacer twentyPx />
  </div>
);
const AktsomhetGradUaktsomhetFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
  andelSomTilbakekreves,
}) => (
  <ArrowBox alignOffset={handletUaktsomhetGrad === aktsomhet.GROVT_UAKTSOM ? 120 : 285}>
    {(handletUaktsomhetGrad === aktsomhet.SIMPEL_UAKTSOM && erTotalBelopUnder4Rettsgebyr) && (
      <>
        <Undertekst><FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Tilbakekrev" /></Undertekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          validate={[required]}
          name="tilbakekrevSelvOmBeloepErUnder4Rettsgebyr"
          readOnly={readOnly}
        >
          <RadioOption label={<FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Ja" />} value>
            {sarligGrunnerBegrunnelseDiv(readOnly)}
            <AktsomhetSarligeGrunnerFormPanel
              harGrunnerTilReduksjon={harGrunnerTilReduksjon}
              erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
              sarligGrunnTyper={sarligGrunnTyper}
              harMerEnnEnYtelse={harMerEnnEnYtelse}
              feilutbetalingBelop={feilutbetalingBelop}
              readOnly={readOnly}
              handletUaktsomhetGrad={handletUaktsomhetGrad}
              andelSomTilbakekreves={andelSomTilbakekreves}
            />
          </RadioOption>
          <RadioOption label={<FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Nei" />} value={false}>
            <ArrowBox alignOffset={20}>
              <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.AllePerioderBehandlesLikt" />
            </ArrowBox>
          </RadioOption>
        </RadioGroupField>
        <VerticalSpacer eightPx />
      </>
    )}
    {(handletUaktsomhetGrad !== aktsomhet.SIMPEL_UAKTSOM || !erTotalBelopUnder4Rettsgebyr) && (
      <>
        {sarligGrunnerBegrunnelseDiv(readOnly)}
        <AktsomhetSarligeGrunnerFormPanel
          harGrunnerTilReduksjon={harGrunnerTilReduksjon}
          erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
          sarligGrunnTyper={sarligGrunnTyper}
          harMerEnnEnYtelse={harMerEnnEnYtelse}
          feilutbetalingBelop={feilutbetalingBelop}
          readOnly={readOnly}
          handletUaktsomhetGrad={handletUaktsomhetGrad}
          andelSomTilbakekreves={andelSomTilbakekreves}
        />
      </>
    )}
  </ArrowBox>
);

AktsomhetGradUaktsomhetFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  erSerligGrunnAnnetValgt: PropTypes.bool.isRequired,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  erTotalBelopUnder4Rettsgebyr: PropTypes.bool.isRequired,
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
  andelSomTilbakekreves: PropTypes.string,
};

AktsomhetGradUaktsomhetFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
  andelSomTilbakekreves: undefined,
};

export default AktsomhetGradUaktsomhetFormPanel;
