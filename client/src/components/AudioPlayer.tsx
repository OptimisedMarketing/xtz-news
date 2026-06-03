import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Headphones, Download, Loader2, Video } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AudioPlayerProps {
  src?: string | null;
  title?: string;
  postId?: number;
  featuredImageUrl?: string | null;
  slug?: string;
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const AUDIO_VIDEO_SERVICE = 'http://34.52.212.6:8085';

export default function AudioPlayer({ src: initialSrc, title, postId, featuredImageUrl, slug }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(initialSrc || null);
  const [hasTriedGenerate, setHasTriedGenerate] = useState(false);
  const [downloadingMp4, setDownloadingMp4] = useState(false);

  const generateAudio = trpc.audio.getOrGenerate.useMutation({
    onSuccess: (data) => {
      setAudioSrc(data.audioUrl);
      setGenerating(false);
      if (!data.cached) {
        toast.success("Audio generated! Press play to listen.");
      }
    },
    onError: (err) => {
      setGenerating(false);
      toast.error("Could not generate audio. Please try again.");
      console.error("Audio generation error:", err);
    },
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    const onWaiting = () => setAudioLoading(true);
    const onCanPlay = () => setAudioLoading(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [audioSrc]);

  const handlePlay = async () => {
    // If no audio yet and we have a postId, generate on first play
    if (!audioSrc && postId && !hasTriedGenerate) {
      setHasTriedGenerate(true);
      setGenerating(true);
      generateAudio.mutate({ postId });
      return;
    }

    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        console.error("Play error:", e);
      }
    }
  };

  // Auto-play when audio becomes available after generation
  useEffect(() => {
    if (audioSrc && hasTriedGenerate && !playing) {
      const audio = audioRef.current;
      if (audio) {
        audio.load();
        audio.play().then(() => setPlaying(true)).catch(() => {});
      }
    }
  }, [audioSrc]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const handleDownload = () => {
    if (!audioSrc) {
      toast.error("Generate the audio first by pressing play.");
      return;
    }
    const a = document.createElement("a");
    a.href = audioSrc;
    a.download = `${(title || "article").replace(/[^a-z0-9]/gi, "-").toLowerCase()}-george-elevenlabs.mp3`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Downloading MP3...");
  };

  const handleDownloadMp4 = async () => {
    if (!audioSrc) {
      toast.error("Generate the audio first by pressing play.");
      return;
    }
    setDownloadingMp4(true);
    toast.info("Converting to MP4 for X/Twitter... this may take 30-60 seconds.");
    try {
      const res = await fetch(`${AUDIO_VIDEO_SERVICE}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioUrl: audioSrc,
          imageUrl: featuredImageUrl || null,
          title: title || 'XTZ.News Article',
          slug: slug || 'xtz-news-article',
        }),
      });
      if (!res.ok) throw new Error(`Conversion failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(slug || 'xtz-news-article')}-george-elevenlabs.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('MP4 downloaded! Ready to post on X/Twitter.');
    } catch (err) {
      toast.error('MP4 conversion failed. Try downloading the MP3 instead.');
      console.error('MP4 error:', err);
    } finally {
      setDownloadingMp4(false);
    }
  };

  const isLoading = audioLoading || generating;
  const hasAudio = !!audioSrc;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)",
        border: "1px solid rgba(44,125,247,0.3)",
        borderRadius: "6px",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Headphones size={14} style={{ color: "#2c7df7", flexShrink: 0 }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7" }}>
            Listen to this article
          </span>
          {!hasAudio && (
            <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
              · George, ElevenLabs
            </span>
          )}
        </div>
        {/* Download buttons */}
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button
            onClick={handleDownload}
            title={hasAudio ? "Download MP3" : "Generate audio first"}
            style={{ background: "none", border: "none", cursor: hasAudio ? "pointer" : "default", color: hasAudio ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: "0.25rem", padding: "2px 6px", borderRadius: "3px", fontSize: "0.62rem", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={(e) => { if (hasAudio) (e.currentTarget as HTMLElement).style.color = "#2c7df7"; }}
            onMouseLeave={(e) => { if (hasAudio) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
          >
            <Download size={11} />
            <span>MP3</span>
          </button>
          <button
            onClick={handleDownloadMp4}
            disabled={downloadingMp4}
            title={hasAudio ? "Download MP4 for X/Twitter" : "Generate audio first"}
            style={{ background: "none", border: "none", cursor: hasAudio && !downloadingMp4 ? "pointer" : "default", color: hasAudio ? "rgba(255,165,0,0.7)" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: "0.25rem", padding: "2px 6px", borderRadius: "3px", fontSize: "0.62rem", fontWeight: 600, transition: "all 0.15s" }}
            onMouseEnter={(e) => { if (hasAudio) (e.currentTarget as HTMLElement).style.color = "#ffa500"; }}
            onMouseLeave={(e) => { if (hasAudio) (e.currentTarget as HTMLElement).style.color = "rgba(255,165,0,0.7)"; }}
          >
            {downloadingMp4 ? <Loader2 size={11} style={{ animation: "spin 0.8s linear infinite" }} /> : <Video size={11} />}
            <span>{downloadingMp4 ? '...' : 'MP4 𝕏'}</span>
          </button>
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        {/* Play/Pause button */}
        <button
          onClick={handlePlay}
          disabled={isLoading && !hasAudio}
          style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "#2c7df7", border: "none", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
            transition: "background 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
          onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.95)")}
          onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
          aria-label={playing ? "Pause" : "Play"}
        >
          {generating ? (
            <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />
          ) : isLoading ? (
            <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          ) : playing ? (
            <Pause size={16} />
          ) : (
            <Play size={16} style={{ marginLeft: "2px" }} />
          )}
        </button>

        {/* Progress bar + status */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {generating ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, transparent, #2c7df7, transparent)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
              </div>
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>Generating...</span>
            </div>
          ) : (
            <>
              <div
                ref={progressRef}
                onClick={handleProgressClick}
                style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", cursor: hasAudio ? "pointer" : "default", position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: "#2c7df7", borderRadius: "2px", transition: "width 0.1s linear" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>
                  {hasAudio ? formatTime(currentTime) : "Press ▶ to generate"}
                </span>
                <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>
                  {formatTime(duration)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          style={{ background: "none", border: "none", color: muted ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)", cursor: "pointer", padding: "4px", display: "flex", flexShrink: 0, transition: "color 0.2s" }}
          aria-label={muted ? "Unmute" : "Mute"}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = muted ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)")}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}
