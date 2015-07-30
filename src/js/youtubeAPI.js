;
(function(window, $, Handlebars, _){
    LY.namespace('YoutubeAPI');
    LY.namespace('YoutubeAPItest');

    LY.YoutubeAPItest = (function() {
        var KEY = 'AIzaSyA3EWqvGw1-S-67J9kUwSYqK0ZZmY4beDo',
            urls = {
                MAIN: 'https://www.googleapis.com/youtube/v3/',
                PLAYLISTS: 'playlists',
                PLAYLIST_ITEMS: 'playlistItems'
            };

        function removeWhiteSpace(str) {
            return str.replace(/ /g, '');
        }

        function getCommonPartOfRequest(o, part, maxRes) {
            var obj = '',
                maxRes = maxRes || 50;

            switch(o){
                case 'playlists':
                    obj = urls.PLAYLISTS;
                    break;
                case 'playlistItems':
                    obj = urls.PLAYLIST_ITEMS;
                    break;
                default:
                    return false
                    break;
            }

            return urls.MAIN + obj + '?'+ 'key=' + KEY + '&part='  + part + '&maxResult=' + maxRes;
        }

        return {
            getRequestUrlPlayLists: function(part, idPlaylists, maxResults) {
                var idPLs = removeWhiteSpace(idPlaylists),
                    partChecked = encodeURIComponent( removeWhiteSpace(part) );
                    commonPartOfRequest = getCommonPartOfRequest('playlists', partChecked, maxResults);

                return commonPartOfRequest + '&id=' + encodeURIComponent( removeWhiteSpace(idPLs) );
            },
            getRequestUrlPlayListItems: function() {

            }
        }
    }());

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
    };
}(window, jQuery, Handlebars, _));