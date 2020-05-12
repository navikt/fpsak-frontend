import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import { Behandlingsresultat, Kodeverk } from '@fpsak-frontend/types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  decodeHtmlEntity, getLanguageCodeFromSprakkode, hasValidText, maxLength, minLength, requiredIfNotPristine,
} from '@fpsak-frontend/utils';

import styles from './vedtakFritekstPanel.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

interface OwnProps {
  behandlingsresultat: Behandlingsresultat;
  sprakkode: Kodeverk;
  readOnly: boolean;
  labelTextCode: string;
}

const VedtakFritekstPanelImpl: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingsresultat,
  sprakkode,
  readOnly,
  labelTextCode,
}) => (
  <>
    {!readOnly && (
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
    {readOnly && behandlingsresultat.avslagsarsakFritekst !== null && (
      <span>
        <VerticalSpacer twentyPx />
        <Undertekst>{intl.formatMessage({ id: labelTextCode })}</Undertekst>
        <VerticalSpacer eightPx />
        <div className={styles.fritekstItem}>{decodeHtmlEntity(behandlingsresultat.avslagsarsakFritekst)}</div>
      </span>
    )}
  </>
);

export default injectIntl(VedtakFritekstPanelImpl);
