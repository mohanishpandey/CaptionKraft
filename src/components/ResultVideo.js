import { useEffect, useState, useRef } from "react"; 
import { FFmpeg } from "@ffmpeg/ffmpeg"; 
import { toBlobURL, fetchFile } from "@ffmpeg/util"; 
import SparklesIcon from "./SparklesIcon"; 
import { transcriptionItemsToSrt } from "@/libs/awsTranscriptionsHelper"; 
import roboto from "./../fonts/Roboto-Regular.ttf"; 
import robotoBold from "./../fonts/Roboto-Bold.ttf"; 
import akshar from "./../fonts/Akshar Unicode.ttf"; 
import latha from "./../fonts/latha.ttf"; 
import dhurjati from "./../fonts/dhurjati.ttf"; 
// import { langcode } from "@/app/api/transcribe/route"; 
 
export default function ResultVideo({ filename, transcriptionItems }) { 
  const videoUrl = "https://harshit-epic-captions.s3.amazonaws.com/" + filename; 
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF"); 
  const [outlineColor, setOutlineColor] = useState("#000000"); 
  const [progress, setProgress] = useState(1); 
  const [loaded, setLoaded] = useState(false); 
  // const [fontn, setfontn] = useState("Roboto Bold"); 
  const ffmpegRef = useRef(new FFmpeg()); 
  const videoRef = useRef(null); 
 
  useEffect(() => { 
    videoRef.current.src = videoUrl; 
 
    load(); 
  }, []); 
  // if (langcode != null && langcode == "hi-IN") { 
  //   setfontn("Akshar Unicode"); 
  // } else if (langcode != null && langcode == "ta-IN") { 
  //   setfontn("latha"); 
  // } else if (langcode != null && langcode == "te-IN") { 
  //   setfontn("dhurjati"); 
  // } 
  const load = async () => { 
    const ffmpeg = ffmpegRef.current; 
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd"; 
    await ffmpeg?.load({ 
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"), 
      wasmURL: await toBlobURL( 
        `${baseURL}/ffmpeg-core.wasm`, 
        "application/wasm" 
      ), 
    }); 
    await ffmpeg.writeFile("/tmp/roboto.ttf", await fetchFile(roboto)); 
    await ffmpeg.writeFile("/tmp/roboto-bold.ttf", await fetchFile(robotoBold)); 
    await ffmpeg.writeFile("/tmp/akshar.ttf", await fetchFile(akshar)); 
    await ffmpeg.writeFile("/tmp/latha.ttf", await fetchFile(latha)); 
    await ffmpeg.writeFile("/tmp/dhurjati.ttf", await fetchFile(dhurjati)); 
 
    setLoaded(true); 
  }; 
 
  function toFFmpegColor(rgb) { 
    const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3); 
    return "&H" + bgr + "&"; 
  } 
 
  const transcode = async () => { 
    const ffmpeg = ffmpegRef.current; 
    const srt = transcriptionItemsToSrt(transcriptionItems); 
    await ffmpeg.writeFile(filename, await fetchFile(videoUrl)); 
    await ffmpeg.writeFile("subs.srt", srt); 
    videoRef.current.src = videoUrl; 
    await new Promise((resolve, reject) => { 
      videoRef.current.onloadedmetadata = resolve; 
    }); 
 
    const duration = videoRef.current.duration; 
    ffmpeg.on("log", ({ message }) => { 
      const regexResult = /time=([0-9:.]+)/.exec(message); 
      if (regexResult && regexResult?.[1]) { 
        const howMuchIsDone = regexResult?.[1]; 
        const [hours, minutes, seconds] = howMuchIsDone.split(":"); 
        const doneTotalSeconds = hours * 3600 + minutes * 60 + seconds; 
        const videoProgress = doneTotalSeconds / duration; 
        setProgress(videoProgress); 
      } 
    }); 
    await ffmpeg.exec([ 
      "-i", 
      filename, 
      /* "-to", 
      "00:00:05", */ 
      "-preset", 
      "ultrafast", 
      "-vf", 
      `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Akhsar Unicode,FontSize=30,MarginV=70,PrimaryColour=${toFFmpegColor( 
        primaryColor 
      )},OutlineColour=${toFFmpegColor(outlineColor)}'`, 
      "output.mp4", 
    ]); 
    //dhurjati 
    //Akshar Unicode 
    //latha 
    const data = await ffmpeg.readFile("output.mp4"); 
    videoRef.current.src = URL.createObjectURL( 
      new Blob([data.buffer], { type: "video/mp4" }) 
    ); 
    setProgress(1); 
  }; 
 
  return ( 
    <> 
      <div className="mb-4"> 
        <button 
          onClick={transcode} 
          className="bg-green-600 px-6 py-2 rounded-full inline-flex gap-2 border-2 border-purple-700/50 cursor-pointer" 
        > 
          <SparklesIcon /> 
          <span>Apply captions</span> 
        </button> 
      </div> 
      <div> 
        primary color: 
        <input 
          type="color" 
          value={primaryColor} 
          onChange={(ev) => setPrimaryColor(ev.target.value)} 
        /> 
        <br /> 
        outline color: 
        <input 
          type="color" 
          value={outlineColor} 
          onChange={(ev) => setOutlineColor(ev.target.value)} 
        /> 
      </div> 
      <div className="rounded-xl overflow-hidden relative"> 
        {progress && progress < 1 && ( 
          <div className="absolute inset-0 bg-black/80 flex items-center"> 
            <div className="w-full text-center"> 
              <div className="bg-bg-gradient-from/50 mx-8 rounded-lg overflow-hidden relative"> 
                <div 
                  className="bg-bg-gradient-from h-8" 
                  style={{ width: progress * 100 + "%" }} 
                > 
                  <h3 className="text-white text-xl absolute inset-0 py-1"> 
                    {parseInt(progress * 100)}% 
                  </h3> 
                </div> 
              </div> 
            </div> 
          </div> 
        )} 
 
        <video data-video={0} controls ref={videoRef}></video> 
      </div> 
    </> 
  ); 
}