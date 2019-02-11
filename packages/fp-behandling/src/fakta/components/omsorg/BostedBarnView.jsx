import React from 'react';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import { personopplysningPropType } from '@fpsak-frontend/fp-behandling-felles';
import PropTypes from 'prop-types';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, getAddresses } from '@fpsak-frontend/utils';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { MerkePanel } from '@fpsak-frontend/person-info';

import styles from './bostedBarnView.less';

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');
const getAgeFromDate = birthDate => moment().diff(moment(birthDate), 'years');

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

    <Undertekst>
      <FormattedMessage id="BostedBarnView.Adresse" />
    </Undertekst>
    <Normaltekst>
      {getAdresse(barn.adresser)}
    </Normaltekst>
  </div>
);

BostedBarnView.propTypes = {
  barn: personopplysningPropType.isRequired,
  barnNr: PropTypes.number.isRequired,
  className: PropTypes.string,
};

BostedBarnView.defaultProps = {
  className: styles.defaultBostedBarn,
};

export default BostedBarnView;
