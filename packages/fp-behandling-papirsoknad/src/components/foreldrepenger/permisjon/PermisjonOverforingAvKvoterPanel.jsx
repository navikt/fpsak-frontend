import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FormSection, formValueSelector } from 'redux-form';
import { Element } from 'nav-frontend-typografi';

import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import {
  ElementWrapper, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { CheckboxField, DatepickerField, SelectField } from '@fpsak-frontend/form';
import { dateAfterOrEqual, hasValidDate, required } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';
import overforingArsak from '@fpsak-frontend/kodeverk/src/overforingArsak';

import { getKodeverk } from '../../../duckPapirsoknad';
import SoknadData from '../../../SoknadData';

import styles from './permisjonPanel.less';

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

const showPeriod = (arsakForOverforingCode) => arsakForOverforingCode === overforingArsak.SYKDOM_ANNEN_FORELDER
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
  visFeilMelding,
}) => {
  const selectValues = mapArsaker(overtaKvoteReasons, soknadData.getForeldreType() === foreldreType.MOR, intl);

  return (
    <ElementWrapper>
      <Element><FormattedMessage id="Registrering.Permisjon.OverforingAvKvote.OvertaKvoten" /></Element>
      <VerticalSpacer sixteenPx />
      <CheckboxField
        className={visFeilMelding ? styles.showErrorBackground : ''}
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
              )}
            </FlexRow>
          </FlexContainer>
        </FormSection>
        )}
    </ElementWrapper>
  );
};

PermisjonOverforingAvKvoterPanelImpl.propTypes = {
  overtaKvoteReasons: kodeverkPropType.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  skalOvertaKvote: PropTypes.bool.isRequired,
  arsakForOverforingCode: PropTypes.string,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  visFeilMelding: PropTypes.bool.isRequired,
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
