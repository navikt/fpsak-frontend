function getRelativeDate(diff) {
  const d = new Date();
  d.setDate(d.getDate() + diff);
  return d;
}

module.exports = {
  '30_DAGER_FREM_I_TID': getRelativeDate(30),
  '180_DAGER_FREM_I_TID': getRelativeDate(180),
  '14_DAGER_FREM_I_TID': getRelativeDate(14),
};
