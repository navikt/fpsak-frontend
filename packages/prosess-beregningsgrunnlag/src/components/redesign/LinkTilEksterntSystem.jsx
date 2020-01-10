import React from 'react';
import linkArrow from '@fpsak-frontend/assets/images/ekstern_link_pil.svg';
import PropTypes from 'prop-types';
import styles from './linkTilEksternSystem.less';


const LinkTilEksterntSystem = ({
  type, linkText, userIdent, uniqeReactId,
}) => {
  let link = 'http://alink';

  switch (type) {
    case 'AI': {
      link = `https://modapp.adeo.no/a-inntekt/person/${userIdent}?1&soekekontekst=PERSON&modia.global.hent.person.begrunnet=false#!PersonInntektLamell`;
      break;
    }
    case 'SØ': {
      link = `https://modapp.adeo.no/a-inntekt/person/${userIdent}?1&soekekontekst=PERSON&modia.global.hent.person.begrunnet=false#!PersonInntektLamell`;
      break;
    }
    default: {
      link = null;
    }
  }

  if (!linkText || !link) {
    return null;
  }
  return (
    <span className={styles.linkContainer} key={`ExtLink${uniqeReactId}`} id={`ExtLink${uniqeReactId}`}>
      <a
        href={link}
        className={styles.linkText}
        key={`a${uniqeReactId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {`${linkText}`}
        <img
          className={styles.linkArrow}
          src={linkArrow}
          alt={`Ekster link til ${linkText}`}
          key={`img${uniqeReactId}`}
        />
      </a>
    </span>
  );
};
LinkTilEksterntSystem.propTypes = {
  linkText: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  userIdent: PropTypes.string.isRequired,
  uniqeReactId: PropTypes.string.isRequired,
};

export default LinkTilEksterntSystem;
