// ページの読み込みが完了したらコールバック関数が呼ばれる
// ※コールバック: 第2引数の無名関数(=関数名が省略された関数)
window.addEventListener('load', () => {
  const canvas = document.querySelector('#draw-area');
  // contextを使ってcanvasに絵を書いていく
  const context = canvas.getContext('2d');

  const nameForm = document.querySelector('#name-form');
  const nameText = document.querySelector('#name-text');
  const nameButton = document.querySelector('#name-button');
  const main = document.querySelector('#main');
  const clearButton = document.querySelector('#clear-button');
  const nextButton = document.querySelector('#next-button');
  const counter = document.querySelector('#counter');

  // 直前のマウスのcanvas上のx座標とy座標を記録する
  let lastPosition = { x: null, y: null };

  let data = new Array(5);
  data[0] = [];
  data[1] = [];
  data[2] = [];
  data[3] = [];
  data[4] = [];
  let name;
  let now_coordinate = new Array(2);
  let count = 0;
  let character_count = 0;
  const times = 1;
  let name_flag = false;
  let start_flag = false;
  let isDrag = false;
  let isTouch = false;

  // let fs = require('fs');

  nameForm.style.display = "block";
  main.style.display = "none"
  nextButton.disabled = true;

 
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


  function initEventHandler() {
    nameButton.addEventListener('click', (event) => {
      name = nameText.value
      console.log(name);
      if(name.match(/^[A-Za-z0-9]/) && name.length>=3 && name.length<=10){
        nameForm.style.display = "none";
        main.style.display = "block";
      }
    });

    clearButton.addEventListener('click', (event) => {
      clear();
      nextButton.disabled = true;
      if (start_flag == ture){
        data[character_count].pop;
      }
      start_flag = false;
    });

    nextButton.addEventListener('click', (event) => {
      clear();
      nextButton.disabled = true;
      count = ++count;
      counter.innerHTML = `あと${times-count}文字`;

      let img = document.createElement("img");
      img.href = canvas.toDataURL("image/png",0.5);
      img.download = "image.png";
      img.click();

      if (count == times){
        count = 0;
        character_count = ++character_count;
        if (character_count == 1){
          character.innerHTML = '「ん」を書いてください';
          counter.innerHTML = `あと${times}文字`;
        }
        if (character_count == 2){
          character.innerHTML = '「だ」を書いてください';
          counter.innerHTML = `あと${times}文字`;
        }
        if (character_count == 3){
          character.innerHTML = '「も」を書いてください';
          counter.innerHTML = `あと${times}文字`;
        }
        if (character_count == 4){
          character.innerHTML = '「ち」を書いてください';
          counter.innerHTML = `あと${times}文字`;
        }
        if (character_count == 5){
          character.innerHTML = 'ご協力ありがとうございました。';
          counter.innerHTML = '';
          console.log(data);
          FileSystem.writeFile('/text.txt','aaaaaa',function(err,datum){
            console.log("OMG");
          });
        }
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
      if (character_count != 5 && data[character_count].length > 20){
        nextButton.disabled = false;
      }
      now_coordinate[0] = Math.ceil(event.layerX);
      now_coordinate[1] = Math.ceil(event.layerY);
      data[character_count].push(now_coordinate.concat());
    })

    canvas.addEventListener('touchstart', dragStart);
    canvas.addEventListener('touchend', dragEnd);
    canvas.addEventListener('touchcancel', dragEnd);
    canvas.addEventListener('touchmove', (event) => {
      draw(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      if(!isDrag && !isTouch) {
        return;
      }
      if (character_count != 5 && data[character_count].length > 50){
        nextButton.disabled = false;
      }
      now_coordinate[0] = Math.ceil(event.changedTouches[0].clientX);
      now_coordinate[1] = Math.ceil(event.changedTouches[0].clientY);
      data[character_count].push(now_coordinate.concat());
    });
  }

  counter.innerHTML = `あと${times}文字`;

  initEventHandler();
});