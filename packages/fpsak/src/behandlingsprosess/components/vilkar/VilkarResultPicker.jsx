import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedHTMLMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import { isRequiredMessage } from 'utils/validation/messages';
import { SelectField, RadioGroupField, RadioOption } from 'form/Fields';
import { required } from 'utils/validation/validators';

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
  hasAksjonspunkt,
}) => (
  <div className={styles.container}>
    <RadioGroupField
      name="erVilkarOk"
      validate={[required]}
      bredde="XXL"
      readOnly={readOnly}
      isEdited={hasAksjonspunkt && (erVilkarOk !== undefined)}
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
    {(erVilkarOk === false && avslagsarsaker)
    && (
    <Row>
      <Column xs="6">
        <ArrowBox alignOffset={158} hideBorder={readOnly}>
          <VerticalSpacer eightPx />
          <SelectField
            name="avslagCode"
            label={intl.formatMessage({ id: 'VilkarResultPicker.Arsak' })}
            placeholder={intl.formatMessage({ id: 'VilkarResultPicker.SelectArsak' })}
            selectValues={avslagsarsaker.map(aa => <option key={aa.kode} value={aa.kode}>{aa.navn}</option>)}
            bredde="xl"
            readOnly={readOnly}
          />
        </ArrowBox>
      </Column>
    </Row>
    )

    }
  </div>
);

VilkarResultPickerImpl.propTypes = {
  intl: intlShape.isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
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
  hasAksjonspunkt: PropTypes.bool.isRequired,
};

VilkarResultPickerImpl.defaultProps = {
  erVilkarOk: undefined,
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
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
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;
  return {
    erVilkarOk,
    avslagCode: erVilkarOk === false && behandlingsresultat && behandlingsresultat.avslagsarsak
      ? behandlingsresultat.avslagsarsak.kode
      : undefined,
  };
};

VilkarResultPicker.transformValues = values => (
  values.erVilkarOk
    ? { erVilkarOk: values.erVilkarOk }
    : {
      erVilkarOk: values.erVilkarOk,
      avslagskode: values.avslagCode,
    }
);

export default VilkarResultPicker;
