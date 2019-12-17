import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { formValueSelector, FieldArray } from 'redux-form';
import { Element } from 'nav-frontend-typografi';

import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import {
  ElementWrapper, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { CheckboxField } from '@fpsak-frontend/form';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';
import overforingArsak from '@fpsak-frontend/kodeverk/src/overforingArsak';
import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';

import { hasValidPeriodIncludingOtherErrors } from '@fpsak-frontend/utils';

import RenderOverforingAvKvoterFieldArray from './RenderOverforingAvKvoterFieldArray';

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

export const overforingPeriodeFieldArrayName = 'overforingsperioder';

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
      {skalOvertaKvote
        && (
          <FieldArray
            name="overforingsperioder"
            component={RenderOverforingAvKvoterFieldArray}
            selectValues={selectValues}
            readOnly={readOnly}
          />
        )}
    </ElementWrapper>
  );
};

PermisjonOverforingAvKvoterPanelImpl.propTypes = {
  overtaKvoteReasons: kodeverkPropType.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  skalOvertaKvote: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  visFeilMelding: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  overtaKvoteReasons: ownProps.alleKodeverk[kodeverkTyper.OVERFOERING_AARSAK_TYPE],
  skalOvertaKvote: formValueSelector(ownProps.form)(state, ownProps.namePrefix).skalOvertaKvote,
});

const PermisjonOverforingAvKvoterPanel = connect(mapStateToProps)(injectIntl(PermisjonOverforingAvKvoterPanelImpl));

PermisjonOverforingAvKvoterPanel.initialValues = {
  skalOvertaKvote: false,
  overforingsperioder: [{}],
};

PermisjonOverforingAvKvoterPanel.validate = (values) => hasValidPeriodIncludingOtherErrors(values);

export default PermisjonOverforingAvKvoterPanel;
