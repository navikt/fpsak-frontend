import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import {
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
 CheckboxField, TextAreaField,
} from '@fpsak-frontend/form';
import {
  minLength,
  maxLength,
  hasValidText,
  required,
} from '@fpsak-frontend/utils';

import UaktsomhetReduksjonAvBelopFormPanel from './UaktsomhetReduksjonAvBelopFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const UaktsomhetSarligeGrunnerFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  annet,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
}) => (
  <div>
    <Undertekst>
      <FormattedMessage id="UaktsomhetGradFormPanel.GrunnerTilReduksjon" />
    </Undertekst>
    <VerticalSpacer eightPx />
    {sarligGrunnTyper.map(sgt => (
      <CheckboxField
        key={sgt.kode}
        name={sgt.kode}
        label={sgt.navn}
      />
    ))}
    {annet && (
      <Row>
        <Column md="1" />
        <Column md="10">
          <TextAreaField
            name="annetBegrunnelse"
            label=""
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </Column>
      </Row>
    )}
    <UaktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon={harGrunnerTilReduksjon}
      readOnly={readOnly}
      handletUaktsomhetGrad={handletUaktsomhetGrad}
      harMerEnnEnYtelse={harMerEnnEnYtelse}
      feilutbetalingBelop={feilutbetalingBelop}
    />
  </div>
);

UaktsomhetSarligeGrunnerFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  annet: PropTypes.bool.isRequired,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
};

UaktsomhetSarligeGrunnerFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
};

export default UaktsomhetSarligeGrunnerFormPanel;
