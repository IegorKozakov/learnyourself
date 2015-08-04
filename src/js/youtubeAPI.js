;
(function(window, $, _){
    LY.namespace('API.Youtube');

    LY.API.Youtube = (function() {
        var KEY = 'AIzaSyA3EWqvGw1-S-67J9kUwSYqK0ZZmY4beDo',
            collection = {};

        return {
            setCoursesPreviewData: function() {
                var defer = $.Deferred();

                if( LY.courses === undefined ) {
                    $.getJSON(LY.Helpers.getPathToData()).then(function(data) {
                        var params = {
                            key: KEY,
                            part: 'snippet, contentDetails',
                            id: _.pluck(data, 'id').join(',')
                        };

                        collection = data;

                        return $.ajax('https://www.googleapis.com/youtube/v3/playlists', { data: params });
                    }).then(function(data) {
                        _.each(data.items, function(item, i) {
                            _.each(collection, function(collectionItem) {
                                if( collectionItem.id === item.id ) {

                                    collectionItem.title = item.snippet.title;
                                    collectionItem.lessonsCount = item.contentDetails.itemCount;
                                    collectionItem.publishedAt = item.snippet.publishedAt;
                                    collectionItem.description = item.snippet.description;

                                    collectionItem.channel = {
                                        id: item.snippet.channelId,
                                        title: item.snippet.channelTitle
                                    }
                                }
                            })
                        });

                        LY.courses = new LY.Collections.Courses(collection);
                        LY.courses.original = LY.courses.clone();

                        defer.resolve(LY.courses);
                    })
                } else {
                    defer.resolve(LY.courses);
                }

                return defer.promise();
            },
            getChannel: function(channelId) {
                var params = {
                    key: KEY,
                    id: channelId,
                    maxResults: 50,
                    part: 'statistics, snippet'
                };
                

                return $.ajax('https://www.googleapis.com/youtube/v3/channels', { data: params });
            },
            getPlaylistItems: function(playlistsId) {
                var params = {
                    key: KEY,
                    part: 'contentDetails, snippet',
                    playlistId: playlistsId
                };

                return $.ajax('https://www.googleapis.com/youtube/v3/playlistItems', { data: params });
            }

        }
    }());
}(window, jQuery, _));