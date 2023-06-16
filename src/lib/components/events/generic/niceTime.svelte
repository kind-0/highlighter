<script lang='ts'>

export let timestamp
export let maxDaysToDisplayNice = 5

let displayDateString 

let nowTime = (new Date()).getTime()

let timePassed = (nowTime - timestamp*1000)
let oneDay = 86400000
let oneHour = 3600000
let oneMinute = 60000

let displayString: string


if (timePassed > oneDay * maxDaysToDisplayNice) {
    displayString = new Date(timestamp * 1000).toLocaleString()
} else if ( timePassed > oneDay ) {
    const daysPassed = Math.floor(timePassed/oneDay)
    displayString = daysPassed.toString() + ' day' 
    daysPassed > 1 ? displayString = displayString.concat('s') : null
} else if ( timePassed > oneHour ) {
    const hoursPassed = Math.floor(timePassed/oneHour)
    displayString = hoursPassed.toString() + ' hour'
    hoursPassed > 1 ? displayString = displayString.concat('s') : null
} else if ( timePassed > oneMinute ) {
const minutesPassed = Math.floor(timePassed/oneMinute)
    displayString = minutesPassed.toString() + ' minute'
    minutesPassed > 1 ? displayString = displayString.concat('s') : null
} else {
    displayString = "now"
}

</script>

<div>{displayString}</div>