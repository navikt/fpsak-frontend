import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { FormattedMessage } from 'react-intl';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import {
  required, minValue, maxValue, hasValidDecimal,
} from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import OAType from 'kodeverk/opptjeningAktivitetType';
import DatepickerField from 'form/fields/DatepickerField';
import { InputField, DecimalField } from 'form/Fields';
import ElementWrapper from 'sharedComponents/ElementWrapper';

import styles from './activityDataSubPanel.less';

const ytelseTypes = [OAType.SYKEPENGER, OAType.FORELDREPENGER, OAType.PLEIEPENGER, OAType.SVANGERSKAPSPENGER, OAType.UTENLANDSK_ARBEIDSFORHOLD];

const isOfType = (selectedActivityType, ...opptjeningAktivitetType) => selectedActivityType && opptjeningAktivitetType.includes(selectedActivityType.kode);

const minValue0 = minValue(0);
const maxValue100 = maxValue(100);

const getOppdragsgiverMessageId = selectedActivityType => (isOfType(selectedActivityType, OAType.FRILANS)
  ? 'ActivityPanel.Oppdragsgiver' : 'ActivityPanel.Arbeidsgiver');

const getArbeidsgiver = (initialValues) => {
  if (initialValues.arbeidsgiver) {
    return initialValues.oppdragsgiverOrg
      ? `${initialValues.arbeidsgiver} (${initialValues.oppdragsgiverOrg})`
      : initialValues.arbeidsgiver;
  }
  return '-';
};

const isManuallyAddedAndNotUtenlandskArbeidsforhold = (
  isManuallyAdded, selectedActivityType,
) => isManuallyAdded && !isOfType(selectedActivityType, OAType.UTENLANDSK_ARBEIDSFORHOLD);
const isManuallyAddedAndUtenlandskArbeidsforhold = (
  isManuallyAdded, selectedActivityType,
) => isManuallyAdded && isOfType(selectedActivityType, OAType.UTENLANDSK_ARBEIDSFORHOLD);

/**
 * ActivityDataSubPanel
 *
 * Presentasjonskomponent. Viser informasjon om valgt aktivitet
 */
const ActivityDataSubPanel = ({
  initialValues,
  readOnly,
  isManuallyAdded,
  selectedActivityType,
}) => (
  <ElementWrapper>
    {isOfType(selectedActivityType, ...[OAType.ARBEID, OAType.NARING, ...ytelseTypes])
    && (
    <Row>
      <Column xs="7">
        {!isManuallyAdded
        && (
        <ElementWrapper>
          <Undertekst>
            <FormattedMessage id={getOppdragsgiverMessageId(selectedActivityType)} />
          </Undertekst>
          <div className={styles.arbeidsgiver}>
            <Normaltekst>{getArbeidsgiver(initialValues)}</Normaltekst>
          </div>
        </ElementWrapper>
        )
        }
        { isManuallyAddedAndNotUtenlandskArbeidsforhold(isManuallyAdded, selectedActivityType)
        && (
        <InputField
          name="oppdragsgiverOrg"
          label={{ id: 'ActivityPanel.Organisasjonsnr' }}
          validate={[required]}
          readOnly={readOnly}
          bredde="S"
        />
        )
        }
        { isManuallyAddedAndUtenlandskArbeidsforhold(isManuallyAdded, selectedActivityType)
        && (
        <InputField
          name="arbeidsgiver"
          label={{ id: 'ActivityPanel.Arbeidsgiver' }}
          validate={[required]}
          readOnly={readOnly}
          bredde="XL"
        />
        )
        }
      </Column>
      {isOfType(selectedActivityType, OAType.ARBEID)
        && (
        <Column xs="5">
          <DecimalField
            name="stillingsandel"
            label={{ id: 'ActivityPanel.Stillingsandel' }}
            validate={[required, minValue0, maxValue100, hasValidDecimal]}
            readOnly={readOnly || !isManuallyAdded}
            bredde="S"
            format={value => (readOnly || !isManuallyAdded ? `${value} %` : value)}
            normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
          />
        </Column>
        )
      }
    </Row>
    )
    }
    <VerticalSpacer eightPx />
    {isOfType(selectedActivityType, OAType.NARING)
    && (
    <Row>
      <Column xs="8">
        <DatepickerField
          name="naringRegistreringsdato"
          label={{ id: 'ActivityPanel.Registreringsdato' }}
          readOnly
        />
      </Column>
    </Row>
    )
    }
  </ElementWrapper>
);

ActivityDataSubPanel.propTypes = {
  initialValues: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  isManuallyAdded: PropTypes.bool.isRequired,
  selectedActivityType: PropTypes.shape(),
};

ActivityDataSubPanel.defaultProps = {
  selectedActivityType: {},
};

export default ActivityDataSubPanel;
