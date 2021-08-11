const App = () => {

    const [displayTime, setDisplayTime] = React.useState(25*60);
    const [breakTime, setBreakTime] = React.useState(5*60);
    const [sessionTime, setSessionTime] = React.useState(25*60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(new Audio("./alarm.mp3"))

    const playBreakSound = () =>{
        breakAudio.currentTime = 0;
        breakAudio.play();
    }

    const formatTime = (time) =>{
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        return(
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds)
        )
    }

    const changeTime=(amount,type)=>{
        if(type=='break'){
            if(breakTime <= 60 && amount<0)return
            setBreakTime(prev => prev + amount)
            
        }
        else{
            if(sessionTime <= 60 && amount<0)return
            setSessionTime(prev => prev + amount)
            if(!timerOn){
                setDisplayTime(sessionTime+amount)
            }
        }
    }

    const controlTime=()=>{
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVar = onBreak;
        if(!timerOn){
            let interval = setInterval(()=>{
                date = new Date().getTime();
                if(date>nextDate){
                    setDisplayTime(prev =>{
                        if(prev <=0 && !onBreakVar){
                            playBreakSound();
                            onBreakVar=true;
                            setOnBreak(true);
                            return breakTime;
                        }else if(prev <= 0 && onBreakVar){
                            playBreakSound();
                            onBreakVar=false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev -1;
                    });
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem("interval-id", interval);
        }

        if(timerOn){
            clearInterval(localStorage.getItem("interval-id"));
        }
        setTimerOn(!timerOn)
    }

    const resetTime=()=>{
        setDisplayTime(25*60);
        setSessionTime(25*60);
        setBreakTime(5*60)
    }

    return (
        <div className="container pt-5 text-center">
            <h1 className="pb-3"><b>Session Clock</b></h1>
                <Length btitle={"Break length"} changeTime={changeTime} btype={"break"} btime={breakTime} formatTime={formatTime} 
                 stitle={"Session length"} stype={"session"} stime={sessionTime} />
            <div className="container text-center vertical-align mt-5" id="smallBox">
                <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
                <h1 id="time-left">{formatTime(displayTime)}</h1>
            </div>
            <div className="pt-5">
            <i class="fas fa-2x fa-play-circle px-2" id="start_stop"onClick={controlTime}></i>
            <i class="fas fa-2x fa-pause-circle px-2" onClick={controlTime}></i>
            <i class="fas fa-2x fa-redo-alt px-2" id="reset" onClick={resetTime}></i>
            </div>
            <h6 className="text-center pt-5"><a href="http://bhindi.myweb.cs.uwindsor.ca/" target="_blank"><b>by Jenil</b></a></h6>
        </div>
    )
}


const Length = ({btitle, stitle, btime, stime, btype, stype, changeTime, formatTime}) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-6 text-center m-0 p-0 ">
                <h2 id="break-label">{btitle}</h2>
                </div>
                <div className="col-6 text-center m-0 p-0">
                <h2 id="session-label">{stitle}</h2>
                </div>
            </div>
            <div className="row ">
                <div className="row col-6 d-flex justify-content-center m-0 p-0 ">
                    <i className="fas fa-2x fa-arrow-circle-down px-2" id="break-decrement" onClick={()=>changeTime(-60,btype)}></i>
                    <h3 id="break-length">{formatTime(btime)}</h3>
                    <i className="fas fa-2x fa-arrow-circle-up px-2" id="break-increment" onClick={()=>changeTime(60,btype)}s></i>
                </div>
                <div className="row col-6 d-flex justify-content-center m-0 p-0">
                    <i className="fas fa-2x fa-arrow-circle-down px-2" id="session-decrement" onClick={()=>changeTime(-60,stype)}></i>
                    <h3 id="session-length">{formatTime(stime)}</h3>
                    <i className="fas fa-2x fa-arrow-circle-up px-2" id="session-increment" onClick={()=>changeTime(60,stype)}></i>
                </div>
            </div>
        </div>
    )
}

ReactDOM.render(<App/>,document.getElementById("app"))