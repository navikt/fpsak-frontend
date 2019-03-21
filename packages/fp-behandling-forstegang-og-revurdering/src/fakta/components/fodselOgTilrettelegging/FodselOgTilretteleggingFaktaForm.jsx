import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import { DatepickerField } from '@fpsak-frontend/form';
import {
  required, hasValidDate,
} from '@fpsak-frontend/utils';

import FaktaSubmitButton from 'behandlingFpsak/src/fakta/components/FaktaSubmitButton';
import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import ArbeidsforholdFaktaPanel from './ArbeidsforholdFaktaPanel';

/**
 * Svangerskapspenger
 */

const FODSEL_TILRETTELEGGING_FORM = 'FodselOgTilretteleggingForm';

export const FodselOgTilretteleggingFaktaForm = ({
  readOnly,
  hasOpenAksjonspunkter,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FlexContainer fluid wrap>
      <FlexRow>
        <FlexColumn>
          <DatepickerField
            name="termindato"
            label={{ id: 'FodselOgTilretteleggingFaktaForm.Termindato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <ArbeidsforholdFaktaPanel readOnly={readOnly} formName={FODSEL_TILRETTELEGGING_FORM} />
    <FlexContainer fluid wrap>
      <FlexRow>
        <FlexColumn>
          <FaktaSubmitButton
            formName={formProps.form}
            isSubmittable={!readOnly}
            isReadOnly={readOnly}
            hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </form>
);

FodselOgTilretteleggingFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
};

const transformValues = values => ({
  kode: '',
  values,
});

const mapStateToProps = (state, ownProps) => {
  // TODO: hente info fra backend når klart.  venter avklaring på om det blir checkboxer( mulighet for flere datoer),
  //  eller radiobuttons (kun 1 dato)
  const tilrettelegging = {
    termindato: '2019-08-01',
    fødselsdato: null,
    arbeidsforholdListe: [
      {
        id: 123,
        tilretteleggingBehovFom: '2019-04-18',
        arbeidsgiverNavn: 'Xansen flyttebyrå AS',
        arbeidsgiverIdent: 1234,
        // tilretteleggingType: 'KODE', // felt som det er nå i backend, tilpasset for kun 1 valg
        // tiltakFom: ''2019-05-30'', // felt som det er nå i backend, tilpasset for kun 1 valg
        // tilrettelegging: [{
        //   kanGjennomfores: true,
        //   dato: '2019-05-30',
        // }, {
        //   kanIkkeGjennomfores: false,
        //   dato: '',
        // }, {
        //   redusertArbeid: true,
        //   dato: '2019-04-18',
        //   stillingsprosent: 50,
        // }],
        kanGjennomfores: {
          kanGjennomfores: true,
          dato: '2019-05-30',
        },
        kanIkkeGjennomfores: {
          kanIkkeGjennomfores: false,
          dato: '',
        },
        redusertArbeid: {
          redusertArbeid: true,
          dato: '2019-04-18',
          stillingsprosent: 50,
        },
        begrunnelse: '',
      },
      {
        id: 456,
        tilretteleggingBehovFom: '2019-06-20',
        arbeidsgiverNavn: 'Rema 100',
        arbeidsgiverIdent: 432,
        // tilretteleggingType: 'KODE',
        // tiltakFom: ''2019-05-30'',
        kanGjennomfores: {
          kanGjennomfores: false,
          dato: '',
        },
        kanIkkeGjennomfores: {
          kanIkkeGjennomfores: true,
          dato: '2019-06-20',
        },
        redusertArbeid: {
          redusertArbeid: false,
          dato: '',
          stillingsprosent: null,
        },
        begrunnelse: '',
      }],
  };
  return {
    initialValues: {
      termindato: tilrettelegging.termindato,
      arbeidsforhold: tilrettelegging.arbeidsforholdListe,
    },
    onSubmit: values => ownProps.submitCallback(transformValues(values)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: FODSEL_TILRETTELEGGING_FORM,
})(FodselOgTilretteleggingFaktaForm));
