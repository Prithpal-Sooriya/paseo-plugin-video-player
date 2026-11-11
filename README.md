# Paseo video player

A [Paseo](https://paseo.sh) plugin that plays video files inside Paseo file tabs instead of showing "Binary preview unavailable".

![Video player panel](assets/screenshot.png)

- Formats: `.mp4`, `.m4v`, `.mov`, `.webm`, `.ogv`
- Desktop and web: HTML5 player with native controls (seek, volume, speed, picture in picture, full screen). Remembers the playback position per tab and reloads when the file changes on disk.
- iOS and Android: plays through `DocumentFrame` (system WebView).
- Client-only plugin. No backend, no network calls.

Requires Paseo 0.13.0 or later.

## Install

```bash
paseo plugin install git:Prithpal-Sooriya/paseo-plugin-video-player
```

Or from a local checkout:

```bash
git clone https://github.com/Prithpal-Sooriya/paseo-plugin-video-player
paseo plugin install "$PWD/paseo-plugin-video-player"
```

Plugins must be enabled on the daemon (Settings → Plugins).

## Develop

```bash
npm install
npm run typecheck
paseo plugin reload video-player
```

## License

MIT
