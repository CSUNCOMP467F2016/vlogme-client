function main() {

  var storage_prefix = 'https://jyelloz.s3.amazonaws.com/COMP467DATA';

  function item_manifest_url(item) {
    return storage_prefix + '/' + item.id + '/dash.mpd';
  }

  function item_src(item) {
    return {
      src: item_manifest_url(item),
      type: 'application/dash+xml'
    };
  }

  function resume(player, uri, position) {
    player.unload();
    player.load(uri, position).then(
      function() {
        console.log("resumed content");
      }
    );
  }

  function on_error(error) {
    console.error('Error code', error.code, 'object', error);
  }

  function on_error_event(event) {
    on_error(event.detail);
  }

  function init(){

    shaka.polyfill.installAll();

    var topic = window.DEMO_DATA[1];
    var topic_src = item_src(topic);

    var response = window.DEMO_DATA[2].responses[0];
    var response_src = item_src(response);
    var other_uri = response_src.src;

    var delay_ms = Math.floor(response.position * 1000);

    console.log('initializing');
    var video = document.getElementById('video');
    var player = new shaka.Player(video);

    var play_closure = video.play.bind(video);

    /*
    window.setTimeout(
      function() {
        var now = response.position - 1;
        var uri = player.getManifestUri();
        console.log('swapping out content');
        video.pause();
        function resume_later() {
          window.setTimeout(
            function () {
              console.log('resuming old content');
              resume(player, uri, now);
            },
            10000
          );
        }
        player.unload();
        player.load(other_uri).then(play_closure).then(resume_later);
      },
      delay_ms
    );
    */

    player.load(topic_src.src).then(play_closure);

  }

  init();

}

document.addEventListener('DOMContentLoaded', main);
