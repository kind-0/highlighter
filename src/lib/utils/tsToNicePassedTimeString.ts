function tsToNicePassedTimeString(timestamp: number | undefined, maxDaysToDisplayNice: number = 5) {
    if (timestamp === undefined) {
        return '';
    }

    let nowTime = new Date().getTime();
    let timePassed = nowTime - timestamp * 1000;
    let oneDay = 86400000;
    let oneHour = 3600000;
    let oneMinute = 60000;

    let displayString: string;

    if (timePassed > oneDay * maxDaysToDisplayNice) {
        // displayString date in local format without time
        displayString = new Date(timestamp * 1000).toLocaleDateString();
    } else if (timePassed > oneDay) {
        const daysPassed = Math.floor(timePassed / oneDay);
        displayString = daysPassed.toString() + 'd';
    } else if (timePassed > oneHour) {
        const hoursPassed = Math.floor(timePassed / oneHour);
        displayString = hoursPassed.toString() + 'h';
    } else if (timePassed > oneMinute) {
        const minutesPassed = Math.floor(timePassed / oneMinute);
        displayString = minutesPassed.toString() + 'm';
    } else {
        displayString = 'now';
    }

    return displayString;
}

export default tsToNicePassedTimeString;
