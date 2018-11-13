import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { createLocationForHistorikkItems } from 'app/paths';
import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';

import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findResultatText,
} from './historikkUtils';
import BubbleText from './bubbleText';

import styles from './historikkMalType.less';

const DOCUMENT_SERVER_URL = '/fpsak/api/dokument/hent-dokument';

const HistorikkMalType7 = ({
  historikkinnslagDeler, behandlingLocation, dokumentLinks, intl, saksNr,
}) => {
  const formatChangedField = (endretFelt) => {
    const fieldName = findEndretFeltNavn(endretFelt, intl);
    const sub1 = fieldName.substring(0, fieldName.lastIndexOf(';'));
    const sub2 = fieldName.substring(fieldName.lastIndexOf(';') + 1);
    const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl);
    const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl);

    if (endretFelt.fraVerdi !== null) {
      return (
        <div>
          <FormattedHTMLMessage
            id="Historikk.Template.7.ChangedFromTo"
            values={{
              sub1,
              sub2,
              fromValue,
              toValue,
            }}
          />
        </div>
      );
    }
    return false;
  };

  return (
    historikkinnslagDeler
      .map((historikkinnslagDel, historikkinnslagDelIndex) => (
        <div key={`historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
        }
        >
          <div>
            {historikkinnslagDel.skjermlenke
            && (
              <Element>
                <NavLink
                  to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDel.skjermlenke.kode)}
                >
                  {historikkinnslagDeler[0].skjermlenke.navn}
                </NavLink>
              </Element>
            )
            }

            {historikkinnslagDel.hendelse
            && <Element>{findHendelseText(historikkinnslagDel.hendelse)}</Element>
            }

            {historikkinnslagDel.resultat
            && <Element>{findResultatText(historikkinnslagDel.resultat, intl)}</Element>
            }

            {historikkinnslagDel.endredeFelter && historikkinnslagDel.endredeFelter
              .map((endretFelt, i) => <div key={`endredeFelter${i + 1}`}>{formatChangedField(endretFelt)}</div>)}

            {historikkinnslagDel.opplysninger && historikkinnslagDel.opplysninger
              .map(opplysning => (<FormattedHTMLMessage id={findIdForOpplysningCode(opplysning)} values={{ antallBarn: opplysning.tilVerdi }} />))}

            {historikkinnslagDel.aarsak && <Normaltekst>{historikkinnslagDel.aarsak.navn}</Normaltekst>}
            {historikkinnslagDel.begrunnelse && <BubbleText bodyText={historikkinnslagDel.begrunnelse.navn} className="snakkeboble-panel__tekst" />}
            {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
            <div>
              {dokumentLinks && dokumentLinks.map(dokumentLink => (
                <a
                  key={dokumentLink.url}
                  className={styles.documentLink}
                  href={`${DOCUMENT_SERVER_URL}?saksnummer=${saksNr}&journalpostId=${dokumentLink.journalpostId}&dokumentId=${dokumentLink.dokumentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #
                  {dokumentLink.tag}
                </a>
              ))}
            </div>
          </div>
        </div>

      )));
};

HistorikkMalType7.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  intl: intlShape.isRequired,
  saksNr: PropTypes.number.isRequired,
};

export default injectIntl(HistorikkMalType7);
