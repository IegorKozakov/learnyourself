;
(function(window, $, Handlebars, _){
    LY.namespace('YoutubeAPI');

    LY.YoutubeAPI = {
        KEY: 'AIzaSyA3EWqvGw1-S-67J9kUwSYqK0ZZmY4beDo',
        urls: {
            MAIN: 'https://www.googleapis.com/youtube/v3/',
            PLAYLISTS: 'playlists',
            PLAYLIST_ITEMS: 'playlistItems'
        },
        getPlaylistItems: function(playlistId) {
            var requestUrl = this.urls.MAIN + this.urls.PLAYLIST_ITEMS + '?part=snippet&maxResults=50' + '&playlistId=' + playlistId + '&key=' + this.KEY;

            $.getJSON(requestUrl).done(function(data) {
                console.log(data);
            })
        }
    }
}(window, jQuery, Handlebars, _));