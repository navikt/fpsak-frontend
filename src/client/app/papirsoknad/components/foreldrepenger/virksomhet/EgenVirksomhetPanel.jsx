import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector, FieldArray, FormSection } from 'redux-form';
import { Undertittel } from 'nav-frontend-typografi';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import { RadioGroupField, RadioOption } from 'form/Fields';
import BorderBox from 'sharedComponents/BorderBox';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { required, arrayMinLength } from 'utils/validation/validators';
import RegistrerVirksomhetPanel from './RegistrerVirksomhetPanel';

import styles from './egenVirksomhetPanel.less';


const arrayMinLength1 = arrayMinLength(1);
const harArbeidetIEgenVirksomhetName = 'harArbeidetIEgenVirksomhet';

const virksomhetsFieldArrayName = 'virksomheter';
const EGEN_VIRKSOMHET_FORM_NAME_PREFIX = 'egenVirksomhet';

/**
 * EgenVirksomhetPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av
 * papirsøknad dersom søknad gjelder foreldrepenger. Søker velger må oppgi om hen har arbdeidet i
 * egen virksomhet.
 */
export const EgenVirksomhetPanel = ({
  readOnly,
  intl,
  form,
  harArbeidetIEgenVirksomhet,
}) => (
  <FormSection name={EGEN_VIRKSOMHET_FORM_NAME_PREFIX}>
    <BorderBox>
      <div className={styles.flexContainer}>
        <Undertittel><FormattedMessage id="Registrering.EgenVirksomhet.Title" /></Undertittel>
        <VerticalSpacer sixteenPx />
        <RadioGroupField name={harArbeidetIEgenVirksomhetName} validate={[required]} direction="vertical" readOnly={readOnly}>
          <RadioOption label={intl.formatMessage({ id: 'Registrering.EgenVirksomhet.No' })} value={false} />
          <RadioOption label={intl.formatMessage({ id: 'Registrering.EgenVirksomhet.Yes' })} value />
        </RadioGroupField>
      </div>
      <ElementWrapper>
        {harArbeidetIEgenVirksomhet
        && (
        <FieldArray
          name={virksomhetsFieldArrayName}
          component={RegistrerVirksomhetPanel}
          form={form}
          namePrefix={EGEN_VIRKSOMHET_FORM_NAME_PREFIX}
          formatMessage={intl.formatMessage}
          validate={[arrayMinLength1]}
          readOnly={readOnly}
        />
        )
    }
      </ElementWrapper>
    </BorderBox>
  </FormSection>
);

EgenVirksomhetPanel.propTypes = {
  intl: intlShape.isRequired,
  form: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  harArbeidetIEgenVirksomhet: PropTypes.bool,
};

EgenVirksomhetPanel.defaultProps = {
  readOnly: true,
  harArbeidetIEgenVirksomhet: null,
};

const mapStateToProps = (state, initialProps) => ({
  harArbeidetIEgenVirksomhet: formValueSelector(initialProps.form)(state, EGEN_VIRKSOMHET_FORM_NAME_PREFIX)
    ? formValueSelector(initialProps.form)(state, EGEN_VIRKSOMHET_FORM_NAME_PREFIX).harArbeidetIEgenVirksomhet : null,
});

export default connect(mapStateToProps)(injectIntl(EgenVirksomhetPanel));
