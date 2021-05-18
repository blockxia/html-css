/**
*
@author: shenxiaoxia
@date: 2021/5/18
@module: 轮播图
*
**/
/*
* 制作图片轮显效果
* */
/*
window.onload = function() {
  var list = document.getElementById('list');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  function animate(offset) {
    //获取的是style.left，是相对左边获取距离，所以第一张图后style.left都为负值，
    //且style.left获取的是字符串，需要用parseInt()取整转化为数字。
    var newLeft = parseInt(list.style.left) + offset;
    list.style.left = newLeft + 'px';
    if(newLeft<-3600){
      list.style.left = -1200 + 'px';
    }
    if(newLeft>-1200){
      list.style.left = -3600 + 'px';
    }
  }

  var buttons = document.getElementById('buttons').getElementsByTagName('span');
  var index = 1;

  function buttonsShow() {
    //这里需要清除之前的样式
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].className == 'on') {
        buttons[i].className = '';
      }
    }
    //数组从0开始，故index需要-1
    buttons[index - 1].className = 'on';
  }

  prev.onclick = function() {
    index -= 1;
    if (index < 1) {
      index = 5;
    }
    buttonsShow();
    animate(600);
  }
  next.onclick = function() {
    //由于上边定时器的作用，index会一直递增下去，我们只有5个小圆点，所以需要做出判断
    index += 1;
    if (index > 5) {
      index = 1;
    }
    buttonsShow();
    animate(-600);
  }
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      // 在浏览器的控制台打印一下，看看结果
      console.log(i);

      /!* 偏移量获取：这里获得鼠标移动到小圆点的位置，用this把index绑定到对象buttons[i]上，去谷歌this的用法  *!/
      /!* 由于这里的index是自定义属性，需要用到getAttribute()这个DOM2级方法，去获取自定义index的属性*!/
      var clickIndex = parseInt(this.getAttribute('index'));
      var offset = 1200 * (index - clickIndex);
      animate(offset); //存放鼠标点击后的位置，用于小圆点的正常显示
      index = clickIndex;
      buttonsShow();
    }
  }
}*/

window.onload = function () {
  /*获取HTML中的对象*/
  var parent = document.getElementById("parent");
  var img_ul = document.getElementById("img_ul");
  var litCir_ul = document.getElementById("litCir_ul");
  var buttons = document.getElementById("buttons");
  var cLis =litCir_ul.children;

  var len = img_ul.children.length;     //图片张数
  var width = parent.offsetWidth;       //每张图片的宽度
  var rate = 15;                        //一张图片的切换速度， 单位为px
  var times = 1;                        //切换速度的倍率
  var gap = 5000;                       //自动切换间隙， 单位为毫秒
  var timer = null;                     //初始化一个定时器
  var picN = 0;                         //当前显示的图片下标
  var cirN = 0;                         //当前显示图片的小圆点下标
  var temp;

  for (var i=0; i<len; i++){
    var a_li = document.createElement("li");
    a_li.className = 'quiet';
    litCir_ul.appendChild(a_li);
  }
  litCir_ul.children[0].className = "active";

  function Roll(distance){                                         //参数distance：滚动的目标点（必为图片宽度的倍数）
    clearInterval(img_ul.timer);                                     //每次运行该函数必须清除之前的定时器！
    var speed = img_ul.offsetLeft < distance ?  rate : (0-rate);     //判断图片移动的方向

    img_ul.timer = setInterval(function(){                           //设置定时器，每隔10毫秒，调用一次该匿名函数
      img_ul.style.left = img_ul.offsetLeft + speed + "px";        //每一次调用滚动到的地方 (速度为 speed px/10 ms)
      var leave = distance - img_ul.offsetLeft;                    //距目标点剩余的px值
      /*接近目标点时的处理，滚动接近目标时直接到达， 避免rate值设置不当时不能完整显示图片*/
      if (Math.abs(leave) <= Math.abs(speed)) {
        clearInterval(img_ul.timer);
        img_ul.style.left = distance + "px";
      }
    },10);
  }


  /*克隆第一个li到列表末*/
  img_ul.appendChild(img_ul.children[0].cloneNode(true));




  function autoRun(){
    picN++;
    cirN++;
    if(picN > len){                  //滚动完克隆项后
      img_ul.style.left = 0;       //改变left至真正的第一项处
      picN = 1;                    //从第二张开始显示
    }
    Roll(-picN*width);

    if(cirN > len-1){                //判断是否到了最后一个圆点
      cirN = 0;
    }
    for(var i=0; i<len; i++){
      cLis[i].className = "quiet";
    }
    cLis[cirN].className = "active";
  }



  for(var i=0; i<len; i++){
    cLis[i].index = i;
    cLis[i].onmouseover = function(){
      for(var j=0; j<len; j++){
        cLis[j].className = "quiet";
      }
      this.className = "active";
      temp = cirN;
      picN = cirN = this.index;
      times = Math.abs(this.index - temp);  //距离上个小圆点的距离
      rate = rate*times;                    //根据距离改变切换速率
      Roll(-this.index * width);
      rate = 15;
    }
  }


  parent.onmouseover = function(){
    clearInterval(timer);
    buttons.style.display = 'block';
  }
  parent.onmouseout = function(){
    timer = setInterval(autoRun, gap);
    buttons.style.display = 'none';
  }


  /*上一张*/
  buttons.children[0].onclick = function(){
    picN--;
    cirN--;
    if(picN < 0){                               //滚动完第一项后
      img_ul.style.left = -len*width + "px";  //改变left至克隆的第一项处
      picN = cirN = len-1;
    }
    Roll(-picN*width);
    //bug处理
    if(cirN < 0){
      cirN = len-1;
    }
    for(var i=0; i<len; i++){
      cLis[i].className = "quiet";
    }
    cLis[cirN].className = "active";
  }
  /*下一张*/
  buttons.children[1].onclick = autoRun;




}