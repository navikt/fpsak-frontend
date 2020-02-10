import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { CheckboxField, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';

import AktsomhetReduksjonAvBelopFormPanel from './AktsomhetReduksjonAvBelopFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const AktsomhetSarligeGrunnerFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  andelSomTilbakekreves,
}) => (
  <div>
    <Undertekst>
      <FormattedMessage id="AktsomhetSarligeGrunnerFormPanel.GrunnerTilReduksjon" />
    </Undertekst>
    <VerticalSpacer eightPx />
    {sarligGrunnTyper.map((sgt) => (
      <>
        <CheckboxField
          key={sgt.kode}
          name={sgt.kode}
          label={sgt.navn}
          readOnly={readOnly}
        />
        <VerticalSpacer eightPx />
      </>
    ))}
    {erSerligGrunnAnnetValgt && (
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
    <AktsomhetReduksjonAvBelopFormPanel
      harGrunnerTilReduksjon={harGrunnerTilReduksjon}
      readOnly={readOnly}
      handletUaktsomhetGrad={handletUaktsomhetGrad}
      harMerEnnEnYtelse={harMerEnnEnYtelse}
      feilutbetalingBelop={feilutbetalingBelop}
      andelSomTilbakekreves={andelSomTilbakekreves}
    />
  </div>
);

AktsomhetSarligeGrunnerFormPanel.propTypes = {
  harGrunnerTilReduksjon: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  handletUaktsomhetGrad: PropTypes.string.isRequired,
  erSerligGrunnAnnetValgt: PropTypes.bool.isRequired,
  harMerEnnEnYtelse: PropTypes.bool.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  andelSomTilbakekreves: PropTypes.string,
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
};

AktsomhetSarligeGrunnerFormPanel.defaultProps = {
  harGrunnerTilReduksjon: undefined,
  andelSomTilbakekreves: undefined,
};

export default AktsomhetSarligeGrunnerFormPanel;
