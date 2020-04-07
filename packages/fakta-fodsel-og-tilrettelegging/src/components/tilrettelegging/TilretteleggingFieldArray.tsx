import React, { FunctionComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';

import {
  DatepickerField, SelectField, DecimalField, behandlingFormValueSelector,
} from '@fpsak-frontend/form';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  hasValidDecimal, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import { Kodeverk } from '@fpsak-frontend/types';

import TilretteleggingUtbetalingsgrad from './TilretteleggingUtbetalingsgrad';

import styles from './tilretteleggingFieldArray.less';

const maxValue100 = maxValue(100);
const minValue0 = minValue(0);

export const finnUtbetalingsgradForDelvisTilrettelegging = (stillingsprosentArbeidsforhold: number, stillingsprosent?: number): string => {
  const defaultUtbetalingsgrad = 100 * (1 - (stillingsprosent / stillingsprosentArbeidsforhold));
  return defaultUtbetalingsgrad > 0 ? defaultUtbetalingsgrad.toFixed(2) : '0';
};

interface TilretteleggingDato {
  type: Kodeverk;
  stillingsprosent: number;
}

interface OwnProps {
  fields: {}[];
  meta?: {
    error?: {
      id: string;
      values?: {[key: string]: string};
    };
    dirty: boolean;
    submitFailed: boolean;
  };
  readOnly: boolean;
  formSectionName: string;
  erOverstyrer: boolean;
  changeField: (field: string, value: string) => void;
  tilretteleggingDatoer: TilretteleggingDato[];
  stillingsprosentArbeidsforhold: number;
  setOverstyrtUtbetalingsgrad: (erOverstyrt: boolean) => void;
}

/**
 * BehovForTilrettteleggingFieldArray
 *
 * Viser inputfelter for tilrettelegging av arbeidsforhold for selvstendig næringsdrivende eller frilans.
 */
export const TilretteleggingFieldArray: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  fields,
  meta,
  readOnly,
  formSectionName,
  erOverstyrer,
  changeField,
  tilretteleggingDatoer,
  stillingsprosentArbeidsforhold,
  setOverstyrtUtbetalingsgrad,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    textCode="TilretteleggingFieldArray.LeggTilTilretteleggingsbehov"
    readOnly={readOnly}
  >
    {(fieldId: string, index, getRemoveButton: () => ReactNode) => {
      const data = tilretteleggingDatoer[index];
      const tilretteleggingKode = data && data.type ? data.type.kode : undefined;
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
                    onChange={(_elmt, value) => {
                      if (value === tilretteleggingType.INGEN_TILRETTELEGGING) {
                        changeField(`${formSectionName}.tilretteleggingDatoer[${index}].overstyrtUtbetalingsgrad`, '100');
                      }
                      if (value === tilretteleggingType.DELVIS_TILRETTELEGGING) {
                        const utbetalingsgrad = finnUtbetalingsgradForDelvisTilrettelegging(stillingsprosentArbeidsforhold, data.stillingsprosent);
                        changeField(`${formSectionName}.tilretteleggingDatoer[${index}].overstyrtUtbetalingsgrad`, utbetalingsgrad);
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
                  <>
                    <FlexColumn>
                      <DecimalField
                        className={styles.textField}
                        readOnly={readOnly}
                        name={`${fieldId}.stillingsprosent`}
                        label={intl.formatMessage({ id: 'TilretteleggingFieldArray.Stillingsprosent' })}
                        validate={[required, minValue0, maxValue100, hasValidDecimal]}
                        normalizeOnBlur={(value) => (new RegExp(/^-?\d+\.?\d*$/).test(value) ? parseFloat(value).toFixed(2) : value)}
                        onChange={(_elmt, value) => {
                          const utbetalingsgrad = finnUtbetalingsgradForDelvisTilrettelegging(stillingsprosentArbeidsforhold, value);
                          changeField(`${formSectionName}.tilretteleggingDatoer[${index}].overstyrtUtbetalingsgrad`, utbetalingsgrad);
                        }}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.buttonMargin}>
                      %
                    </FlexColumn>
                  </>
                )}
                {((data && data.stillingsprosent && tilretteleggingKode === tilretteleggingType.DELVIS_TILRETTELEGGING)
                    || tilretteleggingKode === tilretteleggingType.INGEN_TILRETTELEGGING) && (
                    <TilretteleggingUtbetalingsgrad
                      fieldId={fieldId}
                      erOverstyrer={erOverstyrer}
                      tilretteleggingKode={tilretteleggingKode}
                      readOnly={readOnly}
                      setOverstyrtUtbetalingsgrad={setOverstyrtUtbetalingsgrad}
                    />
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
