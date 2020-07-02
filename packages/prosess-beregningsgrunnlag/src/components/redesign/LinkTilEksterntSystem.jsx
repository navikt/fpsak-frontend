import React from 'react';
import PropTypes from 'prop-types';
import styles from './linkTilEksternSystem.less';

const LinkTilEksterntSystem = ({

  type, linkText, userIdent,
}) => {
  let link;
  if (!userIdent) { return null; }
  // TODO: Det mangler linker til Aa, IM og SØ
  switch (type) {
    case 'AI': {
      link = `https://modapp.adeo.no/a-inntekt/person/${userIdent}?1&soekekontekst=PERSON&modia.global.hent.person.begrunnet=false#!PersonInntektLamell`;
      break;
    }
    default: {
      link = 'http://link';
    }
  }

  if (!linkText || !link) {
    return null;
  }
  return (

    <a
      href={link}
      className={styles.linkText}
      target="_blank"
      rel="noopener noreferrer"
    >
      {`${linkText}`}

    </a>

  );
};
LinkTilEksterntSystem.propTypes = {
  linkText: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  userIdent: PropTypes.string,
};
LinkTilEksterntSystem.defaultProps = {
  userIdent: undefined,
};

export default LinkTilEksterntSystem;
