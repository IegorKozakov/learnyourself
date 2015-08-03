;
(function(window, $, Handlebars, _){
    LY.namespace('API.YoutubeT');

    LY.API.YoutubeT = (function() {
        var KEY = 'AIzaSyA3EWqvGw1-S-67J9kUwSYqK0ZZmY4beDo',
            urls = {
                MAIN: 'https://www.googleapis.com/youtube/v3/',
                PLAYLISTS: 'playlists',
                PLAYLIST_ITEMS: 'playlistItems'
            },
            collection = {};


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

        return {
            getCollection: function() {
                return collection;
            },
            loadData: function() {
                var getBasicData = $.getJSON( LY.Helpers.getPathToData() ),
                    loadPlaylists = getBasicData.then(function( data ) {
                        var playlistsId = '',
                            params = {
                                key: KEY,
                                part: 'snippet'
                            };

                        collection = data;

                        _.each(collection, function(item, i, list) {
                            playlistsId += item.playlistId;
                            item.id = i;

                            if (i !== (list.length - 1) ) {
                                playlistsId += ',';
                            }
                        });

                        params.id = playlistsId;

                        return $.ajax('https://www.googleapis.com/youtube/v3/playlists',{ data: params } );
                    }),
                    loadChannelsDetails = loadPlaylists.then( function( data ) {
                        var channelsId = '',
                            params = {
                                key:KEY,
                                part: 'statistics, snippet'
                            };

                        _.each(data.items, function(item, i, list) {
                            channelsId += item.snippet.channelId;

                            if (i !== (list.length - 1) ) {
                                channelsId += ',';
                            }

                            _.each(collection, function(plItem, plIndex) {
                                if( plItem.playlistId === item.id) {
                                    plItem.title = item.snippet.title;
                                    plItem.publishedAt = item.snippet.publishedAt;
                                    plItem.description = item.snippet.description;

                                    plItem.channel = {
                                        id: item.snippet.channelId,
                                        title: item.snippet.channelTitle,
                                    }
                                }
                            });
                        });

                        params.id = channelsId;

                        return $.ajax( 'https://www.googleapis.com/youtube/v3/channels', { data: params });
                    });

                    loadChannelsDetails.done(function( data ) {

                        _.each(data.items, function(item, i) {

                        });
                        console.log(data);
                        console.log(collection);
                    });
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