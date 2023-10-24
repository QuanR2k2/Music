
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'QUAN_PLAYER'
const player=$('.player');
const volumeSet=$('#volumeAdjust')
const volumeIcon=$('.volume .btn-volume')
const activeSong=$('.song.active');
const cd =$('.cd');
const cdProgressFull = $('.cd .circle .mask.full');
const cdProgressFill = $$('.cd .circle .mask .fill');
const heading = $('header marquee');
const cdThumb =$('.cd-thumb');
const repeatBtn = $('.btn-repeat');
const prevBtn = $('.btn-prev');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const btnMenu=$('.menuBtn');
const randomBtn = $('.btn-random');
const progress= $('#progress');
const progressRange= $('.progressRange')
const audio = $('#audio');
const playlist = $('.playlist');
const endTime=$('.endTime');
const rangeValue=$('.rangeValue');
const startTime =$('.startTime');
const favouriteSongList=$('.favouriteList');
var r = $(':root');
var favouriteArray=[]  


const app = {
  currentSong: {},
  currentIndex: 0,
  isPlaying :false,
  isMute: false,
  isNext :false,
  isRandom: false,
  isTimeUpdate: true,
  isRepeat :false,
  songTime:0,
  songVolume:0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY ))||{},

     config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [

{
name: ' Summertime',
singer: '[Sunshine]',
path: './assets/audio/song1.mp3',
image: './assets/img/song1.jpg'
},
{
name: '  FEARLESS',
singer: '[LESSERAFIM]',
path: './assets/audio/song2.mp3',
image: './assets/img/song15.jpg'
},
{
name: ' PLAY',
singer: '[Alan Walker, K-391, Tungevaag, Mangoo]',
path: './assets/audio/song3.mp3',
image: './assets/img/song3.jpg'
},
{
name: '  THERE’S NO ONE AT ALL',
singer: '[SƠN TÙNG M-TP]',
path: './assets/audio/song4.mp3',
image: './assets/img/song14.jpg'
},
{
name: '   라비앙로즈 (La Vie en Rose)',
singer: '[IZ*ONE]',
path: './assets/audio/song5.mp3',
image: './assets/img/song5.jpg'
},
{
name: '   How You Like That',
singer: '[BLACKPINK]',
path: './assets/audio/song6.mp3',
image: './assets/img/song11.jpg'
},
{
name: '  Sugar',
singer: '[Maroon 5]',
path: './assets/audio/song7.mp3',
image: './assets/img/song8.jpg'
},
{
name: '  Reality',
singer: '[Lost Frequencies]',
path: './assets/audio/song8.mp3',
image: './assets/img/song16.jpg'
},
{
name: '   Em Mới Là Người Yêu Anh',
singer: '[MIN]',
path: './assets/audio/song9.mp3',
image: './assets/img/song17.jpg'
},
{
name: '  Hãy Ra Khỏi Người Đó Đi',
singer: '[Phan Mạnh Quỳnh]',
path: './assets/audio/song10.mp3',
image: './assets/img/song18.jpg'
},
{
    name: '  VÌ MẸ ANH BẮT CHIA TAY',
    singer: '[MIU LÊ x KARIK x CHÂU ĐĂNG KHOA]',
    path: './assets/audio/song11.mp3',
    image: './assets/img/song19.jpg'
    },
    {
        name: '  KHÁC BIỆT này thậm chí còn TO LỚN HƠN',
        singer: '[TRỊNH THĂNG BÌNH x LIZ KIM CƯƠNG]',
        path: './assets/audio/song12.mp3',
        image: './assets/img/song20.jpg'
        },    

],
        setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    renderSong: function(){
        const htmls =this.songs.map((song,index)=>{
            return `
            <div class="song ${this.currentIndex===index?'active':''}" data-index=${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author"${song.singer}</p>
            </div>
            <div class="option">
                <i class="favourite fas fa-heart"></i>
            </div>
          </div>
            `
        });
        playlist.innerHTML=htmls.join('');
 
    },
    handleEvents: function(){
        const _this=this; 
        const cdWidth = cd.offsetWidth;
        const cdHeight =cd.offsetHeight;
        // Xử lý CD vòng xoay
        const cdThumbAnimate =cdThumb.animate([
            {transform:'rotate(360deg)'}
        ],
        {
            iterations:Infinity,
            duration:10000
        })
        cdThumbAnimate.pause();
        // Xử lý hoạt ảnh tiêu đề
        heading.start();
        
        // Xử lý chế độ xem cuộn
        document.onscroll = function(){
            var rs=getComputedStyle(r);
            console.log(rs.getPropertyValue('--cd-dim'));
            const scrollTop = window.scrollY||document.documentElement.scrollTop
            const newWidth = cdWidth -scrollTop;
            const scaleRatio=newWidth/cdWidth;
            r.style.setProperty('--cd-dim',newWidth+'px');
            r.style.setProperty('--thumb-dim',Math.floor(newWidth*94/100)+'px');
            r.style.setProperty('--c-width',Math.floor(newWidth*3/100)+'px');
            cd.style.opacity = scaleRatio;
        }; 

      // Xử lý sự kiện điều khiển nút nghe
       playBtn.onclick = function(){
            if(_this.isPlaying) {
                audio.pause();
                }
            else {
                audio.play();
                }
            };

        // Xử lý khi bật bài hát tiếp theo
        nextBtn.onclick =function(){
            autoNextSong();
            _this.scrollToActiveSong();
            
        }

        // Xử lý bài hát trước 
        prevBtn.onclick =function(){
            if(_this.isRandom){
                _this.randomMode();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        };
        
        // Xử lý phát bài hát ngẫu nhiên
        randomBtn.onclick =function(){
            _this.isRandom=!_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom);
            randomBtn.classList.toggle('active',_this.isRandom);
        };

        // Xử lý lặp lại bài hát
        repeatBtn.onclick =function(){
            _this.isRepeat=!_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat);
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }

        // Xử lý âm lượng tắt tiếng
        volumeIcon.onclick =function(){
            audio.volume=0;
            _this.songVolume=audio.volume;
            volumeDisplay();
            volumeIcon.innerHTML='<i class="fas fa-volume-mute"></i>'
        }

        // Xử lý tự động phát bài hát tiếp theo
        const autoNextSong=()=>{
                if(_this.isRandom)
                     {
                        _this.randomMode();
                    }
                else this.nextSong();
                audio.play();}

        // Xử lý phần tử âm thanh
        // Thời lượng tải ngay lập tức
        audio.onloadeddata = function(){
                _this.songTime=audio.duration.toFixed();
                // _this.songVolume=audio.volume*100; 
                var second=_this.songTime%60;
                endTime.innerHTML =`0${Math.floor(_this.songTime/60)}:${second>9?second:'0'+second}`;
        }
        audio.onplay =function(){
            _this.isPlaying = true;        
            player.classList.add('playing');
            cdThumbAnimate.play();
        };
        audio.onpause =function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate =function(){
                if(audio.duration)
                {
                    const currentProgress =Math.floor(audio.currentTime/audio.duration*100);
                    progress.value = currentProgress;
                    const currentMinute = Math.floor(audio.currentTime/60);
                    const currentSecond =Math.floor(audio.currentTime%60)
                    rangeValue.innerHTML =`0${currentMinute}:${currentSecond>9?currentSecond:'0'+currentSecond}`;
                    startTime.innerHTML =`0${currentMinute}:${currentSecond>9?currentSecond:'0'+currentSecond}`;
                     rangeValue.style.left =currentProgress+'%';
                    var color = 'linear-gradient(90deg, rgb(9, 241, 21)' + progress.value + '% , rgb(214, 214, 214)' + progress.value+ '%)';
                    progress.style.background =color;

                    // Xử lý cd phần trăm nhạc chạy theo
                    const percent =currentProgress/100*180;
                    console.log(percent)
                    cdProgressFull.style.transform = `rotate(${percent}deg)`;
                    cdProgressFill.forEach(fillElement=>{
                        fillElement.style.transform = `rotate(${percent}deg)`;
                    });
                    
                    
                }
            };
        audio.onended = function(){
            if(_this.isRepeat) 
            {
                audio.play();
            }
            else
            autoNextSong();
        };
        progress.oninput =function(e){
                var x=0;
                x=e.target.value;
                const seekTime = x/100*audio.duration;
                audio.currentTime = seekTime;
                
        };
        progress.onkeydown= function(e){
            if(e.keyCode===39)
            {
                progress.value ++;
            }
        };
        // Xử lý bài hát đang hoạt động tại danh sách phát
        playlist.onclick= function(e){
            const songNode=e.target.closest('.song:not(.active)');
            const option=e.target.closest('.option');
            const favouriteIndex=Number(e.target.closest('.song').getAttribute('data-index'));          
            
            if(songNode||option)
            {
                
                if(songNode&&!option){
                    const index=songNode.getAttribute('data-index');
                    _this.currentIndex=Number(index);
                    _this.loadAndSave();
                    audio.play();
                }
                if(option){
                    const addFavourite=favouriteArray.includes(favouriteIndex)     
                    if(!addFavourite) favouriteArray.unshift(favouriteIndex)          
                    else {
                        deleteIndex=favouriteArray.indexOf(favouriteIndex)
                        favouriteArray.splice(deleteIndex,1)   
                    }
                    _this.setConfig('favouriteList',favouriteArray)
                    _this.favouriteSave();
                    
                }
            }
        };
        function volumeDisplay(){
            volumeSet.value=_this.songVolume;
            var volumeColor='linear-gradient(90deg, rgb(75, 36, 173)' +_this.songVolume+'%, rgb(214, 214, 214) '+_this.songVolume+'%)';
            volumeSet.style.background=volumeColor;
        };
        // Xứ lý điều chỉnh âm lượng
        volumeSet.oninput= function(e){
            _this.songVolume=e.target.value;
            audio.volume=_this.songVolume/100;
            volumeDisplay();
            _this.setConfig("volume",_this.songVolume);
            _this.volumeIconHandle();   
        };

        // Xử lý phím và tay cầm chuột
        nextBtn.onmousedown = function(){
            nextBtn.classList.add('active');
        };
        nextBtn.onmouseup = function(){
            nextBtn.classList.remove('active');
        };
        prevBtn.onmousedown = function(){
            prevBtn.classList.add('active');
        };
        prevBtn.onmouseup = function(){
            prevBtn.classList.remove('active');
        };
        volumeIcon.onmousedown =function(){
            volumeIcon.classList.add('active');
        }
        volumeIcon.onmouseup =function(){
            volumeIcon.classList.remove('active');
        }

            
        //progress.addEventListener('input',function(){

        //})
        

    },
    loadCurrentSong: function(){
        this.currentSong=this.songs[this.currentIndex];
        heading.textContent =this.currentSong.name +' - '+this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src =this.currentSong.path;
        
    },
    loadAndSave: function(){
        this.setConfig("currentIndex",this.currentIndex);
        this.loadCurrentSong();
        this.renderSong();
        this.favouriteSave();
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length) 
        {
            this.currentIndex=0;
        }
        this.loadAndSave();

    },
    prevSong: function(){
        this.currentIndex -=1;
        if(this.currentIndex<0) 
        {
            this.currentIndex=this.songs.length-1;
        }
        this.loadAndSave();
    },
    randomMode: function(){
        let newIndex;
        do {
            newIndex=Math.floor(Math.random()*this.songs.length)
        }
        while(newIndex===this.currentIndex)
       this.currentIndex=newIndex;
       this.loadAndSave();
    },
    scrollToActiveSong: function(){
        var view='';
        if(this.currentIndex<2) view='end';
        else view='nearest';
        setTimeout(() => {
            $('.song.active').scrollIntoView({
              behavior: "smooth",
              block: view
            });
          }, 300);
        
    },
    volumeIconHandle: function(){
        const volume=this.songVolume;  
        if(volume>50) volumeIcon.innerHTML='<i class="fas fa-volume-up"></i>'
        else {
            if(volume>=5&&volume<=50) volumeIcon.innerHTML='<i class="fas fa-volume-down"></i>'
            else volumeIcon.innerHTML='<i class="fas fa-volume-mute"></i>'
        }     
        
    },
    volumeLoad: function(){
        ///Volume 
        this.songVolume=this.config.volume;
        volumeSet.value=this.songVolume;
        var volumeColor='linear-gradient(90deg, rgb(75, 36, 173)' +this.songVolume+'%, rgb(214, 214, 214) '+this.songVolume+'%)';
        volumeSet.style.background=volumeColor;   
        //Icon
        this.volumeIconHandle();
       
    },
    reloadHandle: function(){ 
        //First load
        if(this.config.currentIndex===undefined)
        {
            this.currentIndex=0;
            this.config.volume=100;
            
            
        }
        else {
            this.currentIndex = this.config.currentIndex;
            this.isRandom=this.config.isRandom;
            this.isRepeat=this.config.isRepeat;
            
            
        }
        if(favouriteArray===undefined) {
            this.config.favouriteList =[];
            favouriteArray =this.config.favouriteList;
        }

        else 
        {
            favouriteArray= this.config.favouriteList;
        }   
            
        randomBtn.classList.toggle('active',this.isRandom);
        repeatBtn.classList.toggle('active',this.isRepeat);
    },
    favouriteSave:function(){ 
        if(favouriteArray!=undefined)
        {
            favouriteArray=this.config.favouriteList;
            const tempIndexArray=[];
            this.songs.map((song,index)=>{
                tempIndexArray.push(index)
            });

                    let difference = tempIndexArray.filter(x => !favouriteArray.includes(x));
                    favouriteArray.map(favIndex=>{
                
                                const favouriteSong=$(`[data-index=\'${favIndex}\'] .favourite`)
                                favouriteSong.classList.add('active');    

                    });
                    difference.map(favIndex=>{
                
                        const favouriteSong=$(`[data-index=\'${favIndex}\'] .favourite`)
                        favouriteSong.classList.remove('active');  
                
        });}
    }
    ,
    favouriteHandle:function(){
        const _this1=this;
        const favHtmls=favouriteArray.map(index=>{
        
                return `<div class='fav' index=${index}>
                <img src='../lovesong.png'>  
                ${this.songs[index].name} - ${this.songs[index].singer}
                </div>`
            
        })
        favouriteSongList.innerHTML=favHtmls.join('');
        const favChoosen=$$('.fav');
        favChoosen.forEach(favSong=>{
            const favSongIndex=Number(favSong.getAttribute('index'))
            favSong.onclick=function(){
                _this1.currentIndex=favSongIndex;
                _this1.loadAndSave();
                audio.play();
            }
        })
    },
    menuHandle: function() {
        
    // Xử lý phần menu

        const __this=this;
        btnMenu.onclick=function(){
            __this.favouriteHandle();
            btnMenu.classList.toggle('close');
            if(favouriteArray.length!==0)
                {
                    favouriteSongList.classList.toggle('active');}
        };
        window.onclick=function(event){
            if(!event.target.matches('.menuBtn')&&!event.target.matches('.line')){
                btnMenu.classList.remove('close');
                favouriteSongList.classList.remove('active'); 
            }
        }

    },
    start: function(){
        this.reloadHandle();
        this.volumeLoad();
        this.reloadHandle();
        this.loadAndSave();
        this.handleEvents();
        this.menuHandle();
             
    }
}
app.start();