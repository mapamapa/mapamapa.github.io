// Recibe el formulario de contacto y crea/actualiza el contacto en emBlue.
// La API key vive solo en la variable de entorno EMBLUE_API_KEY (configurada en Netlify),
// nunca en el código del navegador.

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.EMBLUE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'EMBLUE_API_KEY no configurada' }), { status: 500 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), { status: 400 });
  }

  const { name, email, message } = data;
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), { status: 400 });
  }

  const embResponse = await fetch('https://api.embluemail.com/v2.3/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          email,
          // TODO: reemplazar por los nombres reales de los campos personalizados
          // configurados en emBlue (Contactos > Campos personalizados).
          personalizedField1: name,
          personalizedField2: message,
        },
      ],
    }),
  });

  if (!embResponse.ok) {
    const errorText = await embResponse.text();
    return new Response(JSON.stringify({ error: 'emBlue error', detail: errorText }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
