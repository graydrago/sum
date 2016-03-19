window.addEventListener("load", function() {
    var RULER_STEP = 39,
        SCREEN;
   
    // ----- Arrow -----
    function Arrow(from, to, callback) {
        var that = this;
        this._from = from;
        this._to = to;
        this._height = 100;
        this._input = undefined;
        this._element = undefined;
        this._draw = false;
        this._callback = callback;
        this._x = 0;
        this._y = 100;
    }

    Arrow.prototype.setPos = function(x, y) {
        this._x = x;
        this._y = y;
    };

    Arrow.prototype.getNumber = function() {
        return this._to - this._from;
    };

    Arrow.prototype.isRightNumber = function() {
        return this._input.value == this.getNumber();
    };

    Arrow.prototype.getNumber = function() {
        return this._to - this._from;
    };

    Arrow.prototype.bindElement = function(element) {
        this._element = element;
        this._element.innerHTML = this.getNumber();
    };

    Arrow.prototype.enable = function() {
        var input = document.createElement("input"),
            inputBounds,
            that = this;
            
        var arrow = createSvgArrow((this._to - this._from) * RULER_STEP);
        arrow.image.style.position = "absolute";
        arrow.image.style.left = this._x + (this._from * RULER_STEP) + "px";
        arrow.image.style.top = this._y - arrow.height + "px";
        SCREEN.appendChild(arrow.image);

        input.type = "text";
        input.style.position = "absolute";
        SCREEN.appendChild(input);
        inputBounds = input.getBoundingClientRect();
        input.style.left = (this._x - inputBounds.width / 2) +
                this._from * RULER_STEP + ((this._to - this._from) * RULER_STEP / 2) + "px";
        input.style.top = this._y - arrow.height - inputBounds.height + "px";
        input.class = "arrow_input_box";

        input.addEventListener("input", function(event) {
            if (that.isRightNumber()) {
                that._input.style.display = "none";

                var number = document.createElement("span");
                number.innerHTML = that.getNumber();
                number.style.position = "absolute";
                number.style.left = that._input.style.left;
                number.style.top = that._input.style.top;
                SCREEN.appendChild(number);

                that._element.className = "";
                event.target.className = "";
                if (isFunction(that._callback)) {
                    that._callback();
                }
            } else {
                event.target.className = "wrong-input";
                that._element.className = "wrong";
            }
        });

        this._input = input;
        this._draw = true;

        input.focus();
    };
    // ----------------

    // ----- Ruler -----
    function Ruler(uri, posX, posY) {
        this._image = new Image();
        this._image.src = uri;
        this._x = posX;
        this._y = posY;
        this._offsetX = 0;
        this._offsetY = 0;
    }

    Ruler.prototype.drawImage = function() {
        this._image.style.position = "absolute";
        this._image.style.left = this._x + "px";
        this._image.style.top = this._y + "px";
        this._image.style["z-index"] = -1;
        SCREEN.appendChild(this._image);
    };

    Ruler.prototype.setOffset = function(offsetX, offsetY) {
        this._offsetX = offsetX;
        this._offsetY = offsetY;
    };

    Ruler.prototype.getOffsetX = function() {
        return this._x + this._offsetX;
    };

    Ruler.prototype.getOffsetY = function() {
        return this._y + this._offsetY;
    };

    Ruler.prototype.getCenter = function() {
        return this._x + RULER_STEP * 10;
    };
    // -----------------
    
    // ----- Finctions -----
    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    function createSvgArrow(width) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            curve = document.createElementNS("http://www.w3.org/2000/svg", "path"),
            arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
            height = width * 0.3;

        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/",
                           "xmlns:xlink",
                           "http://www.w3.org/1999/xlink");

        curve.setAttribute("d",
                "M"+0+" "+height+" "+
                "C "+width*0.2+" "+(0)+", "+
                  (width-width*0.2)+" "+(0)+", "+
                  width+" "+height);
        curve.setAttribute("stroke", "red");
        curve.setAttribute("stroke-width", "2");
        curve.setAttribute("fill", "transparent");

        arrow.setAttribute("d",
                "M"+width+" "+height+" "+
                "L "+(width - width*0.06)+" "+(height - height*0.11)+" "+
                "M"+width+" "+height+" "+
                "L "+(width - width*0.02)+" "+(height - height*0.23)+" ");
        arrow.setAttribute("stroke", "red");
        arrow.setAttribute("stroke-width", "2");

        svg.appendChild(arrow);
        svg.appendChild(curve);

        return { image: svg, width: width, height: height };
    }
    
    function init() {
        var resultInput = document.getElementById("result_input"),
            expression = document.getElementById("expression"),
            expressionWidth = 0,
            result = document.getElementById("result"),
            ruler = new Ruler("ruler.png", 30, 200),
            firstNumber,
            secondNumber,
            a, b, c;

        SCREEN = document.getElementById("screen");

        // Ruler
        ruler.setOffset(35, 20);
        ruler.drawImage();

        // Expression
        for (var i in expression.childNodes) {
            var item = expression.childNodes[i];

            if (item.tagName == "SPAN" ) {
                expressionWidth += item.getBoundingClientRect().width;
            }
        }
        expression.style.left = ruler.getCenter() - expressionWidth / 2 + "px";

        // Conditions
        a = Math.round(Math.random() * (9 - 6) + 6);
        c = Math.round(Math.random() * (14 - 11) + 11);
        b = c - a;
        console.log(a, b , c);

        // Arrows
        firstNumber = new Arrow(0, a, function() {
            secondNumber.enable();
        });

        secondNumber = new Arrow(a, c, function() {
            result.style.display = "none";
            resultInput.style.display = "inline";
            resultInput.addEventListener("input", function(event) {
                var sum = firstNumber.getNumber() + secondNumber.getNumber();
                if (sum === parseInt(event.target.value)) {
                    result.innerHTML = sum;
                    resultInput.style.display = "none";
                    result.style.display = "inline";
                    alert("You are awesome!!! ᕕ( ᐛ )ᕗ");
                } else {
                    event.target.className = "wrong-input";
                }
            });
            resultInput.focus();
        });

        firstNumber.setPos(ruler.getOffsetX(), ruler.getOffsetY());
        secondNumber.setPos(ruler.getOffsetX(), ruler.getOffsetY());

        firstNumber.bindElement(document.getElementById("first_number"));
        secondNumber.bindElement(document.getElementById("second_number"));

        firstNumber.enable();
    }
    // ---------------------

    init();
});

