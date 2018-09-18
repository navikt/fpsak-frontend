export const replaceNorwegianCharacters = (str) => {
  let result = str.split('æ').join('ae');
  result = result.split('ø').join('oe');
  return result.split('å').join('aa');
};

export const getLanguageCodeFromSprakkode = (sprakkode) => {
  if (!sprakkode) {
    return 'Malform.Bokmal';
  }

  switch (sprakkode.kode) {
    case 'NN':
      return 'Malform.Nynorsk';
    case 'EN':
      return 'Malform.Engelsk';
    default:
      return 'Malform.Bokmal';
  }
};
