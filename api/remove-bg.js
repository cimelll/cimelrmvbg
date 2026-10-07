export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method not allowed"
    });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "gambar belum dikirim"
      });
    }

    return res.status(200).json({
      ok: true,
      message: "gambar berhasil diterima"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
