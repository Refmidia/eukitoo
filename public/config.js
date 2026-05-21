/**
 * Press Kit — kito (@eukitoo)
 */
const PRESS_KIT_CONFIG = {
  artist: "kito",
  handle: "@eukitoo",

  /**
   * Instagram — valores abaixo aparecem se a API na Vercel não estiver configurada.
   * Com API ativa, foto / seguidores / posts atualizam sozinhos (~1h de cache).
   */
  instagram: {
    username: "eukitoo",
    profilePhoto: "assets/perfil.jpg",
    followers: "90 mil",
    posts: 127,
    streams: "+2M",
  },

  platforms: {
    instagram: "https://www.instagram.com/eukitoo",
    tiktok: "https://www.tiktok.com/@eukitoo",
    youtube: "https://www.youtube.com/channel/UCgjlKWClQn52XYmi7VcxFAA",
    apple: "https://music.apple.com/br/artist/kito/1691542015",
    deezer: "https://www.deezer.com/us/artist/216840205",
    tidal: "https://tidal.com/artist/41143989",
    amazon:
      "https://music.amazon.com/artists/B0CDHP7CRR/kito?marketplaceId=ATVPDKIKX0DER&musicTerritory=US",
    spotify: "https://open.spotify.com/intl-pt/artist/618jWwZQ91mDQdkrbG2Qcb",
    linktree: "https://linktr.ee/kitoreal",
  },

  media: {
    spotifyArtistId: "618jWwZQ91mDQdkrbG2Qcb",
    /**
     * Lançamento exibido no site = só o primeiro da lista (mais recente no topo).
     * Ao lançar algo novo: cole o novo álbum/EP aqui em cima e faça deploy.
     */
    spotifyLatest: {
      id: "68s7bZwqqqbgkQkmjdrV7f",
      title: "Confessions Missing Tracks",
      type: "EP",
      year: "2026",
      height: 420,
    },
    heroPhoto: "assets/perfil.jpg",
    /** Canal: https://www.youtube.com/channel/UCgjlKWClQn52XYmi7VcxFAA */
    youtubeChannelId: "UCgjlKWClQn52XYmi7VcxFAA",
    /**
     * Só vídeos do kito — cole o ID de cada URL (watch?v=XXXX)
     * rel=0 no player evita sugerir vídeos de outros artistas
     */
    youtubeVideos: [
      { id: "6cdfkMOUKlw", title: "kito", autoplay: true, mute: true },
      { id: "z-wUE4MmAzc", title: "Céu Nublado feat. yoshi" },
    ],
  },

  /** Fundos por seção (fotos em assets/) */
  backgrounds: {
    hero: "assets/kito-11.jpg",
    musica: "assets/kito-11.jpg",
    bio: "assets/kito-04.jpg",
    contatos: "assets/kito-08.jpg",
  },

  /** Fotos em assets/ (kito-01.jpg …) */
  gallery: [
    "assets/kito-01.jpg",
    "assets/kito-02.jpg",
    "assets/kito-03.jpg",
    "assets/kito-04.jpg",
    "assets/kito-05.jpg",
    "assets/kito-06.jpg",
    "assets/kito-07.jpg",
    "assets/kito-08.jpg",
    "assets/kito-09.jpg",
    "assets/kito-10.jpg",
    "assets/kito-11.jpg",
    "assets/kito-12.jpg",
    "assets/kito-13.jpg",
  ],
};
