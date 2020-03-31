import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { FieldArray, FormSection } from 'redux-form';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import { DatepickerField, CheckboxField, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import {
  VerticalSpacer, FlexColumn, FlexContainer, FlexRow,
} from '@fpsak-frontend/shared-components';

import Arbeidsforhold from '../../types/arbeidsforholdTsType';
import TilrettteleggingFieldArray from './TilretteleggingFieldArray';

import styles from './tilretteleggingArbeidsforholdSection.less';

const utledArbeidsforholdTittel = (arbeidsforhold: Arbeidsforhold) => {
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

interface OwnProps {
  readOnly: boolean;
  arbeidsforhold: Arbeidsforhold;
  formSectionName: string;
  visTilrettelegginger: boolean;
  behandlingId: number;
  behandlingVersjon: number;
  erOverstyrer: boolean;
  changeField: () => void;
  stillingsprosentArbeidsforhold?: number;
  setOverstyrtUtbetalingsgrad: (erOverstyrt: boolean) => void;
}

export const TilretteleggingArbeidsforholdSection: FunctionComponent<OwnProps> = ({
  readOnly,
  arbeidsforhold,
  formSectionName,
  visTilrettelegginger,
  behandlingId,
  behandlingVersjon,
  erOverstyrer,
  changeField,
  stillingsprosentArbeidsforhold,
  setOverstyrtUtbetalingsgrad,
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
              setOverstyrtUtbetalingsgrad={setOverstyrtUtbetalingsgrad}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    )}
  </FormSection>
);

TilretteleggingArbeidsforholdSection.defaultProps = {
  stillingsprosentArbeidsforhold: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  visTilrettelegginger: behandlingFormValueSelector('FodselOgTilretteleggingForm',
    ownProps.behandlingId, ownProps.behandlingVersjon)(state, `${ownProps.formSectionName}.skalBrukes`),
});

export default connect(mapStateToProps)(TilretteleggingArbeidsforholdSection);
