import moment from 'moment';

export const isoDateRegex = /(19|20)\d{2}-(0?[1-9]|1[0-2])-(0?[1-9]|1\d|2\d|3[01])$/;
export const numberRegex = /^\d+([,.]\d+)?$/;
export const integerRegex = /^\s*\d+\s*$/;
export const decimalRegex = /^\d+(.\d{1,2})?$/;
export const saksnummerOrFodselsnummerPattern = /^\d{0,18}$/;

export const textRegex = /^[0-9a-zA-ZæøåÆØÅAaÁáBbCcČčDdĐđEeFfGgHhIiJjKkLlMmNnŊŋOoPpRrSsŠšTtŦŧUuVvZzŽžéôèÉöüäÖÜÄ .'\-/%§!?@_()+:;,="&\n]*$/;
export const textGyldigRegex = /[0-9a-zA-ZæøåÆØÅAaÁáBbCcČčDdĐđEeFfGgHhIiJjKkLlMmNnŊŋOoPpRrSsŠšTtŦŧUuVvZzŽžéôèÉöüäÖÜÄ .'\-/%§!?@_()+:;,="&\n]*/g;

export const nameRegex = /^[0-9a-zA-ZæøåÆØÅAaÁáBbCcČčDdĐđEeFfGgHhIiJjKkLlMmNnŊŋOoPpRrSsŠšTtŦŧUuVvZzŽžéôèÉöüäÖÜÄ .'-]*$/;
export const nameGyldigRegex = /[0-9a-zA-ZæøåÆØÅAaÁáBbCcČčDdĐđEeFfGgHhIiJjKkLlMmNnŊŋOoPpRrSsŠšTtŦŧUuVvZzŽžéôèÉöüäÖÜÄ .'-]*/g;

export const isEmpty = (text) => text === null || text === undefined || text.toString().trim().length === 0;

export const yesterday = () => moment().subtract(1, 'days').startOf('day');
export const tomorrow = () => moment().add(1, 'days').startOf('day');

export const dateRangesAreSequential = (ranges) => {
  if (Array.isArray(ranges)) {
    const isBeforeTheNextDate = (element, index, array) => {
      const current = moment(element).startOf('day');
      const next = index + 1 < array.length ? moment(array[index + 1]).startOf('day') : null;
      return next !== null ? current.isBefore(next) : true;
    };

    return [...ranges]
      .sort((range1, range2) => (moment(range1[0]).startOf('day').isAfter(moment(range2[0]).startOf('day')) ? 1 : -1))
      .map((range) => (range[0] === range[1] ? [range[0]] : range))
      .reduce((range1, range2) => range1.concat(range2))
      .every(isBeforeTheNextDate);
  }

  return true;
};
