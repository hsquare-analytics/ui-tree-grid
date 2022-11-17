/**
 * 표시단위 변경
 * @param val
 * @param unit 표시할 단위(예: 1000, 1000000)
 * @returns
 */
export const ConvertToMillion = (val: string | number | Date | undefined, unit: 1000 | 1000000): string => {
  if (typeof val !== 'number') {
    return '0';
  }

  if (val < 0 && val > -0.1) {
    return '0';
  }

  const num = Math.round(parseFloat((val / unit).toString()));

  return num.toLocaleString('en') === '-0' ? '0' : num.toLocaleString('en');
};

/**
 * 백분율 계산
 * @param arg1
 * @param arg2
 * @returns
 */
export const CalcuateRate = (arg1: number | undefined | null, arg2: number | undefined | null): number => {
  if (typeof arg1 === 'number' && typeof arg2 === 'number' && arg2 !== 0) {
    return arg1 / arg2;
  }

  if (arg1 === null || arg2 === null || typeof arg1 === 'undefined' || typeof arg2 === 'undefined') {
    return 0;
  }

  if (arg2 === 0) {
    return 0;
  }

  if (arg1 / arg2 < 0 || arg1 === 0) {
    return 0;
  }

  return 0;
};

export const convertToNumber = (arg: unknown) => {
  switch (typeof arg) {
    case 'number':
      return arg;
    case 'string':
      return parseFloat(arg);
    case 'undefined':
      return 0;
  }
  return 0;
};
