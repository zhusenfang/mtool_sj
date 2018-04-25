/**
 * Created by fengjiaojiao on 2017/7/14.
 */

//毫秒数 转化为 年-月-日 时:分:秒
export function timestampConversion (ms) {
    if(ms == ''|| ms == null) {
        return
    }
    var newMs = new Date(ms);
    var year = newMs.getFullYear();
    var month = newMs.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = newMs.getDate();
    day = day < 10 ? '0' + day : day;
    var hours = newMs.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    var min = newMs.getMinutes();
    min = min < 10 ? '0' + min : min;
    var sec = newMs.getSeconds();
    sec = sec < 10 ? '0' + sec : sec;
    return year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
}
export function transFromHour(ms) {
    if(ms == ''|| ms == null) {
        return
    }
    let newMs = new Date(ms);
    let hours = newMs.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let min = newMs.getMinutes();
    min = min < 10 ? '0' + min : min;
    return hours + ':' + min
}

//2017年,1月,3日,1时,1分 转化为 年-月-日 时:分
export function timestampConvertMin (date) {
    var dataFormatArr = (JSON.stringify(date)).replace('年','').replace('月','')
        .replace('日','').replace('时','').replace('分','')

    var temArr1 = [],tempArr2 = [],tempStr1='',tempStr2 = '',formatTime = '';

    JSON.parse(dataFormatArr).map((item,index)=>{
        item = item<10?('0'+item) :item
        console.log('index',index)
        if(index < 3){
            temArr1.push(item)
        }else{
            tempArr2.push(item)
        }
    })
    tempStr1 = temArr1.join('-');
    tempStr2 = tempArr2.join(':');

    formatTime = tempStr1 + ' ' +tempStr2;

    return formatTime

}

export function zhu_GetTime (date) {
    var dataFormatArr = (JSON.stringify(date)).replace('时','').replace('分','')

    var  tempArr2 = [],tempStr1='',tempStr2 = '',formatTime = '';

    JSON.parse(dataFormatArr).map((item,index)=>{
        item = item<10?('0'+item) :item
        tempArr2.push(item)
    })
    tempStr2 = tempArr2.join(':');

    formatTime =  tempStr2;

    return formatTime

}