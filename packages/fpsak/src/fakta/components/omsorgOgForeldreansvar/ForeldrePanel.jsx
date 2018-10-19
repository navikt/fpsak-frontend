import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';

import getAddresses from 'utils/personUtils';
import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import opplysningAdresseType from 'kodeverk/opplysningAdresseType';
import opplysningsKilde from 'kodeverk/opplysningsKilde';
import { DatepickerField } from 'form/Fields';
import { hasValidDate, dateBeforeOrEqualToToday } from 'utils/validation/validators';
import DateLabel from 'sharedComponents/DateLabel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import personstatusType from 'kodeverk/personstatusType';
import FaktaGruppe from 'fakta/components/FaktaGruppe';

const getParentHeader = erMor => (erMor ? 'ForeldrePanel.MotherDeathDate' : 'ForeldrePanel.FatherDeathDate');

/**
 * ForeldrePanel
 *
 * Presentasjonskomponent. Brukes i tilknytning til faktapanel for omsorg.
 */
export const ForeldrePanel = ({
  fields,
}) => (
  <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.OMSORGSOVERTAKELSE} titleCode="ForeldrePanel.Foreldre">
    {fields.map((foreldre, index, field) => {
      const f = field.get(index);
      const shouldShowAdress = f.adresse && !f.erDod;

      const parentHeader = getParentHeader(f.erMor);
      if (f.opplysningsKilde === opplysningsKilde.TPS && f.originalDodsdato) {
        return (
          <div key={`${f.aktorId}`}>
            <Undertittel>{f.navn}</Undertittel>
            {shouldShowAdress
              && <Element>{f.adresse}</Element>
            }
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id={parentHeader} /></Normaltekst>
            {f.dodsdato
              && <Element><DateLabel dateString={f.dodsdato} /></Element>
            }
            {!f.dodsdato
              && <Normaltekst> - </Normaltekst>
            }
            <VerticalSpacer sixteenPx />
          </div>);
      }
      return (
        <div key={`${f.aktorId}`}>
          <DatepickerField
            name={`${foreldre}.dodsdato`}
            label={f.navn ? { id: 'ForeldrePanel.DeathDate', args: { name: f.navn } } : { id: parentHeader }}
            validate={[hasValidDate, dateBeforeOrEqualToToday]}
            readOnly
          />
          <VerticalSpacer eightPx />
          <Normaltekst><FormattedMessage id="ForeldrePanel.Address" /></Normaltekst>
          {shouldShowAdress
            && <Normaltekst>{f.adresse}</Normaltekst>
          }
          {!shouldShowAdress
            && <Normaltekst> - </Normaltekst>
          }
          <VerticalSpacer sixteenPx />
        </div>);
    })}
  </FaktaGruppe>
);

ForeldrePanel.propTypes = {
  fields: PropTypes.shape().isRequired,
};

const buildSokerPersonopplysning = (sokerPersonopplysninger) => {
  const addresses = getAddresses(sokerPersonopplysninger.adresser);
  const { avklartPersonstatus } = sokerPersonopplysninger;
  const isAvklartPersonstatusDod = avklartPersonstatus
      && avklartPersonstatus.overstyrtPersonstatus && avklartPersonstatus.overstyrtPersonstatus.kode === personstatusType.DOD;

  return {
    aktorId: sokerPersonopplysninger.aktoerId,
    navn: sokerPersonopplysninger.navn,
    dodsdato: sokerPersonopplysninger.dodsdato,
    originalDodsdato: sokerPersonopplysninger.dodsdato,
    adresse: addresses[opplysningAdresseType.POSTADRESSE] || addresses[opplysningAdresseType.BOSTEDSADRESSE],
    opplysningsKilde: sokerPersonopplysninger.opplysningsKilde.kode,
    erMor: sokerPersonopplysninger.navBrukerKjonn.kode === navBrukerKjonn.KVINNE,
    erDod: sokerPersonopplysninger.personstatus.kode === personstatusType.DOD || isAvklartPersonstatusDod,
  };
};

const buildAnnenPartPersonopplysning = (annenPartPersonopplysninger) => {
  const secondaryParentAddresses = getAddresses(annenPartPersonopplysninger.adresser);
  const { avklartPersonstatus } = annenPartPersonopplysninger;
  const isAvklartPersonstatusDod = avklartPersonstatus
    && avklartPersonstatus.overstyrtPersonstatus && avklartPersonstatus.overstyrtPersonstatus.kode === personstatusType.DOD;

  return {
    aktorId: annenPartPersonopplysninger.aktoerId,
    navn: annenPartPersonopplysninger.navn,
    dodsdato: annenPartPersonopplysninger.dodsdato,
    originalDodsdato: annenPartPersonopplysninger.dodsdato,
    adresse: secondaryParentAddresses[opplysningAdresseType.POSTADRESSE] || secondaryParentAddresses[opplysningAdresseType.BOSTEDSADRESSE],
    opplysningsKilde: annenPartPersonopplysninger.opplysningsKilde.kode,
    erMor: annenPartPersonopplysninger.navBrukerKjonn.kode === navBrukerKjonn.KVINNE,
    erDod: annenPartPersonopplysninger.personstatus.kode === personstatusType.DOD || isAvklartPersonstatusDod,
  };
};

ForeldrePanel.buildInitialValues = (sokerPersonopplysninger) => {
  const parents = [];

  const sokerOppl = buildSokerPersonopplysning(sokerPersonopplysninger);
  parents.push(sokerOppl);

  const annenPartPersonopplysninger = sokerPersonopplysninger.annenPart;

  if (annenPartPersonopplysninger) {
    const annenPartOppl = buildAnnenPartPersonopplysning(annenPartPersonopplysninger);
    parents.push(annenPartOppl);
  }
  return { foreldre: parents };
};

export default ForeldrePanel;
