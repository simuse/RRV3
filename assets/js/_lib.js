/*	Prototype
==============================================================*/

/** 
 * Get the smallest number in array
 */
Array.prototype.min = function() {
    return Math.min.apply(Math, this);
};

/** 
 * Get the biggest number in array
 */
Array.prototype.max = function() {
    return Math.max.apply(Math, this);
};

/** 
 * Get the average of an array
 */
Array.prototype.average = function() {
    var l = this.length,
        sum = 0;
    if (l) {
        for (var i = l - 1; i >= 0; i--) {
            sum += this[i]
        }
        return Math.round(sum / l);
    }
};

/*	Various
==============================================================*/

function scrollToTop() {
    window.scrollTo(0, 0);
}

/** 
 * Unescape html tags
 */
function unescape(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function capitaliseEachWord(string) {
    return string.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/*	Main Content
==============================================================*/

/** 
 * Display an alert when subreddit does not exist
 */
function alertInexistingSub(subreddit) {
    var alert = $('<div class="alert alert-warning"><strong>Error:</strong> The subreddit <strong>"' + subreddit + '"</strong> does not exist.</div>');
    $('#main').hide().prepend(alert).slideDown();
    NProgress.done();
    setTimeout(function() {
        alert.slideUp('slow', function() {
            $(this).remove();
        });
    }, 3000);
}

/** 
 * Activate Oembed
 */
function activateOembed() {
    $('.oembed').oembed(null, {
        includeHandle: false,
        embedMethod: 'append',
        afterEmbed: function() {
            var url = $(this).prop('href');
            $(this).parent().find('p').wrap('<a href="' + url + '" class="embeded" target="_blank"></a>');
            $(this).remove();
        }
    });
}

/** 
 * Opens all links in a new tab
 */
function makeLinksExternal() {
    $('a:not(.show-buttons, .clickSub)', '#main').each(function() {
        $(this).click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.open(this.href, '_blank');
        });
    });
}

/*	Comments
==============================================================*/
function hideCommentsLoader() {
    $('.comments-loader').hide();
}

function showCommentsLoader() {
    $('.comments-loader').show();
}

/*	View / Layout
==============================================================*/

/** 
 * Set the layout
 */
function setLayout(layout) {
    if (layout === 'grid') initGrid();
    else if (layout === 'list') initList();
}

/** 
 * Init the grid layout with Isotope.js
 */
function initGrid() {
    var itemWidth = 200,
        itemMargin = 10,
        winWidth = $(window).width(),
        colNr = Math.floor(winWidth / itemWidth);

    $('.post').css('width', itemWidth);

    $('#main').hide()
        .removeClass('list')
        .addClass('grid')
        .isotope({
            itemSelector: '.post',
            layoutMode: 'masonry'
        })
        .trigger('resize')
        .width(colNr * (itemWidth + itemMargin))
        .show();
}


/** 
 * Go back to a list layout
 */
function initList() {
    $('.post').width('100%').height('auto');
    $('#main').removeClass('grid').addClass('list');
    stopIsotope();
}

function stopIsotope() {
    $('#main').isotope('destroy');
}

/** 
 * Reload the grid layout after changing subreddit or page
 */
function reloadGrid() {
    var t = window.setInterval(function() {
        var $posts = $('.post');
        if (!$posts.first().hasClass('isotope-item')) {
            window.clearInterval(t);
            $posts.addClass('isotope-item');
            stopIsotope();
            initGrid();
            $('#main').show();
            setTimeout(function() {
                $('#main').isotope('reLayout');
            }, 2000);
        }
    }, 50);
}