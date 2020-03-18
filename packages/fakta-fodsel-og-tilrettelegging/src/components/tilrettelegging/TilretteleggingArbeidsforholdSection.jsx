import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { FieldArray, FormSection } from 'redux-form';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import { DatepickerField, CheckboxField } from '@fpsak-frontend/form';
import { behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import {
  VerticalSpacer, FlexColumn, FlexContainer, FlexRow,
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
  erOverstyrer,
  changeField,
  stillingsprosentArbeidsforhold,
}) => (
  <FormSection name={formSectionName}>
    <Normaltekst className={styles.arbeidsforholdTittel}>
      {utledArbeidsforholdTittel(arbeidsforhold)}
    </Normaltekst>
    <VerticalSpacer sixteenPx />
    <CheckboxField
      readOnly={readOnly}
      name="skalBrukes"
      label={{ id: 'TilretteleggingArbeidsforholdSection.Checkbox.SoekerSkalhaTilrettelegging' }}
    />
    <VerticalSpacer sixteenPx />
    {visTilrettelegginger && (
      <FlexContainer>
        <FlexRow alignItemsToBaseline>
          <FlexColumn>
            <Normaltekst>
              <FormattedMessage id="TilretteleggingArbeidsforholdSection.DatepickerField.TilretteleggingFra" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <DatepickerField
              name="tilretteleggingBehovFom"
              label=""
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
            <VerticalSpacer eightPx />
          </FlexColumn>
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            <Element>
              <FormattedMessage id="TilretteleggingFieldArray.BehovForTilrettelegging" />
            </Element>
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer sixteenPx />
        <FlexRow>
          <FlexColumn>
            <FieldArray
              name="tilretteleggingDatoer"
              component={TilrettteleggingFieldArray}
              readOnly={readOnly}
              formSectionName={formSectionName}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              erOverstyrer={erOverstyrer}
              changeField={changeField}
              stillingsprosentArbeidsforhold={stillingsprosentArbeidsforhold}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    )}
  </FormSection>
);

TilretteleggingArbeidsforholdSection.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  arbeidsforhold: PropTypes.shape().isRequired,
  formSectionName: PropTypes.string.isRequired,
  visTilrettelegginger: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  changeField: PropTypes.func.isRequired,
  stillingsprosentArbeidsforhold: PropTypes.number,
};

TilretteleggingArbeidsforholdSection.defaultProps = {
  stillingsprosentArbeidsforhold: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  visTilrettelegginger: behandlingFormValueSelector('FodselOgTilretteleggingForm',
    ownProps.behandlingId, ownProps.behandlingVersjon)(state, `${ownProps.formSectionName}.skalBrukes`),
});

export default connect(mapStateToProps)(TilretteleggingArbeidsforholdSection);
