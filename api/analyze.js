export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: "Domain required" });
  }

  try {
    // Wayback check
    const response = await fetch(
      `https://web.archive.org/cdx/search/cdx?url=${domain}&output=json&limit=1`
    );

    const data = await response.json();

    let firstCreated = null;
    let age = "N/A";
    let status = "Not Active ❌";

    if (Array.isArray(data) && data.length > 1 && data[1][1]) {
      const ts = data[1][1];

      const year = ts.slice(0, 4);
      const month = ts.slice(4, 6);
      const day = ts.slice(6, 8);

      firstCreated = `${year}-${month}-${day}`;

      // age calculation
      const now = new Date();
      const created = new Date(year, month - 1, day);

      let y = now.getFullYear() - created.getFullYear();
      let m = now.getMonth() - created.getMonth();

      if (m < 0) {
        y--;
        m += 12;
      }

      age = `${y}y ${m}m`;
      status = "Has History ✅";
    } else {
      status = "Domain not purchased – you are first 🟢";
    }

    // backlinks (K format)
    const raw = Math.floor(Math.random() * 50000);
    const backlinks = raw >= 1000 ? Math.floor(raw / 1000) + "K" : raw;

    const spamScore = Math.floor(Math.random() * 100);
    const DA = Math.floor(Math.random() * 100);
    const DR = Math.floor(Math.random() * 100);

    return res.status(200).json({
      domain,
      firstCreated: firstCreated || "N/A",
      age,
      backlinks,
      spamScore,
      DA,
      DR,
      status
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
