import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer, PeriodLabel } from '@fpsak-frontend/shared-components';

import { arbeidsforholdPropType } from '../../propTypes/arbeidsforholdPropType';

const utledPermisjonLabelID = (arbeidsforhold) => {
  if (arbeidsforhold.permisjoner.length > 1) {
    return 'PersonArbeidsforholdDetailForm.Permisjoner';
  }
  return 'PersonArbeidsforholdDetailForm.Permisjon';
};

const utledPeriodeLabelKey = (id, index) => id + index;

const PermisjonPeriode = ({
  arbeidsforhold,
}) => (
  <>
    { arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 0 && (
      <div>
        <VerticalSpacer sixteenPx />
        <Normaltekst>
          <FormattedMessage id={utledPermisjonLabelID(arbeidsforhold)} />
        </Normaltekst>
        { arbeidsforhold.permisjoner.map((permisjon, index) => (
          <div key={utledPeriodeLabelKey(arbeidsforhold.id, index)}>
            <PeriodLabel
              dateStringFom={permisjon.permisjonFom}
              dateStringTom={permisjon.permisjonTom ? permisjon.permisjonTom : ''}
            />
          </div>
        ))}
        <VerticalSpacer sixteenPx />
      </div>
    )}
  </>
);

PermisjonPeriode.propTypes = {
  arbeidsforhold: arbeidsforholdPropType.isRequired,
};

export default PermisjonPeriode;
