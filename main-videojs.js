function main() {

  var storage_prefix = 'https://jyelloz.s3.amazonaws.com/COMP467DATA/';

  function item_manifest_url(item) {
    return storage_prefix + item.id + '/dash.mpd';
  }

  function item_src(item) {
    return {
      src: item_manifest_url(item),
      type: 'application/dash+xml'
    };
  }

  function init(){

    var topic = window.DEMO_DATA[2];
    var topic_src = item_src(topic);

    var responses = topic.responses;

    var response = responses[0];
    var response_src = item_src(response);

    console.log('initializing');
    var player = videojs('video');
    player.autoplay(true);
    var play_closure = player.play.bind(player);

    var timeupdate_ctx = { };

    function timeupdate_disable() {
      timeupdate_ctx.position = undefined;
      timeupdate_ctx.then = undefined;
    }

    function timeupdate_enable(position, then) {
      timeupdate_ctx.position = position;
      timeupdate_ctx.then = then;
    }

    function timeupdate(then) {
      var now = player.currentTime();
      var position = timeupdate_ctx.position;
      var then = timeupdate_ctx.then;
      if (then !== undefined && position !== undefined && now >= position) {
        console.log('timeupdate: working');
        then();
      }
    }

    function resume(uri, timestamp){
      function resume_at() {
        console.log('ready');
        player.currentTime(timestamp);
        player.play();
      }
      player.src([uri]).load().ready(resume_at);
    }

    function schedule_response() {
      var now = response.position - 1;
      timeupdate_disable();
      console.log('swapping out content');
      player.pause();
      function resume_later() {
        console.log('resuming old content');
        resume(topic_src, now);
      }
      player.on('ended', resume_later);
      player.src([response_src]);
    }

    timeupdate_enable(response.position, schedule_response);

    player.on('timeupdate', timeupdate);

    player.src([topic_src]).load().ready(play_closure);

  }

  init();

}

document.addEventListener('DOMContentLoaded', main);
