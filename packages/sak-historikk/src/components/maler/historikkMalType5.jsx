import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import historikkEndretFeltTypeCodes from '../../kodeverk/historikkEndretFeltTypeCodes';
import historikkEndretFeltTypeHeadingCodes from '../../kodeverk/historikkEndretFeltTypeHeadingCodes';
import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findIdForSoeknadsperiodeCode,
  findResultatText,
} from './felles/historikkUtils';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';
import BubbleText from './felles/bubbleText';

const scrollUp = () => {
  window.scroll(0, 0);
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
      <>
        <FormattedMessage
          id={historikkEndretFeltTypeCodes[historikkinnslagDel.gjeldendeFra.navn].feltId}
          values={{ value: historikkinnslagDel.gjeldendeFra.verdi, b: (...chunks) => <b>{chunks}</b>, br: <br /> }}
        />
        {historikkinnslagDel.gjeldendeFra.fra
        && (
          <FormattedMessage
            id="Historikk.Template.5.VerdiGjeldendeFra"
            values={{ dato: historikkinnslagDel.gjeldendeFra.fra, b: (...chunks) => <b>{chunks}</b> }}
          />
        )}
        {isGjeldendeFraUtenEndredeFelter(historikkinnslagDel)
        && (
          <div>
            <FormattedMessage
              id="Historikk.Template.5.IngenEndring"
            />
          </div>
        )}
      </>
    );
  }
  if (historikkinnslagDel.gjeldendeFra && !historikkinnslagDel.gjeldendeFra.navn) {
    return (
      <>
        <FormattedMessage
          id="Historikk.Template.5.GjeldendeFra"
          values={{ dato: historikkinnslagDel.gjeldendeFra.fra, b: (...chunks) => <b>{chunks}</b> }}
        />
        {isGjeldendeFraUtenEndredeFelter(historikkinnslagDel)
        && (
          <div>
            <FormattedMessage
              id="Historikk.Template.5.IngenEndring"
            />
          </div>
        )}
      </>
    );
  }
  return undefined;
};


const HistorikkMalType5 = ({
  historikkinnslagDeler,
  behandlingLocation,
  dokumentLinks,
  intl,
  saksNr,
  getKodeverknavn,
  createLocationForSkjermlenke,
}) => {
  const lageElementInnhold = (historikkDel) => {
    const list = [];
    if (historikkDel.hendelse) {
      list.push(findHendelseText(historikkDel.hendelse, getKodeverknavn));
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
          <FormattedMessage
            id="Historikk.Template.5.ChangedFromTo"
            values={{
              fieldName,
              fromValue,
              toValue,
              b: (...chunks) => <b>{chunks}</b>,
            }}
          />
        </div>
      );
    }
    return (
      <div>
        <FormattedMessage
          id="Historikk.Template.5.FieldSetTo"
          values={{
            fieldName,
            value: toValue,
            b: (...chunks) => <b>{chunks}</b>,
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
        return <FormattedMessage id={heading.feltId} values={{ value: tema.navnVerdi, b: (...chunks) => <b>{chunks}</b>, br: <br /> }} />;
      }
    }
    return undefined;
  };

  const lagSoeknadsperiode = (soeknadsperiode) => (soeknadsperiode.navnVerdi
    ? (
      <FormattedMessage
        id={findIdForSoeknadsperiodeCode(soeknadsperiode)}
        values={{
          navnVerdi: soeknadsperiode.navnVerdi,
          value: soeknadsperiode.tilVerdi,
          b: (...chunks) => <b>{chunks}</b>,
          br: <br />,
        }}
      />
    )
    : (
      <FormattedMessage
        id={findIdForSoeknadsperiodeCode(soeknadsperiode)}
        values={{ value: soeknadsperiode.tilVerdi, b: (...chunks) => <b>{chunks}</b>, br: <br /> }}
      />
    ));

  return (
    historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
      <div key={
        `historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
      }
      >
        {historikkinnslagDel.skjermlenke
        && (
          <Element>
            <NavLink
              to={createLocationForSkjermlenke(behandlingLocation, historikkinnslagDel.skjermlenke.kode)}
              onClick={scrollUp}
            >
              {getKodeverknavn(historikkinnslagDel.skjermlenke)}
            </NavLink>
          </Element>
        )}

        {lageElementInnhold(historikkinnslagDel)
          .map((tekst) => (
            <div key={tekst}><Element>{tekst}</Element></div>
          ))}


        {lagGjeldendeFraInnslag(historikkinnslagDel)}


        {historikkinnslagDel.soeknadsperiode && lagSoeknadsperiode(historikkinnslagDel.soeknadsperiode, getKodeverknavn)}

        {lagTemaHeadingId(historikkinnslagDel)}


        {historikkinnslagDel.endredeFelter && historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
          <div key={`endredeFelter${i + 1}`}>
            {formatChangedField(endretFelt)}
          </div>
        ))}

        {historikkinnslagDel.opplysninger && historikkinnslagDel.opplysninger.map((opplysning) => (
          <FormattedMessage
            id={findIdForOpplysningCode(opplysning)}
            values={{ antallBarn: opplysning.tilVerdi, b: (...chunks) => <b>{chunks}</b>, br: <br /> }}
            key={`${getKodeverknavn(opplysning)}@${opplysning.tilVerdi}`}
          />
        ))}

        {historikkinnslagDel.aarsak && <Normaltekst>{getKodeverknavn(historikkinnslagDel.aarsak)}</Normaltekst>}
        {historikkinnslagDel.begrunnelse && <BubbleText bodyText={getKodeverknavn(historikkinnslagDel.begrunnelse)} className="snakkeboble-panel__tekst" />}
        {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
        <div>
          {dokumentLinks && dokumentLinks.map((dokumentLenke) => (
            <HistorikkDokumentLenke
              key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
              dokumentLenke={dokumentLenke}
              saksNr={saksNr}
            />
          ))}
        </div>

        {historikkinnslagDelIndex < historikkinnslagDeler.length - 1
        && <VerticalSpacer sixteenPx />}
      </div>
    )));
};

HistorikkMalType5.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  intl: PropTypes.shape().isRequired,
  saksNr: PropTypes.number.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectIntl(HistorikkMalType5);
