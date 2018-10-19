import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { FormSection, formValueSelector } from 'redux-form';
import { Element } from 'nav-frontend-typografi';

import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import DatepickerField from 'form/fields/DatepickerField';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import SoknadData from 'papirsoknad/SoknadData';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { CheckboxField, SelectField } from 'form/Fields';
import { dateAfterOrEqual, hasValidDate, required } from 'utils/validation/validators';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import foreldreType from 'kodeverk/foreldreType';
import overforingArsak from 'kodeverk/overforingArsak';

const getText = (intl, kode, navn) => {
  if (kode === overforingArsak.INSTITUSJONSOPPHOLD_ANNEN_FORELDER) {
    return intl.formatMessage({ id: 'Registrering.Permisjon.OverforingAvKvote.Arsak.MorErInnlagt' });
  }
  if (kode === overforingArsak.SYKDOM_ANNEN_FORELDER) {
    return intl.formatMessage({ id: 'Registrering.Permisjon.OverforingAvKvote.Arsak.MorErSyk' });
  }
  return navn;
};

const mapArsaker = (arsaker, sokerErMor, intl) => arsaker.map(({ kode, navn }) => (!sokerErMor
  ? <option value={kode} key={kode}>{getText(intl, kode, navn)}</option>
  : <option value={kode} key={kode}>{navn}</option>));

const showPeriod = arsakForOverforingCode => arsakForOverforingCode === overforingArsak.SYKDOM_ANNEN_FORELDER
    || arsakForOverforingCode === overforingArsak.INSTITUSJONSOPPHOLD_ANNEN_FORELDER;

/**
 * PermisjonOverforingAvKvoterPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder foreldrepenger.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
export const PermisjonOverforingAvKvoterPanelImpl = ({
  overtaKvoteReasons,
  soknadData,
  skalOvertaKvote,
  arsakForOverforingCode,
  readOnly,
  intl,
}) => {
  const selectValues = mapArsaker(overtaKvoteReasons, soknadData.getForeldreType() === foreldreType.MOR
    || soknadData.getForeldreType() === foreldreType.IKKE_RELEVANT, intl);

  return (
    <ElementWrapper>
      <Element><FormattedMessage id="Registrering.Permisjon.OverforingAvKvote.OvertaKvoten" /></Element>
      <VerticalSpacer sixteenPx />
      <CheckboxField
        readOnly={readOnly}
        name="skalOvertaKvote"
        label={intl.formatMessage({ id: 'Registrering.Permisjon.OverforingAvKvote.OvertaKvote' })}
      />
      { skalOvertaKvote
        && (
        <FormSection name="overforingsperiode">
          <VerticalSpacer space={1} />
          <FlexContainer wrap>
            <FlexRow>
              <FlexColumn>
                <SelectField
                  name="overforingArsak"
                  bredde="xxl"
                  label={{ id: 'Registrering.Permisjon.OverforingAvKvote.Arsak.AngiArsak' }}
                  selectValues={selectValues}
                  validate={[required]}
                  readOnly={readOnly}
                />
              </FlexColumn>
              {showPeriod(arsakForOverforingCode)
              && (
              <ElementWrapper>
                <FlexColumn>
                  <DatepickerField
                    readOnly={readOnly}
                    name="fomDato"
                    validate={[required, hasValidDate]}
                    label={<FormattedMessage id="Registrering.Permisjon.OverforingAvKvote.fomDato" />}
                  />
                </FlexColumn>
                <FlexColumn>
                  <DatepickerField
                    readOnly={readOnly}
                    name="tomDato"
                    validate={[required, hasValidDate]}
                    label={<FormattedMessage id="Registrering.Permisjon.OverforingAvKvote.tomDato" />}
                  />
                </FlexColumn>
              </ElementWrapper>
              )
            }
            </FlexRow>
          </FlexContainer>
        </FormSection>
        )
      }
    </ElementWrapper>
  );
};

PermisjonOverforingAvKvoterPanelImpl.propTypes = {
  overtaKvoteReasons: kodeverkPropType.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  skalOvertaKvote: PropTypes.bool.isRequired,
  arsakForOverforingCode: PropTypes.string,
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

PermisjonOverforingAvKvoterPanelImpl.defaultProps = {
  arsakForOverforingCode: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  overtaKvoteReasons: getKodeverk(kodeverkTyper.OVERFOERING_AARSAK_TYPE)(state),
  skalOvertaKvote: formValueSelector(ownProps.form)(state, ownProps.namePrefix).skalOvertaKvote,
  arsakForOverforingCode: formValueSelector(ownProps.form)(state, ownProps.namePrefix).overforingsperiode.overforingArsak,
});

const PermisjonOverforingAvKvoterPanel = connect(mapStateToProps)(injectIntl(PermisjonOverforingAvKvoterPanelImpl));

PermisjonOverforingAvKvoterPanel.initialValues = {
  skalOvertaKvote: false,
  overforingsperiode: {},
};

PermisjonOverforingAvKvoterPanel.validate = (values) => {
  const validate = showPeriod(values.overforingsperiode.overforingArsak);
  if (validate) {
    const error = dateAfterOrEqual(values.overforingsperiode.fomDato)(values.overforingsperiode.tomDato);
    return error ? { overforingsperiode: { tomDato: error } } : {};
  }
  return {};
};

export default PermisjonOverforingAvKvoterPanel;
