// ページの読み込みが完了したらコールバック関数が呼ばれる
// ※コールバック: 第2引数の無名関数(=関数名が省略された関数)
window.addEventListener('load', () => {
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');
  

  const nameForm = document.querySelector('#name-form');
  const nameText = document.querySelector('#name-text');
  const nameButton = document.querySelector('#name-button');
  const main = document.querySelector('#main');
  const clearButton = document.querySelector('#clear-button');
  const nextButton = document.querySelector('#next-button');
  const counter = document.querySelector('#counter');
  const img_DLlink = document.querySelector('#img-download-link');
  const txt_DLlink = document.querySelector('#txt-download-link');
  const reDL = document.querySelector('#re-download');
  const reZu = document.querySelector('#re-zu');
  const reN = document.querySelector('#re-n');
  const reDa = document.querySelector('#re-da');
  const reMo = document.querySelector('#re-mo');
  const reChi = document.querySelector('#re-chi');

  // 直前のマウスのcanvas上のx座標とy座標を記録する
  let lastPosition = { x: null, y: null };

  const count_goal = 3;
  let data = new Array(5);
  data[0] = new Array(count_goal);
  data[1] = new Array(count_goal);
  data[2] = new Array(count_goal);
  data[3] = new Array(count_goal);
  data[4] = new Array(count_goal);
  let name;
  let now_coordinate = new Array(2);
  let texts = '';
  let DLtexts = new Array(5);
  let DLchara;
  let file_name = "null";

  let character_kind = 0;
  let charalist = ["zu","n","da","mo","chi"];
  let kanalist = ["ず","ん","だ","も","ち"]
  let count = 0;
  let time = 0;

  let name_flag = false;
  let start_flag = false;
  let isDrag = false;
  let isTouch = false;

  let blob;
 
  function draw(x, y) {
    // マウスがドラッグされていなかったら処理を中断する。
    // ドラッグしながらしか絵を書くことが出来ない。
    if(!isDrag && !isTouch) {
      return;
    }

    // 「context.beginPath()」と「context.closePath()」を都度draw関数内で実行するよりも、
    // 線の描き始め(dragStart関数)と線の描き終わり(dragEnd)で1回ずつ読んだほうがより綺麗に線が書ける

    // MDN CanvasRenderingContext2D: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 5;
    context.strokeStyle = 'black';

    // 書き始めは lastPosition.x, lastPosition.y の値はnullとなっているため、
    // クリックしたところを開始点としている。
    // この関数(draw関数内)の最後の2行で lastPosition.xとlastPosition.yに
    // 現在のx, y座標を記録することで、次にマウスを動かした時に、
    // 前回の位置から現在のマウスの位置まで線を引くようになる。
    if (lastPosition.x === null || lastPosition.y === null) {
      // ドラッグ開始時の線の開始位置
      context.moveTo(x, y);
    } else {
      // ドラッグ中の線の開始位置
      context.moveTo(lastPosition.x, lastPosition.y);
    }
    // context.moveToで設定した位置から、context.lineToで設定した位置までの線を引く。
    // - 開始時はmoveToとlineToの値が同じであるためただの点となる。
    // - ドラッグ中はlastPosition変数で前回のマウス位置を記録しているため、
    //   前回の位置から現在の位置までの線(点のつながり)となる
    context.lineTo(x, y);

    // context.moveTo, context.lineToの値を元に実際に線を引く
    context.stroke();

    // 現在のマウス位置を記録して、次回線を書くときの開始点に使う
    lastPosition.x = x;
    lastPosition.y = y;
  }

  // canvas上に書いた絵を全部消す
  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFFFFF";
    context.fillRect(0,0,300,300);
  }

  // マウスのドラッグを開始したらisDragのフラグをtrueにしてdraw関数内で
  // お絵かき処理が途中で止まらないようにする
  function dragStart(event) {
    // これから新しい線を書き始めることを宣言する
    // 一連の線を書く処理が終了したらdragEnd関数内のclosePathで終了を宣言する
    context.beginPath();
    start_flag = true;
    isDrag = true;
    isTouch = true;
  }
  // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら
  // isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする
  function dragEnd(event) {
    // 線を書く処理の終了を宣言する
    context.closePath();
    isDrag = false;
    isTouch = false;

    
    lastPosition.x = null;
    lastPosition.y = null;
  }

  function imageDownload(){
    file_name = name+"_"+charalist[character_kind]+"_"+String(count);
    img_DLlink.href = canvas.toDataURL("image/png", 1);
    img_DLlink.download = file_name;
    img_DLlink.click();
  }

  function textDownload(DLchara){
    blob = new Blob([DLtexts[DLchara]], {type:'text/plain'});
    txt_DLlink.href = URL.createObjectURL(blob);
    txt_DLlink.download = name+"_"+charalist[DLchara];
    txt_DLlink.click();
  }


  function initEventHandler() {
    nameButton.addEventListener('click', (event) => {
      name = nameText.value
      console.log(name);
      if(name.match(/^[A-Za-z0-9]/) && name.length>=3 && name.length<=10){
        nameForm.style.setProperty("display", "none", "important");
        main.style.setProperty("display", "block", "important");
        context.fillStyle = "#FFFFFF";
        context.fillRect(0,0,300,300);
        nextButton.disabled = true;
      }
      console.log("aaaaa");
    });

    clearButton.addEventListener('click', (event) => {
      clear();
      time = 0;
      nextButton.disabled = true;
      if (start_flag == ture){
        let list = data[character_kind];
        list[count].pop;
      }
      start_flag = false;
    });

    nextButton.addEventListener('click', (event) => {
      imageDownload();
      clear();

      time = 0;
      nextButton.disabled = true;
      count = ++count;
      counter.innerHTML = `あと${count_goal-count}文字`;
      //console.log(count)

      if (count == count_goal){
        DLtexts[character_kind] = texts;
        texts = "";
        //DLchara = character_kind;

        //setTimeout(function(){textDownload(character_kind);},2000);

        count = 0;
        character_kind = ++character_kind;

        character.innerHTML = "「"+kanalist[character_kind]+"」を書いてください";
        counter.innerHTML = "あと"+String(count_goal)+"文字";

        if (character_kind == 5){
          character.innerHTML = 'ご協力ありがとうございました。';
          counter.innerHTML = '';
          //console.log(data);
          //console.log(texts);
          reDL.style.setProperty("display", "block", "important");
        }
      } else {
        texts = texts + "&";
        console.log(texts);
      }
      start_flag = true;
    })

    canvas.addEventListener('mousedown', dragStart);
    canvas.addEventListener('mouseup', dragEnd);
    canvas.addEventListener('mouseout', dragEnd);
    canvas.addEventListener('mousemove', (event) => {
      draw(event.layerX, event.layerY);
      if(!isDrag && !isTouch) {
        return;
      }
      let list = data[character_kind];
      if (time == 0){
        list[count] = [];
      }
      if (character_kind != 5 && time > 20){
        nextButton.disabled = false;
      }
      now_coordinate[0] = Math.ceil(event.layerX);
      now_coordinate[1] = Math.ceil(event.layerY);
      list[count].push(now_coordinate.concat());
      console.log(data);

      if (time != 0){
        texts = texts + "/";
      }
      texts = texts + String(now_coordinate[0]) + "," + String(now_coordinate[1]);

      time = ++time;
    })

    canvas.addEventListener('touchstart', dragStart);
    canvas.addEventListener('touchend', dragEnd);
    canvas.addEventListener('touchcancel', dragEnd);
    canvas.addEventListener('touchmove', (event) => {
      draw(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      if(!isDrag && !isTouch) {
        return;
      }
      let list = data[character_kind];
      if (time == 0){
        list[count] = [];
      }
      if (character_kind != 5 && time > 20){
        nextButton.disabled = false;
      }
      now_coordinate[0] = Math.ceil(event.changedTouches[0].clientX);
      now_coordinate[1] = Math.ceil(event.changedTouches[0].clientY);
      list[count].push(now_coordinate.concat());
      console.log(data);

      if (time != 0){
        texts = texts + "/";
      }
      texts = texts + String(now_coordinate[0]) + "," + String(now_coordinate[1]);

      time = ++time;
    });

    reZu.addEventListener('click', (event) => {
      textDownload(0);
    });
    reN.addEventListener('click', (event) => {
      textDownload(1);
    });
    reDa.addEventListener('click', (event) => {
      textDownload(2);
    });
    reMo.addEventListener('click', (event) => {
      textDownload(3);
    });
    reChi.addEventListener('click', (event) => {
      textDownload(4);
    });
  }

  counter.innerHTML = `あと${count_goal}文字`;

  initEventHandler();
});