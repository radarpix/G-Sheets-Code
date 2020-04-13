var sheetName = "Sheet2";
var user_id = "8237157764"; 
//find your id here : https://codeofaninja.com/tools/find-instagram-user-id

var instagram_base_url = "https://www.instagram.com/graphql/query/";
var following = "?query_hash=58712303d941c6855d4e888c5f0cd22f&variables=%7B%22id%22%3A%22" + user_id + "%22%2C%22first%22%3A24%7D"
var followers = "?query_hash=37479f2b8209594dde7facb0d904896a&variables=%7B%22id%22%3A%22" + user_id + "%22%2C%22first%22%3A24%7D"
var medias = "?query_hash=f2405b236d85e8296cf30347c9f08c2a&variables=%7B%22id%22%3A%22" + user_id + "%22%2C%22first%22%3A12%7D"

function insertFollowerCount() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(this.sheetName);

  var followers = getFollowers();
  var following = getFollowing();
  var medias = getMedias();
  var engagement = getEngagement(medias, followers);

  sheet.appendRow([Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd"), followers, following, medias.count, engagement.totalLikes, engagement.totalComments, engagement.EngagementRatio]);
};

function getFollowers() {
  return parseInt(fetch(instagram_base_url + followers)['data']['user']['edge_followed_by']['count']);
}

function getFollowing() {
  return parseInt(fetch(instagram_base_url + following)['data']['user']['edge_follow']['count']);
}

function getMedias() {
  return fetch(instagram_base_url + medias)['data']['user']['edge_owner_to_timeline_media'];
}

function getEngagement(medias, followers) {
  var totalComments = 0,
    totalLikes = 0;
  for (var i = 0; i < 12; i++) {
    totalComments += parseInt(medias.edges[i].node.edge_media_to_comment.count);
  };
  for (var l = 0; l < 12; l++) {
    totalLikes += parseInt(medias.edges[l].node.edge_media_preview_like.count);
  };
  var engagementRatio = (((totalLikes + totalComments)) / followers) / 12;
  return {
    mediaCount: parseInt(medias.count),
    totalComments: totalComments,
    totalLikes: totalLikes,
    EngagementRatio: engagementRatio
  }
}

function fetch(url) {
  var ignoreError = {
    "muteHttpExcecptions": true
  };
  var source = UrlFetchApp.fetch(url, ignoreError).getContentText();
  var data = JSON.parse(source);
  return data;
}