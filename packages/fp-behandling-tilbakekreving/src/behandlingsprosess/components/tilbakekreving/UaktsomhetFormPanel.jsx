import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FormSection } from 'redux-form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Undertekst, Element } from 'nav-frontend-typografi';

import {
 required, minLength, maxLength, hasValidText,
} from '@fpsak-frontend/utils';
import { TextAreaField, RadioOption, RadioGroupField } from '@fpsak-frontend/form';

import UaktsomhetGradFormPanel from './UaktsomhetGradFormPanel';
import tilbakekrevingCodes from './tilbakekrevingCodes';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const uaktsomhetCodes = [
  tilbakekrevingCodes.GROVUAKTSOMHET,
  tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER,
  tilbakekrevingCodes.FORSETT,
];

const UaktsomhetFormPanel = ({
  readOnly,
  resetFields,
  resetAnnetTextField,
  handletUaktsomhetGrad,
  grunnerTilReduksjon,
  annet,
  andelSomSkalTilbakekreves,
}) => (
  <>
    <Element>
      <FormattedMessage id="UaktsomhetFormPanel.Aktsomhet" />
    </Element>
    <VerticalSpacer eightPx />
    <TextAreaField
      name="aktsomhetBegrunnelse"
      label={{ id: 'UaktsomhetFormPanel.Vurdering' }}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
    />
    <Undertekst><FormattedMessage id="UaktsomhetFormPanel.HandletUaktsomhetGrad" /></Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name="handletUaktsomhetGrad"
      readOnly={readOnly}
      onChange={resetFields}
    >
      <RadioOption
        label={<FormattedMessage id="UaktsomhetFormPanel.Forsett" />}
        value={tilbakekrevingCodes.FORSETT}
      />
      <RadioOption
        label={<FormattedMessage id="UaktsomhetFormPanel.GrovUaktsomhet" />}
        value={tilbakekrevingCodes.GROVUAKTSOMHET}
      />
      <RadioOption
        label={<FormattedMessage id="UaktsomhetFormPanel.SimpelUaktsomhet" />}
        value={tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER}
      />
    </RadioGroupField>
    { uaktsomhetCodes.includes(handletUaktsomhetGrad) && (
      <FormSection name={handletUaktsomhetGrad} key={handletUaktsomhetGrad}>
        <UaktsomhetGradFormPanel
          grunnerTilReduksjon={grunnerTilReduksjon}
          readOnly={readOnly}
          handletUaktsomhetGrad={handletUaktsomhetGrad}
          annet={annet}
          resetAnnetTextField={resetAnnetTextField}
          andelSomSkalTilbakekreves={andelSomSkalTilbakekreves}
        />
      </FormSection>
    )}
  </>
);

UaktsomhetFormPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  resetFields: PropTypes.func.isRequired,
  resetAnnetTextField: PropTypes.func.isRequired,
  grunnerTilReduksjon: PropTypes.bool,
  annet: PropTypes.bool,
  handletUaktsomhetGrad: PropTypes.string,
  andelSomSkalTilbakekreves: PropTypes.number.isRequired,
};

UaktsomhetGradFormPanel.defaultProps = {
  annet: false,
  grunnerTilReduksjon: false,
  handletUaktsomhetGrad: undefined,
};

export default UaktsomhetFormPanel;
