import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import fodselSammenligningSoknadPropType from './propTypes/fodselSammenligningSoknadPropType';
import fodselSammenligningOriginalBehandlingPropType from './propTypes/fodselSammenligningOriginalBehandlingPropType';
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
  originalBehandling,
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
        originalBehandling={originalBehandling}
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
  originalBehandling: fodselSammenligningOriginalBehandlingPropType,
};

FodselSammenligningIndex.defaultProps = {
  termindato: undefined,
  vedtaksDatoSomSvangerskapsuke: undefined,
  originalBehandling: undefined,
  avklartBarn: [],
};

export default FodselSammenligningIndex;
