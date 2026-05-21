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

  const heroPhoto = document.querySelector(".hero-photo");
  if (heroPhoto && cfg.media?.heroPhoto) heroPhoto.src = cfg.media.heroPhoto;

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

function applyMediaEmbeds(media) {
  if (!media) return;
  initYouTubeVideos(media);
  const sp = document.getElementById("spotify-embed");
  if (sp && media.spotifyArtistId) {
    sp.src = `https://open.spotify.com/embed/artist/${media.spotifyArtistId}?utm_source=generator&theme=0`;
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
