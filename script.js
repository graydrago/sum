window.addEventListener("load", function() {
    var SCREEN_WIDTH = 800,
        SCREEТ_HEIGHT = 600,
        SCREEN,
        CTX;
   
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
    }

    Arrow.prototype.getNumber = function() {
        return this._to - this._from;
    };

    Arrow.prototype.isRightNumber = function() {
        return this._input.value == this.getNumber();
    };

    Arrow.prototype.draw = function(ctx) {
        if (!this._draw) {
            return;
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this._from, this._height);
        ctx.lineTo(this._to, this._height);
        ctx.stroke();
        ctx.restore();
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
            that = this;
            
        input.type = "text";
        input.style.position = "absolute";
        input.style.left = this._from + ((this._to - this._from) / 2) + "px";
        input.style.top = this._height - 30 + "px";
        input.class = "arrow_input_box";

        input.addEventListener("input", function(event) {
            if (that.isRightNumber()) {
                that._element.className = "";
                event.target.className = "";
                if (isFunction(that._callback)) {
                    that._callback();
                }
            } else {
                event.target.className = "wrongInput";
                that._element.className = "wrong";
            }
        });

        this._input = input;
        this._draw = true;

        SCREEN.appendChild(this._input);
    };
    // ----------------
    
    // ----- Expression ------
    function Expression(firstNumber, secondNumber) {
        this._firstNumber = firstNumber;
        this._secondNumber = secondNumber;
    }

    function init() {
        var canvas,
            firstNumber,
            secondNumber,
            expression;

        SCREEN = document.getElementById("screen");
        canvas = document.getElementById("canvas");
        canvas.width  = SCREEN_WIDTH;
        canvas.height = SCREEТ_HEIGHT;

        SCREEN.appendChild(canvas);

        CTX = canvas.getContext("2d");
        firstNumber = new Arrow(10, 200, function() {
            secondNumber.enable();
        });
        secondNumber = new Arrow(210, 300);

        firstNumber.bindElement(document.getElementById("first_number"));
        secondNumber.bindElement(document.getElementById("second_number"));

        firstNumber.enable();
        function animation(time) {
            firstNumber.draw(CTX);
            secondNumber.draw(CTX);
            window.requestAnimationFrame(animation);
        }
        window.requestAnimationFrame(animation);
    }

    init();
});

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
