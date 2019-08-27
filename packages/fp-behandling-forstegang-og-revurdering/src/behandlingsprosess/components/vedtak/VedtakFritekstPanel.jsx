import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  minLength, maxLength, requiredIfNotPristine, hasValidText, getLanguageCodeFromSprakkode, decodeHtmlEntity,
} from '@fpsak-frontend/utils';

import styles from './vedtakAvslagPanel.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

const VedtakFritekstPanelImpl = ({
  intl,
  behandlingsresultat,
  sprakkode,
  readOnly,
  labelTextCode,
}) => (
  <ElementWrapper>
    {!readOnly
    && (
    <Row>
      <VerticalSpacer sixteenPx />
      <Column xs="8">
        <TextAreaField
          name="begrunnelse"
          label={intl.formatMessage({ id: labelTextCode })}
          validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
          badges={[{
            type: 'fokus',
            textId: getLanguageCodeFromSprakkode(sprakkode),
            title: 'Malform.Beskrivelse',
          }]}
        />
      </Column>
    </Row>
    )}
    {readOnly && behandlingsresultat.avslagsarsakFritekst !== null
    && (
    <span>
      <VerticalSpacer twentyPx />
      <Undertekst>{intl.formatMessage({ id: labelTextCode })}</Undertekst>
      <VerticalSpacer eightPx />
      <div className={styles.fritekstItem}>{decodeHtmlEntity(behandlingsresultat.avslagsarsakFritekst)}</div>
    </span>
    )}
  </ElementWrapper>
);

VedtakFritekstPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  labelTextCode: PropTypes.string.isRequired,
};
const VedtakFritekstPanel = injectIntl(VedtakFritekstPanelImpl);
export default VedtakFritekstPanel;
