import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import {
  injectIntl, intlShape, FormattedMessage, FormattedHTMLMessage,
} from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import moment from 'moment';

import { findDifferenceInMonthsAndDays } from 'utils/dateUtils';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import { omit, isEqual } from 'utils/objectUtils';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import Image from 'sharedComponents/Image';
import { getKodeverk } from 'kodeverk/duck';
import arbeidType from 'kodeverk/arbeidType';
import opptjeningAktivitetType from 'kodeverk/opptjeningAktivitetType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import {
  requiredIfCustomFunctionIsTrue, required, hasValidPeriod, minLength, maxLength, hasValidText, isWithinOpptjeningsperiode,
}
  from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import {
  PeriodpickerField, RadioGroupField, RadioOption, TextAreaField, SelectField,
} from 'form/Fields';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import arrowLeftImageUrl from 'images/arrow_left.svg';
import arrowLeftFilledImageUrl from 'images/arrow_left_filled.svg';
import arrowRightImageUrl from 'images/arrow_right.svg';
import arrowRightFilledImageUrl from 'images/arrow_right_filled.svg';
import ActivityDataSubPanel from './ActivityDataSubPanel';

import styles from './activityPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

function erFraAvvikendeKode(atCodes, oat) {
  return (atCodes.includes(arbeidType.LONN_UNDER_UTDANNING) && oat.kode === opptjeningAktivitetType.VIDERE_ETTERUTDANNING)
    || (atCodes.includes(arbeidType.FRILANSER) && oat.kode === opptjeningAktivitetType.FRILANS);
}

const filterActivityType = (opptjeningAktivitetTypes, erManueltOpprettet, arbeidTypes) => {
  if (!erManueltOpprettet) {
    return opptjeningAktivitetTypes;
  }

  const atCodes = arbeidTypes.map(at => at.kode);
  return opptjeningAktivitetTypes.filter(oat => atCodes.includes(oat.kode)
    || erFraAvvikendeKode(atCodes, oat));
};

const shouldDisablePeriodpicker = (hasAksjonspunkt, initialValues) => {
  if (!hasAksjonspunkt) {
    return true;
  }
  return !initialValues.erManueltOpprettet && !!initialValues.erGodkjent && !initialValues.erEndret;
};

const hasMerknad = activity => !!activity.erGodkjent && !activity.erManueltOpprettet && activity.erEndret;
const findArrowLeftImg = isHovering => (isHovering ? arrowLeftFilledImageUrl : arrowLeftImageUrl);
const findArrowRightImg = isHovering => (isHovering ? arrowRightFilledImageUrl : arrowRightImageUrl);

const findInYearsMonthsAndDays = (opptjeningFom, opptjeningTom) => {
  const difference = findDifferenceInMonthsAndDays(opptjeningFom, opptjeningTom);
  if (!difference) {
    return <span />;
  }
  return difference.months >= 1
    ? <FormattedMessage id="ActivityPanel.MonthsAndDays" values={{ months: difference.months, days: difference.days }} />
    : <FormattedMessage id="ActivityPanel.Days" values={{ days: difference.days }} />;
};

const isBegrunnelseRequired = (allValues, props) => {
  if (props.pristine) {
    return false;
  } if (allValues.erGodkjent === false) {
    return true;
  }
  return !isEqual(omit(props.initialValues, 'erGodkjent'), omit(allValues, 'erGodkjent'));
};
const requiredCustom = requiredIfCustomFunctionIsTrue(isBegrunnelseRequired);

export const activityPanelName = 'ActivityPanel';

/**
 * ActivityPanel
 *
 * Presentasjonskomponent. Viser informasjon om valgt aktivitet
 */
