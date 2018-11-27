import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import arbeidsforholdPropType from 'behandling/proptypes/arbeidsforholdPropType';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

const getTextCode = (arbeidsforhold) => {
  if (!arbeidsforhold || (!arbeidsforhold.tilVurdering && !arbeidsforhold.erEndret)) {
    return undefined;
  }
  if (!arbeidsforhold.mottattDatoInntektsmelding) {
    return 'PersonAksjonspunktText.AvklarManglendeInntektsmelding';
  }
  if (arbeidsforhold.replaceOptions.length > 0) {
    return 'PersonAksjonspunktText.AvklarErstatteTidligere';
  }
  if (arbeidsforhold.harErstattetEttEllerFlere) {
    return 'PersonAksjonspunktText.AvklarErstatteAlle';
  }
  return arbeidsforhold.ikkeRegistrertIAaRegister
    ? 'PersonAksjonspunktText.AvklarIkkeRegistrertIAa'
    : undefined;
};

const PersonAksjonspunktText = ({
  arbeidsforhold,
}) => {
  const textCode = getTextCode(arbeidsforhold);
  if (!textCode) {
    return null;
  }
  return (
    <ElementWrapper>
      <VerticalSpacer eightPx />
      <Normaltekst><FormattedMessage id={textCode} /></Normaltekst>
    </ElementWrapper>
  );
};

PersonAksjonspunktText.propTypes = {
  arbeidsforhold: arbeidsforholdPropType,
};

PersonAksjonspunktText.defaultProps = {
  arbeidsforhold: undefined,
};

export default PersonAksjonspunktText;
