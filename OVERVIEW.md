Video player opens video files in a Paseo file tab and plays them with standard playback controls: play and pause, seeking, volume, playback speed, picture in picture and full screen.

It handles `.mp4`, `.m4v`, `.mov`, `.webm` and `.ogv` files. Open a video from the file explorer, or from a link an agent prints, and it plays in place instead of showing "Binary preview unavailable". This suits automations and skills that render videos, such as a daily digest or an explainer video.

The tab shows the file name and size, remembers where you stopped watching, and reloads the video when the file changes on disk, keeping your position.

## Known limits

- The whole file is transferred from the daemon to the app before playback starts, so very large files take a moment to open, especially from a remote host.
- Codec support comes from the app's platform. H.264 and AAC in MP4 play everywhere. HEVC, AV1 and some MOV codecs depend on the operating system.
- On iOS and Android the video plays through the system web view with its own controls, and the saved position is not restored.

Requires Paseo 0.13.0 or later. The plugin runs only in the app and has no backend; it does not read or send anything beyond the file you open.
