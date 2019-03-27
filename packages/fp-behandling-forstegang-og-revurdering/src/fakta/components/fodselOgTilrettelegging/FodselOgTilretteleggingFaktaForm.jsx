import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  FlexContainer, FlexColumn, FlexRow, VerticalSpacer, ElementWrapper,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  required, hasValidDate, hasValidText, maxLength,
} from '@fpsak-frontend/utils';

import {
  behandlingForm,
  getBehandlingFormInitialValues,
  getBehandlingFormValues,
  isBehandlingFormDirty,
} from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import {
  getSvangerskapspengerTil,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import ArbeidsforholdFaktaPanel from './ArbeidsforholdFaktaPanel';

import styles from './arbeidsforholdInnhold.less';

/**
 * Svangerskapspenger
 */

const maxLength1500 = maxLength(1500);

const FODSEL_TILRETTELEGGING_FORM = 'FodselOgTilretteleggingForm';

export const FodselOgTilretteleggingFaktaForm = ({
  readOnly,
  hasOpenAksjonspunkter,
  visBegrunnelse,
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
      {visBegrunnelse
      && (
      <FlexRow>
        <FlexColumn className={styles.textAreaBredde}>
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'FodselOgTilretteleggingFaktaForm.BegrunnEndringene' }}
            validate={[required, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
      )
    }
    </FlexContainer>
    <ArbeidsforholdFaktaPanel readOnly={readOnly} formName={FODSEL_TILRETTELEGGING_FORM} />
    <FlexContainer fluid wrap>
      <FlexRow>
        <FlexColumn>
          <ElementWrapper>
            <VerticalSpacer twentyPx />

            <FaktaSubmitButton
              formName={formProps.form}
              isSubmittable={!readOnly}
              isReadOnly={readOnly}
              hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            />
          </ElementWrapper>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </form>
);

FodselOgTilretteleggingFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  visBegrunnelse: PropTypes.bool.isRequired,
};

const transformValues = values => ({
  kode: '',
  values,
});

const mapStateToProps = (state, ownProps) => {
  const visBegrunnelse = createSelector(
    [
      isBehandlingFormDirty(FODSEL_TILRETTELEGGING_FORM),
      getBehandlingFormValues(FODSEL_TILRETTELEGGING_FORM),
      getBehandlingFormInitialValues(FODSEL_TILRETTELEGGING_FORM),
    ],
    (dirty, values, initialValues = {}) => dirty && values.termindato !== initialValues.termindato,
  );
  // const tilretteleggingREST = getSvangerskapspengerTil(state);

  // TODO: hente info fra backend når klart.  venter avklaring på om det blir checkboxer( mulighet for flere datoer),
  //  eller radiobuttons (kun 1 dato)
  const tilrettelegging = {
    termindato: '2019-08-01',
    fødselsdato: null,
    begrunnelse: '',
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
    visBegrunnelse: visBegrunnelse(state),
    onSubmit: values => ownProps.submitCallback(transformValues(values)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: FODSEL_TILRETTELEGGING_FORM,
})(FodselOgTilretteleggingFaktaForm));
