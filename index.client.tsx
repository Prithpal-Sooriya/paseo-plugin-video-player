import type { PluginClientContext } from "@getpaseo/plugin/client";
import { VideoPanel } from "./client/video-panel";
import { VIDEO_EXTENSIONS } from "./shared/formats";

export default function contribute(client: PluginClientContext) {
  return client.addFilePanel({
    id: "video",
    title: "Video player",
    icon: "Play",
    files: { extensions: VIDEO_EXTENSIONS },
    Component: VideoPanel,
  });
}
