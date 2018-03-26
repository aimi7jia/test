/**
 * Created by Administrator on 2016/10/26.
 */
/*
*  微信分享
* */

// wechat_share.init(
//     {
//         public_number:'',// 要挂在哪个公众号下面  默认 b+
//         appId:'',
//         title:'', // 分享标题
//         desc:'', // 分享描述
//         imgUrl:'', // 分享图片
//     }
// );
// // 如果需要发送请求(仅针对微信,这个请求是带有openId的)
// wechat_share.send(
//     {
//         url:'', // 请求地址
//         type:'post', // 请求类型 默认 get
//         data : {}, // 需要发送的数据 json 格式
//         beforeSend : function (xhr) { // 请求发送前需要执行的动作,可复写ajax默认配置
//
//         },
//         callback:function (data) { // 请求成功时执行的回调,data是后台返回的数据
//
//         },
//         error:function (err) { // 请求失败时的回调
//
//         }
//     }
// );

var  wechat_share = (function () {
    var wechatScan,wx_fnc,send,init,openid,changeTitle,_options,audioAutoPlay;
    /*微信接口调用*/
    wechatScan = function (options) {
        var currentUrl = encodeURIComponent(location.href.split('#')[0]);
        var _type = options.public_number || 'BJIA';
        var _appId = options.appId || 'wx002fd6e8c088deb6';
        var _thisUrl = 'http://99kang.net/hxgrm/hapi/v1/wechatplatform/jssdkparameters/get?version='+_type+'&url='+ currentUrl;
        var pparm = {};
        $.ajax({
            cache: false,
            type: "GET",
            url: _thisUrl,
            data: pparm,
            dataType: "jsonp",
            jsonp: "callback",
            success: function(obj) {
               var  _obj = eval(obj);
                var timestamp = parseInt(_obj["timestamp"], 10);
                wx.config({
                    debug : false,
                    appId : _appId,
                    timestamp : timestamp,
                    nonceStr : _obj["nonce_str"],
                    signature : _obj["signature"],
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone'
                    ]
                });
                options.callback && options.callback()
            }
        });
    };
    //用于截取链接中的参数
    function getUrlParam(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return decodeURI(r[2]); return null;
    }
    send = function (options) {
        openid = getUrlParam('openId');
        var _data = options.data || {};
        _data['openid'] = openid;
        $.ajax({
            type:options.type || 'get',
            url:options.url,
            data:_data,
            jsonp:'callback',
            dataType:'jsonp',
            beforeSend: function ( xhr ) {
                if(options.beforeSend){
                    options.beforeSend(xhr);
                }
            }
        }).done(function (data) {
            if(options.callback){
                options.callback(data)
            }
        }).fail(function (err){
            if(options.error){
                options.error(err)
            }
        })
    };
    wx_fnc = function (options) {
        wx.ready(function () {
            //分享到朋友圈
            wx.onMenuShareTimeline({
                title: options.title,
                link: options.link || window.location.href,
                imgUrl: options.imgUrl,
                success: function () {
                    options.cb && options.cb();
                },
                cancel: function () {
                }
            });
            //发送给朋友
            wx.onMenuShareAppMessage({
                title: options.title,
                desc: options.desc,
                link: options.link || window.location.href,
                imgUrl: options.imgUrl,
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    options.cb && options.cb();
                },
                cancel: function () {
                }
            });
            // 分享到QQ
            wx.onMenuShareQQ({
                title: options.title,
                desc: options.desc,
                link: options.link || window.location.href,
                imgUrl: options.imgUrl,
                success: function () {
                    // 用户确认分享后执行的回调函数
                    options.cb && options.cb();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            // 分享到腾讯微博
            wx.onMenuShareWeibo({
                title: options.title,
                desc: options.desc,
                link: options.link || window.location.href,
                imgUrl: options.imgUrl,
                success: function () {
                    // 用户确认分享后执行的回调函数
                    options.cb && options.cb();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            // 分享到QQ空间
            wx.onMenuShareQZone({
                title: options.title,
                desc: options.desc,
                link: options.link || window.location.href,
                imgUrl: options.imgUrl,
                success: function () {
                    // 用户确认分享后执行的回调函数
                    options.cb && options.cb();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    };
    init = function (options) {
        _options = options;
        wechatScan(options);
        wx_fnc(options);
    };
    // 动态修改title
    changeTitle = function (t) {
        document.title = t;
        var i = document.createElement('iframe');
        i.src = '//m.baidu.com/favicon.ico';
        i.style.display = 'none';
        i.onload = function() {
            setTimeout(function(){
                i.remove();
            }, 9)
        };
        document.body.appendChild(i);

    };
    audioAutoPlay = function (obj) {
        if (window.HTMLAudioElement) {
            if (obj.paused) {
                obj.play();
            } else {
                obj.pause();
            }
        }
        document.addEventListener("WeixinJSBridgeReady", function () {
            obj.play();
        }, false);
    };

    return{
        init:init,
        send : send,
        changeTitle:changeTitle,
        audioAutoPlay:audioAutoPlay
    }
})();