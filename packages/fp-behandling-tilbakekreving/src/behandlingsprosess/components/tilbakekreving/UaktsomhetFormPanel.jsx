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
  harGrunnerTilReduksjon,
  annet,
  aktsomhetTyper,
  sarligGrunnTyper,
  antallYtelser,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
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
      {aktsomhetTyper.map(vrt => (
        <RadioOption
          key={vrt.kode}
          label={vrt.navn}
          value={vrt.kode}
        />
      ))}
    </RadioGroupField>
    { uaktsomhetCodes.includes(handletUaktsomhetGrad) && (
      <FormSection name={handletUaktsomhetGrad} key={handletUaktsomhetGrad}>
        <UaktsomhetGradFormPanel
          harGrunnerTilReduksjon={harGrunnerTilReduksjon}
          readOnly={readOnly}
          handletUaktsomhetGrad={handletUaktsomhetGrad}
          annet={annet}
          resetAnnetTextField={resetAnnetTextField}
          sarligGrunnTyper={sarligGrunnTyper}
          harMerEnnEnYtelse={antallYtelser - 2 > 1}
          feilutbetalingBelop={feilutbetalingBelop}
          erTotalBelopUnder4Rettsgebyr={erTotalBelopUnder4Rettsgebyr}
        />
      </FormSection>
    )}
  </>
);

UaktsomhetFormPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  resetFields: PropTypes.func.isRequired,
  resetAnnetTextField: PropTypes.func.isRequired,
  harGrunnerTilReduksjon: PropTypes.bool,
  annet: PropTypes.bool,
  handletUaktsomhetGrad: PropTypes.string,
  antallYtelser: PropTypes.number.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  erTotalBelopUnder4Rettsgebyr: PropTypes.bool.isRequired,
  aktsomhetTyper: PropTypes.arrayOf(PropTypes.shape()),
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
};

UaktsomhetGradFormPanel.defaultProps = {
  annet: false,
  harGrunnerTilReduksjon: undefined,
  handletUaktsomhetGrad: undefined,
};

export default UaktsomhetFormPanel;
