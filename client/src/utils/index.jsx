export const getCurrentDate = () => {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate;
  if (`${day}`.length === 1) {
    currentDate = `${year}-${month}-0${day}`;
  } else if (`${month}`.length === 1) {
    currentDate = `${year}-0${month}-${day}`;
  } else {
    currentDate = `${year}-${month}-${day}`;
  }

  return currentDate;
};

export const addDays = (dateString, numberOfDays) => {
  const date = new Date(dateString);

  date.setDate(date.getDate() + numberOfDays + 1);
  return date.toISOString().split("T")[0];
};

export const extractPricesAndDate = (history) => {
  return history?.map((item) => {
    return {
      ticker: item.meta.symbol,
      history: item.quotes?.map((item) => {
        return {
          date: item.date.slice(0, 10),
          close: item.close,
        };
      }),
    };
  });
};
