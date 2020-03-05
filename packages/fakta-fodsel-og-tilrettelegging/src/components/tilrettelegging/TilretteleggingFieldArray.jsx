import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { injectIntl, FormattedMessage } from 'react-intl';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';

import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import { DatepickerField, SelectField, DecimalField } from '@fpsak-frontend/form';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray, VerticalSpacer, Image,
} from '@fpsak-frontend/shared-components';
import {
  hasValidDecimal, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import endreImage from '@fpsak-frontend/assets/images/endre.svg';
import endretImage from '@fpsak-frontend/assets/images/endret_felt.svg';

import styles from './tilretteleggingFieldArray.less';

const maxValue100 = maxValue(100);
const minValue0 = minValue(0);

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
  erOverstyrer,
  changeField,
  tilretteleggingDatoer,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    textCode="TilretteleggingFieldArray.LeggTilTilretteleggingsbehov"
    readOnly={readOnly}
  >
    {(fieldId, index, getRemoveButton) => {
      const data = tilretteleggingDatoer[index];
      const tilretteleggingKode = data.type ? data.type.kode : undefined;
      return (
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
                        const defaultUtbetalingsgrad = 100 * (1 - 23 / data.stillingsprosent);
                        changeField(`${formSectionName}.tilretteleggingDatoer[${index}].overstyrtUtbetalingsgrad`, defaultUtbetalingsgrad);
                      }
                    }}
                  />
                </FlexColumn>
                <FlexColumn className={styles.removeButtonMargin}>
                  {!readOnly && (
                    <>
                      { getRemoveButton() }
                    </>
                  )}
                </FlexColumn>
              </FlexRow>
              {tilretteleggingKode === tilretteleggingType.DELVIS_TILRETTELEGGING && (
                <FlexRow>
                  <FlexColumn>
                    <AlertStripe type="info" form="inline">
                      <Element>
                        <FormattedMessage id="TilretteleggingFieldArray.StillingsprosentUtvidet" />
                      </Element>
                    </AlertStripe>
                    <VerticalSpacer eightPx />
                  </FlexColumn>
                </FlexRow>
              )}
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
                {tilretteleggingKode === tilretteleggingType.DELVIS_TILRETTELEGGING && (
                  <FlexColumn>
                    <DecimalField
                      readOnly={readOnly}
                      name={`${fieldId}.stillingsprosent`}
                      label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Stillingsprosent' })}
                      validate={[required, minValue0, maxValue100, hasValidDecimal]}
                      normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                    />
                  </FlexColumn>
                )}
                {(tilretteleggingKode === tilretteleggingType.DELVIS_TILRETTELEGGING || tilretteleggingKode === tilretteleggingType.INGEN_TILRETTELEGGING) && (
                  <FlexColumn>
                    <FlexContainer>
                      <FlexRow>
                        <FlexColumn>
                          <DecimalField
                            readOnly={readOnly}
                            name={`${fieldId}.overstyrtUtbetalingsgrad`}
                            label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Utbetalingsgrad' })}
                            validate={[required, minValue0, maxValue100, hasValidDecimal]}
                            normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                          />
                        </FlexColumn>
                        {erOverstyrer && (
                          <FlexColumn>
                            <Image
                              className={styles.buttonMargin}
                              src={erOverstyrer ? endreImage : endretImage}
                              tabIndex="0"
                            />
                          </FlexColumn>
                        )}
                      </FlexRow>
                    </FlexContainer>
                  </FlexColumn>
                )}
              </FlexRow>
            </FlexContainer>
            <VerticalSpacer sixteenPx />
          </Column>
        </Row>
      );
    }}
  </PeriodFieldArray>
);

TilretteleggingFieldArray.propTypes = {
  intl: PropTypes.shape().isRequired,
  fields: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  meta: PropTypes.shape().isRequired,
  formSectionName: PropTypes.string.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  changeField: PropTypes.func.isRequired,
  tilretteleggingDatoer: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const {
    behandlingId, behandlingVersjon, formSectionName,
  } = ownProps;
  return {
    tilretteleggingDatoer: behandlingFormValueSelector('FodselOgTilretteleggingForm', behandlingId, behandlingVersjon)(state,
      `${formSectionName}.tilretteleggingDatoer`),
  };
};

export default connect(mapStateToProps)(injectIntl(TilretteleggingFieldArray));
