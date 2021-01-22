import moment from 'moment';

export function getFormattedDate(date) {
  const formatedDate = moment(date).format('dddd, MMMM Do yyyy, hh:mm:ss a');
  return formatedDate;
}