export const ActivityPanel = ({
  intl,
  initialValues,
  readOnly,
  opptjeningAktivitetTypes,
  cancelSelectedOpptjeningActivity,
  selectedActivityType,
  activityId,
  opptjeningFom,
  opptjeningTom,
  selectNextPeriod,
  selectPrevPeriod,
  hasAksjonspunkt,
  opptjeningFomDato,
  opptjeningTomDato,
  ...formProps
}) => (
  <FaktaGruppe className={styles.panel} aksjonspunktCode={hasMerknad(initialValues) ? aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING : undefined}>
    <Row>
      <Column xs="10">
        <Element><FormattedMessage id={initialValues.id ? 'ActivityPanel.Details' : 'ActivityPanel.NewActivity'} /></Element>
      </Column>
      <Column xs="2">
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          imageSrcFunction={findArrowLeftImg}
          altCode="Timeline.prevPeriod"
          onMouseDown={selectPrevPeriod}
          onKeyDown={selectPrevPeriod}
        />
        <Image
          tabIndex="0"
          className={styles.timeLineButton}
          imageSrcFunction={findArrowRightImg}
          altCode="Timeline.nextPeriod"
          onMouseDown={selectNextPeriod}
          onKeyDown={selectNextPeriod}
        />
      </Column>
    </Row>
    <Row>
      <Column xs="7">
        <FlexContainer fluid>
          <FlexRow>
            <FlexColumn>
              <PeriodpickerField
                key={activityId}
                names={['opptjeningFom', 'opptjeningTom']}
                label={{ id: 'ActivityPanel.Period' }}
                readOnly={readOnly || shouldDisablePeriodpicker(hasAksjonspunkt, initialValues)}
                disabledDays={{ before: moment(opptjeningFomDato).toDate(), after: moment(opptjeningTomDato).toDate() }}
                isEdited={initialValues.erPeriodeEndret}
              />
            </FlexColumn>
            <FlexColumn>
              <Normaltekst className={styles.period}>
                {findInYearsMonthsAndDays(opptjeningFom, opptjeningTom)}
              </Normaltekst>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </Column>
      <Column xs="5">
        <SelectField
          name="aktivitetType.kode"
          label={intl.formatMessage({ id: 'ActivityPanel.Activity' })}
          validate={[required]}
          placeholder={intl.formatMessage({ id: 'ActivityPanel.VelgAktivitet' })}
          selectValues={opptjeningAktivitetTypes.map(oat => <option key={oat.kode} value={oat.kode}>{oat.navn}</option>)}
          readOnly={readOnly || !initialValues.erManueltOpprettet}
        />
      </Column>
    </Row>
    <ActivityDataSubPanel
      initialValues={initialValues}
      readOnly={readOnly}
      isManuallyAdded={initialValues.erManueltOpprettet}
      selectedActivityType={selectedActivityType}
    />
    {!shouldDisablePeriodpicker(hasAksjonspunkt, initialValues)
    && (
    <ElementWrapper>
      <VerticalSpacer twentyPx />
      {(!initialValues.erManueltOpprettet)
      && (
      <RadioGroupField name="erGodkjent" validate={[required]} readOnly={readOnly} isEdited={initialValues.erEndret}>
        <RadioOption value label={{ id: 'ActivityPanel.Godkjent' }} />
        <RadioOption value={false} label={<FormattedHTMLMessage id="ActivityPanel.IkkeGodkjent" />} />
      </RadioGroupField>
      )
      }
      <VerticalSpacer fourPx />
      <TextAreaField
        name="begrunnelse"
        textareaClass={styles.explanationTextarea}
        label={{ id: initialValues.erManueltOpprettet ? 'ActivityPanel.Begrunnelse' : 'ActivityPanel.BegrunnEndringene' }}
        validate={[requiredCustom, minLength3, maxLength1500, hasValidText]}
        maxLength={1500}
        readOnly={readOnly}
      />
      <FlexContainer fluid>
        <FlexRow>
          <FlexColumn>
            <Hovedknapp mini htmlType="button" onClick={formProps.handleSubmit} disabled={formProps.pristine}>
              <FormattedMessage id="ActivityPanel.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp mini htmlType="button" onClick={cancelSelectedOpptjeningActivity}>
              <FormattedMessage
                id="ActivityPanel.Avbryt"
              />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </ElementWrapper>
    )
    }
  </FaktaGruppe>
);

ActivityPanel.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool.isRequired,
  opptjeningAktivitetTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  cancelSelectedOpptjeningActivity: PropTypes.func.isRequired,
  selectedActivityType: PropTypes.shape(),
  opptjeningFom: PropTypes.string,
  opptjeningTom: PropTypes.string,
  selectNextPeriod: PropTypes.func,
  selectPrevPeriod: PropTypes.func,
  activityId: PropTypes.number,
  ...formPropTypes,
};

ActivityPanel.defaultProps = {
  selectedActivityType: {},
  opptjeningFom: undefined,
  opptjeningTom: undefined,
  selectPrevPeriod: undefined,
  selectNextPeriod: undefined,
  activityId: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  initialValues: ownProps.activity,
  onSubmit: values => ownProps.updateActivity(values),
  opptjeningAktivitetTypes:
      filterActivityType(ownProps.opptjeningAktivitetTypes, ownProps.activity.erManueltOpprettet, getKodeverk(kodeverkTyper.ARBEID_TYPE)(state)),
  selectedActivityType: behandlingFormValueSelector(activityPanelName)(state, 'aktivitetType'),
  opptjeningFom: behandlingFormValueSelector(activityPanelName)(state, 'opptjeningFom'),
  opptjeningTom: behandlingFormValueSelector(activityPanelName)(state, 'opptjeningTom'),
  activityId: behandlingFormValueSelector(activityPanelName)(state, 'id'),
});

const validateForm = ({ opptjeningFom, opptjeningTom }, props) => {
  const errors = {};
  // TODO (TOR) Denne valideringa bør ligga i PeriodpickerField
  errors.opptjeningFom = required(opptjeningFom) || hasValidPeriod(opptjeningFom, opptjeningTom);
  errors.opptjeningTom = required(opptjeningTom) || hasValidPeriod(opptjeningFom, opptjeningTom);

  if (!errors.opptjeningFom && !errors.opptjeningTom) {
    errors.opptjeningFom = isWithinOpptjeningsperiode(props.opptjeningFomDato, props.opptjeningTomDato)(opptjeningFom, opptjeningTom);
  }

  return errors;
};

export default connect(mapStateToProps)(injectIntl(behandlingForm({
  form: activityPanelName,
  validate: validateForm,
  enableReinitialize: true,
})(ActivityPanel)));
