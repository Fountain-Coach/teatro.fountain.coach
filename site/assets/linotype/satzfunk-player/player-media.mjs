// SatzfunkPlayer's source-bound, pure media binding.
// Production HTML remains authored/published by Fountain-Coach/Satzfunk.
// No runtime redirects, external playback or remote decoder.
function mediaBasePrefix(prefix) {
  if (typeof prefix !== "string" || !/^\/(?:[a-z0-9._-]+\/)*$/i.test(prefix) || prefix.includes("..")) return null;
  return prefix;
}

function sameOriginPath(path, origin, kind, basePrefix = "/") {
  if (typeof path !== "string" || path.includes("..") || path.includes("//")) return null;
  const prefix = mediaBasePrefix(basePrefix);
  if (!prefix) return null;
  const candidate = kind === "media" && prefix !== "/"
    ? prefix.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path)
    : path;
  const media = /^\/(?:[a-z0-9._-]+\/)*media\/[a-z0-9][a-z0-9._/-]*\.(mp4|webm|mp3|ogg|wav|m4a)$/i;
  const image = /^\/(media\/posters|posters)\/[a-z0-9][a-z0-9._/-]*\.(jpg|jpeg|png|webp)$/i;
  if (!(kind === "media" ? media : image).test(candidate)) return null;
  try {
    const url = new URL(candidate, origin);
    return url.origin === new URL(origin).origin ? url.pathname : null;
  } catch {
    return null;
  }
}

/** Return metadata for an admitted track, never a third-party playback URL. */
export function playbackBinding(track, origin, editionPoster = null, mediaBasePrefix = "/") {
  const fallback = sameOriginPath(editionPoster, origin, "image");
  if (!track || track.publicReleaseAuthorized !== true) {
    return { state: "unreleased", media: null, poster: fallback };
  }
  const media = sameOriginPath(track.media, origin, "media", mediaBasePrefix);
  const poster = sameOriginPath(track.poster, origin, "image") || fallback;
  return media ? { state: "ready", media, poster }
               : { state: "unavailable", media: null, poster };
}

/** Hash-only page state is not crawler-visible: social images need an actual static route. */
export function socialImageURL(publicPageURL, posterPath) {
  try {
    const page = new URL(publicPageURL);
    if (page.protocol !== "https:" || page.hash) return null;
    const path = sameOriginPath(posterPath, page.origin, "image");
    return path ? new URL(path, page.origin).href : null;
  } catch {
    return null;
  }
}
