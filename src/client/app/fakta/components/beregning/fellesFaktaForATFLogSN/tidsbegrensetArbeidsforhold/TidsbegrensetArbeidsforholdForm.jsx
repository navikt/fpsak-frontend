import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { RadioOption, RadioGroupField } from '@fpsak-frontend/form';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import { getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import { required } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';
import { sortArbeidsforholdList } from '../../ArbeidsforholdHelper';

const kortvarigStringId = 'BeregningInfoPanel.TidsbegrensetArbFor.Arbeidsforhold';

const createArbeidsforholdRadioKey = andel => (andel ? `${andel.virksomhetNavn}(${andel.arbeidsforholdId})(${andel.andelsnr})` : '');
/**
 * TidsbegrensetArbeidsforholdForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet VURDER_FAKTA_FOR_ATFL_SN for Vurder Tidsbegrenset Arbeidsforhold som ber
 * bruker bestemme om en liste med arbeidsforhold er tidsbegrenset eller ikke.
 */

const TidsbegrensetArbeidsforholdForm = ({
  readOnly,
  arbeidsforhold,
  isAksjonspunktClosed,
}) => (
  <div>
    {arbeidsforhold.map(forhold => (
      <div key={`fastsettTidsbegrensedeForhold_${createVisningsnavnForAktivitet(forhold)}`}>
        <Normaltekst>
          <FormattedMessage
            id={kortvarigStringId}
            values={{
              navn: createVisningsnavnForAktivitet(forhold),
              fom: moment(forhold.startdato).format(DDMMYYYY_DATE_FORMAT),
              tom: moment(forhold.opphoersdato).format(DDMMYYYY_DATE_FORMAT),
            }}
          />
        </Normaltekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          name={createArbeidsforholdRadioKey(forhold)}
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
  arbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

TidsbegrensetArbeidsforholdForm.buildInitialValues = (arbeidsforhold) => {
  const initialValues = {};
  if (!arbeidsforhold) {
    return initialValues;
  }
  arbeidsforhold.forEach((forhold) => {
    if (forhold.erTidsbegrensetArbeidsforhold !== undefined) {
      initialValues[createArbeidsforholdRadioKey(forhold)] = forhold.erTidsbegrensetArbeidsforhold;
    }
  });
  return initialValues;
};

TidsbegrensetArbeidsforholdForm.transformValues = (values, arbeidsforhold) => {
  const newValues = [];
  arbeidsforhold.forEach((forhold) => {
    const fieldName = createArbeidsforholdRadioKey(forhold);
    const booleanValue = values[fieldName];
    const valueObject = {
      andelsnr: forhold.andelsnr,
      tidsbegrensetArbeidsforhold: booleanValue,
      opprinneligVerdi: forhold.erTidsbegrensetArbeidsforhold,
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
    arbeidsforhold: sortArbeidsforholdList(faktaOmBeregning.kortvarigeArbeidsforhold),
  };
};

export default connect(mapStateToProps)(TidsbegrensetArbeidsforholdForm);
