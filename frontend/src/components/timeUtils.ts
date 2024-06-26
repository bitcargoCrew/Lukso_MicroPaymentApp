export const timeSince = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval >= 1) {
    const years = Math.floor(interval);
    return years === 1 ? "1 year ago" : years + " years ago";
  }
  interval = seconds / 2592000;
  if (interval >= 1) {
    const months = Math.floor(interval);
    return months === 1 ? "1 month ago" : months + " months ago";
  }
  interval = seconds / 86400;
  if (interval >= 1) {
    const days = Math.floor(interval);
    return days === 1 ? "1 day ago" : days + " days ago";
  }
  interval = seconds / 3600;
  if (interval >= 1) {
    const hours = Math.floor(interval);
    return hours === 1 ? "1 hour ago" : hours + " hours ago";
  }
  interval = seconds / 60;
  if (interval >= 1) {
    const minutes = Math.floor(interval);
    return minutes === 1 ? "1 minute ago" : minutes + " minutes ago";
  }
  const sec = Math.floor(seconds);
  return sec === 1 ? "1 second ago" : sec + " seconds ago";
};