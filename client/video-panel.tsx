import { type PluginFilePanelProps, useFileUrl, useTabState } from "@getpaseo/plugin/client";
import { DocumentFrame, Loading } from "@getpaseo/plugin/client/ui";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import { z } from "zod";
import { mountVideo, type VideoHandle } from "./web";

const positionSchema = z.object({ position: z.number().nonnegative() });
const defaultPosition = { position: 0 };
const SAVE_EVERY_SECONDS = 2;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

/** Web and desktop: an HTML5 video element with native controls. Remembers the position per tab. */
function WebVideo({ url, props }: { url: string; props: PluginFilePanelProps }) {
  const { theme, tab } = props;
  const parent = useRef<View>(null);
  const player = useRef<VideoHandle | null>(null);
  const [saved, setSaved] = useTabState(tab, positionSchema, defaultPosition);
  const lastSaved = useRef(saved.position);
  const [error, setError] = useState<string | null>(null);
  const initialUrl = useRef(url);
  const initialPosition = useRef(saved.position);
  const setSavedRef = useRef(setSaved);
  setSavedRef.current = setSaved;

  useLayoutEffect(() => {
    const handle = mountVideo(
      parent.current,
      initialUrl.current,
      initialPosition.current,
      theme.colors.surface0,
      {
        onTimeUpdate(seconds) {
          if (Math.abs(seconds - lastSaved.current) < SAVE_EVERY_SECONDS) return;
          lastSaved.current = seconds;
          setSavedRef.current({ position: Math.floor(seconds) });
        },
        onError: setError,
      },
    );
    player.current = handle;
    return () => {
      handle?.destroy();
      player.current = null;
    };
    // Mount once; source and colour changes are applied without remounting.
  }, []);

  useEffect(() => {
    setError(null);
    player.current?.setSource(url);
  }, [url]);

  const styles = useMemo(
    () => ({
      panel: { flex: 1, minHeight: 0, backgroundColor: theme.colors.surface0 },
      stage: { flex: 1, minHeight: 0 },
      error: {
        color: theme.colors.statusDanger,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: theme.colors.surface1,
      },
    }),
    [theme],
  );

  return (
    <View style={styles.panel}>
      {error ? (
        <Text style={styles.error} testID="video-player-error">
          {error}
        </Text>
      ) : null}
      <View ref={parent} style={styles.stage} testID="video-player" />
    </View>
  );
}

export function VideoPanel(props: PluginFilePanelProps) {
  const { file, theme, layout } = props;
  const url = useFileUrl(file);
  const styles = useMemo(
    () => ({
      panel: { flex: 1, minHeight: 0, backgroundColor: theme.colors.surface0 },
      header: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 8,
        paddingHorizontal: layout.compact ? 12 : 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      },
      name: { flex: 1, color: theme.colors.foreground, fontSize: 13 },
      meta: { color: theme.colors.foregroundMuted, fontSize: 12 },
      center: { flex: 1, alignItems: "center" as const, justifyContent: "center" as const, padding: 24 },
      error: { color: theme.colors.statusDanger, textAlign: "center" as const },
    }),
    [theme, layout.compact],
  );

  let body;
  if (url.status === "loading") body = <Loading />;
  else if (url.status === "error") {
    body = (
      <View style={styles.center}>
        <Text style={styles.error}>{url.error.message}</Text>
      </View>
    );
  } else if (layout.platform === "web") body = <WebVideo url={url.url} props={props} />;
  // iOS and Android: the native WebView plays the local file with system controls.
  else body = <DocumentFrame url={url.url} testID="video-player-native" />;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={styles.meta}>{formatBytes(file.size)}</Text>
      </View>
      {body}
    </View>
  );
}
