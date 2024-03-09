export const ensureTwoDigits = (num: number): number | string => {
  return num < 10 ? `0${num}` : num;
};

export const updateDate = (date: Date, dayPlaceholder: number, monthOffset: number): string => {

  let year = date.getFullYear();
  let month = date.getMonth() + 1 + monthOffset;

  if(month > 12) {
    year += Math.floor(month / 12);
    month = month % 12;
    if (month === 0) {
      month = 12;
      year--;
    }
  }
  else if(month < 1) {
    // year += Math.floor(month / 12) - 1;
    // month = 12 + (month % 12);
    const expression = Math.ceil(month / 12) == 0 ? -1 : Math.ceil(month / 12) - 1;
    year += expression;
    month = 12 - Math.abs(month) % 12;
  }

  const dateString = `${year}-${ensureTwoDigits(month)}-${ensureTwoDigits(dayPlaceholder)}`;
  return dateString;
};