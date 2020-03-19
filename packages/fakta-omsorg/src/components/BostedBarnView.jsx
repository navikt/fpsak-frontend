import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { DateLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, getAddresses, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { MerkePanel } from '@fpsak-frontend/fakta-felles';

import omsorgPersonopplysningerPropType from '../propTypes/omsorgPersonopplysningerPropType';

import styles from './bostedBarnView.less';

const formatDate = (date) => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');
const getAgeFromDate = (birthDate) => moment().diff(moment(birthDate), 'years');

const getAdresse = (adresser) => {
  const adresseListe = getAddresses(adresser);
  const adresse = adresseListe[opplysningAdresseType.POSTADRESSE] || adresseListe[opplysningAdresseType.BOSTEDSADRESSE];
  return adresse || '-';
};

const BostedBarnView = ({
  barn,
  barnNr,
  className,
}) => (
  <div className={className}>
    <Undertekst>
      <FormattedMessage id="BostedBarnView.Barn" values={{ barnNr }} />
      {barn.dodsdato
              && <div className={styles.inline}><MerkePanel erDod /></div>}
    </Undertekst>

    <Element>
      {barn.navn ? barn.navn : '-' }
    </Element>
    <Normaltekst className={styles.paddingBottom}>
      <FormattedMessage
        id="BostedBarnView.Age"
        values={{
          fodselsdato: formatDate(barn.fodselsdato) ? formatDate(barn.fodselsdato) : '-',
          age: getAgeFromDate(barn.fodselsdato),
        }}
      />
    </Normaltekst>
    {barn.dodsdato
    && (
    <div>
      <FormattedMessage id="BostedBarnView.DodsDato" />
      <Element><DateLabel dateString={barn.dodsdato} /></Element>
      <VerticalSpacer eightPx />
    </div>
    )}
    <Undertekst>
      <FormattedMessage id="BostedBarnView.Adresse" />
    </Undertekst>
    <Normaltekst>
      {getAdresse(barn.adresser)}
    </Normaltekst>
  </div>
);

BostedBarnView.propTypes = {
  barn: omsorgPersonopplysningerPropType.isRequired,
  barnNr: PropTypes.number.isRequired,
  className: PropTypes.string,
};

BostedBarnView.defaultProps = {
  className: styles.defaultBostedBarn,
};

export default BostedBarnView;
