import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

<<<<<<< HEAD:packages/fpsak/src/behandlingFpsak/fakta/components/person/panelBody/arbeidsforhold/PersonAksjonspunktText.jsx
import arbeidsforholdPropType from 'behandlingFelles/proptypes/arbeidsforholdPropType';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
=======
import arbeidsforholdPropType from 'behandling/proptypes/arbeidsforholdPropType';
import ElementWrapper from '@fpsak-frontend/shared-components';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
>>>>>>> NOJIRA moduler:packages/fpsak/src/fakta/components/person/panelBody/arbeidsforhold/PersonAksjonspunktText.jsx

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
