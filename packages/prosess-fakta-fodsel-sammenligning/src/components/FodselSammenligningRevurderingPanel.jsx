import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { ElementWrapper } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';

/**
 * FodselSammenligningRevurderingPanel
 *
 * Presentasjonskomponent. Viser sammenligning av fødsel ved ytelsesvedtak/søknad og oppdatert informasjon fra TPS.
 */
export const FodselSammenligningRevurderingPanel = ({
  vedtaksDato,
  terminOrFodselLabel,
  terminOrFodselDate,
  antallBarn,
  shouldShowVedtaksdatoAsSvangerskapsuke,
}) => (
  <ElementWrapper>
    <Element><FormattedMessage id="FodselsammenligningPanel.Ytelsesvedtak" /></Element>
    <Row>
      {shouldShowVedtaksdatoAsSvangerskapsuke
        && (
        <Column xs="4">
          <Normaltekst><FormattedMessage id="FodselsammenligningPanel.Vedtaksdato" /></Normaltekst>
        </Column>
        )}
      <Column xs="4"><Normaltekst><FormattedMessage id={terminOrFodselLabel} /></Normaltekst></Column>
      <Column xs="4"><Normaltekst><FormattedMessage id="FodselsammenligningPanel.AntallBarn" /></Normaltekst></Column>
    </Row>
    <Row>
      {shouldShowVedtaksdatoAsSvangerskapsuke
        && <Column xs="4"><Normaltekst>{vedtaksDato}</Normaltekst></Column>}
      <Column xs="4"><Normaltekst>{terminOrFodselDate}</Normaltekst></Column>
      <Column xs="4"><Normaltekst>{antallBarn}</Normaltekst></Column>
    </Row>
  </ElementWrapper>
);

FodselSammenligningRevurderingPanel.propTypes = {
  terminOrFodselLabel: PropTypes.string.isRequired,
  terminOrFodselDate: PropTypes.string.isRequired,
  antallBarn: PropTypes.number.isRequired,
  shouldShowVedtaksdatoAsSvangerskapsuke: PropTypes.bool.isRequired,
  vedtaksDato: PropTypes.string,
};

FodselSammenligningRevurderingPanel.defaultProps = {
  vedtaksDato: '',
};

const formatDate = (date) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

export const getIsTermin = createSelector(
  [(ownProps) => ownProps.soknadOriginalBehandling, (ownProps) => ownProps.familiehendelseOriginalBehandling],
  (originalSoknad = {}, orginalFamiliehendelse = {}) => !!orginalFamiliehendelse.termindato
  || (!originalSoknad.fodselsdatoer || Object.keys(originalSoknad.fodselsdatoer).length === 0),
);

const getTerminOrFodselLabel = createSelector(
  [getIsTermin], (isTermin) => (isTermin ? 'FodselsammenligningPanel.Termindato' : 'FodselsammenligningPanel.Fodselsdato'),
);

export const getTerminDateOrFodselDate = createSelector(
  [getIsTermin, (ownProps) => ownProps.soknadOriginalBehandling, (ownProps) => ownProps.familiehendelseOriginalBehandling],
  (isTermin, originalSoknad, orginalFamiliehendelse) => {
    if (!originalSoknad && !orginalFamiliehendelse) {
      return '';
    }
    if (isTermin) {
      return formatDate(orginalFamiliehendelse.termindato ? orginalFamiliehendelse.termindato : originalSoknad.termindato);
    }
    return formatDate(orginalFamiliehendelse.fodselsdato ? orginalFamiliehendelse.fodselsdato : Object.values(originalSoknad.fodselsdatoer)[0]);
  },
);

export const getAntallBarn = createSelector(
  [getIsTermin, (ownProps) => ownProps.soknadOriginalBehandling, (ownProps) => ownProps.familiehendelseOriginalBehandling],
  (isTermin, originalSoknad, orginalFamiliehendelse) => {
    if (!originalSoknad && !orginalFamiliehendelse) {
      return 0;
    }
    if (isTermin) {
      return orginalFamiliehendelse.termindato ? orginalFamiliehendelse.antallBarnTermin : originalSoknad.antallBarn;
    }
    return orginalFamiliehendelse.fodselsdato ? orginalFamiliehendelse.antallBarnFodsel : originalSoknad.antallBarn;
  },
);

export const showVedtaksdatoAsSvangerskapsuke = createSelector(
  [(ownProps) => ownProps.familiehendelseOriginalBehandling, (ownProps) => ownProps.vedtaksDatoSomSvangerskapsuke],
  (orginalFamiliehendelse, vedtaksDato) => (!orginalFamiliehendelse ? false : !orginalFamiliehendelse.fodselsdato && !!vedtaksDato),
);

// TODO Fjern mapStateToProps (ingenting blir henta fra state)
const mapStateToProps = (state, ownProps) => ({
  terminOrFodselLabel: getTerminOrFodselLabel(ownProps),
  terminOrFodselDate: getTerminDateOrFodselDate(ownProps),
  antallBarn: getAntallBarn(ownProps),
  shouldShowVedtaksdatoAsSvangerskapsuke: showVedtaksdatoAsSvangerskapsuke(ownProps),
  vedtaksdato: ownProps.vedtaksDatoSomSvangerskapsuke,
});

export default connect(mapStateToProps)(FodselSammenligningRevurderingPanel);
