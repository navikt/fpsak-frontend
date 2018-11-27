import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RadioGroupField, RadioOption } from 'form/Fields';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import { getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import { required } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';
import { sortArbeidsforholdList } from '../../ArbeidsforholdHelper';

const kortvarigStringId = 'BeregningInfoPanel.TidsbegrensetArbFor.Arbeidsforhold';

const createArbeidsforholdRadioKey = andel => (andel && andel.arbeidsforhold
  ? `${andel.arbeidsforhold.arbeidsgiverNavn}(${andel.arbeidsforhold.arbeidsforholdId})(${andel.andelsnr})`
  : '');
/**
 * TidsbegrensetArbeidsforholdForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for Vurder Tidsbegrenset Arbeidsforhold som ber
 * bruker bestemme om en liste med arbeidsforhold er tidsbegrenset eller ikke.
 */

const TidsbegrensetArbeidsforholdForm = ({
  readOnly,
  andelsliste,
  isAksjonspunktClosed,
}) => (
  <div>
    {andelsliste.map(andel => (
      <div key={`fastsettTidsbegrensedeForhold_${createVisningsnavnForAktivitet(andel.arbeidsforhold)}`}>
        <Normaltekst>
          <FormattedMessage
            id={kortvarigStringId}
            values={{
              navn: createVisningsnavnForAktivitet(andel.arbeidsforhold),
              fom: moment(andel.arbeidsforhold.startdato).format(DDMMYYYY_DATE_FORMAT),
              tom: moment(andel.arbeidsforhold.opphoersdato).format(DDMMYYYY_DATE_FORMAT),
            }}
          />
        </Normaltekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          name={createArbeidsforholdRadioKey(andel)}
          validate={[required]}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
        >
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
        </RadioGroupField>
      </div>
    ))}
  </div>
);

TidsbegrensetArbeidsforholdForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  andelsliste: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

TidsbegrensetArbeidsforholdForm.buildInitialValues = (andeler) => {
  const initialValues = {};
  if (!andeler) {
    return initialValues;
  }
  andeler.forEach((andel) => {
    if (andel.erTidsbegrensetArbeidsforhold !== undefined) {
      initialValues[createArbeidsforholdRadioKey(andel)] = andel.erTidsbegrensetArbeidsforhold;
    }
  });
  return initialValues;
};

TidsbegrensetArbeidsforholdForm.transformValues = (values, andeler) => {
  const newValues = [];
  andeler.forEach((andel) => {
    const fieldName = createArbeidsforholdRadioKey(andel);
    const booleanValue = values[fieldName];
    const valueObject = {
      andelsnr: andel.andelsnr,
      tidsbegrensetArbeidsforhold: booleanValue,
      opprinneligVerdi: andel.erTidsbegrensetArbeidsforhold,
    };
    newValues.push(valueObject);
  });
  return {
    vurderTidsbegrensetArbeidsforhold: { fastsatteArbeidsforhold: newValues },
  };
};

const mapStateToProps = (state) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  return {
    andelsliste: sortArbeidsforholdList(faktaOmBeregning.kortvarigeArbeidsforhold),
  };
};

export default connect(mapStateToProps)(TidsbegrensetArbeidsforholdForm);
