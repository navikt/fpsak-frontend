import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  VerticalSpacer, FlexContainer, FlexRow, FlexColumn, Image,
} from '@fpsak-frontend/shared-components';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  DatepickerField, RadioGroupField, RadioOption, SelectField,
} from '@fpsak-frontend/form';

import { hasValidDate, isRequiredMessage, required } from '@fpsak-frontend/utils';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';

import styles from './vilkarResultPicker.less';

const findRadioButtonTextCode = (customVilkarText, isVilkarOk) => {
  if (customVilkarText) {
    return customVilkarText.id;
  }
  return isVilkarOk ? 'VilkarResultPicker.VilkarOppfylt' : 'VilkarResultPicker.VilkarIkkeOppfylt';
};

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPickerImpl = ({
  intl,
  avslagsarsaker,
  erVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  readOnly,
  erMedlemskapsPanel,
}) => (
  <div className={styles.container}>
    <VerticalSpacer sixteenPx />
    {(readOnly && erVilkarOk !== undefined) && (
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image className={styles.image} src={erVilkarOk ? innvilgetImage : avslattImage} />
          </FlexColumn>
          <FlexColumn>
            {erVilkarOk && <Normaltekst><FormattedHTMLMessage id={findRadioButtonTextCode(customVilkarOppfyltText, true)} /></Normaltekst>}
            {!erVilkarOk && <Normaltekst><FormattedHTMLMessage id={findRadioButtonTextCode(customVilkarIkkeOppfyltText, false)} /></Normaltekst>}
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
      </FlexContainer>
    )}
    {(!readOnly || erVilkarOk === undefined) && (
      <RadioGroupField
        name="erVilkarOk"
        validate={[required]}
        bredde="XXL"
        direction="vertical"
        readOnly={readOnly}
      >
        <RadioOption
          label={(
            <FormattedHTMLMessage
              id={findRadioButtonTextCode(customVilkarOppfyltText, true)}
              values={customVilkarOppfyltText ? customVilkarIkkeOppfyltText.values : {}}
            />
          )}
          value
        />
        <RadioOption
          label={(
            <FormattedHTMLMessage
              id={findRadioButtonTextCode(customVilkarIkkeOppfyltText, false)}
              values={customVilkarIkkeOppfyltText ? customVilkarIkkeOppfyltText.values : {}}
            />
          )}
          value={false}
        />
      </RadioGroupField>
    )}
    <>
      {erVilkarOk !== undefined && !erVilkarOk && avslagsarsaker && (
        <>
          <VerticalSpacer eightPx />
          <SelectField
            name="avslagCode"
            label={intl.formatMessage({ id: 'VilkarResultPicker.Arsak' })}
            placeholder={intl.formatMessage({ id: 'VilkarResultPicker.SelectArsak' })}
            selectValues={avslagsarsaker.map((aa) => <option key={aa.kode} value={aa.kode}>{aa.navn}</option>)}
            bredde="xl"
            readOnly={readOnly}
          />
          {erMedlemskapsPanel && (
          <DatepickerField
            name="avslagDato"
            label={{ id: 'VilkarResultPicker.VilkarDato' }}
            readOnly={readOnly}
            validate={[required, hasValidDate]}
          />
          )}
        </>
      )}
    </>
    <VerticalSpacer eightPx />
  </div>
);

VilkarResultPickerImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })),
  customVilkarIkkeOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  customVilkarOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  erVilkarOk: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  erMedlemskapsPanel: PropTypes.bool,
};

VilkarResultPickerImpl.defaultProps = {
  erVilkarOk: undefined,
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  erMedlemskapsPanel: false,
  avslagsarsaker: undefined,
};

const VilkarResultPicker = injectIntl(VilkarResultPickerImpl);

VilkarResultPicker.validate = (erVilkarOk, avslagCode) => {
  const errors = {};
  if (erVilkarOk === false && !avslagCode) {
    errors.avslagCode = isRequiredMessage();
  }
  return errors;
};

VilkarResultPicker.buildInitialValues = (behandlingsresultat, aksjonspunkter, status) => {
  const isOpenAksjonspunkt = aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;
  return {
    erVilkarOk,
    avslagCode: erVilkarOk === false && behandlingsresultat && behandlingsresultat.avslagsarsak
      ? behandlingsresultat.avslagsarsak.kode
      : undefined,
  };
};

VilkarResultPicker.transformValues = (values) => (
  values.erVilkarOk
    ? { erVilkarOk: values.erVilkarOk }
    : {
      erVilkarOk: values.erVilkarOk,
      avslagskode: values.avslagCode,
      avslagDato: values.avslagDato,
    }
);

export default VilkarResultPicker;
