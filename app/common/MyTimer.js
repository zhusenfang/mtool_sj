/**
 * Created by ZHG on 2017/9/5.
 */
//倒计时
function formatSeconds(index,value){
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时

    if(theTime >=60) {

        theTime1 = parseInt(theTime/60);

        theTime = parseInt(theTime%60);

        if(theTime1 >= 60) {

            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);

        }
    }
    if(theTime<10){

        theTime = "0"+theTime;
    }

    if(index==1){
        return theTime1+":"+theTime;
    }
if(index==2){
    return theTime2+"时"+theTime1+"分"+theTime+'秒';
}

}
export default {formatSeconds}
