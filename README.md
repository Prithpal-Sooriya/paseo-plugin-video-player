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
npm run check
paseo plugin reload video-player
```

## Releasing

Releases are Git tags. Pushing a `vX.Y.Z` tag runs [the release workflow](.github/workflows/release.yml), which re-runs the checks, verifies the tag matches `package.json`, and creates a GitHub release with generated notes and the packed plugin attached.

1. Open a PR that bumps `version` in `package.json` (e.g. `npm version minor --no-git-tag-version`) and merge it.
2. Tag the merged commit and push the tag: `git tag v0.2.0 && git push origin v0.2.0`.

Tags with a suffix such as `v0.2.0-beta.1` are marked as pre-releases.

Pin an install to a release with `paseo plugin install git:Prithpal-Sooriya/paseo-plugin-video-player --ref v0.1.0`. `paseo plugin update` on a Git install follows the default branch rather than tags, so keep the default branch releasable.

## License

MIT
