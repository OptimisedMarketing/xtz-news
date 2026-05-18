import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Headphones } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title?: string;
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);

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
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

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
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
        <Headphones size={14} style={{ color: "#2c7df7", flexShrink: 0 }} />
        <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7" }}>
          Listen to this article
        </span>

      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          disabled={loading}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#2c7df7",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.2s, transform 0.1s",
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
          onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.95)")}
          onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
          aria-label={playing ? "Pause" : "Play"}
        >
          {loading ? (
            <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          ) : playing ? (
            <Pause size={16} />
          ) : (
            <Play size={16} style={{ marginLeft: "2px" }} />
          )}
        </button>

        {/* Progress bar + times */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {/* Clickable progress bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${progress}%`,
                background: "#2c7df7",
                borderRadius: "2px",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          {/* Time display */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(currentTime)}
            </span>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(duration)}
            </span>
          </div>
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
      `}</style>
    </div>
  );
}
