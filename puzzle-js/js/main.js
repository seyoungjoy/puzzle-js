import {StopWatch} from "./stop-watch.js";

class ItemDragHandler {
    //전역변수로 설정.
    el;
    downHandler;
    moveHandler;
    upHandler;
    shiftX;
    shiftY;
    puzzleCont = document.querySelector('.piece-wrap');

    static answer = [];

    constructor(el) {
        this.el = el;
        this.addEvent();
        this.isMobile();
    }

    static setAnswer(idx,arg){
        ItemDragHandler.answer[idx] = arg;
    }

    isMobile() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    }

    addEvent() {
        StopWatch.tick();

        this.downHandler = (e) => {
            this.onDownHandler(e);
        }
        this.moveHandler = (e) => {
            this.onMoveHandler(e);
        }
        this.upHandler = (e) => {
            this.onUpHandler(e);
        }

        if (this.isMobile()) {
            this.el.addEventListener('touchstart', this.downHandler);
        } else {
            this.el.addEventListener('mousedown', this.downHandler);
        }
        this.onStart();


    }

    onStart(){
        let startBtn = document.querySelector('.startBtn');

        startBtn.addEventListener('click', this.onMixHandler);
        startBtn.addEventListener('click', this.onStartWatch);
    }

    //start 버튼 클릭시 순서 섞기
    onMixHandler(){
        let piece1 = document.querySelector('.piece-wrap:nth-child(1)');
        let piece2 = document.querySelector('.piece-wrap:nth-child(3)');
        let piece3 = document.querySelector('.piece-wrap:nth-child(7)');
        let piece4 = document.querySelector('.piece-wrap:nth-child(9)');

        piece1.style.order = '3';
        piece2.style.order = '8';
        piece3.style.order = '1';
        piece4.style.order = '7';
    }

    debugEl(el) {
        return el.classList;
    }

    onDownHandler(e) {
        e.preventDefault();
        console.log(this.debugEl(this.el) + ' : down');

        this.el.classList.add('down');


        if (this.isMobile()) {
            console.log('touchmove');
            document.addEventListener('touchmove', this.moveHandler);
            document.addEventListener('touchend', this.upHandler);

            this.shiftX = e.targetTouches[0].clientX - this.el.getBoundingClientRect().left;
            this.shiftY = e.targetTouches[0].clientY - this.el.getBoundingClientRect().top;

        } else {
            console.log('clickmove')
            document.addEventListener('mousemove', this.moveHandler);
            document.addEventListener('mouseup', this.upHandler);

            this.shiftX = e.clientX - this.el.getBoundingClientRect().left;
            this.shiftY = e.clientY - this.el.getBoundingClientRect().top;
        }

    }

    onMoveHandler(e) {
        console.log(this.debugEl(this.el) + ' : move');
        this.el.style.position = 'absolute';
        this.el.style.zIndex = '1000';
        this.el.classList.add('move');

        if (this.isMobile()) {
            this.el.style.left = e.targetTouches[0].pageX - this.shiftX + 'px';
            this.el.style.top = e.targetTouches[0].pageY - this.shiftY + 'px';
        } else {
            this.el.style.left = e.pageX - this.shiftX + 'px';
            this.el.style.top = e.pageY - this.shiftY + 'px';
        }

        // 화면 밖으로 나갔을 때 return;
        if(e.pageX - this.shiftX < 0  || e.pageY - this.shiftY < 0){
            return
        }


    }

    onUpHandler(e) {
        console.log(this.debugEl(this.el) + ' : up');
        this.el.classList.remove('down');
        this.el.classList.remove('move');

        if (this.isMobile()) {
            document.removeEventListener('touchmove', this.moveHandler);
            document.removeEventListener('touchend', this.upHandler);

        } else {
            document.removeEventListener('mousemove', this.moveHandler);
            document.removeEventListener('mouseup', this.upHandler);
        }

        this.onLocation(e);

        // 화면 밖으로 나갔을 때 return;
        if(e.pageX - this.shiftX < 0  || e.pageY - this.shiftY < 0){
            console.log('화면밖으로 나갔어');
            this.el.parentNode.append(this.el);
            this.el.style.position = '';
        }
    }

    onLocation(e){
        console.log('placed');
        this.el.hidden = true;
        let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        this.el.hidden = false;

        if(!elemBelow) return;

        let droppableBelow = elemBelow.closest('.droppable')

        if(droppableBelow==null){
            return;
        }

        if(droppableBelow){
            droppableBelow.append(this.el);
            this.el.style.position = '';
        } else{
            this.puzzleCont.append(this.el);
        }

        if(droppableBelow.children.length >=2){
            let firstChild = droppableBelow.firstChild;
            this.puzzleCont.append(firstChild);
        }

        //dataset의 숫자가 서로 일치할때만 answer의 배열에 그 값을 넣어줌.
        if(droppableBelow.dataset.order === e.target.dataset.order){
            ItemDragHandler.setAnswer(droppableBelow.dataset.order - 1,e.target.dataset.order);
        }

        console.log(ItemDragHandler.answer);

        this.onComplete();
    }

    onComplete(){
        if(JSON.stringify(ItemDragHandler.answer) ==  JSON.stringify(['1','2','3','4','5','6','7','8','9'])){
            this.onStopWatch();
            return alert('complete!');
        }
    }

    onStartWatch(){


        console.log('watch start!');
    }

    onStopWatch(){
        console.log('watch stop!');
    }




}

let pz1El = document.querySelector('.pz-1');
let pz2El = document.querySelector('.pz-2');
let pz3El = document.querySelector('.pz-3');
let pz4El = document.querySelector('.pz-4');
let pz5El = document.querySelector('.pz-5');
let pz6El = document.querySelector('.pz-6');
let pz8El = document.querySelector('.pz-7');
let pz7El = document.querySelector('.pz-8');
let pz9El = document.querySelector('.pz-9');

new ItemDragHandler(pz1El);
new ItemDragHandler(pz2El);
new ItemDragHandler(pz3El);
new ItemDragHandler(pz4El);
new ItemDragHandler(pz5El);
new ItemDragHandler(pz6El);
new ItemDragHandler(pz7El);
new ItemDragHandler(pz8El);
new ItemDragHandler(pz9El);



// start 누르면 섞어지기(랜덤값으로)
// 시간초
// 랭킹 시스템

//뷰랑 데이터를 분리해서 다시 만들어보기..?

// 슬라이드

