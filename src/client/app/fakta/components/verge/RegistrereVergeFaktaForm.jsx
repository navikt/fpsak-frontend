import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';

import FaktaGruppe from 'fakta/components/FaktaGruppe';
import {
  required, hasValidDate, hasValidFodselsnummer, hasValidName,
} from 'utils/validation/validators';
import {
  InputField, DatepickerField, SelectField, TextAreaField, CheckboxField,
} from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';

import styles from './RegistrereVergeFaktaForm.less';

/**
 * RegistrereVergeFaktaForm
 *
 * Formkomponent. Registrering og oppdatering av verge.
 */
export const RegistrereVergeFaktaForm = ({
  intl,
  readOnly,
  vergetyper,
}) => (
  <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.AVKLAR_VERGE}>
    <div>
      <Row>
        <Column xs="3">
          <InputField
            bredde="XXL"
            name="navn"
            label={{ id: 'Verge.Navn' }}
            validate={[required, hasValidName]}
            readOnly={readOnly}
          />
        </Column>
        <Column xs="3">
          <InputField
            bredde="S"
            name="fnr"
            label={{ id: 'Verge.FodselsNummer' }}
            validate={[required, hasValidFodselsnummer]}
            readOnly={readOnly}
          />
        </Column>
        <Column xs="6">
          <TextAreaField
            name="mandatTekst"
            label={{ id: 'Verge.Mandat' }}
            maxLength={1500}
            readOnly={readOnly}
          />
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="5">
          <div className={styles.horizontalForm}>
            <DatepickerField
              name="gyldigFom"
              label={{ id: 'Verge.PeriodeFOM' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
            <DatepickerField
              name="gyldigTom"
              label={{ id: 'Verge.PeriodeTOM' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
          </div>
        </Column>
        <Column xs="1" />

        <Column xs="6">
          <SelectField
            name="vergeType"
            label={intl.formatMessage({ id: 'Verge.TypeVerge' })}
            placeholder={intl.formatMessage({ id: 'Verge.TypeVerge' })}
            validate={[required]}
            selectValues={vergetyper.map(vt => <option key={vt.kode} value={vt.kode}>{vt.navn}</option>)}
            bredde="xxl"
            readOnly={readOnly}
          />
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="12">
          <div>
            <Undertekst>
              <FormattedMessage id="Verge.KontaktPerson" />
            </Undertekst>
          </div>
        </Column>
      </Row>
      <Row>
        <Column xs="6">
          <CheckboxField
            name="sokerErKontaktPerson"
            label={{ id: 'Verge.Soker' }}
            readOnly={readOnly}
          />
          <CheckboxField
            name="vergeErKontaktPerson"
            label={{ id: 'Verge.VergeFullmektig' }}
            readOnly={readOnly}
          />

        </Column>
        <Column xs="6">
          <CheckboxField
            name="sokerErUnderTvungenForvaltning"
            label={{ id: 'Verge.BrukerErUnderTvungenForvaltning' }}
            readOnly={readOnly}
          />
        </Column>

      </Row>
    </div>
  </FaktaGruppe>
);

RegistrereVergeFaktaForm.buildInitialValues = verge => ({
  navn: verge.navn,
  gyldigFom: verge.gyldigFom,
  gyldigTom: verge.gyldigTom,
  fnr: verge.fnr,
  mandatTekst: verge.mandatTekst,
  sokerErKontaktPerson: verge.sokerErKontaktPerson,
  vergeErKontaktPerson: verge.vergeErKontaktPerson,
  sokerErUnderTvungenForvaltning: verge.sokerErUnderTvungenForvaltning,
  vergeType: verge.vergeType ? verge.vergeType.kode : undefined,
});

RegistrereVergeFaktaForm.transformValues = values => ({
  vergeType: values.vergeType,
  navn: values.navn,
  fnr: values.fnr,
  gyldigFom: values.gyldigFom,
  gyldigTom: values.gyldigTom,
  mandatTekst: values.mandatTekst,
  sokerErKontaktPerson: values.sokerErKontaktPerson,
  vergeErKontaktPerson: values.vergeErKontaktPerson,
  sokerErUnderTvungenForvaltning: values.sokerErUnderTvungenForvaltning,
  kode: aksjonspunktCodes.AVKLAR_VERGE,
});

RegistrereVergeFaktaForm.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  vergetyper: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    name: PropTypes.string,
  })),
};

RegistrereVergeFaktaForm.defaultProps = {
  vergetyper: [],
};


export default RegistrereVergeFaktaForm;
