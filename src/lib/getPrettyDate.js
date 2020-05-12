const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getPrettyDate = (date) => {
  date = date.split(' ')[0];
	const newDate = date.split('-');
	const month = months[parseInt(newDate[1])-1];
	return `${month} ${newDate[2]}, ${newDate[0]}`;
}
export default getPrettyDate;
