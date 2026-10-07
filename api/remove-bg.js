export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "REMOVE_BG_API_KEY belum terbaca di Vercel",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const form = await request.formData();
    const image = form.get("image");

    if (!image) {
      return new Response(
        JSON.stringify({
          error: "gambar belum dikirim",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const removeBgForm = new FormData();

    removeBgForm.append("image_file", image);
    removeBgForm.append("size", "auto");
    removeBgForm.append("format", "png");

    const response = await fetch(
      "https://api.remove.bg/v1.0/removebg",
      {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: removeBgForm,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return new Response(
        JSON.stringify({
          error: "remove.bg menolak permintaan",
          detail: errorText,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const imageData = await response.arrayBuffer();

    return new Response(imageData, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "inline",
        "Cache-Control": "no-store",
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "server error",
        detail: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
      }
