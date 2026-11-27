import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token,
        }),
    });

    const token = await response.json();
    if (!token.access_token) {
        // Shows up in the Vercel function logs. The usual cause is a revoked or expired refresh token.
        console.error('Spotify did not return an access token:', response.status, token.error, token.error_description);
    }
    return token;
};

export const getNowPlaying = async () => {
    const { access_token } = await getAccessToken();

    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        // Next.js caching: revalidate every 30 seconds
        next: { revalidate: 30 }
    });
};

const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

export const getTopTracks = async () => {
    const { access_token } = await getAccessToken();

    return fetch(`${TOP_TRACKS_ENDPOINT}?time_range=short_term&limit=5`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        next: { revalidate: 3600 }
    });
};
