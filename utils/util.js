const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


 // 时间格式化输出，如3:25:19 86。每10ms都会调用一次
 function dateformat(that, micro_second) {
    // 秒数
    const second = Math.floor(micro_second / 1000);
    // 小时位
    const hr = Math.floor(second / 3600);
    // 分钟位
    const min = Math.floor((second - hr * 3600) / 60);
    // 秒位
    const sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;
    // 毫秒位，保留2位
    const micro_sec = Math.floor((micro_second % 1000) / 10);
    console.log('time', min + ":" + sec, that.data);
    that.setData({
        timer: min + ":" + sec,
    });
    // return min + ":" + sec
 }


/* 毫秒级倒计时 */
function countdown(that, time) {
    // 渲染倒计时时钟
    that.setData({
      clock: dateformat(that, time)
    });
  
    if (time <= 0) {
      that.setData({
         clock:"已经截止"
      });
      // timeout则跳出递归
      return ;
    }  
    setTimeout(function(){
        // 放在最后--
        time -= 1000;
        countdown(that, time);
    }
    ,1000)
 }
  


module.exports = {
  formatTime,
  countdown
}
