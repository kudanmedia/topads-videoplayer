import React, { useRef, useState } from 'react';
import { PhotographIcon} from '@heroicons/react/solid'
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [isPIP, setIsPIP] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);

  const videoHandler = (control) => {
    if (control === "play") {
      videoRef.current.play();
      setPlaying(true);
      var vid = document.getElementById("video1");
      setVideoTime(vid.duration);
    } else if (control === "pause") {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const fastForward = () => {
    videoRef.current.currentTime += 5;
  };

  const revert = () => {
    videoRef.current.currentTime -= 5;
  };

  const checkFull = () => {
    if (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement) {
          return (
            <button onClick={exitFull} className="controlsIcon bg-transparent border-none text-white outline-none focus:outline-none" id="exitFullscreen">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          </button>
          );
        } else {
          return (
            <button onClick={goFull} className="controlsIcon mr-2 bg-transparent border-none text-white outline-none focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
          );
        }
  }

  const goFull = () => {
    if (document.fullscreenEnabled) {
      document.documentElement.requestFullscreen();
    } else if (document.webkitFullscreenEnabled) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.mozFullScreenEnabled) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.msFullscreenEnabled) {
      document.documentElement.msRequestFullscreen();
    }
  }

  const exitFull = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  const screenOrientationChange = () => {
    const mql = window.matchMedia("(orientation: portrait)");
    mql.addListener(handleOrientationChange);

    function handleOrientationChange(mql) {
      if (mql.matches) {
        console.log('portrait');
        exitFull();
      } else {
        console.log('landscape');
        goFull();
      }
    }
  }

  const seek = (e) => {
    const x = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const percent = Math.floor((100 / width) * x);
    const currentTime = Math.floor((videoTime / 100) * percent);

    videoRef.current.currentTime = currentTime;
  }

  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  }

  const changeVolume = (e) => {
    const x = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const percent = Math.floor((100 / width) * x);
    const currentVolume = percent / 100;

    videoRef.current.volume = currentVolume;
    setVolume(currentVolume);
  }

  const togglePIP = () => {
    if (isPIP) {
      document.exitPictureInPicture();
      setIsPIP(false);
    } else {
      videoRef.current.requestPictureInPicture();
      setIsPIP(true);
    }
  }

  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setSpeed(rate);
  }

  const togglePlayer = () => {
    setShowPlayer(!showPlayer);
  }

  window.setInterval(function () {
    setCurrentTime(videoRef.current?.currentTime);
    setProgress((videoRef.current?.currentTime / videoTime) * 100);
  }, 1000);

  return (
    <div className="app">
      {showPlayer && (
        <>
          <video
            id="video1"
            ref={videoRef}
            className="video"
            src="https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.ogg"
          ></video>

          <div className="controlsContainer mt-4">
            <div className="controls flex">
              <img
                onClick={revert}
                className="controlsIcon mr-2"
                alt=""
                src="/backward-5.svg"
              />
              {playing ? (
                <img
                  onClick={() => videoHandler("pause")}
                  className="controlsIcon--small mr-2"
                  alt=""
                  src="/pause.svg"
                />
              ) : (
                <img
                  onClick={() => videoHandler("play")}
                  className="controlsIcon--small mr-2"
                  alt=""
                  src="/play.svg"
                />
              )}
              <img
                className="controlsIcon mr-2"
                onClick={fastForward}
                alt=""
                src="/forward-5.svg"
              />
            </div>
          </div>

          <div className="timecontrols grid grid-cols-3 gap-4 mt-4">
          <div className="time_progressbarContainer">
              <div
                onClick={seek}
                style={{ width: `${progress}%` }}
                className="time_progressBar bg-green-500 cursor-pointer"
              ></div>
            </div>
            <div><p className="controlsTime">
              {Math.floor(currentTime / 60) +
                ":" +
                ("0" + Math.floor(currentTime % 60)).slice(-2)}

              /

              {Math.floor(videoTime / 60) +
                ":" +
                ("0" + Math.floor(videoTime % 60)).slice(-2)}
              </p>
            </div>
            <div className="float-right grid grid-col-3 mt-4">
              <div>
                {checkFull()}
              </div>
              <div>
                <button onClick={toggleMute} className="controlsIcon bg-transparent border-none text-white outline-none focus:outline-none">
                {muted ? (
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                   </svg>
                  ) : volume > 0.5 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
                  </svg>
                  ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
                  </svg>
                  )}
                </button>
              </div>
              <div>
              <button onClick={togglePIP} className="controlsIcon bg-transparent border-none text-white outline-none focus:outline-none">
              <PhotographIcon className="h-5 w-5 text-white-500" />
                </button>
              </div>
            </div>
          </div>
          
          
        </>
      )}

      {!showPlayer && (
        <div className="flex items-center justify-center">
          <div className="px-3 py-3 bg-gray-500 rounded-lg">
            <p>Video is playing in the background</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={togglePlayer}
            >
              Open Video
            </button>
          </div>
        </div>
      )}

    </div>
    
  );
}

export default App;