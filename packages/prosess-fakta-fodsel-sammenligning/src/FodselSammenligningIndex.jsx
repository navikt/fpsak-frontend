import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import fodselSammenligningSoknadPropType from './propTypes/fodselSammenligningSoknadPropType';
import fodselSammenligningFamiliehendelsePropType from './propTypes/fodselSammenligningFamiliehendelsePropType';
import FodselSammenligningPanel from './components/FodselSammenligningPanel';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const FNR_DODFODT_PART = '00001';

const FodselSammenligningIndex = ({
  behandlingsTypeKode,
  avklartBarn,
  termindato,
  vedtaksDatoSomSvangerskapsuke,
  soknad,
  soknadOriginalBehandling,
  familiehendelseOriginalBehandling,
}) => {
  const nrOfDodfodteBarn = avklartBarn.reduce((ab, barn) => ab + (barn.fnr && barn.fnr.endsWith(FNR_DODFODT_PART) ? 1 : 0), 0);
  return (
    <RawIntlProvider value={intl}>
      <FodselSammenligningPanel
        avklartBarn={avklartBarn}
        termindato={termindato}
        vedtaksDatoSomSvangerskapsuke={vedtaksDatoSomSvangerskapsuke}
        nrOfDodfodteBarn={nrOfDodfodteBarn}
        behandlingsTypeKode={behandlingsTypeKode}
        soknad={soknad}
        soknadOriginalBehandling={soknadOriginalBehandling}
        familiehendelseOriginalBehandling={familiehendelseOriginalBehandling}
      />
    </RawIntlProvider>
  );
};

FodselSammenligningIndex.propTypes = {
  behandlingsTypeKode: PropTypes.string.isRequired,
  avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  termindato: PropTypes.string,
  vedtaksDatoSomSvangerskapsuke: PropTypes.string,
  soknad: fodselSammenligningSoknadPropType.isRequired,
  soknadOriginalBehandling: fodselSammenligningSoknadPropType,
  familiehendelseOriginalBehandling: fodselSammenligningFamiliehendelsePropType,
};

FodselSammenligningIndex.defaultProps = {
  termindato: undefined,
  vedtaksDatoSomSvangerskapsuke: undefined,
  soknadOriginalBehandling: undefined,
  familiehendelseOriginalBehandling: undefined,
  avklartBarn: [],
};

export default FodselSammenligningIndex;
