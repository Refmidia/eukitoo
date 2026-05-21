(function () {
  const cfg = window.PRESS_KIT_CONFIG;
  if (!cfg) return;

  document.querySelectorAll("[data-platform]").forEach((el) => {
    const key = el.getAttribute("data-platform");
    const url = cfg.platforms?.[key];
    if (url) {
      el.href = url;
      el.removeAttribute("aria-disabled");
    }
  });

  applyMediaEmbeds(cfg.media);
  initInstagramLive(cfg.instagram, cfg.media?.heroPhoto);

  initBackgrounds(cfg.backgrounds);

  initPkNav();
})();

function initPkNav() {
  const items = document.querySelectorAll(".pk-nav-item");
  const sections = ["musica", "bio", "contatos"];

  const setActive = (id) => {
    items.forEach((el) => {
      el.classList.toggle("pk-nav-item--active", el.dataset.pk === id);
    });
  };

  items.forEach((el) => {
    el.addEventListener("click", () => setActive(el.dataset.pk));
  });

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

function initBackgrounds(backgrounds) {
  if (!backgrounds) return;

  if (backgrounds.hero) {
    document.documentElement.style.setProperty("--hero-bg", `url("${backgrounds.hero}")`);
  }

  Object.entries(backgrounds).forEach(([id, url]) => {
    if (id === "hero" || !url) return;
    const section = document.getElementById(id);
    if (section) {
      section.classList.add("section--bg");
      section.style.setProperty("--section-bg", `url("${url}")`);
    }
  });
}

function formatInstagramCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const rounded = m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
    return `+${String(rounded).replace(".", ",")}M`;
  }
  if (n >= 10_000) return `${Math.round(n / 1000)} mil`;
  if (n >= 1_000) {
    const mil = Math.round((n / 1000) * 10) / 10;
    return Number.isInteger(mil) ? `${mil} mil` : `${String(mil).replace(".", ",")} mil`;
  }
  return String(n);
}

function applyInstagramFallback(instagram, mediaHeroPhoto) {
  const photo = document.getElementById("hero-photo");
  const followers = document.getElementById("hero-stat-followers");
  const posts = document.getElementById("hero-stat-posts");
  const streams = document.getElementById("hero-stat-streams");

  const photoSrc = instagram?.profilePhoto || mediaHeroPhoto;
  if (photo && photoSrc) {
    photo.src = photoSrc;
    photo.alt = `${instagram?.username || "kito"} — foto de perfil`;
  }
  if (followers && instagram?.followers != null) {
    followers.textContent = String(instagram.followers);
  }
  if (posts && instagram?.posts != null) {
    posts.textContent = String(instagram.posts);
  }
  if (streams && instagram?.streams) {
    streams.textContent = instagram.streams;
  }
}

async function initInstagramLive(instagram, mediaHeroPhoto) {
  applyInstagramFallback(instagram, mediaHeroPhoto);
  if (!instagram) return;

  try {
    const res = await fetch("/api/instagram");
    const data = await res.json();
    if (!res.ok || !data.configured || data.error) return;

    const photo = document.getElementById("hero-photo");
    if (photo && data.profilePicture) {
      photo.src = data.profilePicture;
      photo.alt = `@${data.username || instagram.username} — foto de perfil no Instagram`;
    }

    const followers = document.getElementById("hero-stat-followers");
    if (followers && data.followers != null) {
      const formatted = formatInstagramCount(data.followers);
      if (formatted) followers.textContent = formatted;
    }

    const postsEl = document.getElementById("hero-stat-posts");
    if (postsEl && data.posts != null) {
      postsEl.textContent = String(data.posts);
    }
  } catch {
    /* mantém valores do config.js */
  }
}

function applyMediaEmbeds(media) {
  if (!media) return;
  initYouTubeVideos(media);
  initSpotifyEmbed(media);
}

function initSpotifyEmbed(media) {
  const artistId = media?.spotifyArtistId;
  const latest = media?.spotifyLatest || media?.spotifyAlbums?.[0];
  const openBtn = document.getElementById("spotify-open-app");

  if (openBtn) {
    if (latest?.id) {
      openBtn.href = `https://open.spotify.com/album/${latest.id}`;
    } else if (artistId) {
      openBtn.href = `https://open.spotify.com/intl-pt/artist/${artistId}`;
    }
  }

  if (latest) {
    const titleEl = document.getElementById("spotify-latest-title");
    const badgeEl = document.getElementById("spotify-latest-badge");
    const iframe = document.getElementById("spotify-latest-embed");

    if (titleEl) titleEl.textContent = latest.title;
    if (badgeEl) {
      badgeEl.textContent = [latest.type, latest.year].filter(Boolean).join(" · ");
    }
    if (iframe) {
      iframe.src = `https://open.spotify.com/embed/album/${latest.id}?utm_source=presskit&theme=0`;
      iframe.title = `${latest.title} — kito no Spotify`;
      iframe.height = String(latest.height || 420);
    }
  }

  if (window.location.protocol === "file:") {
    const hint = document.getElementById("spotify-file-hint");
    if (hint) hint.hidden = false;
  }
}

function buildYouTubeEmbedUrl(videoId, options = {}) {
  const params = new URLSearchParams({
    playsinline: "1",
    modestbranding: "1",
    iv_load_policy: "3",
    rel: "0",
    controls: "1",
  });

  if (options.autoplay) {
    params.set("autoplay", "1");
    params.set("mute", "1");
  }

  if (window.location.origin && window.location.origin !== "null") {
    params.set("origin", window.location.origin);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function createYouTubeIframe(src, title) {
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.title = title;
  iframe.width = "560";
  iframe.height = "315";
  iframe.setAttribute("frameborder", "0");
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.loading = "eager";
  return iframe;
}

function initYouTubeVideos(media) {
  const container = document.getElementById("youtube-videos");
  if (!container) return;

  const videos = media.youtubeVideos?.length
    ? media.youtubeVideos
    : media.youtubeVideoId
      ? [{ id: media.youtubeVideoId, title: "kito", autoplay: true, mute: true }]
      : [];

  if (!videos.length) return;

  const featuredId = container.querySelector(".youtube-player--featured iframe")?.src?.match(
    /embed\/([^?]+)/
  )?.[1];

  videos.forEach((video) => {
    if (featuredId && video.id === featuredId) return;

    const wrap = document.createElement("div");
    wrap.className = "youtube-player";
    wrap.appendChild(
      createYouTubeIframe(
        buildYouTubeEmbedUrl(video.id, { autoplay: false }),
        video.title || "kito — YouTube"
      )
    );
    container.appendChild(wrap);
  });
}
