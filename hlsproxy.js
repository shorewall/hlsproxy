addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Verifica se il manifest è richiesto (modifica l'URL se necessario)
  if (url.pathname.endsWith('.m3u8')) {
    const response = await fetch(request)
    const text = await response.text()

    // Riscrivi tutti gli URL relativi nel manifest
    const newText = text.replace(/(\/[^"]+\.ts)/g, (match) => {
      return `https://${url.hostname}${match}`
    })

    // Crea una nuova risposta con il testo modificato
    return new Response(newText, {
      headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
    })
  }

  // Passa la richiesta al server di origine se non è un manifest
  return fetch(request)
}
