/*	REDDIT API
==============================================================*/
var Settings = {
	numPosts: 25,
	sortBy: 'new'
};

var Reddit = {
	after: [],
	subreddit: ''
};

/*	APP
==============================================================*/
angular.module('app', ['ngRoute', 'filters']);


/*	Filters
==============================================================*/
angular.module('filters', [])
	.filter('timeago', function () {
        return function(timestamp) {
    		return jQuery.timeago(new Date(timestamp*1000));
    	}
    });

/*	Controllers
==============================================================*/
function FrontPage($scope, $http, $sce) {
	$scope.posts = [];

	/*	Data
	==============================================================*/

	$scope.getPage = function() {
		var url;
		if (!Reddit.subreddit) {
			url = "http://www.reddit.com/.json?&limit=" + Settings.numPosts + "&sort=" + Settings.sortBy + "&after=" + Reddit.after[Reddit.after.length -1];
		} else {
			url = "http://www.reddit.com/r/" + $scope.subreddit + "/.json?limit=" + Settings.numPosts + "&sort=" + Settings.sortBy + "&after=" + Reddit.after[Reddit.after.length -1];
		}

		$http.get(url)
			.success(function(data, status, headers, config){
				$scope.parseData(data);
			})
			.error(function(data, status, headers, config){
				console.log(data);
			});
	}

	$scope.getPage();

	$scope.findSub = function() {
		Reddit.after = [];
		Reddit.subreddit = $scope.subreddit;
		$scope.disablePreviousButton();
		$scope.getPage();
	}

	$scope.parseData = function(data) {
		Reddit.after.push(data.data.after);
		var posts = data.data.children;
		angular.forEach(posts, function(post){
			$scope.getPostType(post);
		});
		$scope.posts = posts;
	}

	$scope.getPostType = function(post) {
		var url = post.data.url,
			extension = url.split(".")[url.split(".").length - 1],
			type = '';
		if (/jpg|png|gif|bmp/.test(extension)) type = 'image';
		else if (/imgur.com\/a/.test(url)) type = 'imguralb';
		else if (/imgur.com/.test(url)) type = 'imgur';
		else if (post.data.selftext) type = 'text';
		else if (/youtube.com/.test(url) || /youtu.be/.test(url) || /vimeo/.test(url)) {
			type = 'video';
			post.data.url = $sce.trustAsResourceUrl($scope.makeEmbedable(post.data.url));
			// post.data.url = $sce.trustAsHtml(post.data.secure_media_embed.content);
		}
		else type = 'oembed';
		post.data.type = type;
	}

	$scope.makeEmbedable = function(url) {
		if (/youtube.com/.test(url)) {
			return 'http://www.youtube.com/embed/' + url.split('v=')[1];
		} 
		else if (/youtu.be/.test(url)) {
			return 'http://www.youtube.com/embed/' + url.split('/')[url.split('/').length - 1];	
		}
		else if (/vimeo.com/.test(url)) {
			return 'http://player.vimeo.com/video/' + url.split('/')[url.split('/').length - 1];
		}
	}

	/*	Navigation
	==============================================================*/

	$scope.nextPage = function() {
		$scope.getPage();
		$('#previous').removeClass('disabled');
	}

	$scope.previousPage = function() {
		Reddit.after.pop();
		Reddit.after.pop();
		if (Reddit.after.length == 0) $scope.disablePreviousButton();
		$scope.getPage();
	}

	$scope.disablePreviousButton = function() {
		$('#previous').addClass('disabled')
	}

	$scope.loadComments = function(permalink) {
		$scope.$broadcast('loadComments', permalink);
	}
}


function Comments($scope, $http) {
	$scope.meta = [];
	$scope.comments = [];

	$scope.$on('loadComments', function(e, permalink) {
		var winH = $(window).height(),
			navH = $('#nav').height(),
			commentsUrl = 'http://www.reddit.com' + permalink + '.json?&sort=best';
		
		$('#comments').css('height', winH-navH).addClass('showing');

		$http.get(commentsUrl)
			.success(function(data, status, headers, config){
				$scope.parseComments(data);
				$('.loader').remove();
			})
			.error(function(data, status, headers, config){
				console.log(data);
			});
	});

	$scope.parseComments = function(data) {
		var comments = data[1].data.children;
		// angular.foreach(comments, function(comment) {
		// 	comment.replies = comment.replies.data.children;
		// });
		$scope.meta = data[0].data.children[0].data;
		$scope.comments = comments;
		console.log($scope.comments);
	}

	$scope.closeComments = function() {
		$('#comments').removeClass('showing');
	}
	
}