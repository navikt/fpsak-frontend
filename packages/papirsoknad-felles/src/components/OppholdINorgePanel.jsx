import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Undertekst } from 'nav-frontend-typografi';
import { Fieldset } from 'nav-frontend-skjema';

import { NavFieldGroup, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { ArrowBox, BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';

import SoknadData from '../SoknadData';
import UtenlandsOppholdField from './UtenlandsOppholdField';

import styles from './oppholdINorgePanel.less';

/**
 * OppholdINorgePanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder engangsstønad.
 * Inneholder delen av skjemaet som omhandler informasjon om utenlandsopphold.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
export const OppholdINorgePanelImpl = ({
  readOnly, intl, countryCodes, harFremtidigeOppholdUtenlands, harTidligereOppholdUtenlands, soknadData,
}) => {
  const { formatMessage } = intl;
  const sortedCountriesByName = countryCodes.slice().sort((a, b) => a.navn.localeCompare(b.navn));

  return (
    <BorderBox>
      <Fieldset className={styles.fullWidth} legend={formatMessage({ id: 'Registrering.Opphold' })}>
        <NavFieldGroup>
          {soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON
          && (
          <Undertekst>
            {` ${formatMessage({ id: 'Registrering.OppholdVedAdopsjon' })} `}
          </Undertekst>
          )}
          {soknadData.getFamilieHendelseType() !== familieHendelseType.ADOPSJON
          && (
          <Undertekst>
            {` ${formatMessage({ id: 'Registrering.OppholdVedFodsel' })} `}
          </Undertekst>
          )}
          <VerticalSpacer eightPx />
          <RadioGroupField name="oppholdINorge" readOnly={readOnly}>
            <RadioOption label={formatMessage({ id: 'Registrering.Opphold.Yes' })} value />
            <RadioOption label={formatMessage({ id: 'Registrering.Opphold.No' })} value={false} />
          </RadioGroupField>
        </NavFieldGroup>
        <NavFieldGroup>
          <Undertekst>
            {` ${formatMessage({ id: 'Registrering.OppholdSisteTolv' })} `}
          </Undertekst>
          <VerticalSpacer eightPx />
          <RadioGroupField name="harTidligereOppholdUtenlands" readOnly={readOnly}>
            <RadioOption label={formatMessage({ id: 'Registrering.Opphold.Yes' })} value={false} />
            <RadioOption label={formatMessage({ id: 'Registrering.Opphold.No' })} value />
          </RadioGroupField>
          {harTidligereOppholdUtenlands
            ? (
              <ArrowBox alignOffset={64}>
                <UtenlandsOppholdField
                  name="tidligereOppholdUtenlands"
                  countryCodes={sortedCountriesByName}
                  readOnly={readOnly}
                />
              </ArrowBox>
            )
            : null}
        </NavFieldGroup>
        <NavFieldGroup>
          <Undertekst>
            {` ${formatMessage({ id: 'Registrering.OppholdNesteTolv' })} `}
          </Undertekst>
          <VerticalSpacer eightPx />
          <RadioGroupField name="harFremtidigeOppholdUtenlands" readOnly={readOnly}>
            <RadioOption label={formatMessage({ id: 'Registrering.Opphold.Yes' })} value={false} />
            <RadioOption label={formatMessage({ id: 'Registrering.Opphold.No' })} value />
          </RadioGroupField>
          {harFremtidigeOppholdUtenlands
            ? (
              <ArrowBox alignOffset={64}>
                <UtenlandsOppholdField
                  name="fremtidigeOppholdUtenlands"
                  countryCodes={sortedCountriesByName}
                  readOnly={readOnly}
                />
              </ArrowBox>
            )
            : null}
        </NavFieldGroup>
      </Fieldset>
    </BorderBox>
  );
};

OppholdINorgePanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  countryCodes: kodeverkPropType.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  harFremtidigeOppholdUtenlands: PropTypes.bool,
  harTidligereOppholdUtenlands: PropTypes.bool,
  readOnly: PropTypes.bool,
};

OppholdINorgePanelImpl.defaultProps = {
  harFremtidigeOppholdUtenlands: false,
  harTidligereOppholdUtenlands: false,
  readOnly: true,
};

const mapStateToProps = (state, initialProps) => ({
  ...formValueSelector(initialProps.form)(state, 'harTidligereOppholdUtenlands', 'harFremtidigeOppholdUtenlands'),
  countryCodes: initialProps.alleKodeverk[kodeverkTyper.LANDKODER],
});

const OppholdINorgePanel = connect(mapStateToProps)(injectIntl(OppholdINorgePanelImpl));

OppholdINorgePanel.validate = (values) => {
  const errors = {};
  if (values.oppholdINorge === undefined) {
    errors.oppholdINorge = isRequiredMessage();
  }
  if (values.harTidligereOppholdUtenlands === undefined) {
    errors.harTidligereOppholdUtenlands = isRequiredMessage();
  } else if (values.harTidligereOppholdUtenlands) {
    errors.tidligereOppholdUtenlands = UtenlandsOppholdField.validate(values.tidligereOppholdUtenlands, { todayOrBefore: true });
  }
  if (values.harFremtidigeOppholdUtenlands === undefined) {
    errors.harFremtidigeOppholdUtenlands = isRequiredMessage();
  } else if (values.harFremtidigeOppholdUtenlands) {
    errors.fremtidigeOppholdUtenlands = UtenlandsOppholdField.validate(values.fremtidigeOppholdUtenlands, { tidligstDato: values.mottattDato });
  }
  return errors;
};

OppholdINorgePanel.initialValues = {
  tidligereOppholdUtenlands: [{}],
  fremtidigeOppholdUtenlands: [{}],
};

export default OppholdINorgePanel;
