(function() {
  //キャプチャした写真の幅と高さ。設定します
  //幅はここで定義された値になりますが、高さは
  //入力ストリームのアスペクト比に基づいて計算されます。

  var width = 320;    //写真の幅をこれに合わせて拡大縮小します
  var height = 0;     //これは入力ストリームに基づいて計算されます

  //|ストリーミング| 現在ストリーミングしているかどうかを示します
  //カメラからのビデオ。明らかに、私たちはfalseから始めます。

  var streaming = false;

  //構成または制御する必要のあるさまざまなHTML要素。これらは
  // startup（）関数によって設定されます。

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function showViewLiveResultButton() {
    if (window.self !== window.top) {
      //ドキュメントがフレーム内にある場合は、ユーザーを取得するようにします
      //最初に独自のタブまたはウィンドウで開きます。そうでなければ、それ
      //カメラアクセスの許可をリクエストできなくなります。
      document.querySelector(".contentarea").remove();
      const button = document.createElement("button");
      button.textContent = "View live result of the example code above";
      document.body.append(button);
      button.addEventListener('click', () => window.open(location.href));
      return true;
    }
    return false;
  }

  function startup() {
    if (showViewLiveResultButton()) { return; }
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefoxには現在、高さを読み取れないバグがあります
        //ビデオなので、これが発生した場合は想定します。
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
  }

  //写真に何も表示されていないことを示すものを入力します
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  //ビデオの現在のコンテンツを取得して写真をキャプチャします
  //それをキャンバスに描画し、それをPNGに変換します
  //データURLをフォーマットします。オフスクリーンキャンバスに描画してから
  //それを画面に描画すると、サイズを変更したり、適用したりできます
  //描画する前に他の変更。

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }

  //起動プロセスを実行するようにイベントリスナーを設定します
  //ロードが完了したら。
  window.addEventListener('load', startup, false);
})();