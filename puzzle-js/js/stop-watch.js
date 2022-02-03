// class StopWatch {
//     constructor() {


//     }

//     static Config(){
//         var h2 = document.getElementById()
//     }

//     static tick(){

//     }
// }

// export {StopWatch}

let stopWatch = (function(){
    let timerId;
    let hour, min, sec;
    let clock = document.querySelector('.time');
    let startBtn = document.querySelector('.start');
    let stopBtn =document.querySelector('.stop');
    let resetBtn = document.querySelector('.reset');

    function init(){
        addEvent();
        sec = 0;
        min = 0;
        hour = 0;
    }
    function addEvent(){
        startBtn.addEventListener('click', startClock);
        stopBtn.addEventListener('click', stopClock);
        resetBtn.addEventListener('click', resetClock);

    }

    function printTime(){
        sec++;
        getTimeFormat();
    }

    function startClock(){
        printTime();
        timerId = setTimeout(startClock,1000);
    }

    function getTimeFormat(){
        if(sec > 60){
            sec = 0;
            min++;
            if(min > 60){
                min=0;
                hour++;
            }
        }
        clock.innerHTML = (hour > 9 ? hour : "0"+hour)
        + ":" + (min > 9 ? min : "0"+min)
        + ":" + (sec > 9 ? sec : "0"+sec);
    }

    function stopClock(){
        if(timerId != null){
            clearTimeout(timerId);
        }
    }

    function resetClock(){
        stopClock();
        clock.innerHTML = "00:00:00";
        sec = 0;
    }

    return {
        init : init
    }
})();

stopWatch.init();
