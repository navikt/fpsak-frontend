import React from 'react';
import PropTypes from 'prop-types';

import { FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { createLocationForHistorikkItems } from 'app/paths';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';
import historikkEndretFeltTypeCodes from 'kodeverk/historikkEndretFeltTypeCodes';
import historikkEndretFeltTypeHeadingCodes from 'kodeverk/historikkEndretFeltTypeHeadingCodes';
import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findIdForSoeknadsperiodeCode,
  findResultatText,
} from './historikkUtils';

import BubbleText from './bubbleText';

import styles from './historikkMalType.less';

const scrollUp = () => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
  return false;
};

function isGjeldendeFraUtenEndredeFelter(historikkinnslagDel) {
  return (historikkinnslagDel.gjeldendeFra && !historikkinnslagDel.endredeFelter);
}

const lagGjeldendeFraInnslag = (historikkinnslagDel) => {
  if (!historikkinnslagDel.gjeldendeFra) {
    return undefined;
  }
  if (historikkinnslagDel.gjeldendeFra && historikkinnslagDel.gjeldendeFra.navn) {
    return (
      <ElementWrapper>
        <FormattedHTMLMessage
          id={historikkEndretFeltTypeCodes[historikkinnslagDel.gjeldendeFra.navn].feltId}
          values={{ value: historikkinnslagDel.gjeldendeFra.verdi }}
        />
        {historikkinnslagDel.gjeldendeFra.fra
        && (
          <FormattedHTMLMessage
            id="Historikk.Template.5.VerdiGjeldendeFra"
            values={{ dato: historikkinnslagDel.gjeldendeFra.fra }}
          />
        )
        }
        {isGjeldendeFraUtenEndredeFelter(historikkinnslagDel)
        && (
          <div>
            <FormattedHTMLMessage
              id="Historikk.Template.5.IngenEndring"
            />
          </div>
        )
        }
      </ElementWrapper>
    );
  }
  if (historikkinnslagDel.gjeldendeFra && !historikkinnslagDel.gjeldendeFra.navn) {
    return (
      <ElementWrapper>
        <FormattedHTMLMessage
          id="Historikk.Template.5.GjeldendeFra"
          values={{ dato: historikkinnslagDel.gjeldendeFra.fra }}
        />
        {isGjeldendeFraUtenEndredeFelter(historikkinnslagDel)
        && (
          <div>
            <FormattedHTMLMessage
              id="Historikk.Template.5.IngenEndring"
            />
          </div>
        )
        }
      </ElementWrapper>
    );
  }
  return undefined;
};


const HistorikkMalType5 = ({
  historikkinnslagDeler, behandlingLocation, dokumentLinks, intl, saksNr,
}) => {
  const lageElementInnhold = (historikkDel) => {
    const list = [];
    if (historikkDel.hendelse) {
      list.push(findHendelseText(historikkDel.hendelse));
    }
    if (historikkDel.resultat) {
      list.push(findResultatText(historikkDel.resultat, intl));
    }
    return list;
  };

  const formatChangedField = (endretFelt) => {
    const fieldName = findEndretFeltNavn(endretFelt, intl);
    const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl);
    const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl);

    if (endretFelt.fraVerdi !== null && endretFelt.endretFeltNavn.kode !== historikkEndretFeltTypeCodes.FORDELING_FOR_NY_ANDEL.kode) {
      return (
        <div>
          <FormattedHTMLMessage
            id="Historikk.Template.5.ChangedFromTo"
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
          id="Historikk.Template.5.FieldSetTo"
          values={{
            fieldName,
            value: toValue,
          }}
        />
      </div>
    );
  };

  const lagTemaHeadingId = (historikkinnslagDel) => {
    const { tema } = historikkinnslagDel;
    if (tema) {
      const heading = historikkEndretFeltTypeHeadingCodes[tema.endretFeltNavn.kode];
      if (heading && tema.navnVerdi) {
        return <FormattedHTMLMessage id={heading.feltId} values={{ value: tema.navnVerdi }} />;
      }
    }
    return undefined;
  };

  const lagSoeknadsperiode = soeknadsperiode => (soeknadsperiode.navnVerdi
    ? (
      <FormattedHTMLMessage
        id={findIdForSoeknadsperiodeCode(soeknadsperiode)}
        values={{
          navnVerdi: soeknadsperiode.navnVerdi,
          value: soeknadsperiode.tilVerdi,
        }}
      />
    )
    : (
      <FormattedHTMLMessage
        id={findIdForSoeknadsperiodeCode(soeknadsperiode)}
        values={{ value: soeknadsperiode.tilVerdi }}
      />
    ));

  return (
    historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
      <div key={`historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
      }
      >
        {historikkinnslagDel.skjermlenke
        && (
          <Element>
            <NavLink
              to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDel.skjermlenke.kode)}
              onClick={scrollUp}
            >
              {historikkinnslagDel.skjermlenke.navn}
            </NavLink>
          </Element>
        )
        }

        {lageElementInnhold(historikkinnslagDel)
          .map(tekst => (
            <div key={tekst}><Element>{tekst}</Element></div>
          ))}


        {lagGjeldendeFraInnslag(historikkinnslagDel)}


        {historikkinnslagDel.soeknadsperiode && lagSoeknadsperiode(historikkinnslagDel.soeknadsperiode)}

        {lagTemaHeadingId(historikkinnslagDel)}


        {historikkinnslagDel.endredeFelter && historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
          <div key={`endredeFelter${i + 1}`}>
            {formatChangedField(endretFelt)}
          </div>
        ))}

        {historikkinnslagDel.opplysninger && historikkinnslagDel.opplysninger.map(opplysning => (
          <FormattedHTMLMessage
            id={findIdForOpplysningCode(opplysning)}
            values={{ antallBarn: opplysning.tilVerdi }}
            key={`${opplysning.navn}@${opplysning.tilVerdi}`}
          />
        ))}

        {historikkinnslagDel.aarsak && <Normaltekst>{historikkinnslagDel.aarsak.navn}</Normaltekst>}
        {historikkinnslagDel.begrunnelse && <BubbleText bodyText={historikkinnslagDel.begrunnelse.navn} className="snakkeboble-panel__tekst" />}
        {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
        <div>
          {dokumentLinks && dokumentLinks.map(dokumentLink => (
            <a
              key={dokumentLink.url}
              className={styles.documentLink}
              href={`/fpsak/api/dokument/hent-dokument?saksnummer=${saksNr}&journalpostId=${dokumentLink.journalpostId}&dokumentId=${dokumentLink.dokumentId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @
              {dokumentLink.tag}
            </a>
          ))}
        </div>

        {historikkinnslagDelIndex < historikkinnslagDeler.length - 1
        && <VerticalSpacer sixteenPx />
        }
      </div>
    )));
};

HistorikkMalType5.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  intl: intlShape.isRequired,
  saksNr: PropTypes.number.isRequired,
};

export default injectIntl(HistorikkMalType5);
