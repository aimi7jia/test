/**
 * Created by Administrator on 2016/10/27.
 */

var ImageLoading = function(img_arr,audio_arr,obj){
    'use strict';
    var img_urls = img_arr || [],
        audio_urls = audio_arr || [],
        _obj = obj,
        is_ok = [],
        imgs_len = img_urls.length,
        audios_len = audio_urls.length,
        start = new Date,
        _img = null,
        _audios = [],
        _audios_is_ok = [],
        _audio = null;
    _obj.len = imgs_len + audios_len;
    _img = function(url,index){
        this.url = url;
        this.index = index;
        this.img = new Image();
    };
    _img.prototype.Loading = function(){
        this.img.onload = function(){
            this.img.onload = null;
            is_ok.push(this.index);
            _obj.loading(is_ok.length,_obj.len);
            if(_obj.len === is_ok.length){
                var _time = new Date;
                var _finishTime = Math.floor(_time - start);
                _obj.complete(_finishTime,_audios_is_ok);
            }
        }.bind(this);
        this.img.src = this.url;
    };
    img_urls.forEach(function(val,key){
        new _img(val,key).Loading();
    });
    _audio = function(options,index){
        this.obj = new Audio();
        this.index = index;
        this.obj.type = options._type || 'audio/mpeg';
        this.obj.preload = options._preload || 'auto';
        this.obj.loop = options._loop || true;
        this.obj.src = options.src;
        this.obj.load();
    };
    audio_urls.forEach(function(obj,key){
        _audios[key] = new _audio(obj,key);
    });
    _audios.forEach(function(val,key){
        val.obj.addEventListener('loadedmetadata',function(){
            is_ok.push(val.index);
            _obj.loading(is_ok.length,_obj.len);
            _audios_is_ok = _audios;
            var self = this;
            this.play();
            // this.parse();
            if(_obj.len === is_ok.length){
                var _time = new Date;
                var _finishTime = Math.floor(_time - start);
                _obj.complete(_finishTime,_audios);
            }
        },false);
    })

};