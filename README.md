# Localfy

Localfy is an Electron app that allows you to make a local mp3 backup of your Spotify music library.

## What's the difference to a "Spotify Downloader"?

Via a syncing (rather than just downloading) based approach, it's designed to make it easy to keep your "backups" up-to-date whenever you make changes to your playlists or library.

If you add/remove songs to your playlists, just open Localfy again and you can re-sync your backed up items in their current form.

## Features

- Backup your Spotify playlists, saved albums, and recently played tracks
- Optional ability to save metadata (such as album artwork and artists)
- Customizable settings for backup preferences
- Dark mode

## Limitations

- The audio stream for songs is sourced from YouTube; very occasionally the wrong audio may be downloaded (such as a music video rather than an audio video). This is quite rare in my experience, however.

- You must make your own Spotify API Client ID as it is unlikely Spotify will approve of this app. Add "fyfy://redirect" as a redirect uri.

## A Note on Copyright

Please use this for legal purposes. In some jurisdictions, your usage of Localfy could break the law. Please consult your own legislation on free-use, and keep the backups for personal use.

Localfy does not break DRM.
