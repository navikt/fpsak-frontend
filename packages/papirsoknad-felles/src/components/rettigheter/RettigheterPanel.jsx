import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';

import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { BorderBox } from '@fpsak-frontend/shared-components';
import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';

import SoknadData from '../../SoknadData';

import styles from './rettigheterPanel.less';

export const rettighet = {
  ANNEN_FORELDER_DOED: 'ANNEN_FORELDER_DOED',
  OVERTA_FORELDREANSVARET_ALENE: 'OVERTA_FORELDREANSVARET_ALENE',
  MANN_ADOPTERER_ALENE: 'MANN_ADOPTERER_ALENE',
  IKKE_RELEVANT: 'IKKE_RELEVANT',
};

/**
 * RettigheterPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av papirsøknad dersom søknad gjelder engangsstønad og søker er far.
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
export const RettigheterPanel = ({
  readOnly,
  intl,
  soknadData,
}) => (
  <BorderBox>
    <Fieldset legend={intl.formatMessage({ id: 'Registrering.Rettigheter.Title' })}>
      <RadioGroupField name="rettigheter" direction="vertical" readOnly={readOnly}>
        <RadioOption
          className={styles.breakLabelText}
          label={{ id: 'Registrering.Rettigheter.AnnenForelderDoed' }}
          value={rettighet.ANNEN_FORELDER_DOED}
        />
        <RadioOption
          className={styles.breakLabelText}
          label={{ id: 'Registrering.Rettigheter.OvertaForeldreansvaretAlene' }}
          value={rettighet.OVERTA_FORELDREANSVARET_ALENE}
        />
        {soknadData.getFamilieHendelseType() !== familieHendelseType.FODSEL && soknadData.getForeldreType() === foreldreType.FAR
        && (
        <RadioOption
          className={styles.breakLabelText}
          label={{ id: 'Registrering.Rettigheter.MannAdoptererAlene' }}
          value={rettighet.MANN_ADOPTERER_ALENE}
        />
        )}
        <RadioOption
          className={styles.breakLabelText}
          label={{ id: 'Registrering.Rettigheter.IkkeRelevant' }}
          value={rettighet.IKKE_RELEVANT}
        />
      </RadioGroupField>
    </Fieldset>
  </BorderBox>
);

RettigheterPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  readOnly: PropTypes.bool,
};

RettigheterPanel.defaultProps = {
  readOnly: true,
};

export default injectIntl(RettigheterPanel);
