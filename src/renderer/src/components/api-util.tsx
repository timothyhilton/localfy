const proxyUrl = 'https://nmukb92alf.execute-api.ap-southeast-2.amazonaws.com/localfy'

async function refreshToken(): Promise<string | null> {
  const refreshToken = await window.api.getSetting('refresh_token')
  const clientId = await window.api.getSetting('client_id')
  
  if (!refreshToken) return null;

  const useProxy = await window.api.getSetting("useProxy");

  if (useProxy) {
    const res = await fetch(`${proxyUrl}/?token=${refreshToken}&subdomain=api/token&refresh_token=${refreshToken}&client_id=${clientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!res.ok) {
      console.error('Failed to refresh token:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    console.log('Refreshed token data:', data);

    await window.api.setSetting({setting: 'token', value: data.access_token});
    await window.api.setSetting({setting: 'refresh_token', value: data.refresh_token});
    return data.access_token;
  } else {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    await window.api.setSetting({setting: 'token', value: data.access_token})
    await window.api.setSetting({setting: 'refresh_token', value: data.refresh_token})
    return data.access_token;
  }
}

export async function callSpotifyApi(subdomain: string) {
  let token = await window.api.getSetting('token');
  
  const makeRequest = async () => {
    if (await window.api.getSetting("useProxy")) {
      const res = await fetch(`${proxyUrl}/?token=${token}&subdomain=${subdomain}`);
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      return res.json();
    } else {
      const res = await fetch(`https://api.spotify.com/${subdomain}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      return res.json();
    }
  };

  try {
    return await makeRequest();
  } catch (error) {
    // If the request fails, try refreshing the token
    token = await refreshToken();
    if (!token) throw new Error('Failed to refresh token');

    // Retry the request with the new token
    return await makeRequest();
  }
}

export async function isUserLoggedIn(): Promise<boolean> {
  let token = await window.api.getSetting('token');
  console.log('Initial token:', token);

  if (!token) {
    token = await refreshToken();
    console.log('Refreshed token:', token);
  }

  try {
    await callSpotifyApi('v1/me');
    return true;
  } catch (error) {
    return false;
  }
}