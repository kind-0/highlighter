function tsToNicePassedTimeString(timestamp: number | undefined, maxDaysToDisplayNice: number = 5) {
    if (timestamp === undefined) {
        return '';
    }

    const nowTime = new Date().getTime();
    const timePassed = nowTime - timestamp * 1000;
    const oneDay = 86400000;
    const oneHour = 3600000;
    const oneMinute = 60000;

    let displayString: string;

    if (timePassed > oneDay * maxDaysToDisplayNice) {
        displayString = new Date(timestamp * 1000).toLocaleString();
    } else if (timePassed > oneDay) {
        const daysPassed = Math.floor(timePassed / oneDay);
        displayString = daysPassed.toString() + ' day';
        daysPassed > 1 ? (displayString = displayString.concat('s')) : null;
    } else if (timePassed > oneHour) {
        const hoursPassed = Math.floor(timePassed / oneHour);
        displayString = hoursPassed.toString() + ' hour';
        hoursPassed > 1 ? (displayString = displayString.concat('s')) : null;
    } else if (timePassed > oneMinute) {
        const minutesPassed = Math.floor(timePassed / oneMinute);
        displayString = minutesPassed.toString() + ' minute';
        minutesPassed > 1 ? (displayString = displayString.concat('s')) : null;
    } else {
        displayString = 'now';
    }

    return displayString;
}

export default tsToNicePassedTimeString;
