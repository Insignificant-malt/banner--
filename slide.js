/**
 * Created by yangwenjun on 2016/9/13.
 */

(function (w) {
    var Slide = function (config) {
        this._init(config);
    }
    /*获取id*/
    var id = function (id) {
        return document.getElementById(id);
    }
    /*初始化元素*/
    var initElements = function (config) {
        this.wrapper = id(config.wrapper);
        this.slideImg = id(config.slideBox).children;
        this.slideCircle = id(config.slideCircle).children;
        this.arrow = id(config.arrow);
        this.IsCircleShow = config.IsCircleShow;
        this.IsArrowShow = config.IsArrowShow;
        this.auto = config.auto;
        this.timeSpan = config.timeSpan;
        this.hover = config.hover;
    }
    /*动态生成按钮*/
    var createElement = function (config) {
        var slideImg = this.slideImg,
            olCircle = id(config.slideCircle),
            i = 0,
            Len = slideImg.length;
        for (; i < Len; i++) {
            var li = document.createElement("li");
            li.innerHTML = i + 1;
            olCircle.appendChild(li);
        }
        this.slideCircle[0].className = "current";
    }
    /*根据第一张图 动态克隆 并追加到最后*/
    var cloneFirstImg = function (config) {
        var last = this.slideImg[0].cloneNode(true);
        id(config.slideBox).appendChild(last);
    }
    /*获取图片的宽度*/
    var imgWidth = function () {
        return this.wrapper.children[0].offsetWidth;
    }
    /*初始化事件*/
    var initCircleEvent = function () {
        var self = this,
            slideCircle = this.slideCircle,
            i = 0,
            Len = slideCircle.length;
        for (; i < Len; i++) {
            slideCircle[i].index = i;
            slideCircle[i].onmouseover = function () {
                self.changeCircle(this);
            }
        }
    }
    var initArrowEvent = function () {
        var self = this,
            left = this.arrow.children[0],
            right = this.arrow.children[1];
        left.onclick = function () {
            self.changeLeftArrow()
        }
        right.onclick = function () {
            self.changeRightArrow()
        }
    }
    Slide.prototype = {
        constructor: Slide,
        _init: function (config) {
            this.flag = 0;
            this.flag_o = 0;
            this.timer = null;
            initElements.call(this, config);
            if (this.IsCircleShow !== false) {
                createElement.call(this, config);
                initCircleEvent.call(this);
            }
            cloneFirstImg.call(this, config);

            if (this.auto !== false) {
                this.autoplay()
            }
            if (this.hover !== false) {
                this.isHover()
            }
            if (this.IsArrowShow !== false) {
                this.ArrowShow();
                initArrowEvent.call(this);
            }
        },
        changeCircle: function (obj) {
            var slideCircle = this.slideCircle,
                slideImg = this.slideImg,
                i = 0,
                Len = slideCircle.length;
            for (; i < Len; i++) {
                slideCircle[i].className = "";
            }
            obj.className = "current";
            /*移动图片*/
            var target = -obj.index * (imgWidth.call(this));
            var slideBox = slideImg[0].parentNode;
            this.animate(slideBox, target);
            this.flag = this.flag_o = obj.index;
        },
        changeRightArrow: function () {
            var slideCircle = this.slideCircle,
                slideImg = this.slideImg
            if (this.flag == slideImg.length - 1) {
                slideImg[0].parentNode.style.left = 0;
                this.flag = 0;
            }
            (this.flag)++;
            var target = -(this.flag) * (imgWidth.call(this));
            var slideBox = slideImg[0].parentNode;
            this.animate(slideBox, target);
            /*按钮也跟着变化*/
            if (this.IsCircleShow === true) {
                if (this.flag_o < slideCircle.length - 1) {
                    (this.flag_o)++;
                } else {
                    this.flag_o = 0;
                }
                for (var i = 0; i < slideCircle.length; i++) {
                    slideCircle[i].className = "";
                }
                slideCircle[this.flag_o].className = "current";
            }
        },
        changeLeftArrow: function () {
            var slideCircle = this.slideCircle,
                slideImg = this.slideImg
            if (this.flag === 0) {
                slideImg[0].parentNode.style.left = -(slideImg.length - 1) * (imgWidth.call(this)) + "px";
                this.flag = slideImg.length - 1;
            }
            (this.flag)--;
            var target = -(this.flag) * (imgWidth.call(this));
            var slideBox = slideImg[0].parentNode;
            this.animate(slideBox, target);
            /*按钮也跟着变化*/
            if (this.IsCircleShow === true) {
                if (this.flag_o > 0) {
                    (this.flag_o)--;
                } else {
                    this.flag_o = slideCircle.length - 1;
                }
                for (var i = 0; i < slideCircle.length; i++) {
                    slideCircle[i].className = "";
                }
                slideCircle[this.flag_o].className = "current";
            }
        },
        autoplay: function () {
            var self = this;
            self.timer = setInterval(function () {
                self.changeRightArrow()
            }, self.timeSpan || 1000);
        },
        ArrowShow: function () {
            var self = this,
                wrapper = this.wrapper;
            wrapper.addEventListener("mouseover" , function () {
                arrow.style.display = "block";
            });
            wrapper.addEventListener("mouseout" , function () {
                arrow.style.display = "none";
            })
        },
        isHover: function () {
            var self = this,
                wrapper = this.wrapper;
            wrapper.addEventListener("mouseenter" , function () {
                clearInterval(self.timer);
            });
            wrapper.addEventListener("mouseleave" , function () {
                self.timer = setInterval(function () {
                    self.changeRightArrow()
                }, self.timeSpan || 2000);
            });
        },
        animate: function (obj, target) {
            clearInterval(obj.timer);
            obj.timer = setInterval(function () {
                var leader = obj.offsetLeft;
                var step = 30;
                step = leader < target ? step : -step;
                if (Math.abs(target - leader) >= Math.abs(step)) {
                    leader = leader + step;
                    obj.style.left = leader + "px";
                } else {
                    obj.style.left = target + "px";
                    clearInterval(obj.timer);
                }
            }, 15);
        }
    }
    w.Slide = Slide;
})(window)
