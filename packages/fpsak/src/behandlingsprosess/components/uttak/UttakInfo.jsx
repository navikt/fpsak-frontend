import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import FlexColumn from '@fpsak-frontend/shared-components/flexGrid/FlexColumn';
import FlexRow from '@fpsak-frontend/shared-components/flexGrid/FlexRow';
import FlexContainer from '@fpsak-frontend/shared-components/flexGrid/FlexContainer';
import {
  CheckboxField, DecimalField,
} from '@fpsak-frontend/form';
import {
  required,
  hasValidDecimal,
  maxValue,
} from '@fpsak-frontend/utils/validation/validators';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import periodeResultatType from '@fpsak-frontend/kodeverk/periodeResultatType';
import uttakArbeidTypeKodeverk from '@fpsak-frontend/kodeverk/uttakArbeidType';
import uttakArbeidTypeTekstCodes from '@fpsak-frontend/kodeverk/uttakArbeidTypeCodes';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/formats/';
import { calcDaysAndWeeks } from '@fpsak-frontend/utils/dateUtils';
import { Element, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment/moment';
import styles from './uttakActivity.less';

/**
 * UttakInfo
 * Presentationskomponent. Viser opp den faktiska informasjonen om en periode i uttak
 */

const maxValue200 = maxValue(200);

const periodeStatusClassName = (periode) => {
  if (periode.erOppfylt === false) {
    return styles.redDetailsPeriod;
  }
  if (periode.erOppfylt || (periode.periodeResultatType.kode === periodeResultatType.INNVILGET && !periode.tilknyttetStortinget)) {
    return styles.greenDetailsPeriod;
  }
  if (periode.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING || periode.tilknyttetStortinget) {
    return styles.orangeDetailsPeriod;
  }
  return styles.redDetailsPeriod;
};

const periodeIsInnvilget = (periode) => {
  if (periode.erOppfylt === false) {
    return false;
  }
  if (periode.erOppfylt || (periode.periodeResultatType.kode === periodeResultatType.INNVILGET)) {
    return true;
  }
  return false;
};

const gradertArbforhold = (selectedItem) => {
  let arbeidsforhold = '';
  if (selectedItem.gradertAktivitet) {
    const {
      arbeidsforholdNavn, arbeidsforholdOrgnr, uttakArbeidType,
    } = selectedItem.gradertAktivitet;

    if (uttakArbeidType && uttakArbeidType.kode !== uttakArbeidTypeKodeverk.ORDINÆRT_ARBEID) {
      arbeidsforhold = <FormattedMessage id={uttakArbeidTypeTekstCodes[uttakArbeidType.kode]} />;
    } else {
      arbeidsforhold = arbeidsforholdNavn ? `${arbeidsforholdNavn}` : arbeidsforhold;
      arbeidsforhold = arbeidsforholdOrgnr ? `${arbeidsforhold} (${arbeidsforholdOrgnr})` : arbeidsforhold;
    }
  }
  return arbeidsforhold;
};

const typePeriode = (selectedItem, kontoIkkeSatt) => {
  let returnText = '';
  if (selectedItem.utsettelseType.kode === '-' && !kontoIkkeSatt) {
    returnText = (<FormattedMessage id="UttakActivity.Uttak" />);
  } else if (selectedItem.utsettelseType.kode !== '-') {
    returnText = (<FormattedHTMLMessage id="UttakActivity.Utsettelse" values={{ utsettelseType: selectedItem.utsettelseType.navn }} />);
  } else if (kontoIkkeSatt) {
    returnText = (<FormattedMessage id="UttakActivity.IngenKonto" />);
  }
  return returnText;
};

const isInnvilgetText = (isApOpen, selectedItemData) => {
  let returnText = '';
  if (periodeIsInnvilget(selectedItemData)) {
    returnText = <FormattedHTMLMessage id="UttakActivity.InnvilgelseAarsak" values={{ innvilgelseAarsak: selectedItemData.periodeResultatÅrsak.navn }} />;
  } else {
    returnText = <FormattedHTMLMessage id="UttakActivity.IkkeOppfyltAarsak" values={{ avslagAarsak: selectedItemData.periodeResultatÅrsak.navn }} />;
  }
  return returnText;
};

const stonadskonto = (selectedItem, kontoIkkeSatt) => {
  let returnText = '';
  if (!kontoIkkeSatt) {
    returnText = selectedItem.aktiviteter[0].stønadskontoType.navn;
  }
  return returnText;
};

export const UttakInfo = ({
  selectedItemData,
  kontoIkkeSatt,
  isApOpen,
  readOnly,
  graderingInnvilget,
  erSamtidigUttak,
  stonadskontoer,
}) => (
  <Column xs="12">
    <div className={periodeStatusClassName(selectedItemData)}>
      <Row>
        <Column xs="4">
          <Row>
            <Column xs="12">
              <Element>
                {typePeriode(selectedItemData, kontoIkkeSatt)}
              </Element>
            </Column>
          </Row>
          <Row>
            <Column xs="12">{stonadskonto(selectedItemData, kontoIkkeSatt)}</Column>
          </Row>
        </Column>
        <Column xs="5">
          {readOnly
          && (
            <div>
              {isInnvilgetText(isApOpen, selectedItemData)}
            </div>
          )
          }
        </Column>
        <Column xs="3">
          {(stonadskontoer.FLERBARNSDAGER)
          && (
          <CheckboxField
            key="flerbarnsdager"
            name="flerbarnsdager"
            label={{ id: 'UttakActivity.Flerbarnsdager' }}
            disabled={readOnly}
          />
          )
          }
          <CheckboxField
            key="samtidigUttak"
            name="samtidigUttak"
            label={{ id: 'UttakActivity.SamtidigUttak' }}
            disabled={readOnly}
          />
          {erSamtidigUttak
            && (
              <FlexContainer>
                <FlexRow className={styles.fieldHorizontal}>
                  <FlexColumn className={styles.textAlignRight}>
                    <DecimalField
                      name="samtidigUttaksprosent"
                      bredde="XS"
                      readOnly={readOnly}
                      value={selectedItemData.samtidigUttaksprosent}
                      label={{ id: 'UttakInfo.SamtidigUttaksprosent' }}
                      validate={[required, maxValue200, hasValidDecimal]}
                      format={(value) => {
                        if (value || value === 0) {
                          return readOnly ? `${value} %` : value;
                        }
                        return '';
                      }}
                      normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                    />
                  </FlexColumn>
                  {!readOnly && <FlexColumn className={styles.suffix}>%</FlexColumn>}
                </FlexRow>
              </FlexContainer>
            )
          }
        </Column>
      </Row>
      <Row>
        <Column xs="4">
          <Row>
            <Column xs="12">
              <Element>
                <FormattedMessage
                  id="UttakActivity.PeriodeData.Periode"
                  values={{
                    fomVerdi: moment(selectedItemData.fom.toString())
                      .format(DDMMYYYY_DATE_FORMAT),
                    tomVerdi: moment(selectedItemData.tom.toString())
                      .format(DDMMYYYY_DATE_FORMAT),
                  }}
                />
              </Element>
            </Column>
          </Row>
          <Row>
            <Column xs="12">
              <FormattedMessage
                id={calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).id}
                values={{
                  weeks: calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).weeks,
                  days: calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).days,
                }}
              />
            </Column>
          </Row>
        </Column>
        <Column xs="6">
          <Row>
            <Column xs="12">
              {selectedItemData.gradertAktivitet
              && (
                <Undertekst>
                  <FormattedMessage id="UttakActivity.Gradering" />
                </Undertekst>
              )}
            </Column>
          </Row>
          <Row>
            <Column xs="12">
              {gradertArbforhold(selectedItemData)}
              {' '}
            </Column>

          </Row>
          {selectedItemData.gradertAktivitet && graderingInnvilget === false && readOnly && (
          <Row>
            <Column xs="12">
              <b>
                <FormattedMessage id="UttakActivity.GraderingIkkeOppfylt" />
                {': '}
              </b>
              {selectedItemData.graderingAvslagÅrsak.navn}
            </Column>
          </Row>
          )}
        </Column>
      </Row>
    </div>
  </Column>
);

UttakInfo.propTypes = {
  selectedItemData: PropTypes.PropTypes.shape().isRequired,
  stonadskontoer: PropTypes.shape().isRequired,
  kontoIkkeSatt: PropTypes.bool,
  isApOpen: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  graderingInnvilget: PropTypes.bool,
  erSamtidigUttak: PropTypes.bool,
};

UttakInfo.defaultProps = {
  kontoIkkeSatt: undefined,
  graderingInnvilget: undefined,
  erSamtidigUttak: undefined,
  isApOpen: undefined,
};

export default UttakInfo;
