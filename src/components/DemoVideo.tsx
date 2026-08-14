import { useCallback, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useScrollScale } from '../lib/useScrollScale';
import styles from './DemoVideo.module.css';

export interface DemoCrop {
  /** Device region within the source frame, in source pixels. */
  x: number;
  y: number;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  /** Device corner radius in source pixels, used to round off the crop box. */
  cornerRadius?: number;
}

interface DemoVideoProps {
  src: string;
  poster: string;
  crop: DemoCrop;
  /** Accessible name for the play button, e.g. "Play the GreenEye demo". */
  label: string;
  /** false for silent screen recordings — hides the mute control. */
  hasAudio?: boolean;
}

function timecode(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * Screen-recorded demo shown cropped to just the device, discarding the black
 * surround of the source frame.
 *
 * The video is scaled up and offset inside a smaller window rather than cropped
 * with object-fit: `cover` on a portrait box always scales to the source's
 * height, so it can trim the sides but never the black above and below the
 * device. That in turn puts the native control bar outside the window, hence
 * the small custom bar underneath.
 */
export function DemoVideo({ src, poster, crop, label, hasAudio = true }: DemoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // Expands upward from its base as it scrolls into view, scrubbed to scroll.
  useScrollScale(playerRef);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const windowStyle: CSSProperties = {
    aspectRatio: `${crop.width} / ${crop.height}`,
    borderRadius: crop.cornerRadius
      ? `${(crop.cornerRadius / crop.width) * 100}% / ${(crop.cornerRadius / crop.height) * 100}%`
      : undefined,
  };

  // Scale the frame so the crop region fills the window, then pull it left/up
  // by the crop origin. Percentages resolve against the window, which is
  // exactly the crop region — so the source pixel numbers convert directly.
  const frameStyle: CSSProperties = {
    width: `${(crop.sourceWidth / crop.width) * 100}%`,
    left: `${(-crop.x / crop.width) * 100}%`,
    top: `${(-crop.y / crop.height) * 100}%`,
  };

  const toggle = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }, []);

  // A browser/desktop recording needs most of the content column; a phone
  // recording needs a phone's worth. Derived from the crop, not another field.
  const orientation = crop.width > crop.height ? 'landscape' : 'portrait';

  return (
    <div className={styles.player} data-orientation={orientation} ref={playerRef}>
      <div className={styles.window} style={windowStyle}>
        <video
          ref={ref}
          className={styles.video}
          style={frameStyle}
          src={src}
          poster={poster}
          // Nothing but the poster loads until the viewer asks for it; the
          // duration arrives with the metadata once playback starts.
          preload="none"
          playsInline
          onClick={toggle}
          onPlay={() => {
            setStarted(true);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        />

        {!started && (
          <button type="button" className={styles.play} aria-label={label} onClick={toggle}>
            <span className={styles.playIcon} aria-hidden="true" />
          </button>
        )}
      </div>

      {started && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '❙❙' : '▶'}
          </button>

          <span className={styles.time}>{timecode(time)}</span>

          <input
            className={styles.seek}
            type="range"
            min={0}
            max={duration || 0}
            step={0.05}
            value={time}
            aria-label="Seek"
            onChange={(event) => {
              const next = Number(event.target.value);
              setTime(next);
              if (ref.current) ref.current.currentTime = next;
            }}
          />

          <span className={styles.time}>{timecode(duration)}</span>

          {hasAudio && (
            <button
              type="button"
              className={styles.control}
              aria-label={muted ? 'Unmute' : 'Mute'}
              aria-pressed={muted}
              onClick={() => {
                const video = ref.current;
                if (!video) return;
                video.muted = !video.muted;
                setMuted(video.muted);
              }}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
