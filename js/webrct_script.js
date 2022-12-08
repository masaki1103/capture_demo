(function() {
  //�L���v�`�������ʐ^�̕��ƍ����B�ݒ肵�܂�
  //���͂����Œ�`���ꂽ�l�ɂȂ�܂����A������
  //���̓X�g���[���̃A�X�y�N�g��Ɋ�Â��Čv�Z����܂��B

  var width = 320;    //�ʐ^�̕�������ɍ��킹�Ċg��k�����܂�
  var height = 0;     //����͓��̓X�g���[���Ɋ�Â��Čv�Z����܂�

  //|�X�g���[�~���O| ���݃X�g���[�~���O���Ă��邩�ǂ����������܂�
  //�J��������̃r�f�I�B���炩�ɁA��������false����n�߂܂��B

  var streaming = false;

  //�\���܂��͐��䂷��K�v�̂��邳�܂��܂�HTML�v�f�B������
  // startup�i�j�֐��ɂ���Đݒ肳��܂��B

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function showViewLiveResultButton() {
    if (window.self !== window.top) {
      //�h�L�������g���t���[�����ɂ���ꍇ�́A���[�U�[���擾����悤�ɂ��܂�
      //�ŏ��ɓƎ��̃^�u�܂��̓E�B���h�E�ŊJ���܂��B�����łȂ���΁A����
      //�J�����A�N�Z�X�̋������N�G�X�g�ł��Ȃ��Ȃ�܂��B
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
      
        // Firefox�ɂ͌��݁A������ǂݎ��Ȃ��o�O������܂�
        //�r�f�I�Ȃ̂ŁA���ꂪ���������ꍇ�͑z�肵�܂��B
      
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

  //�ʐ^�ɉ����\������Ă��Ȃ����Ƃ��������̂���͂��܂�
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  //�r�f�I�̌��݂̃R���e���c���擾���Ďʐ^���L���v�`�����܂�
  //������L�����o�X�ɕ`�悵�A�����PNG�ɕϊ����܂�
  //�f�[�^URL���t�H�[�}�b�g���܂��B�I�t�X�N���[���L�����o�X�ɕ`�悵�Ă���
  //�������ʂɕ`�悷��ƁA�T�C�Y��ύX������A�K�p������ł��܂�
  //�`�悷��O�ɑ��̕ύX�B

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

  //�N���v���Z�X�����s����悤�ɃC�x���g���X�i�[��ݒ肵�܂�
  //���[�h������������B
  window.addEventListener('load', startup, false);
})();