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

import aktsomhet from '../../../kodeverk/aktsomhet';
import UaktsomhetGradFormPanel from './UaktsomhetGradFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const uaktsomhetCodes = [
  aktsomhet.GROVT_UAKTSOM,
  aktsomhet.SIMPEL_UAKTSOM,
  aktsomhet.FORSETT,
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
        value={aktsomhet.FORSETT}
      />
      <RadioOption
        label={<FormattedMessage id="UaktsomhetFormPanel.GrovUaktsomhet" />}
        value={aktsomhet.GROVT_UAKTSOM}
      />
      <RadioOption
        label={<FormattedMessage id="UaktsomhetFormPanel.SimpelUaktsomhet" />}
        value={aktsomhet.SIMPEL_UAKTSOM}
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
