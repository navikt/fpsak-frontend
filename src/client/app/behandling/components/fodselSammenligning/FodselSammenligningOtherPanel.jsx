import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import {
  getBehandlingHasSoknad, getSoknadTermindato, getSoknadAntallBarn, getSoknadUtstedtdato,
  getSoknadFodselsdatoer, getFamiliehendelseTermindato,
} from 'behandling/behandlingSelectors';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

/**
 * FodselSammenligningOtherPanel
 *
 * Presentasjonskomponent. Viser sammenligning av fødsel ved ytelsesvedtak/søknad og oppdatert informasjon fra TPS.
 */
export const FodselSammenligningOtherPanel = ({
  terminOrFodselLabel,
  terminOrFodselDate,
  terminFodselHeader,
  antallBarnSoknad,
  utstedtdato,
}) => (
  <ElementWrapper>
    <Element>
      <FormattedMessage id={terminFodselHeader} />
    </Element>
    <Row>
      {utstedtdato
        && (
        <Column xs="4">
          <Normaltekst><FormattedMessage id="FodselsammenligningPanel.UstedtDato" /></Normaltekst>
        </Column>
        )
            }
      <Column xs="4"><Normaltekst><FormattedMessage id={terminOrFodselLabel} /></Normaltekst></Column>
      <Column xs="4"><Normaltekst><FormattedMessage id="FodselsammenligningPanel.AntallBarn" /></Normaltekst></Column>
    </Row>
    <Row>
      {utstedtdato
        && (
        <Column xs="4">
          <Normaltekst>{formatDate(utstedtdato)}</Normaltekst>
        </Column>
        )
            }
      <Column xs="4"><Normaltekst>{terminOrFodselDate}</Normaltekst></Column>
      <Column xs="4"><Normaltekst>{antallBarnSoknad}</Normaltekst></Column>
    </Row>
  </ElementWrapper>
);

FodselSammenligningOtherPanel.propTypes = {
  terminOrFodselLabel: PropTypes.string,
  terminOrFodselDate: PropTypes.string,
  antallBarnSoknad: PropTypes.number.isRequired,
  terminFodselHeader: PropTypes.string,
  utstedtdato: PropTypes.string,
};

FodselSammenligningOtherPanel.defaultProps = {
  utstedtdato: null,
  terminOrFodselLabel: null,
  terminOrFodselDate: null,
  terminFodselHeader: null,
};

export const getTerminFodselLabel = createSelector(
  [getSoknadFodselsdatoer], fodselsdatoer => (Object.keys(fodselsdatoer).length
  > 0 ? 'FodselsammenligningPanel.Fodselsdato' : 'FodselsammenligningPanel.Termindato'),
);

export const getTerminOrFodselDate = createSelector(
  [getBehandlingHasSoknad, getSoknadTermindato, getSoknadFodselsdatoer, getFamiliehendelseTermindato],
  (hasSoknad, termindatoSoknad, fødselsdatoerSoknad, termindato) => {
    if (termindato) {
      return formatDate(termindato);
    }
    if (!hasSoknad) {
      return null;
    }
    if (Object.keys(fødselsdatoerSoknad).length > 0) {
      return formatDate(Object.values(fødselsdatoerSoknad)[0]);
    }
    return formatDate(termindatoSoknad);
  },
);

export const getAntallBarn = createSelector([getSoknadAntallBarn], antallBarnSoknad => (antallBarnSoknad));

export const getTerminFodselHeader = createSelector([getSoknadFodselsdatoer], fodselsdatoer => (Object.keys(fodselsdatoer).length > 0
  ? 'FodselSammenligningOtherPanel.OpplysningerISoknad' : 'FodselSammenligningOtherPanel.TerminISoknad'));

const mapStateToProps = state => ({
  terminOrFodselLabel: getTerminFodselLabel(state),
  terminOrFodselDate: getTerminOrFodselDate(state),
  antallBarnSoknad: getAntallBarn(state),
  terminFodselHeader: getTerminFodselHeader(state),
  utstedtdato: getSoknadUtstedtdato(state),
});

export default connect(mapStateToProps)(FodselSammenligningOtherPanel);
