import React from 'react';
import PropTypes from 'prop-types';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { createVisningsnavnForAktivitet } from '@fpsak-frontend/utils';
import { arbeidsforholdProptype } from '../ArbeidsforholdHelper';

const finnArbeidsforholdForAndel = (arbeidsforholdListe, val) => {
  const andelsnr = Number(val);
  return arbeidsforholdListe.find(arbeidsforhold => arbeidsforhold.andelsnr === andelsnr);
};

const setArbeidsforholdInfo = (fields, index, arbeidsforholdList, val) => {
  const field = fields.get(index);
  const arbeidsforhold = finnArbeidsforholdForAndel(arbeidsforholdList, val);
  if (arbeidsforhold) {
    field.arbeidsforholdId = arbeidsforhold.arbeidsforholdId;
    field.arbeidsgiverNavn = arbeidsforhold.arbeidsgiverNavn;
    field.arbeidsgiverId = arbeidsforhold.arbeidsgiverId;
    field.arbeidsperiodeFom = arbeidsforhold.startdato;
    field.arbeidsperiodeTom = arbeidsforhold.opphoersdato;
    field.andelsnrRef = arbeidsforhold.andelsnr;
  }
};

const fieldLabel = (index, labelId) => {
  if (index === 0) {
    return { id: labelId };
  }
  return '';
};


const arbeidsgiverSelectValues = arbeidsforholdList => (arbeidsforholdList
  .map(arbeidsforhold => (
    <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
      {createVisningsnavnForAktivitet(arbeidsforhold)}
    </option>
  )));


const ArbeidsforholdField = ({
  fields,
  index,
  name,
  readOnly,
  arbeidsforholdList,
}) => (
  <ElementWrapper>
    {(!fields.get(index).nyAndel)
      && (
      <InputField
        name={name}
        bredde="L"
        readOnly
      />
      )
      }
    {fields.get(index).nyAndel
      && (
      <SelectField
        name={name}
        bredde="l"
        label={fieldLabel(index, 'BeregningInfoPanel.EndringBG.Andel')}
        selectValues={arbeidsgiverSelectValues(arbeidsforholdList)}
        readOnly={readOnly}
        onChange={event => setArbeidsforholdInfo(fields, index, arbeidsforholdList, event.target.value)}
      />
      )
      }
  </ElementWrapper>
);

ArbeidsforholdField.propTypes = {
  fields: PropTypes.shape().isRequired,
  index: PropTypes.number.isRequired,
  readOnly: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  arbeidsforholdList: PropTypes.arrayOf(arbeidsforholdProptype).isRequired,
};


export default ArbeidsforholdField;
