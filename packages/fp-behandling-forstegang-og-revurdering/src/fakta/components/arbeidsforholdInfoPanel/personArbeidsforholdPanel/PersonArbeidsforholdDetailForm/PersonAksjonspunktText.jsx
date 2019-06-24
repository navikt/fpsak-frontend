import React, { Fragment } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import { VerticalSpacer, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';

const utledPermisjonValues = (permisjon, getKodeverknavn) => {
  const kodeverknavn = getKodeverknavn(permisjon.type);
  const permisjonType = kodeverknavn !== undefined && kodeverknavn !== null ? kodeverknavn.toLowerCase() : '';
  return {
    permisjonFom: moment(permisjon.permisjonFom).format(DDMMYYYY_DATE_FORMAT),
    permisjonTom: permisjon.permisjonTom ? moment(permisjon.permisjonTom).format(DDMMYYYY_DATE_FORMAT) : '',
    permisjonsprosent: permisjon.permisjonsprosent,
    permisjonType,
  };
};

const harPermisjonOgIkkeMottattIM = arbeidsforhold => arbeidsforhold.permisjoner
    && arbeidsforhold.permisjoner.length === 1
    && (arbeidsforhold.mottattDatoInntektsmelding === undefined || arbeidsforhold.mottattDatoInntektsmelding === null);

const harPermisjonOgMottattIM = arbeidsforhold => arbeidsforhold.permisjoner
  && arbeidsforhold.permisjoner.length === 1
  && (arbeidsforhold.mottattDatoInntektsmelding !== undefined && arbeidsforhold.mottattDatoInntektsmelding !== null);


const lagAksjonspunktMessage = (arbeidsforhold, getKodeverknavn) => {
  if (!arbeidsforhold || (!arbeidsforhold.tilVurdering && !arbeidsforhold.erEndret)) {
    return undefined;
  }
  if (harPermisjonOgIkkeMottattIM(arbeidsforhold)) {
    return (
      <FormattedHTMLMessage
        key="permisjonUtenMottattIM"
        id="PersonAksjonspunktText.SokerHarPermisjonOgIkkeMottattIM"
        values={utledPermisjonValues(arbeidsforhold.permisjoner[0], getKodeverknavn)}
      />
    );
  }
  if (harPermisjonOgMottattIM(arbeidsforhold)) {
    return (
      <FormattedHTMLMessage
        key="permisjonMedMottattIM"
        id="PersonAksjonspunktText.SokerHarPermisjonOgMottattIM"
        values={utledPermisjonValues(arbeidsforhold.permisjoner[0], getKodeverknavn)}
      />
    );
  }
  if (arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 1) {
    return <FormattedHTMLMessage key="permisjoner" id="PersonAksjonspunktText.SokerHarFlerePermisjoner" />;
  }
  if (arbeidsforhold.lagtTilAvSaksbehandler) {
    return <FormattedHTMLMessage key="lagtTilAvSaksbehandler" id="PersonAksjonspunktText.LeggTilArbeidsforhold" />;
  }
  if (!arbeidsforhold.mottattDatoInntektsmelding) {
    return <FormattedHTMLMessage key="mottattDatoInntektsmelding" id="PersonAksjonspunktText.AvklarManglendeInntektsmelding" />;
  }
  if (arbeidsforhold.replaceOptions.length > 0) {
    return <FormattedHTMLMessage key="replaceOptions" id="PersonAksjonspunktText.AvklarErstatteTidligere" />;
  }
  if (arbeidsforhold.harErstattetEttEllerFlere) {
    return <FormattedHTMLMessage key="harErstattetEttEllerFlere" id="PersonAksjonspunktText.AvklarErstatteAlle" />;
  }
  if (arbeidsforhold.ikkeRegistrertIAaRegister) {
    return <FormattedHTMLMessage key="ikkeRegistrertIAaRegister" id="PersonAksjonspunktText.AvklarIkkeRegistrertIAa" />;
  }
  return undefined;
};

export const PersonAksjonspunktTextImpl = ({
  arbeidsforhold,
  getKodeverknavn,
}) => {
  const msg = lagAksjonspunktMessage(arbeidsforhold, getKodeverknavn);
  if (msg === undefined) {
    return null;
  }
  return (
    <Fragment>
      <VerticalSpacer eightPx />
      <AksjonspunktHelpText isAksjonspunktOpen={arbeidsforhold.tilVurdering}>
        {[msg]}
      </AksjonspunktHelpText>
    </Fragment>
  );
};

PersonAksjonspunktTextImpl.propTypes = {
  arbeidsforhold: arbeidsforholdPropType,
  getKodeverknavn: PropTypes.func.isRequired,
};

PersonAksjonspunktTextImpl.defaultProps = {
  arbeidsforhold: undefined,
};

export default injectKodeverk(getAlleKodeverk)(PersonAksjonspunktTextImpl);
