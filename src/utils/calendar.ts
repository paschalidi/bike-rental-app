import { format } from 'date-fns';

export const deriveCalendarBounds = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return [format(date, 'yyyy/MM/dd'), '2050/12/31'];
};
