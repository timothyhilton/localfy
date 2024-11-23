const proxyUrl = 'https://nmukb92alf.execute-api.ap-southeast-2.amazonaws.com/localfy'

export async function callSpotifyApi(subdomain: string) {
  const token = await window.api.getSetting('token')
  
  if (await window.api.getSetting("useProxy")) {
    const res = await fetch(`${proxyUrl}/?token=${token}&subdomain=${subdomain}`)
    if (!res.ok) {
      throw new Error('Failed to fetch albums')
    }

    return res.json()
  } else {
    const res = await fetch(`https://api.spotify.com/${subdomain}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch albums')
    }

    return res.json()
  }
}

export async function isUserLoggedIn(): Promise<boolean> {
  const token = await window.api.getSetting('token')
  return token != ""
}