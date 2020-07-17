import React from 'react';
import { dateFormat, hasValidDate, required } from '@fpsak-frontend/utils';
import { Column, Row } from 'nav-frontend-grid';
import { DatepickerField } from '@fpsak-frontend/form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';
import { refusjonAndelTilVurderingPropType } from '../../propTypes/beregningsgrunnlagPropType';
import styles from './vurderEndringRefusjonRad.less';

const visningsnavn = (andel) => {
  if (andel.arbeidsgiverNavn) {
    return andel.arbeidsgiverNavn;
  } if (andel.arbeidsgiverId && andel.arbeidsgiverId.arbeidsgiverOrgnr) {
    return andel.arbeidsgiverId.arbeidsgiverOrgnr;
  } if (andel.arbeidsgiverId && andel.arbeidsgiverId.arbeidsgiverAktørId) {
    return andel.arbeidsgiverId.arbeidsgiverAktørId;
  }
  return undefined;
};

const FIELD_KEY = 'REFUSJON_ENDRING_DATO';

export const lagNøkkel = (andel) => `${FIELD_KEY}${andel.arbeidsgiverNavn}${andel.aktivitetStatus.kode}${andel.internArbeidsforholdRef}
${andel.arbeidsgiverId.arbeidsgiverOrgnr}${andel.arbeidsgiverId.arbeidsgiverAktørId}`;

export const VurderEndringRefusjonRad = ({
  refusjonAndel,
  readOnly,
}) => {
  if (!refusjonAndel) {
    return null;
  }
  const navn = visningsnavn(refusjonAndel);
  return (
    <>
      <Row>
        <Column xs="8">
          <FormattedMessage
            id="BeregningInfoPanel.RefusjonBG.Arbeidsgiver"
            values={{
              ag: navn,
              dato: dateFormat(refusjonAndel.nyttRefusjonskravFra),
              b: (...chunks) => <b>{chunks}</b>,
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column xs="4">
          <Normaltekst className={styles.marginTopp}>
            <FormattedMessage
              id="BeregningInfoPanel.RefusjonBG.RefusjonFra"
            />
          </Normaltekst>
        </Column>
        <Column xs="4">
          <DatepickerField
            name={lagNøkkel(refusjonAndel)}
            readOnly={readOnly}
            validate={[required, hasValidDate]}
            isEdited={!!refusjonAndel.fastsattNyttRefusjonskravFra}
          />
        </Column>
      </Row>
    </>
  );
};

VurderEndringRefusjonRad.buildInitialValues = (refusjonAndel) => (refusjonAndel.fastsattNyttRefusjonskravFra);

VurderEndringRefusjonRad.transformValues = (values, andel) => {
  const nøkkel = lagNøkkel(andel);
  const fastsattDato = values[nøkkel];
  return {
    arbeidsgiverOrgnr: andel.arbeidsgiverId.arbeidsgiverOrgnr,
    arbeidsgiverAktoerId: andel.arbeidsgiverId.arbeidsgiverAktørId,
    internArbeidsforholdRef: andel.internArbeidsforholdRef,
    fastsattRefusjonFra: fastsattDato,
  };
};

VurderEndringRefusjonRad.propTypes = {
  refusjonAndel: refusjonAndelTilVurderingPropType,
  readOnly: PropTypes.bool.isRequired,
};

export default VurderEndringRefusjonRad;
