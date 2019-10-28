import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { required } from '@fpsak-frontend/utils';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray,
} from '@fpsak-frontend/shared-components';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

import TilretteleggingFieldArrayStillingsprosent from './TilretteleggingFieldArrayStillingsprosent';

import styles from './tilretteleggingFieldArray.less';

/**
 * BehovForTilrettteleggingFieldArray
 *
 * Viser inputfelter for tilrettelegging av arbeidsforhold for selvstendig næringsdrivende eller frilans.
 */
export const TilretteleggingFieldArray = ({
  intl,
  fields,
  meta,
  readOnly,
  formSectionName,
  behandlingId,
  behandlingVersjon,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    textCode="TilretteleggingFieldArray.LeggTilTilretteleggingsbehov"
    readOnly={readOnly}
  >
    {(fieldId, index, getRemoveButton) => (
      <Row key={fieldId} className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
        <Column xs="12">
          <FlexContainer>
            <FlexRow>
              <FlexColumn className={styles.halfColumn}>
                { index === 0 && (
                <Normaltekst className={styles.tilretteleggingTittel}>
                  <FormattedMessage id="TilretteleggingFieldArray.BehovForTilrettelegging" />
                </Normaltekst>
                )}
                <SelectField
                  readOnly={readOnly}
                  name={`${fieldId}.type.kode`}
                  label=""
                  validate={[required]}
                  placeholder={intl.formatMessage({ id: 'TilretteleggingFieldArray.VelgTilretteleggingPlaceholder' })}
                  selectValues={[
                    <option value={tilretteleggingType.HEL_TILRETTELEGGING} key={tilretteleggingType.HEL_TILRETTELEGGING}>
                      {intl.formatMessage({ id: 'TilretteleggingFieldArray.KanGjennomfores' })}
                    </option>,
                    <option value={tilretteleggingType.DELVIS_TILRETTELEGGING} key={tilretteleggingType.DELVIS_TILRETTELEGGING}>
                      {intl.formatMessage({ id: 'TilretteleggingFieldArray.RedusertArbeid' })}
                    </option>,
                    <option value={tilretteleggingType.INGEN_TILRETTELEGGING} key={tilretteleggingType.INGEN_TILRETTELEGGING}>
                      {intl.formatMessage({ id: 'TilretteleggingFieldArray.KanIkkeGjennomfores' })}
                    </option>,
                  ]}
                />
              </FlexColumn>
              <FlexColumn>
                { index === 0 && (
                <Normaltekst className={styles.tilretteleggingTittel}>
                  <FormattedMessage id="TilretteleggingFieldArray.Dato" />
                </Normaltekst>
                )}
                <DatepickerField
                  readOnly={readOnly}
                  name={`${fieldId}.fom`}
                  defaultValue={null}
                  label=""
                  validate={[required]}
                />
              </FlexColumn>
              <FlexColumn className={styles.smallColumn}>
                { index === 0 && (
                <Normaltekst className={styles.tilretteleggingTittel}>
                  <FormattedMessage id="TilretteleggingFieldArray.Stillingsprosent" />
                </Normaltekst>
                )}
                <TilretteleggingFieldArrayStillingsprosent
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
                  readOnly={readOnly}
                  tilretteleggingFieldId={fieldId}
                  index={index}
                  formSectionName={formSectionName}
                />
              </FlexColumn>
              <FlexColumn>
                { !readOnly && (
                  <>
                    { getRemoveButton() }
                  </>
                )}
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </Column>
      </Row>
    )}
  </PeriodFieldArray>
);

TilretteleggingFieldArray.propTypes = {
  intl: PropTypes.shape().isRequired,
  fields: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  meta: PropTypes.shape().isRequired,
  formSectionName: PropTypes.string.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

export default injectIntl(TilretteleggingFieldArray);
