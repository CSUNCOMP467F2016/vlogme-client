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

  function player_init(){
    console.log("loading item %s", JSON.stringify(topic_src));
  }

  function init(){

    var topic = window.DEMO_DATA[2];
    var topic_src = item_src(topic);

    var responses = topic.responses;

    responses.forEach(
     (item) => { console.log("response@%d: %s", item.position, item.title); }
    );

    console.log('initializing');
    var player = videojs('video', player_init);
    player.src([topic_src]).load();
    player.play();

  }

  init();

}

document.addEventListener('DOMContentLoaded', main);
