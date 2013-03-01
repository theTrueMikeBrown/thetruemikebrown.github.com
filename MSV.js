(function () {
    var msvScreen = {};

    msvScreen.calculateImage = function (location, image, splits) {
        var xRatio = (image.width > image.height ? image.width / image.height : 1) / location.zoom,
            yRatio = (image.height > image.width ? image.height / image.width : 1) / location.zoom,
            delta = xRatio * 2 / image.width;

        var xStart,
            yStart;

        if (!window.Worker) {
            xStart = location.x - xRatio;
            yStart = location.y - yRatio;

            msvScreen.calculateRegion(
                { xStart: xStart, yStart: yStart, delta: delta, maxIter: location.maxIter },
                { height: image.height, width: image.width, data: image.data.data, context: image.context, fullWidth: image.width }
            );
            return;
        }

        var blockSize = image.height / splits;
        for (var i = 0; i < splits; i++) {
            var finished = 0;

            var onWorkEnded = function (e) {
                var outData = e.data.result;
                var outIndex = e.data.index;

                image.context.putImageData(outData, 0, blockSize * outIndex);

                finished++;
            };

            xStart = location.x - xRatio;
            yStart = location.y - yRatio + 2 * yRatio * i / splits;

            var worker = new Worker("Worker.js");
            worker.onmessage = onWorkEnded;

            var canvasData = image.context.createImageData(image.width, blockSize);

            worker.postMessage({
                location: { xStart: xStart, yStart: yStart, delta: delta, maxIter: location.maxIter },
                image: { index: i, splits: splits, data: canvasData }
            });
        }
    };

    window.addEventListener('load', function () {
        msvScreen.x = 0; //-1.7799900799981,
        msvScreen.y = 0;
        msvScreen.zoom = .5; //10000000000000,
        msvScreen.maxIter = 256; //65535,
        msvScreen.splits = 2; //8;
        msvScreen.go = 1; //8;        

        var searchString = window.location.search.substring(1),
            i,
            val,
            params = searchString.split("&");

        for (i = 0; i < params.length; i++) {
            val = params[i].split("=");
            if (val[0] === "x") {
                msvScreen.x = val[1];
            }
            else if (val[0] === "y") {
                msvScreen.y = val[1];
            }
            else if (val[0] === "z") {
                msvScreen.zoom = val[1];
            }
            else if (val[0] === "m") {
                msvScreen.maxIter = val[1];
            }
            else if (val[0] === "s") {
                msvScreen.splits = val[1];
            }
            else if (val[0] === "g") {
                msvScreen.go = val[1];
            }
        }

        if(msvScreen.go !== 0) {
            return;
        }

        var canvasHeight = $(window).height() - 20,
            canvasWidth = $(window).width() - 10,
            canvasDiv = document.getElementById('canvasDiv'),
            canvas = document.createElement('canvas'),
            context = canvas.getContext("2d"),
            imageData = context.createImageData(canvasWidth, canvasHeight);

        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        canvas.setAttribute('id', 'canvas');
        canvasDiv.appendChild(canvas);

        if (typeof window.G_vmlCanvasManager != 'undefined') {
            canvas = window.G_vmlCanvasManager.initElement(canvas);
        }

        msvScreen.height = canvasHeight;
        msvScreen.width = canvasWidth;
        msvScreen.context = context;
        msvScreen.imageData = imageData;

        msvScreen.calculateImage(
            { x: msvScreen.x, y: msvScreen.y, zoom: msvScreen.zoom, maxIter: msvScreen.maxIter },
            { height: msvScreen.height, width: msvScreen.width, context: msvScreen.context, data: msvScreen.imageData },
            msvScreen.splits
        );

        $("#canvasDiv canvas").click(function (event) {
            var position = getPosition(event);

            var xRatio = (this.width > this.height ? this.width / this.height : 1) / msvScreen.zoom,
                yRatio = (this.height > this.width ? this.height / this.width : 1) / msvScreen.zoom,
                delta = xRatio * 2 / this.width;

            var xStart = msvScreen.x - xRatio,
                yStart = msvScreen.y - yRatio,
                xVal = position.x * delta + xStart,
                yVal = position.y * delta + yStart;


            switch (event.which) {
                case 1:
                    msvScreen.x = xVal;
                    msvScreen.y = yVal;
                    break;
                case 2:
                    msvScreen.zoom = msvScreen.zoom * 1.5;
                    break;
                case 3:
                    msvScreen.zoom = msvScreen.zoom / 1.5;
                    break;
                default:
                    alert('You have a strange mouse');
            }

            //alert("x:" + msvScreen.x + "y:" + msvScreen.y);

            msvScreen.calculateImage(
                { x: msvScreen.x, y: msvScreen.y, zoom: msvScreen.zoom, maxIter: msvScreen.maxIter },
                { height: msvScreen.height, width: msvScreen.width, context: msvScreen.context, data: msvScreen.imageData },
                msvScreen.splits
            );
        });
    }, false);

    function getPosition(e) {
        var targ = {};
        if (!e)
            e = window.event;
        if (e.target)
            targ = e.target;
        else if (e.srcElement)
            targ = e.srcElement;
        if (targ.nodeType == 3)
            targ = targ.parentNode;
        var x = e.pageX - $(targ).offset().left;
        var y = e.pageY - $(targ).offset().top;
        return { "x": x, "y": y };
    };
})();
