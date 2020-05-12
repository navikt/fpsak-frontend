import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
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
import { KodeverkMedNavn } from '@fpsak-frontend/types';

import styles from './vilkarResultPicker.less';

const findRadioButtonTextCode = (customVilkarText, isVilkarOk) => {
  if (customVilkarText) {
    return customVilkarText.id;
  }
  return isVilkarOk ? 'VilkarResultPicker.VilkarOppfylt' : 'VilkarResultPicker.VilkarIkkeOppfylt';
};

interface OwnProps {
  avslagsarsaker?: KodeverkMedNavn[];
  erVilkarOk?: boolean;
  customVilkarIkkeOppfyltText?: {
    id: string;
    values?: {};
  };
  customVilkarOppfyltText?: {
    id: string;
    values?: {};
  };
  readOnly: boolean;
  erMedlemskapsPanel?: boolean;
}

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPickerImpl: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  avslagsarsaker,
  erVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  readOnly,
  erMedlemskapsPanel = false,
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
            {erVilkarOk && <Normaltekst><FormattedMessage id={findRadioButtonTextCode(customVilkarOppfyltText, true)} /></Normaltekst>}
            {!erVilkarOk && (
            <Normaltekst>
              <FormattedMessage
                id={findRadioButtonTextCode(customVilkarIkkeOppfyltText, false)}
                values={{
                  b: (...chunks) => <b>{chunks}</b>,
                }}
              />
            </Normaltekst>
            )}
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
            <FormattedMessage
              id={findRadioButtonTextCode(customVilkarOppfyltText, true)}
              values={customVilkarOppfyltText ? {
                b: (...chunks) => <b>{chunks}</b>,
                ...customVilkarIkkeOppfyltText.values,
              } : { b: (...chunks) => <b>{chunks}</b> }}
            />
          )}
          value
        />
        <RadioOption
          label={(
            <FormattedMessage
              id={findRadioButtonTextCode(customVilkarIkkeOppfyltText, false)}
              values={customVilkarIkkeOppfyltText ? {
                b: (...chunks) => <b>{chunks}</b>,
                ...customVilkarIkkeOppfyltText.values,
              } : { b: (...chunks) => <b>{chunks}</b> }}
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

const VilkarResultPicker = injectIntl(VilkarResultPickerImpl);

// @ts-ignore Korleis fikse dette på ein bra måte?
VilkarResultPicker.validate = (erVilkarOk, avslagCode) => {
  if (erVilkarOk === false && !avslagCode) {
    return {
      avslagCode: isRequiredMessage(),
    };
  }
  return {};
};

// @ts-ignore Korleis fikse dette på ein bra måte?
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

// @ts-ignore Korleis fikse dette på ein bra måte?
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
