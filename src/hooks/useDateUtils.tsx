export const useDateUtils = () => {
  const getDayOfWeek = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const formatDate = (date: Date) => {
    const dayOfWeek = getDayOfWeek(date);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day} ${month} ${year}`;
  };

  return { getDayOfWeek, formatDate };
};
