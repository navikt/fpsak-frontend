import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';
import { DatepickerField, TextAreaField, CheckboxField } from '@fpsak-frontend/form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { ElementWrapper, BorderBox, ArrowBox } from '@fpsak-frontend/shared-components';

import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';

import {
  FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import {
  required, hasValidDate, maxLength, minLength, hasValidText,
} from '@fpsak-frontend/utils';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const arbKode = [
  {
    kode: 'GJENNOMFORES',
    navn: 'kan gjennomføres slik at arbeidstakeren kan fortsette med samme stilling fra og med',
  },
  {
    kode: 'REDUSERT',
    navn: 'kan gjennomføres slik at arbeidstakeren kan fortsette med redusert arbeidstid fra og med',
  },
  {
    kode: 'IKKE_GJENNOMFORES',
    navn: 'Kan ikke gjennomfores og arbeidstakeren må midlertidig gå ut av sitt arbeid fra og med ',
  },
];

export const ArbeidsforholdInnhold = ({
  cancelArbeidsforholdCallback,
}) => {
  const checkboxFields = arbKode.map(ay => (
    <ElementWrapper key={ay.kode}>
      <CheckboxField key={ay.kode} name={ay.kode} label={ay.navn} readOnly={false} />
      <ArrowBox>
        <div>HEI</div>
      </ArrowBox>
    </ElementWrapper>
  ));
  return (
    <div>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <DatepickerField
              name="tilretteleggingFra"
              label={{ id: 'ArbeidsforholdFaktaPanel.TilretteleggingFra' }}
              validate={[required, hasValidDate]}
              readOnly={false}
            />
          </FlexColumn>
        </FlexRow>
        <Fieldset legend="Registrering.AndreYtelser.Title">
          {checkboxFields}
        </Fieldset>
        <FlexRow>
          <FlexColumn>
            <TextAreaField
              name="begrunnelse"
              label={{ id: 'ArbeidsforholdFaktaPanel.BegrunnEndringene' }}
              readOnly={false}
              validate={[
                minLength3,
                maxLength1500,
                hasValidText,
              ]}
              maxLength={1500}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <FlexContainer fluid>
        <FlexRow>
          <FlexColumn>
            <Hovedknapp
              htmlType="button"
              mini
              onClick=""
            >
              <FormattedMessage id="ArbeidsforholdFaktaPanel.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp
              htmlType="button"
              mini
              onClick={cancelArbeidsforholdCallback}
            >
              <FormattedMessage id="ArbeidsforholdFaktaPanel.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

ArbeidsforholdInnhold.propTypes = {
  cancelArbeidsforholdCallback: PropTypes.func.isRequired,
};

ArbeidsforholdInnhold.defaultProps = {
};

const mapStateToProps = (state, ownProps) => {
  const { selectedArbeidsforhold } = ownProps;
  return {
    initialValues: {
      tilretteleggingFra: selectedArbeidsforhold.jordmor.tilretteleggingFra,
      begrunnelse: selectedArbeidsforhold.arbeidsforhold.begrunnelse,
    },
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'arbeidsforhold',
  enableReinitialize: true,
})(ArbeidsforholdInnhold));
