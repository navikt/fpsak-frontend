import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Container, Row, Column } from 'nav-frontend-grid';
import { connect } from 'react-redux';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';

import { getEditedStatus } from 'behandling/behandlingSelectors';
import { isForeldrepengerFagsak } from 'fagsak/fagsakSelectors';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import { DatepickerField } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { required, hasValidDate } from 'utils/validation/validators';
import Image from 'sharedComponents/Image';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import advarselImageUrl from 'images/advarsel.svg';

import styles from './dokumentasjonFaktaForm.less';

const findAntallBarnUnder15 = (fodselsdatoer, omsorgsovertakelseDato) => {
  const nrOfNotNullFodselsdatoer = Object.keys(fodselsdatoer).filter(id => fodselsdatoer[id]).length;
  if (nrOfNotNullFodselsdatoer === 0 || !omsorgsovertakelseDato) {
    return '-';
  }
  const omsorgsdato = moment(omsorgsovertakelseDato).subtract(15, 'years');
  return Object.values(fodselsdatoer)
    .map(fodselsdato => (moment(fodselsdato).isAfter(omsorgsdato) ? 1 : 0))
    .reduce((a, b) => a + b, 0);
};

const isAgeAbove15 = (fodselsdatoer, omsorgsovertakelseDato, id) => fodselsdatoer[id]
    && omsorgsovertakelseDato
    && moment(fodselsdatoer[id]).isSameOrBefore(moment(omsorgsovertakelseDato).subtract(15, 'years'));

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
  barnetsAnkomstTilNorgeDato,
  adopsjonFodelsedatoerIsEdited,
  omsorgsovertakelseDatoIsEdited,
  barnetsAnkomstTilNorgeDatoIsEdited,
  erForeldrepengerFagsak,
  hasEktefellesBarnAksjonspunkt,
}) => (
  <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.ADOPSJONSDOKUMENTAJON} titleCode="DokumentasjonFaktaForm.ApplicationInformation">
    <Container className={styles.container}>
      <DatepickerField
        name="omsorgsovertakelseDato"
        label={{
          id: erForeldrepengerFagsak && hasEktefellesBarnAksjonspunkt
            ? 'DokumentasjonFaktaForm.Stebarnsadopsjon' : 'DokumentasjonFaktaForm.Omsorgsovertakelsesdato',
        }}
        validate={[required, hasValidDate]}
        readOnly={readOnly}
        isEdited={omsorgsovertakelseDatoIsEdited}
      />
      {erForeldrepengerFagsak && barnetsAnkomstTilNorgeDato
      && (
      <DatepickerField
        name="barnetsAnkomstTilNorgeDato"
        label={{ id: 'DokumentasjonFaktaForm.DatoForBarnetsAnkomstTilNorge' }}
        validate={[hasValidDate]}
        readOnly={readOnly}
        isEdited={barnetsAnkomstTilNorgeDatoIsEdited}
      />
      )
      }
      {Object.keys(fodselsdatoer).map((id, i) => (
        <div key={`div-${aksjonspunktCodes.ADOPSJONSDOKUMENTAJON}-${id}`}>
          <VerticalSpacer eightPx />
          <Row>
            <Column xs="6">
              <DatepickerField
                name={`fodselsdatoer.${id}`}
                label={{ id: 'DokumentasjonFaktaForm.Fodselsdato', args: { number: i + 1 } }}
                validate={[required, hasValidDate]}
                readOnly={readOnly}
                isEdited={adopsjonFodelsedatoerIsEdited[id]}
              />
            </Column>
            <Column xs="6">
              {(!readOnly && isAgeAbove15(fodselsdatoer, omsorgsovertakelseDato, id))
              && (
              <Image
                className={styles.image}
                altCode="DokumentasjonFaktaForm.BarnErOver15Ar"
                titleCode="DokumentasjonFaktaForm.BarnErOver15Ar"
                src={advarselImageUrl}
              />
              )
              }
            </Column>
          </Row>
        </div>
      ))
      }
      <VerticalSpacer twentyPx />
      <Undertekst>{intl.formatMessage({ id: 'DokumentasjonFaktaForm.AntallBarnSomFyllerVilkaret' })}</Undertekst>
      <Normaltekst>{findAntallBarnUnder15(fodselsdatoer, omsorgsovertakelseDato)}</Normaltekst>
    </Container>
  </FaktaGruppe>
);

DokumentasjonFaktaFormImpl.propTypes = {
  intl: intlShape.isRequired,
  fodselsdatoer: PropTypes.shape(),
  omsorgsovertakelseDato: PropTypes.string,
  barnetsAnkomstTilNorgeDato: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  adopsjonFodelsedatoerIsEdited: PropTypes.shape(),
  omsorgsovertakelseDatoIsEdited: PropTypes.bool,
  barnetsAnkomstTilNorgeDatoIsEdited: PropTypes.bool,
  erForeldrepengerFagsak: PropTypes.bool.isRequired,
  hasEktefellesBarnAksjonspunkt: PropTypes.bool.isRequired,
};

DokumentasjonFaktaFormImpl.defaultProps = {
  fodselsdatoer: {},
  omsorgsovertakelseDato: undefined,
  barnetsAnkomstTilNorgeDato: undefined,
  adopsjonFodelsedatoerIsEdited: {},
  omsorgsovertakelseDatoIsEdited: false,
  barnetsAnkomstTilNorgeDatoIsEdited: false,
};

const mapStateToProps = state => ({
  erForeldrepengerFagsak: isForeldrepengerFagsak(state),
  adopsjonFodelsedatoerIsEdited: getEditedStatus(state).adopsjonFodelsedatoer,
  omsorgsovertakelseDatoIsEdited: getEditedStatus(state).omsorgsovertakelseDato,
  barnetsAnkomstTilNorgeDatoIsEdited: getEditedStatus(state).barnetsAnkomstTilNorgeDato,
  ...behandlingFormValueSelector('AdopsjonInfoPanel')(state, 'fodselsdatoer', 'omsorgsovertakelseDato', 'barnetsAnkomstTilNorgeDato'),
});

const DokumentasjonFaktaForm = connect(mapStateToProps)(injectIntl(DokumentasjonFaktaFormImpl));

DokumentasjonFaktaForm.buildInitialValues = (soknad, familiehendelse) => ({
  omsorgsovertakelseDato: familiehendelse && familiehendelse.omsorgsovertakelseDato ? familiehendelse.omsorgsovertakelseDato : soknad.omsorgsovertakelseDato,
  barnetsAnkomstTilNorgeDato: familiehendelse && familiehendelse.barnetsAnkomstTilNorgeDato
    ? familiehendelse.barnetsAnkomstTilNorgeDato
    : soknad.barnetsAnkomstTilNorgeDato,
  fodselsdatoer: familiehendelse && familiehendelse.adopsjonFodelsedatoer ? familiehendelse.adopsjonFodelsedatoer : soknad.adopsjonFodelsedatoer,
});

DokumentasjonFaktaForm.transformValues = values => ({
  kode: aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
  omsorgsovertakelseDato: values.omsorgsovertakelseDato,
  barnetsAnkomstTilNorgeDato: values.barnetsAnkomstTilNorgeDato,
  fodselsdatoer: values.fodselsdatoer,
});

export default DokumentasjonFaktaForm;
