/**
 * Atualiza foto, seguidores e posts via Instagram Graph API (conta Profissional).
 *
 * Variáveis na Vercel (Settings → Environment Variables):
 *   INSTAGRAM_ACCESS_TOKEN — token de longa duração
 *   INSTAGRAM_USER_ID — ID numérico da conta Instagram Business/Creator
 *
 * Como obter: developers.facebook.com → app → Instagram Graph API
 * (conta @eukitoo precisa ser Criador ou Empresa ligada a uma Página do Facebook)
 */

const FIELDS = "username,profile_picture_url,followers_count,media_count";
const CACHE = "s-maxage=3600, stale-while-revalidate=86400";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", CACHE);

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    return res.status(503).json({
      configured: false,
      message: "Instagram API não configurada na Vercel.",
    });
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${userId}?fields=${FIELDS}&access_token=${encodeURIComponent(token)}`;
    const apiRes = await fetch(url);
    const data = await apiRes.json();

    if (!apiRes.ok || data.error) {
      return res.status(502).json({
        configured: true,
        error: data.error?.message || "Erro ao consultar Instagram.",
      });
    }

    return res.status(200).json({
      configured: true,
      username: data.username,
      profilePicture: data.profile_picture_url,
      followers: data.followers_count,
      posts: data.media_count,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      configured: true,
      error: err.message || "Falha na requisição.",
    });
  }
};
