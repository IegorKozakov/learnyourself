;
(function(window, $, _){
    LY.namespace('API.Youtube');

    LY.API.Youtube = (function() {
        var KEY = 'AIzaSyA3EWqvGw1-S-67J9kUwSYqK0ZZmY4beDo',
            URI = {
                playlists: 'https://www.googleapis.com/youtube/v3/playlists',
                channels: 'https://www.googleapis.com/youtube/v3/channels',
                playlistItems: 'https://www.googleapis.com/youtube/v3/playlistItems'
            }

        function _prepareCollection(data, initialCollection) {
            var collection = [],
                course = {};

            _.each(data.items, function(item) {
                var course = {
                    id: item.id,
                    lessonCount: item.contentDetails.itemCount,
                    title: item.snippet.title,
                    channelId: item.snippet.channelId,
                    description: item.snippet.description,
                    publishedAt: item.snippet.publishedAt,
                    channelTitle: item.snippet.channelTitle
                }

                _.each(initialCollection, function(initialCourse) {
                    if(item.id === initialCourse.id) {
                        course.lang = initialCourse.lang;
                    }
                });

                collection.push(course);
            });

            return collection;
        }

        function _prepareChannelInfo(channel) {
            return {
                channelLogo: channel.items[0].snippet.thumbnails.high.url,
                channelDescription: channel.items[0].snippet.description,
                channelViewCount: channel.items[0].statistics.viewCount,
                channelSubscriberCount: channel.items[0].statistics.subscriberCount
            }
        }

        function _prepareLessons(playlistItems) {
            var lessons = [];

            _.each(playlistItems.items, function(item) {
                var lesson = {
                    title: item.snippet.title,
                    position: item.snippet.position,
                    videoId: item.contentDetails.videoId,
                    description: item.snippet.description,
                };

                lessons.push(lesson);
            });

            return lessons;
        }

        return {
            setCourses: function() {
                var defer = $.Deferred(),
                    initialCollection = [],
                    params = {
                        key: KEY,
                        part: 'snippet, contentDetails',

                    };

                if( LY.courses === undefined ) {
                    $.getJSON(LY.Helpers.getPathToData()).then(function(data) {
                        initialCollection = data;
                        params.id =  _.pluck(data, 'id').join(',');

                        return $.ajax(URI.playlists , { data: params });
                    }).then(function(data) {
                        var collection = _prepareCollection(data, initialCollection);

                        LY.courses = new LY.Collections.Courses(collection);
                        LY.courses.original = LY.courses.clone();

                        defer.resolve(LY.courses);
                    })
                } else {
                    defer.resolve(LY.courses);
                }

                return defer.promise();
            },
            setChannel: function(model, channelId) {
                var defer = $.Deferred(),
                    params = {
                        key: KEY,
                        maxResults: 50,
                        part: 'statistics, snippet',
                        id: channelId
                    };

                if(model.get('channelDescription') === undefined) {
                    $.ajax(URI.channels, { data: params }).then(function(channel) {
                        model.set(_prepareChannelInfo(channel));
                        defer.resolve(LY.courses);
                    })
                } else {
                    defer.resolve(LY.courses);
                }

                return defer.promise();
            },
            setPlaylistItems: function(model, playlistsId) {
                var defer = $.Deferred(),
                    params = {
                        key: KEY,
                        maxResults: 50,
                        part: 'contentDetails, snippet',
                        playlistId: playlistsId
                    };

                if(model.get('lessons') === undefined) {
                    $.ajax(URI.playlistItems, { data: params }).then(function(lessons) {
                        model.set('lessons', _prepareLessons(lessons));
                        defer.resolve(LY.courses);
                    });
                } else {
                    defer.resolve(LY.courses);
                }

                return defer.promise();
            }
        }
    }());
}(window, jQuery, _));