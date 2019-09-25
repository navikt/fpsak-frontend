import React from 'react';
import { PropTypes } from 'prop-types';
import CheckboxField from '@fpsak-frontend/form/src/CheckboxField';
import { FieldArray, FormSection } from 'redux-form';
import { FlexColumn, FlexContainer } from '@fpsak-frontend/shared-components';
import DatepickerField from '@fpsak-frontend/form/src/DatepickerField';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import BorderBox from '@fpsak-frontend/shared-components/src/BorderBox';
import { Normaltekst } from 'nav-frontend-typografi';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import { connect } from 'react-redux';
import styles from './tilretteleggingArbeidsforholdSection.less';
import TilrettteleggingFieldArray from './TilretteleggingFieldArray';
import { behandlingFormValueSelector } from '../../../../behandlingFormForstegangOgRevurdering';

const utledArbeidsforholdTittel = (arbeidsforhold) => {
  let tittel = arbeidsforhold.arbeidsgiverNavn;
  if (arbeidsforhold.arbeidsgiverIdent) {
    tittel += ` (${arbeidsforhold.arbeidsgiverIdent})`;
  }
  if (arbeidsforhold.arbeidsforholdReferanse) {
    let ref = arbeidsforhold.arbeidsforholdReferanse;
    if (ref.length > 4) {
      ref = ref.slice(-4);
    }
    tittel += `....${ref}`;
  }
  return tittel;
};

export const TilretteleggingArbeidsforholdSection = ({
  readOnly,
  arbeidsforhold,
  formSectionName,
  visTilrettelegginger,
}) => (
  <FormSection name={formSectionName}>
    <BorderBox>
      <FlexContainer>
        <FlexColumn>
          <Normaltekst className={styles.arbeidsforholdTittel}>
            {utledArbeidsforholdTittel(arbeidsforhold)}
          </Normaltekst>
          <VerticalSpacer sixteenPx />
        </FlexColumn>
        <FlexColumn>
          <CheckboxField
            readOnly={readOnly}
            name="skalBrukes"
            label={{ id: 'TilretteleggingArbeidsforholdSection.Checkbox.SoekerSkalhaTilrettelegging' }}
          />
          <VerticalSpacer sixteenPx />
        </FlexColumn>
        { visTilrettelegginger && (
          <>
            <FlexColumn>
              <DatepickerField
                name="tilretteleggingBehovFom"
                label={{ id: 'TilretteleggingArbeidsforholdSection.DatepickerField.TilretteleggingFra' }}
                validate={[required, hasValidDate]}
                readOnly={readOnly}
              />
              <VerticalSpacer eightPx />
            </FlexColumn>
            <FlexColumn>
              <FieldArray
                name="tilretteleggingDatoer"
                component={TilrettteleggingFieldArray}
                readOnly={readOnly}
                formSectionName={formSectionName}
              />
            </FlexColumn>
          </>
        )}
      </FlexContainer>
    </BorderBox>
  </FormSection>
);

TilretteleggingArbeidsforholdSection.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  arbeidsforhold: PropTypes.shape().isRequired,
  formSectionName: PropTypes.string.isRequired,
  visTilrettelegginger: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  visTilrettelegginger: behandlingFormValueSelector('FodselOgTilretteleggingForm')(state, `${ownProps.formSectionName}.skalBrukes`),
});

export default connect(mapStateToProps)(TilretteleggingArbeidsforholdSection);
