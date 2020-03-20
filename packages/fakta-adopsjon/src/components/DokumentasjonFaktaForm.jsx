import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Column, Container, Row } from 'nav-frontend-grid';
import { connect } from 'react-redux';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';

import { DatepickerField, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import { Image, VerticalSpacer, FaktaGruppe } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import advarselImageUrl from '@fpsak-frontend/assets/images/advarsel.svg';

import styles from './dokumentasjonFaktaForm.less';

const findAntallBarnUnder15 = (fodselsdatoer, omsorgsovertakelseDato) => {
  const nrOfNotNullFodselsdatoer = Object.keys(fodselsdatoer)
    .filter((id) => fodselsdatoer[id]).length;
  if (nrOfNotNullFodselsdatoer === 0 || !omsorgsovertakelseDato) {
    return '-';
  }
  const omsorgsdato = moment(omsorgsovertakelseDato)
    .subtract(15, 'years');
  return Object.values(fodselsdatoer)
    .map((fodselsdato) => (moment(fodselsdato)
      .isAfter(omsorgsdato) ? 1 : 0))
    .reduce((a, b) => a + b, 0);
};

const isAgeAbove15 = (fodselsdatoer, omsorgsovertakelseDato, id) => fodselsdatoer[id]
  && omsorgsovertakelseDato
  && moment(fodselsdatoer[id])
    .isSameOrBefore(moment(omsorgsovertakelseDato)
      .subtract(15, 'years'));

/**
 * DokumentasjonFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av adopsjonsopplysninger i søknaden.
 */
const DokumentasjonFaktaFormImpl = ({
  intl,
  readOnly,
  fodselsdatoer,
  omsorgsovertakelseDato,
  editedStatus,
  barnetsAnkomstTilNorgeDato,
  erForeldrepengerFagsak,
  hasEktefellesBarnAksjonspunkt,
  alleMerknaderFraBeslutter,
}) => (
  <FaktaGruppe
    aksjonspunktCode={aksjonspunktCodes.ADOPSJONSDOKUMENTAJON}
    titleCode="DokumentasjonFaktaForm.ApplicationInformation"
    merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.ADOPSJONSDOKUMENTAJON]}
  >
    <Container className={styles.container}>
      <DatepickerField
        name="omsorgsovertakelseDato"
        label={{
          id: erForeldrepengerFagsak && hasEktefellesBarnAksjonspunkt
            ? 'DokumentasjonFaktaForm.Stebarnsadopsjon' : 'DokumentasjonFaktaForm.Omsorgsovertakelsesdato',
        }}
        validate={[required, hasValidDate]}
        readOnly={readOnly}
        isEdited={editedStatus.omsorgsovertakelseDato}
      />
      {erForeldrepengerFagsak && barnetsAnkomstTilNorgeDato
      && (
        <DatepickerField
          name="barnetsAnkomstTilNorgeDato"
          label={{ id: 'DokumentasjonFaktaForm.DatoForBarnetsAnkomstTilNorge' }}
          validate={[hasValidDate]}
          readOnly={readOnly}
          isEdited={editedStatus.barnetsAnkomstTilNorgeDato}
        />
      )}

      {Object.keys(fodselsdatoer)
        .map((id, i) => (
          <div key={`div-${aksjonspunktCodes.ADOPSJONSDOKUMENTAJON}-${id}`}>
            <VerticalSpacer eightPx />
            <Row>
              <Column xs="6">
                <DatepickerField
                  name={`fodselsdatoer.${id}`}
                  label={{
                    id: 'DokumentasjonFaktaForm.Fodselsdato',
                    args: { number: i + 1 },
                  }}
                  validate={[required, hasValidDate]}
                  readOnly={readOnly}
                  isEdited={editedStatus.adopsjonFodelsedatoer[id]}
                />
              </Column>
              <Column xs="6">
                {(!readOnly && isAgeAbove15(fodselsdatoer, omsorgsovertakelseDato, id))
                && (
                  <Image
                    className={styles.image}
                    alt={intl.formatMessage({ id: 'DokumentasjonFaktaForm.BarnErOver15Ar' })}
                    tooltip={intl.formatMessage({ id: 'DokumentasjonFaktaForm.BarnErOver15Ar' })}
                    src={advarselImageUrl}
                  />
                )}

              </Column>
            </Row>
          </div>
        ))}
      <VerticalSpacer twentyPx />
      <Undertekst>{intl.formatMessage({ id: 'DokumentasjonFaktaForm.AntallBarnSomFyllerVilkaret' })}</Undertekst>
      <Normaltekst>{findAntallBarnUnder15(fodselsdatoer, omsorgsovertakelseDato)}</Normaltekst>
    </Container>
  </FaktaGruppe>
);

DokumentasjonFaktaFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  fodselsdatoer: PropTypes.shape(),
  omsorgsovertakelseDato: PropTypes.string,
  barnetsAnkomstTilNorgeDato: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  erForeldrepengerFagsak: PropTypes.bool.isRequired,
  hasEktefellesBarnAksjonspunkt: PropTypes.bool.isRequired,
  editedStatus: PropTypes.shape({
    adopsjonFodelsedatoer: PropTypes.shape().isRequired,
    omsorgsovertakelseDato: PropTypes.bool.isRequired,
    barnetsAnkomstTilNorgeDato: PropTypes.bool.isRequired,
  }).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

DokumentasjonFaktaFormImpl.defaultProps = {
  fodselsdatoer: {},
  omsorgsovertakelseDato: undefined,
  barnetsAnkomstTilNorgeDato: undefined,
};

const FORM_NAME = 'AdopsjonInfoPanel';

const mapStateToProps = (state, ownProps) => ({
  ...behandlingFormValueSelector(FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
    state, 'fodselsdatoer', 'omsorgsovertakelseDato', 'barnetsAnkomstTilNorgeDato',
  ),
});

const DokumentasjonFaktaForm = connect(mapStateToProps)(injectIntl(DokumentasjonFaktaFormImpl));

DokumentasjonFaktaForm.buildInitialValues = (soknad, familiehendelse) => ({
  omsorgsovertakelseDato: familiehendelse && familiehendelse.omsorgsovertakelseDato ? familiehendelse.omsorgsovertakelseDato : soknad.omsorgsovertakelseDato,
  barnetsAnkomstTilNorgeDato: familiehendelse && familiehendelse.barnetsAnkomstTilNorgeDato
    ? familiehendelse.barnetsAnkomstTilNorgeDato
    : soknad.barnetsAnkomstTilNorgeDato,
  fodselsdatoer: familiehendelse && familiehendelse.adopsjonFodelsedatoer ? familiehendelse.adopsjonFodelsedatoer : soknad.adopsjonFodelsedatoer,
});

DokumentasjonFaktaForm.transformValues = (values) => ({
  kode: aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
  omsorgsovertakelseDato: values.omsorgsovertakelseDato,
  barnetsAnkomstTilNorgeDato: values.barnetsAnkomstTilNorgeDato,
  fodselsdatoer: values.fodselsdatoer,
});

export default DokumentasjonFaktaForm;
