import { Media, MediaObject } from '@ionic-native/media'
import { isPlatform } from '@ionic/react'
import { useEffect, useRef, useState } from 'react'

interface UseAudioPlayerProps {
  audioUrl: string
  progressRef: React.MutableRefObject<HTMLInputElement>
}

const useAudioPlayer = (props: UseAudioPlayerProps) => {
  // > return appropriate platform audio
  return isPlatform('hybrid') ? usePlatformAudio(props) : useHTMLAudio(props)
}

export default useAudioPlayer

const useHTMLAudio = ({ audioUrl, progressRef }: UseAudioPlayerProps) => {
  // --- hooks ---
  // > state
  const [audio, setAudio] = useState<HTMLAudioElement>(null!) // current audio
  const [curTime, setCurTime] = useState(0) // current time of audio
  const [duration, setDuration] = useState(0) // audio duration
  const [isPaused, setIsPaused] = useState(true) // is the audio paused
  const [isLoading, setIsLoading] = useState(true) // is the audio is loading
  // > refs
  const animationRef = useRef<number>(null!) // request animation ref
  // > component did mount
  useEffect(() => {
    // create new audio
    const newAudio = new Audio(audioUrl)
    setAudio(newAudio)
    // get media duration
    const newDuration = newAudio.duration
    setDuration(newDuration)
    // set up audio state when audio is loaded
    newAudio.onloadedmetadata = (e) => {
      console.log(e)
      const seconds = Math.floor(newAudio.duration)
      progressRef.current.max = `${seconds}`
      setDuration(seconds)
      setIsLoading(false)
    }
    // > on unmount
    return () => {
      // cancel animation loop
      cancelAnimationFrame(animationRef.current)
    }
  }, [])
  // > component should update on paused change
  useEffect(() => {
    setCurTime(audio?.currentTime)
  }, [isPaused])
  // > audio functions
  /**
   * Toggle audio pause and play state
   */
  const togglePlayPause = () => {
    if (audio?.paused) {
      audio.play()
      animationRef.current = requestAnimationFrame(whilePlaying)
    } else {
      audio.pause()
      cancelAnimationFrame(animationRef.current)
    }
    setIsPaused(audio.paused)
  }
  /**
   * Skip forward with positive number and backward with negative number
   * @param skipSeconds Change the current time by num
   */
  const skip = (skipSeconds: number) => {
    if (!audio) return
    audio.currentTime = Math.floor(audio.currentTime + skipSeconds)
    progressRef.current.value = `${audio.currentTime}`
    setCurTime(audio.currentTime)
  }
  /**
   * Seek to audio section in seconds
   * @param seconds Time to seek to
   */
  const seekTo = (seconds: number) => {
    if (!audio) return
    audio.currentTime = Math.floor(seconds)
    setCurTime(audio.currentTime)
  }
  /**
   * While playing, update progress bar
   */
  const whilePlaying = () => {
    if (!audio) return
    progressRef.current.value = `${audio.currentTime}`
    setCurTime(audio.currentTime)
    animationRef.current = requestAnimationFrame(whilePlaying)
  }
  /**
   * Get audio percentage
   * @returns {number}
   */
  const getPercent = () => {
    return progressRef?.current?.value && progressRef?.current?.max
      ? parseInt(progressRef.current.value) / parseInt(progressRef.current.max)
      : 0
  }

  return {
    /**
     * Current time of audio
     */
    curTime,
    /**
     * Duration of current audio
     */
    duration,
    /**
     * Paused state of audio
     */
    isPaused,
    /**
     * Loading state of audio
     */
    isLoading,
    seekTo,
    togglePlayPause,
    skip,
    getPercent
  }
}

const usePlatformAudio = ({ audioUrl, progressRef }: UseAudioPlayerProps) => {
  // --- hooks ---
  // > state
  const [audio, setAudio] = useState<MediaObject>(Media.create(audioUrl)) // current audio
  const [curTime, setCurTime] = useState(0) // current time of audio
  const [duration, setDuration] = useState(0) // audio duration
  const [isPaused, setIsPaused] = useState(true) // is the audio paused
  const [isLoading, setIsLoading] = useState(true) // is the audio is loading
  // > refs
  const animationRef = useRef<number>(null!) // request animation ref
  // > component did mount
  useEffect(() => {
    // create new audio
    const newAudio = Media.create(audioUrl)
    setAudio(newAudio)
    // get media duration
    const newDuration = newAudio.getDuration()
    setDuration(newDuration)
    // set up audio state when audio is loaded
    const seconds = Math.floor(newAudio.getDuration())
    progressRef.current.max = `${seconds}`
    setDuration(seconds)
    setIsLoading(false)
    // > on unmount
    return () => {
      // cancel animation loop
      cancelAnimationFrame(animationRef.current)
      // release audio
      audio.release()
    }
  }, [])
  // > component should update on paused change
  useEffect(() => {
    const curTimeHandler = async () => {
      const pos: number = await audio.getCurrentPosition()
      setCurTime(pos)
    }
    curTimeHandler()
  }, [isPaused])
  // > audio functions
  /**
   * Toggle audio pause and play state
   */
  const togglePlayPause = () => {
    if (!audio) return
    // if audio is paused
    if (isPaused) {
      audio.play()
      animationRef.current = requestAnimationFrame(whilePlaying)
    } else {
      audio.pause()
      cancelAnimationFrame(animationRef.current)
    }
    setIsPaused(!isPaused)
  }
  /**
   * Skip forward with positive number and backward with negative number
   * @param skipSeconds Change the current time by num
   */
  const skip = async (skipSeconds: number) => {
    if (!audio) return
    const pos: number = await audio.getCurrentPosition()
    const skipPos = Math.floor(pos + skipSeconds)
    audio.seekTo(skipPos)
    progressRef.current.value = `${skipPos}`
    setCurTime(skipPos)
  }
  /**
   * Seek to audio section in seconds
   * @param seconds Time to seek to
   */
  const seekTo = (seconds: number) => {
    if (!audio) return
    const newSeconds = Math.floor(seconds)
    audio.seekTo(newSeconds)
    setCurTime(newSeconds)
  }
  /**
   * While playing, update progress bar
   */
  const whilePlaying = async () => {
    if (!audio) return
    const curPos: number = await audio.getCurrentPosition()
    progressRef.current.value = `${curPos}`
    setCurTime(curPos)
    animationRef.current = requestAnimationFrame(whilePlaying)
  }
  /**
   * Get audio percentage
   * @returns {number}
   */
  const getPercent = () => {
    return progressRef?.current?.value && progressRef?.current?.max
      ? parseInt(progressRef.current.value) / parseInt(progressRef.current.max)
      : 0
  }

  return {
    /**
     * Current time of audio
     */
    curTime,
    /**
     * Duration of current audio
     */
    duration,
    /**
     * Paused state of audio
     */
    isPaused,
    /**
     * Loading state of audio
     */
    isLoading,
    seekTo,
    togglePlayPause,
    skip,
    getPercent
  }
}
