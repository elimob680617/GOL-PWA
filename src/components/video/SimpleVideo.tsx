import { FC, useEffect, useRef, useState } from 'react';
import useOnScreen from 'src/hooks/useIsVisiable';
import {
  addInViewPortVideo,
  getInViewPortVideos,
  getPlayingVideos,
  removeInViewPortVideo,
  removePlayingVideo,
  setPlayingVideo,
} from 'src/redux/slices/homePage';
import { useDispatch, useSelector } from 'src/redux/store';
import { SURFACE } from 'src/theme/palette';
import { browserName, browserVersion } from 'react-device-detect';

interface ISimpleVideoProps {
  autoShow?: boolean;
  src: string;
  controls?: boolean;
  width?: number;
  height?: number;
  maxHeight?: number;
}

const SimpleVideo: FC<ISimpleVideoProps> = (props) => {
  const { autoShow, src, controls, width, height, maxHeight } = props;
  const dispatch = useDispatch();
  const inViewVideos = useSelector(getInViewPortVideos);
  const playingVideos = useSelector(getPlayingVideos);
  const videoRef = useRef(null);
  const ref = useRef<HTMLDivElement>();
  const onScreen: boolean = useOnScreen<HTMLDivElement>(ref, ref.current ? `-${ref.current.offsetHeight}px` : '');
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  useEffect(() => {
    if (onScreen && autoShow) {
      dispatch(addInViewPortVideo({ link: src, positionTop: ref.current.offsetTop }));
    } else if (!onScreen && autoShow) {
      pauseVideo();
      dispatch(removePlayingVideo(src));
      dispatch(removeInViewPortVideo(src));
    }
  }, [onScreen]);

  useEffect(() => {
    if (inViewVideos.length === 0) {
      return;
    }
    if (inViewVideos[0] && inViewVideos[0].link === src) {
      if (!autoPlay) {
        setAutoPlay(true);
        videoRef.current.play();
        dispatch(setPlayingVideo(src));
      }
    }
  }, [inViewVideos]);

  useEffect(() => {
    const videoIndex = playingVideos.findIndex((i) => i === src);
    if (videoIndex >= 0) {
      if (inViewVideos[0] && inViewVideos[0].link !== src) {
        pauseVideo();
        dispatch(removePlayingVideo(src));
      }
    }
  }, [playingVideos]);

  const pauseVideo = () => {
    setAutoPlay(false);
    videoRef.current.pause();
  };

  // useEffect(() => {
  //   if (onScreen && autoShow) {
  //     setAutoPlay(true);
  //     videoRef.current.play();
  //   } else {
  //     setAutoPlay(false);
  //     videoRef.current.pause();
  //   }
  // }, [onScreen]);

  function msToTime(s: any) {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;
    if (hrs === 0) {
      return mins + ':' + secs + ms;
    } else {
      return hrs + ':' + mins + ':' + secs;
    }
  }
  return (
    <div
      style={{
        maxHeight: maxHeight ? maxHeight : '30rem',
        maxWidth: '100%',
        height: height ? height : '15rem',
        width: width ? width : '100٪',
      }}
      ref={ref}
    >
      <video
        style={{
          maxHeight: maxHeight ? maxHeight : '30rem',
          maxWidth: '100%',
          height: height ? height : '15rem',
          width: width ? width : '100٪',
        }}
        id="video"
        muted
        controls={controls}
        autoPlay={autoPlay}
        ref={videoRef}
        playsInline
        key={src}
      >
        <source src={src} />
      </video>
    </div>
  );
};

export default SimpleVideo;
