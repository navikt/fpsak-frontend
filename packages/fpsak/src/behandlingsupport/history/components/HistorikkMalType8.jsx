import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { historikkinnslagDelPropType } from '@fpsak-frontend/prop-types';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'kodeverk/duck';
import { createLocationForHistorikkItems } from 'kodeverk/skjermlenkeCodes';
import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findResultatText,
} from './historikkUtils';
import HistorikkDokumentLenke from './HistorikkDokumentLenke';
import BubbleText from './bubbleText';

const HistorikkMalType8 = ({
  historikkinnslagDeler, behandlingLocation, dokumentLinks, intl, saksNr, getKodeverknavn,
}) => {
  const formatChangedField = (endretFelt) => {
    const fieldName = findEndretFeltNavn(endretFelt, intl);
    const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl);
    const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl);

    if (endretFelt.fraVerdi !== null) {
      return (
        <div>
          <FormattedHTMLMessage
            id="Historikk.Template.8.ChangedFromTo"
            values={{
              fieldName,
              fromValue,
              toValue,
            }}
          />
        </div>
      );
    }
    return (
      <div>
        <FormattedHTMLMessage
          id="Historikk.Template.8.LagtTil"
          values={{
            fieldName,
            value: toValue,
          }}
        />
      </div>
    );
  };

  return (
    historikkinnslagDeler.map((
      historikkinnslagDel, historikkinnslagDelIndex,
    ) => (
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
                {getKodeverknavn(historikkinnslagDeler[0].skjermlenke)}
              </NavLink>
            </Element>
          )
          }

          {historikkinnslagDel.hendelse
          && <Element>{findHendelseText(historikkinnslagDel.hendelse, getKodeverknavn)}</Element>
          }

          {historikkinnslagDel.resultat
          && <Element>{findResultatText(historikkinnslagDel.resultat, intl)}</Element>
          }

          {historikkinnslagDel.endredeFelter && historikkinnslagDel.endredeFelter
            .map((endretFelt, i) => <div key={`endredeFelter${i + 1}`}>{formatChangedField(endretFelt)}</div>)}

          {historikkinnslagDel.opplysninger && historikkinnslagDel.opplysninger.map(opplysning => (
            <FormattedHTMLMessage
              id={findIdForOpplysningCode(opplysning)}
              values={{ antallBarn: opplysning.tilVerdi }}
            />
          ))}

          {historikkinnslagDel.aarsak && <Normaltekst>{getKodeverknavn(historikkinnslagDel.aarsak)}</Normaltekst>}
          {historikkinnslagDel.begrunnelse && <BubbleText bodyText={getKodeverknavn(historikkinnslagDel.begrunnelse)} className="snakkeboble-panel__tekst" />}
          {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
          <div>
            {dokumentLinks && dokumentLinks.map(dokumentLenke => (
              <HistorikkDokumentLenke
                key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
                dokumentLenke={dokumentLenke}
                saksNr={saksNr}
              />
            ))}
          </div>
        </div>
      </div>

    )));
};

HistorikkMalType8.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  intl: intlShape.isRequired,
  saksNr: PropTypes.number.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectIntl(injectKodeverk(getAlleKodeverk)(HistorikkMalType8));
