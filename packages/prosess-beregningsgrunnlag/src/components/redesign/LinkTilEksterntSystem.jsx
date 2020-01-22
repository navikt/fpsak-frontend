import React from 'react';
import linkArrow from '@fpsak-frontend/assets/images/ekstern_link_pil.svg';
import PropTypes from 'prop-types';
import styles from './linkTilEksternSystem.less';


const LinkTilEksterntSystem = ({

  type, linkText, userIdent,
}) => {
  let link;
  if (!userIdent) { return null; }
  // TODO: Det mangler linker til IM og SØ de bruker det samm som AI må endres når vi får data fra backend
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
    <span className={styles.linkContainer}>
      <a
        href={link}
        className={styles.linkText}
        target="_blank"
        rel="noopener noreferrer"
      >
        {`${linkText}`}
        <img
          className={styles.linkArrow}
          src={linkArrow}
          alt={`Ekster link til ${linkText}`}
        />
      </a>
    </span>
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
