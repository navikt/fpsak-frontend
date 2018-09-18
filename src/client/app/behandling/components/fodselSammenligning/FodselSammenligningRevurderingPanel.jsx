import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import { getBehandlingVedtaksDatoSomSvangerskapsuke } from 'behandling/behandlingSelectors';
import { getSoknadFraOriginalBehandling, getFamiliehendelseFraOriginalBehandling } from 'behandling/selectors/originalBehandlingSelectors';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';

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
        )
      }
      <Column xs="4"><Normaltekst><FormattedMessage id={terminOrFodselLabel} /></Normaltekst></Column>
      <Column xs="4"><Normaltekst><FormattedMessage id="FodselsammenligningPanel.AntallBarn" /></Normaltekst></Column>
    </Row>
    <Row>
      {shouldShowVedtaksdatoAsSvangerskapsuke
        && <Column xs="4"><Normaltekst>{vedtaksDato}</Normaltekst></Column>
      }
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

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

export const getIsTermin = createSelector(
  [getSoknadFraOriginalBehandling, getFamiliehendelseFraOriginalBehandling],
  (originalSoknad = {}, orginalFamiliehendelse = {}) => !!orginalFamiliehendelse.termindato
  || (!originalSoknad.fodselsdatoer || Object.keys(originalSoknad.fodselsdatoer).length === 0),
);

const getTerminOrFodselLabel = createSelector(
  [getIsTermin], isTermin => (isTermin ? 'FodselsammenligningPanel.Termindato' : 'FodselsammenligningPanel.Fodselsdato'),
);

export const getTerminDateOrFodselDate = createSelector(
  [getIsTermin, getSoknadFraOriginalBehandling, getFamiliehendelseFraOriginalBehandling],
  (isTermin, originalSoknad, orginalFamiliehendelse) => {
    if (!originalSoknad && !orginalFamiliehendelse) {
      return '';
    } if (isTermin) {
      return formatDate(orginalFamiliehendelse.termindato ? orginalFamiliehendelse.termindato : originalSoknad.termindato);
    }
    return formatDate(orginalFamiliehendelse.fodselsdato ? orginalFamiliehendelse.fodselsdato : Object.values(originalSoknad.fodselsdatoer)[0]);
  },
);

export const getAntallBarn = createSelector(
  [getIsTermin, getSoknadFraOriginalBehandling, getFamiliehendelseFraOriginalBehandling],
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
  [getFamiliehendelseFraOriginalBehandling, getBehandlingVedtaksDatoSomSvangerskapsuke],
  (orginalFamiliehendelse, vedtaksDato) => (!orginalFamiliehendelse ? false : !orginalFamiliehendelse.fodselsdato && !!vedtaksDato),
);

const mapStateToProps = state => ({
  terminOrFodselLabel: getTerminOrFodselLabel(state),
  terminOrFodselDate: getTerminDateOrFodselDate(state),
  antallBarn: getAntallBarn(state),
  shouldShowVedtaksdatoAsSvangerskapsuke: showVedtaksdatoAsSvangerskapsuke(state),
  vedtaksdato: getBehandlingVedtaksDatoSomSvangerskapsuke(state),
});

export default connect(mapStateToProps)(FodselSammenligningRevurderingPanel);
