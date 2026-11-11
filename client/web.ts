import { Platform } from "react-native";

// This plugin typechecks without the DOM library. Declare only what this module uses.
interface VideoElement {
  src: string;
  controls: boolean;
  playsInline: boolean;
  preload: string;
  currentTime: number;
  style: Record<string, string>;
  setAttribute(name: string, value: string): void;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
  pause(): void;
  removeAttribute(name: string): void;
  load(): void;
  remove(): void;
  readonly error: { code: number; message?: string } | null;
}
interface ParentElement {
  appendChild(child: unknown): void;
}
declare const document: { createElement(tag: "video"): VideoElement };

export interface VideoHandle {
  setSource(url: string): void;
  destroy(): void;
}

export interface VideoCallbacks {
  onTimeUpdate(seconds: number): void;
  onError(message: string): void;
}

const MEDIA_ERRORS: Record<number, string> = {
  1: "Playback was aborted.",
  2: "A network error stopped the video from loading.",
  3: "The video could not be decoded. The codec may be unsupported on this device.",
  4: "This video format is not supported here.",
};

/** DOM code stays here; native never evaluates it. Mounts an HTML5 <video> into a View. */
export function mountVideo(
  parent: unknown,
  url: string,
  startAt: number,
  background: string,
  callbacks: VideoCallbacks,
): VideoHandle | null {
  if (Platform.OS !== "web" || !parent) return null;
  const video = document.createElement("video");
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.setAttribute("data-testid", "video-player-element");
  video.setAttribute("aria-label", "Video player");
  Object.assign(video.style, {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "contain",
    backgroundColor: background,
    outline: "none",
  });
  let resumeAt = startAt;
  const onLoaded = () => {
    if (resumeAt > 0) video.currentTime = resumeAt;
    resumeAt = 0;
  };
  const onTime = () => callbacks.onTimeUpdate(video.currentTime);
  const onError = () => {
    const code = video.error?.code ?? 0;
    callbacks.onError(video.error?.message || MEDIA_ERRORS[code] || "The video could not be played.");
  };
  video.addEventListener("loadedmetadata", onLoaded);
  video.addEventListener("timeupdate", onTime);
  video.addEventListener("error", onError);
  video.src = url;
  (parent as ParentElement).appendChild(video);
  return {
    setSource(next) {
      if (video.src === next) return;
      resumeAt = video.currentTime;
      video.src = next;
    },
    destroy() {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("error", onError);
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
    },
  };
}
