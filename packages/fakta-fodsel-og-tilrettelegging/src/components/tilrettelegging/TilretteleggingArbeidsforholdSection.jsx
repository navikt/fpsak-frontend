import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray, FormSection } from 'redux-form';
import { Normaltekst } from 'nav-frontend-typografi';

import { DatepickerField, CheckboxField } from '@fpsak-frontend/form';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import {
  BorderBox, VerticalSpacer, FlexColumn, FlexContainer,
} from '@fpsak-frontend/shared-components';

import TilrettteleggingFieldArray from './TilretteleggingFieldArray';

import styles from './tilretteleggingArbeidsforholdSection.less';

const utledArbeidsforholdTittel = (arbeidsforhold) => {
  let tittel = arbeidsforhold.arbeidsgiverNavn;
  if (arbeidsforhold.arbeidsgiverIdent) {
    tittel += ` (${arbeidsforhold.arbeidsgiverIdentVisning})`;
  }
  if (arbeidsforhold.eksternArbeidsforholdReferanse) {
    let ref = arbeidsforhold.eksternArbeidsforholdReferanse;
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
  behandlingId,
  behandlingVersjon,
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
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
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
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  visTilrettelegginger: behandlingFormValueSelector('FodselOgTilretteleggingForm',
    ownProps.behandlingId, ownProps.behandlingVersjon)(state, `${ownProps.formSectionName}.skalBrukes`),
});

export default connect(mapStateToProps)(TilretteleggingArbeidsforholdSection);
