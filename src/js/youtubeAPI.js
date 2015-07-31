;
(function(window, $, Handlebars, _){
    LY.namespace('API.YoutubeT');

    LY.API.YoutubeT = (function() {
        var KEY = 'AIzaSyA3EWqvGw1-S-67J9kUwSYqK0ZZmY4beDo',
            urls = {
                MAIN: 'https://www.googleapis.com/youtube/v3/',
                PLAYLISTS: 'playlists',
                PLAYLIST_ITEMS: 'playlistItems'
            };

        function _removeWhiteSpace(str) {
            return str.replace(/ /g, '');
        }

        function _getCommonPartOfRequest(o, part, maxRes) {
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

            return urls.MAIN + obj + '?'+ 'key=' + KEY + '&part='  + part + '&maxResults=' + maxRes;
        }

        function _getRequestUrlPlaylists(part, palylistsId) {

        }

        function _loadPlaylists(courses) {
            console.log(courses);
        }

        return {
            loadPlaylists: function() {
                var getData = $.getJSON( LY.Helpers.getPathToData() ),
                    loadPlaylists = getData.then(function( data ) {
                        var playlistsId = '';

                        _.each(data, function(el, i, list) {
                            playlistsId += el.playlistId;
                            if (i !== (list.length - 1) ) {
                                playlistsId += ',';
                            }
                        })

                        return $.ajax( 'https://www.googleapis.com/youtube/v3/playlists', { data: { part: 'snippet', id: playlistsId, key: KEY } } );
                    }),
                    loadChannelsDetails = loadPlaylists.then( function( data ) {
                        var channelsId = '';
                        
                        _.each(data.items, function(el, i, list) {
                            channelsId += el.snippet.channelId;
                            if (i !== (list.length - 1) ) {
                                channelsId += ',';
                            }
                        })

                        return $.ajax( 'https://www.googleapis.com/youtube/v3/channels', { data: { part: 'snippet', id: channelsId, key: KEY } } );
                    });

                    loadChannelsDetails.done(function( data ) {
                        console.log(data);
                    });

               // $.when( $.getJSON( LY.Helpers.getPathToData() ) ).then( _loadPlaylists ).then( myFunc );
               // $.when(LY.Helpers.getLocalDate()).done( function(a) {  LY.API.YoutubeT } );
                // LY.Helpers.getLocalDate().done(function(response) {
                //     console.log(response);
                // })
            }
        }
    }());




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

            return urls.MAIN + obj + '?'+ 'key=' + KEY + '&part='  + part + '&maxResults=' + maxRes;
        }

        return {
            getRequestUrlPlayLists: function(part, playlistsId, maxResults) {
                var idPLs = removeWhiteSpace(playlistsId),
                    partChecked = encodeURIComponent( removeWhiteSpace(part) );
                    commonPartOfRequest = getCommonPartOfRequest('playlists', partChecked, maxResults);

                return commonPartOfRequest + '&id=' + encodeURIComponent( removeWhiteSpace(idPLs) );
            },
            getRequestUrlPlayListItems: function(part, playlistId) {
                var partChecked = encodeURIComponent( removeWhiteSpace(part) ),
                    commonPartOfRequest = getCommonPartOfRequest('playlistItems', partChecked);

                return commonPartOfRequest + '&playlistId=' + playlistId;
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