import React from 'react';
import PropTypes from 'prop-types';
import { required } from '@fpsak-frontend/utils';
import { Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioOption, RadioGroupField } from '@fpsak-frontend/form';
import tilbakekrevingCodes from './tilbakekrevingCodes';

const Uaktsomhet = ({
  readOnly,
  resetFields,
}) => (
  <>
    <Undertekst><FormattedMessage id="Tilbakekreving.RadioGroup.HandletUaktsomhetGrad" /></Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name="handletUaktsomhetGrad"
      readOnly={readOnly}
      onChange={resetFields}
    >
      <RadioOption
        label={<FormattedMessage id="Tilbakekreving.RadioGroup.Forsett" />}
        value={tilbakekrevingCodes.FORSETT}
      />
      <RadioOption
        label={<FormattedMessage id="Tilbakekreving.RadioGroup.GrovUaktsomhet" />}
        value={tilbakekrevingCodes.GROVUAKTSOMHET}
      />
      <RadioOption
        label={<FormattedMessage id="Tilbakekreving.RadioGroup.SimpelUaktsomhet" />}
        value={tilbakekrevingCodes.MANGELFULLEOPPLYSNINGER}
      />
    </RadioGroupField>
  </>
);

Uaktsomhet.propTypes = {
  grunnerTilReduksjon: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  resetFields: PropTypes.func.isRequired,
};

export default Uaktsomhet;
