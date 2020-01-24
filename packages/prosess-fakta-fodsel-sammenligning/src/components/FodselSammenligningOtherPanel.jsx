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

const formatDate = (date) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

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
        )}
      <Column xs="4"><Normaltekst><FormattedMessage id={terminOrFodselLabel} /></Normaltekst></Column>
      <Column xs="4"><Normaltekst><FormattedMessage id="FodselsammenligningPanel.AntallBarn" /></Normaltekst></Column>
    </Row>
    <Row>
      {utstedtdato
        && (
        <Column xs="4">
          <Normaltekst>{formatDate(utstedtdato)}</Normaltekst>
        </Column>
        )}
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

const getHasSoknad = createSelector([(state, ownProps) => ownProps.soknad], (soknad) => !!soknad);
const getSoknadFodselsdatoer = createSelector([(state, ownProps) => ownProps.soknad], (soknad = {}) => (soknad.fodselsdatoer ? soknad.fodselsdatoer : {}));
const getSoknadTermindato = createSelector([(state, ownProps) => ownProps.soknad], (soknad = {}) => (soknad.termindato ? soknad.termindato : {}));

export const getTerminFodselLabel = createSelector(
  [getSoknadFodselsdatoer], (fodselsdatoer) => (Object.keys(fodselsdatoer).length
  > 0 ? 'FodselsammenligningPanel.Fodselsdato' : 'FodselsammenligningPanel.Termindato'),
);

export const getTerminOrFodselDate = createSelector(
  [getHasSoknad, getSoknadTermindato, getSoknadFodselsdatoer, (state, ownProps) => ownProps.termindato],
  (hasSoknad, termindatoSoknad, fødselsdatoerSoknad, termindato) => {
    if (hasSoknad && Object.keys(fødselsdatoerSoknad).length > 0) {
      return formatDate(Object.values(fødselsdatoerSoknad)[0]);
    }
    if (termindato) {
      return formatDate(termindato);
    }
    if (!hasSoknad) {
      return null;
    }
    return formatDate(termindatoSoknad);
  },
);

export const getTerminFodselHeader = createSelector([getSoknadFodselsdatoer], (fodselsdatoer) => (Object.keys(fodselsdatoer).length > 0
  ? 'FodselSammenligningOtherPanel.OpplysningerISoknad' : 'FodselSammenligningOtherPanel.TerminISoknad'));

// TODO Fjern mapStateToProps (ingenting blir henta fra state)
const mapStateToProps = (state, ownProps) => ({
  terminOrFodselLabel: getTerminFodselLabel(state, ownProps),
  terminOrFodselDate: getTerminOrFodselDate(state, ownProps),
  antallBarnSoknad: ownProps.soknad.antallBarn,
  terminFodselHeader: getTerminFodselHeader(state, ownProps),
  utstedtdato: ownProps.soknad.utstedtdato,
});

export default connect(mapStateToProps)(FodselSammenligningOtherPanel);
