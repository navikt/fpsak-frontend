import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment/moment';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Undertittel } from 'nav-frontend-typografi';
import FadingPanel from 'sharedComponents/FadingPanel';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import beregningresultatMedUttaksplanPropType from 'behandling/proptypes/beregningresultatMedUttaksplanPropType';
import {
  getPersonopplysning,
  getBehandlingResultatstruktur,
  getSoknad,
  getFamiliehendelse,
} from 'behandling/behandlingSelectors';
import soknadType from 'kodeverk/soknadType';
import { ISO_DATE_FORMAT } from 'utils/formats';
import TilkjentYtelse from './TilkjentYtelse';

const perioderMedClassName = [];

const formatPerioder = (perioder) => {
  perioderMedClassName.length = 0;
  perioder.forEach((item, index) => {
    if (item.andeler[0] && item.dagsats) {
      perioderMedClassName.push(item);
      perioderMedClassName[perioderMedClassName.length - 1].id = index;
    }
  });
  return perioderMedClassName;
};

const groups = [{ id: 1, content: '' }, { id: 2, content: '' }];

export const TilkjentYtelsePanelImpl = ({
  beregningsresultatMedUttaksplan,
  hovedsokerKjonn,
  medsokerKjonn,
  soknadDato,
  familiehendelseDato,
}) => (
  <FadingPanel>
    <Undertittel>
      <FormattedMessage id="TilkjentYtelse.Title" />
    </Undertittel>
    {beregningsresultatMedUttaksplan
      && (
      <TilkjentYtelse
        items={formatPerioder(beregningsresultatMedUttaksplan.perioder)}
        groups={groups}
        soknadDate={soknadDato}
        familiehendelseDate={familiehendelseDato}
        hovedsokerKjonnKode={hovedsokerKjonn}
        medsokerKjonnKode={medsokerKjonn}
      />
      )
      }
  </FadingPanel>
);


TilkjentYtelsePanelImpl.propTypes = {
  beregningsresultatMedUttaksplan: beregningresultatMedUttaksplanPropType,
  hovedsokerKjonn: PropTypes.string.isRequired,
  medsokerKjonn: PropTypes.string,
  soknadDato: PropTypes.string.isRequired,
  familiehendelseDato: PropTypes.shape().isRequired,
};

TilkjentYtelsePanelImpl.defaultProps = {
  beregningsresultatMedUttaksplan: undefined,
  medsokerKjonn: undefined,
};

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();

const getFamiliehendelsedatoFraSoknad = (soknad) => {
  if (soknad.fodselsdatoer && Object.keys(soknad.fodselsdatoer).length > 0) {
    return Object.values(soknad.fodselsdatoer)[0];
  } if (soknad.termindato) {
    return soknad.termindato;
  } if (soknad.adopsjonFodelsedatoer && Object.keys(soknad.adopsjonFodelsedatoer).length > 0) {
    return Object.values(soknad.adopsjonFodelsedatoer)[0];
  }
  return undefined;
};

const getCurrentFamiliehendelseDato = (
  soknadsType, familiehendelsedatoFraSoknad,
  endredFodselsDato, omsorgsOvertagelseDato, endredomsorgsOvertagelseDato,
) => {
  if (soknadsType === soknadType.FODSEL) {
    return endredFodselsDato ? parseDateString(endredFodselsDato) : parseDateString(familiehendelsedatoFraSoknad);
  }
  return endredomsorgsOvertagelseDato ? parseDateString(endredomsorgsOvertagelseDato) : parseDateString(omsorgsOvertagelseDato);
};

const mapStateToProps = (state) => {
  const person = getPersonopplysning(state);
  const familiehendelse = getFamiliehendelse(state);
  const beregningsresultat = getBehandlingResultatstruktur(state);
  const soknad = getSoknad(state);
  return {
    hovedsokerKjonn: person ? person.navBrukerKjonn.kode : undefined,
    medsokerKjonn: person.annenPart ? person.annenPart.navBrukerKjonn.kode : undefined,
    soknadDato: soknad.mottattDato,
    familiehendelseDato: getCurrentFamiliehendelseDato(
      soknad.soknadType.kode,
      getFamiliehendelsedatoFraSoknad(soknad),
      familiehendelse.fodselsdato,
      soknad.omsorgsovertakelseDato,
      familiehendelse.omsorgsovertakelseDato,
    ),
    beregningsresultatMedUttaksplan: beregningsresultat,
  };
};

const TilkjentYtelsePanel = connect(mapStateToProps)(injectIntl(TilkjentYtelsePanelImpl));

TilkjentYtelsePanel.supports = bp => bp === behandlingspunktCodes.TILKJENT_YTELSE;

export default TilkjentYtelsePanel;
