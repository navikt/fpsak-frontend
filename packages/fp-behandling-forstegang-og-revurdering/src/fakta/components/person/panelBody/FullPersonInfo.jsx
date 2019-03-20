import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { getAddresses } from '@fpsak-frontend/utils';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import opplysningsKilde from '@fpsak-frontend/kodeverk/src/opplysningsKilde';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import { AdressePanel, BarnePanel, PersonYtelserTable } from '@fpsak-frontend/person-info';
import { getSkalKunneLeggeTilNyeArbeidsforhold } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import PersonArbeidsforholdPanel from './arbeidsforhold/PersonArbeidsforholdPanel';
import { Utland } from './utland/Utland';

const findPersonStatus = (personopplysning) => {
  if (personopplysning.avklartPersonstatus) {
    return personopplysning.avklartPersonstatus.overstyrtPersonstatus;
  }
  return personopplysning.personstatus ? personopplysning.personstatus : undefined;
};

export const getBarnFraTPS = (barneListe = []) => barneListe.filter(barn => barn.opplysningsKilde.kode === opplysningsKilde.TPS);

/**
 *
 * FullPersonInfo
 *
 * Presentasjonskomponent. Tar inn et personopplysningsobjekt som brukes til å populere adressepanelet og barnepanelet med data som blir vist
 * når NAV-ansatt utvider nedtrekksfanen med personopplysninger.
 *
 */
export const FullPersonInfoImpl = ({
  sprakkode,
  personopplysning,
  ytelser,
  relatertYtelseTypes,
  relatertYtelseStatus,
  hasOpenAksjonspunkter,
  hasAksjonspunkter,
  utlandSakstype,
  readOnly,
  submitCallback,
  isPrimaryParent,
  personstatusTypes,
  sivilstandTypes,
  skalKunneLeggeTilNyeArbeidsforhold,
}) => {
  if (!personopplysning) {
    return null;
  }
  const adresseListe = getAddresses(personopplysning.adresser);
  const barnFraTPS = getBarnFraTPS(personopplysning.barn);
  const harBarnITPSSjekk = barnFraTPS.length !== 0;
  const aksjonspunktID = skalKunneLeggeTilNyeArbeidsforhold ? 'FullPersonInfo.IngenArbeidsforholdRegistrert' : 'FullPersonInfo.AvklarArbeidsforhold';

  return (
    <div>
      {isPrimaryParent && hasAksjonspunkter && (
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter && !readOnly}>
          {[<FormattedMessage key="AvklarArbeidsforhold" id={aksjonspunktID} />]}
        </AksjonspunktHelpText>
      )}
      <AdressePanel
        bostedsadresse={adresseListe[opplysningAdresseType.BOSTEDSADRESSE]}
        postAdresseNorge={adresseListe[opplysningAdresseType.POSTADRESSE]}
        postadresseUtland={adresseListe[opplysningAdresseType.UTENLANDSK_POSTADRESSE]}
        midlertidigAdresse={
          adresseListe[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
            ? adresseListe[opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE]
            : adresseListe[opplysningAdresseType.UTENLANDSK_NAV_TILLEGSADRESSE]
        }
        personstatus={findPersonStatus(personopplysning)}
        sivilstandtype={personopplysning.sivilstand}
        region={personopplysning.region ? personopplysning.region.navn : null}
        sprakkode={sprakkode}
        isPrimaryParent={isPrimaryParent}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
      >
        <Utland
          initialValue={utlandSakstype}
          submitCallback={submitCallback}
        />
      </AdressePanel>
      {harBarnITPSSjekk && <BarnePanel barneListe={barnFraTPS} />}
      {isPrimaryParent && (
        <PersonArbeidsforholdPanel
          readOnly={readOnly}
          hasAksjonspunkter={hasAksjonspunkter}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          skalKunneLeggeTilNyeArbeidsforhold={skalKunneLeggeTilNyeArbeidsforhold}
        />
      )}
      {ytelser && ytelser.length > 0 && (
        <FaktaGruppe titleCode="PersonYtelserTable.Ytelser">
          <PersonYtelserTable
            ytelser={ytelser}
            relatertYtelseTypes={relatertYtelseTypes}
            relatertYtelseStatus={relatertYtelseStatus}
          />
        </FaktaGruppe>
      )}
    </div>
  );
};

FullPersonInfoImpl.propTypes = {
  sprakkode: PropTypes.shape().isRequired,
  personopplysning: PropTypes.shape({}).isRequired,
  ytelser: PropTypes.arrayOf(PropTypes.shape({})),
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  relatertYtelseStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func,
  hasAksjonspunkter: PropTypes.bool.isRequired,
  utlandSakstype: PropTypes.string.isRequired,
  isPrimaryParent: PropTypes.bool.isRequired,
  sivilstandTypes: kodeverkPropType.isRequired,
  personstatusTypes: kodeverkPropType.isRequired,
  skalKunneLeggeTilNyeArbeidsforhold: PropTypes.bool.isRequired,
};

FullPersonInfoImpl.defaultProps = {
  ytelser: undefined,
  submitCallback: undefined,
};

const mapStateToProps = state => ({
  skalKunneLeggeTilNyeArbeidsforhold: getSkalKunneLeggeTilNyeArbeidsforhold(state),
});

export default connect(mapStateToProps)(FullPersonInfoImpl);
