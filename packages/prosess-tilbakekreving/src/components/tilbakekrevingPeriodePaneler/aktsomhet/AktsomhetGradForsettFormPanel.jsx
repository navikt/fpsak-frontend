import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import styles from './aktsomhetReduksjonAvBelopFormPanel.less';

const AktsomhetGradForsettFormPanel = ({
  readOnly,
  erValgtResultatTypeForstoBurdeForstaatt,
}) => (
  <div>
    <ArrowBox alignOffset={20}>
      {erValgtResultatTypeForstoBurdeForstaatt && (
        <Row>
          <Column md="6">
            <Undertekst>
              <FormattedMessage id="AktsomhetGradForsettFormPanel.Andel" />
            </Undertekst>
            <Normaltekst className={styles.labelPadding}>100 %</Normaltekst>
          </Column>
          <Column md="6">
            <RadioGroupField
              label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter" />}
              validate={[required]}
              name="skalDetTilleggesRenter"
              readOnly={readOnly}
            >
              <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Ja" />} value />
              <RadioOption label={<FormattedMessage id="AktsomhetReduksjonAvBelopFormPanel.Nei" />} value={false} />
            </RadioGroupField>
          </Column>
        </Row>
      )}
      {!erValgtResultatTypeForstoBurdeForstaatt && (
        <>
          <Undertekst>
            <FormattedMessage id="AktsomhetGradForsettFormPanel.Andel" />
          </Undertekst>
          <Normaltekst>100 %</Normaltekst>
          <VerticalSpacer eightPx />
          <Normaltekst>
            <FormattedMessage id="AktsomhetGradForsettFormPanel.Renter" />
          </Normaltekst>
        </>
      )}
    </ArrowBox>
  </div>
);

AktsomhetGradForsettFormPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erValgtResultatTypeForstoBurdeForstaatt: PropTypes.bool,
};

export default AktsomhetGradForsettFormPanel;
