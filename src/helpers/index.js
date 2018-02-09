export const monthName = (num)=> {
    const months = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August",
        "September", 
        "October", 
        "November",
        "December"
    ]
    return months[num];
}

export const dayname = (num)=> {
    const days = [
        "Sunday", 
        "Monday", 
        "Tuesday", 
        "Wednesday", 
        "Thursday", 
        "Friday", 
        "Saturday"
    ]
    return days[num];
}

export const getAddress = (name, street, city) => {

    let theName = name ? name+', ' : '';
    let theStreet = street ? street+', ' : '';
    let theCity = city ? city : '';
    return theName === '' && theStreet === '' && theCity === '' ? 'Location Not Provided' : theName + theStreet + theCity;
}

export const convertDate =(date) => {
    var arr = date.split(/[- :]/);
    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
    return date;
}

export const capitalize = (string) =>{
    if(string.includes('_')){
        var string = string.split('_');
        var newString = '';
        string.map( (str, index)=> {
            newString += string[index].charAt(0).toUpperCase() + string[index].slice(1)+' ';
        })
        return newString;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getWeek = (date, weekend=false) =>{
    var currentDate = new Date(date);
    var currentDay = currentDate.getDay();
    var edayDiff = 0;
    var sdayDiff = (weekend? 5:0) - currentDay;
    var edayDiff = 6 - currentDay;
    var sweekDate = new Date(date);
    var eweekDate = new Date(date);

    sweekDate.setDate(sweekDate.getDate()+sdayDiff);
    eweekDate.setDate(eweekDate.getDate()+edayDiff);
    //console.log(sweekDate, eweekDate);
    return [sweekDate.toISOString(), eweekDate.toISOString()];

}

export const getLastDayOfMonth = (d) => {
    var date = new Date(d), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 1);
    return lastDay.toISOString();
}

export const getNextMonth = (d) => {
    var date = new Date(d), y = date.getFullYear(), m = date.getMonth() + 1;
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 1);
    return [firstDay.toISOString(), lastDay.toISOString()];
}

export const getHours = (date) => {
    var ampm = 'am';
    var hour = date.getUTCHours();
    var hourtwelve = hour > 12 ? hour - 12  : hour;
    ampm = hour >= 12 ? 'pm': 'am';

    return hourtwelve.toString()+ampm;
}

export const dateDifference = (a, b) => {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24 ;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    var hrs = b.getUTCHours() - a.getUTCHours();
    var diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    var In = 'In: ';
    var day = diff > 1 ? 'Days' : 'Day';
    if(diff === 1){
        diff = 'Tomorrow'; day = ''; In = '';
    }
    if( hrs < 0){ hrs = 0}
    if(diff === 0){
        return (In + hrs+' hrs').toString();
    }
    return (In + diff + ' '+ day).toString();
    //console.log('Event Ends In: ', Math.floor((utc2 - utc1) / _MS_PER_DAY) , b.getUTCHours() - a.getUTCHours(), 'hrs');
}

export const getDateVerb = (date) => {
    var verb = 'th'; 
    var d = new Date(date);
    var theDate = d.getDate();

    if(theDate === 1 || theDate === 21 || theDate === 31) { verb = 'st' }
    if(theDate === 2 || theDate === 22 ) { verb = 'nd' }
    if(theDate === 3 || theDate === 23 ) { verb = 'rd' }
    
    return verb;
}

