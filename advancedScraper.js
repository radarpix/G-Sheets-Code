
function scraper(url) {
    var result = [];
    var title, ogurl, ogtitle, ogimage, ogdescription, description, h1, robots, canonical;
    var options = {
        'muteHttpExceptions': true,
        'followRedirects': false,
    };
    try {
        // trim url to prevent (rare) errors
        url.toString().trim();
        var r = UrlFetchApp.fetch(url, options);
        var c = r.getResponseCode();
        // check for meta refresh if 200 ok
        if (c == 200) {
            var html = r.getContentText();
            var $ = Cheerio.load(html); // make sure this lib is added to your project!
            // meta robots
            if ($('meta[name="robots"]').attr('content')) {
                robots = $('meta[name="robots"]').attr('content').trim();
            }
            // canonical
            if ($("link[rel='canonical']").attr("href")) {
                canonical = $("link[rel='canonical']").attr("href");
            }
            // meta title
            if ($('title')) {
                title = $('title').text().trim();
            }
            // meta description
            if ($('meta[name=description]').attr("content")) {
                description = $('meta[name=description]').attr("content").trim();
            }
            // h1
            if ($('h1')) {
                h1 = $('h1').text().trim();
            }
            // open graph url
            if ($('meta[property="og:url"]').attr('content')) {
                ogurl = $('meta[property="og:url"]').attr('content').trim();
            }
            // open graph title
            if ($('meta[property="og:title"]').attr('content')) {
                ogtitle = $('meta[property="og:title"]').attr('content').trim();
            }
            // open graph image
            if ($('meta[property="og:image"]').attr('content')) {
                ogimage = $('meta[property="og:image"]').attr('content');
            }
            // open graph description
            if ($('meta[property="og:description"]').attr('content')) {
                ogdescription = $('meta[property="og:description"]').attr('content').trim();
            }
        }
        result.push([c, canonical, robots, title, description, h1, ogurl, ogtitle, ogimage, ogdescription]);
    } catch (error) {
        result.push(error.toString());
    } finally {
        return result;
    }
}