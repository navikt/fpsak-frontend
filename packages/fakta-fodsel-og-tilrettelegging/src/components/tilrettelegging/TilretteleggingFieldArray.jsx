import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { injectIntl } from 'react-intl';

import { required } from '@fpsak-frontend/utils';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

import TilretteleggingFieldArrayStillingsprosent from './TilretteleggingFieldArrayStillingsprosent';
import TilretteleggingFieldArrayUtbetalingsgrad from './TilretteleggingFieldArrayUtbetalingsgrad';

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
  erOverstyrer,
  changeField,
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
              <FlexColumn>
                <SelectField
                  readOnly={readOnly}
                  name={`${fieldId}.type.kode`}
                  label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Tilretteleggingsbehov' })}
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
                  onChange={(elmt, value) => {
                    if (value === tilretteleggingType.INGEN_TILRETTELEGGING) {
                      changeField(`${formSectionName}.tilretteleggingDatoer[${index}].overstyrtUtbetalingsgrad`, 100);
                    }
                    if (value === tilretteleggingType.DELVIS_TILRETTELEGGING) {
                      changeField(`${formSectionName}.tilretteleggingDatoer[${index}].overstyrtUtbetalingsgrad`, 100);
                    }
                  }}
                />
              </FlexColumn>
              <FlexColumn className={styles.removeButtonMargin}>
                { !readOnly && (
                  <>
                      { getRemoveButton() }
                  </>
                )}
              </FlexColumn>
            </FlexRow>
            <FlexRow>
              <FlexColumn>
                <DatepickerField
                  readOnly={readOnly}
                  name={`${fieldId}.fom`}
                  defaultValue={null}
                  label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Dato' })}
                  validate={[required]}
                />
              </FlexColumn>
              <TilretteleggingFieldArrayStillingsprosent
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                readOnly={readOnly}
                tilretteleggingFieldId={fieldId}
                index={index}
                formSectionName={formSectionName}
              />
              <FlexColumn className={styles.smallColumn}>
                <TilretteleggingFieldArrayUtbetalingsgrad
                  behandlingId={behandlingId}
                  behandlingVersjon={behandlingVersjon}
                  readOnly={readOnly}
                  tilretteleggingFieldId={fieldId}
                  index={index}
                  formSectionName={formSectionName}
                  erOverstyrer={erOverstyrer}
                />
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
          <VerticalSpacer sixteenPx />
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
  erOverstyrer: PropTypes.bool.isRequired,
};

export default injectIntl(TilretteleggingFieldArray);
