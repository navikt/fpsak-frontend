import React, { Fragment } from 'react';
import { FormattedHTMLMessage } from 'react-intl';

import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';

import { VerticalSpacer, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';

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
    <Fragment>
      <VerticalSpacer eightPx />
      <AksjonspunktHelpText isAksjonspunktOpen={arbeidsforhold.tilVurdering}>
        {[<FormattedHTMLMessage id={textCode} key={textCode} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
    </Fragment>
  );
};

PersonAksjonspunktText.propTypes = {
  arbeidsforhold: arbeidsforholdPropType,
};

PersonAksjonspunktText.defaultProps = {
  arbeidsforhold: undefined,
};

export default PersonAksjonspunktText;
