import React from 'react';
import PropTypes from 'prop-types';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/util/visningsnavnHelper';
import { getUniqueListOfArbeidsforholdFields } from '../ArbeidsforholdHelper';

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
    field.arbeidsperiodeFom = arbeidsforhold.arbeidsperiodeFom;
    field.arbeidsperiodeTom = arbeidsforhold.arbeidsperiodeTom;
    field.andelsnrRef = arbeidsforhold.andelsnr;
  }
};

const fieldLabel = (index, labelId) => {
  if (index === 0) {
    return { id: labelId };
  }
  return '';
};


const arbeidsgiverSelectValues = (arbeidsforholdList, getKodeverknavn) => (arbeidsforholdList
  .map(arbeidsforhold => (
    <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
      {createVisningsnavnForAktivitet(arbeidsforhold, getKodeverknavn)}
    </option>
  )));


export const ArbeidsforholdFieldImpl = ({
  fields,
  index,
  name,
  readOnly,
  getKodeverknavn,
}) => {
  const arbeidsforholdList = getUniqueListOfArbeidsforholdFields(fields);
  return (
    <ElementWrapper>
      {(!fields.get(index).skalKunneEndreAktivitet)
      && (
      <InputField
        name={name}
        bredde="L"
        readOnly
      />
      )
      }
      {fields.get(index).skalKunneEndreAktivitet
      && (
      <SelectField
        name={name}
        bredde="l"
        label={fieldLabel(index, 'BeregningInfoPanel.EndringBG.Andel')}
        selectValues={arbeidsgiverSelectValues(arbeidsforholdList, getKodeverknavn)}
        readOnly={readOnly}
        onChange={event => setArbeidsforholdInfo(fields, index, arbeidsforholdList, event.target.value)}
      />
      )
      }
    </ElementWrapper>
);
};

ArbeidsforholdFieldImpl.propTypes = {
  fields: PropTypes.shape().isRequired,
  index: PropTypes.number.isRequired,
  readOnly: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectKodeverk(getAlleKodeverk)(ArbeidsforholdFieldImpl);
