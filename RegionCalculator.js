var msv = {};

msv.hToRgb = function (h) {
    var r, g, b;

    function hue2Rgb(t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return 6 * t;
        if (t < 1 / 2) return 1;
        if (t < 2 / 3) return (2 / 3 - t) * 6;
        return 0;
    }

    r = hue2Rgb(h + 1 / 3);
    g = hue2Rgb(h);
    b = hue2Rgb(h - 1 / 3);

    return [r * 255, g * 255, b * 255];
};

msv.calculateRegion = function (location, image) {
    var colors = new Array();
    
    colors[location.maxIter * 3] = 0;
    colors[location.maxIter * 3 + 1] = 0;
    colors[location.maxIter * 3 + 2] = 0;

    for (var j = 0; j < image.data.height; j++) {
        for (var i = 0; i < image.data.width; i++) {
            msv.calcPixel({ x: i, y: j }, location, { data: image.data.data, fullWidth: image.data.width }, colors);
        }
    }

    //if (offset != 0) {
    //    throw JSON.stringify({ data: image.data.height });
    //}
};

//msv.calcPixel = function (pixel, location, image, colors) {
//    var x = pixel.x * location.delta + location.xStart;
//    var y = pixel.y * location.delta + location.yStart;
//    var xCurrent = 0;
//    var yCurrent = 0;
//    var xSquared = xCurrent * xCurrent;
//    var ySquared = yCurrent * yCurrent;
//    var escape = 4 - xSquared - ySquared;
//    var iter = 0;
//
//    while (escape >= 0 && iter < location.maxIter) {
//        yCurrent = 2 * xCurrent * yCurrent + y;
//        xCurrent = xSquared - ySquared + x;
//        iter++;
//        xSquared = xCurrent * xCurrent;
//        ySquared = yCurrent * yCurrent;
//        escape = 4 - xSquared - ySquared;
//    }
//
//    if (!((iter * 3 + 0) in colors)) {
//        var rgb = msv.hToRgb(iter / location.maxIter);
//        colors[iter * 3 + 0] = rgb[0];
//        colors[iter * 3 + 1] = rgb[1];
//        colors[iter * 3 + 2] = rgb[2];
//    }
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 0] = colors[iter * 3 + 0];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 1] = colors[iter * 3 + 1];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 2] = colors[iter * 3 + 2];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 3] = 255;
//};


//z^3+(c-1)z-c
//c=0.3+1.64i

//z^3+(-0.7+1.64i)z-(0.3+1.64i)


//z-(z^3+(-0.7+1.64i)z-(0.3+1.64i))/(3(z^2-(7/30-41/75*i)))

//(x+y*i)-((x+y*i)^3+(-0.7+1.64*i)(x+y*i)-(0.3+1.64*i))/(3((x+y*i)^2-(7/30-41/75*i)))


// var d1 = x*x - y*y - 7/30;
// var d2 = 2*x*y + 41/75;
// var d = d1^2 + d2^2;
// var xCurrent = x - (1.09333*x*x*y)/d + (0.1*x*x)/d + (1.09333*x*y)/d - (0.353289*x)/d - (0.1*y*y)/d + 0.275511/d - (x*y*y*y*y)/(3 d) - (0.364444*y*y*y)/d - x*x*x*x*x/(3 d) - (2*x*x*x*y*y)/(3 d) + (0.311111*x*x*x)/d;
// var yCurrent = y - (1.09333*x*y*y)/d - (0.546667*y*y)/d - (0.2*x*y)/d - (0.353289*y)/d + (0.546667*x*x)/d - 0.182222/d - y*y*y*y*y/(3 d) - (2*x*x*y*y*y)/(3 d) - (0.311111*y*y*y)/d - (x*x*x*x*y)/(3 d) - (0.364444*x*x*x)/d;

var smallNum = 0.00001;
var n1 = 1.09333;//1.09333;
var n2 = 0.353289;//0.353289;
var n3 = 0.275511;//0.275511;
var n4 = 0.364444;//0.364444;
var n5 = 0.311111;//0.311111;
var n6 = 0.546667;//0.546667;
var n7 = 0.182222;//0.182222;
msv.calcPixel = function (pixel, location, image, colors) {
    var x = pixel.x * location.delta + location.xStart;
    var y = pixel.y * location.delta + location.yStart;

    var d1 = x*x - y*y - 7/30;
    var d2 = 2*x*y + 41/75;
    var d = d1*d1 + d2*d2;
    var xCurrent = x - (n1*x*x*y)/d + (0.1*x*x)/d + (n1*x*y)/d - (n2*x)/d - (0.1*y*y)/d + n3/d - (x*y*y*y*y)/(3*d) - (n4*y*y*y)/d - x*x*x*x*x/(3*d) - (2*x*x*x*y*y)/(3*d) + (n5*x*x*x)/d;
    var yCurrent = y - (n1*x*y*y)/d - (n6*y*y)/d - (0.2*x*y)/d - (n2*y)/d + (n6*x*x)/d - n7/d - y*y*y*y*y/(3*d) - (2*x*x*y*y*y)/(3*d) - (n5*y*y*y)/d - (x*x*x*x*y)/(3*d) - (n4*x*x*x)/d;

    var xL = 9999;
    var yL = 9999;
    var escape = (xCurrent - xL) * (xCurrent - xL) + (yCurrent - yL) * (yCurrent - yL) - smallNum;
    var iter = 0;

    while (escape >= 0 && iter < location.maxIter) {
        xL = xCurrent;
        yL = yCurrent;

    d1 = xL*xL - yL*yL - 7/30;
    d2 = 2*xL*yL + 41/75;
    d = d1*d1 + d2*d2;
    xCurrent = xL - (n1*xL*xL*yL)/d + (0.1*xL*xL)/d + (n1*xL*yL)/d - (n2*xL)/d - (0.1*yL*yL)/d + n3/d - (xL*yL*yL*yL*yL)/(3*d) - (n4*yL*yL*yL)/d - xL*xL*xL*xL*xL/(3*d) - (2*xL*xL*xL*yL*yL)/(3*d) + (n5*xL*xL*xL)/d + x;
    yCurrent = yL - (n1*xL*yL*yL)/d - (n6*yL*yL)/d - (0.2*xL*yL)/d - (n2*yL)/d + (n6*xL*xL)/d - n7/d - yL*yL*yL*yL*yL/(3*d) - (2*xL*xL*yL*yL*yL)/(3*d) - (n5*yL*yL*yL)/d - (xL*xL*xL*xL*yL)/(3*d) - (n4*xL*xL*xL)/d + y;

        escape = (xCurrent - xL) * (xCurrent - xL) + (yCurrent - yL) * (yCurrent - yL) - smallNum;
        iter++;
    }

    iter = iter * 10;
    
    if (!((iter * 3 + 0) in colors)) {
        var rgb = msv.hToRgb(iter / location.maxIter);
        colors[iter * 3 + 0] = rgb[0];
        colors[iter * 3 + 1] = rgb[1];
        colors[iter * 3 + 2] = rgb[2];
    }
    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 0] = colors[iter * 3 + 0];
    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 1] = colors[iter * 3 + 1];
    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 2] = colors[iter * 3 + 2];
    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 3] = 255;
};

////z^3+(l-1)z+l
////L=0.3+1.64i
//
////z^3+(-0.7+1.64i)z+0.3+1.64i
////z-(z^3+(-0.7+1.64i)z+0.3+1.64i)/(3(z^2-(7/30-41/75*i)))
//
////(x+y*i)-((x+y*i)^3+(-0.7+1.64*i)(x+y*i)+0.3+1.64*i)/(3((x+y*i)^2-(7/30-41/75*i)))
//
//// var d=((150 (x^2 - y*y) - 35)^2 + (300 x y + 82)^2);
//// var x=(24600 x^2 y)/d - (2250 x^2)/d + (10500 x y*y)/d - (24600 x y)/d + (2250 y*y)/d - 6199/d + (15000 x y*y*y*y)/d - (8200 y*y*y)/d + (15000 x^5)/d + (30000 x^3 y*y)/d - (3500 x^3)/d
//// var y=(24600 x y*y)/d + (12300 y*y)/d - (10500 x^2 y)/d + (4500 x y)/d - (12300 x^2)/d + 4100/d + (15000 y*y*y*y*y)/d + (30000 x^2 y*y*y)/d + (3500 y*y*y)/d + (15000 x^4 y)/d - (8200 x^3)/d
//
//// var d = (x*x - y*y - 7/30)^2 + (2*x*y + 41/75)^2;
//// var xCurrent = -(82*x*x*y)/(75*d) - x*x/(10*d) - (82*x*y)/(75*d) - (7949*x)/(22500*d) + y*y/(10*d) - 6199/(22500*d) - (x*y*y*y*y)/(3*d) - (82*y*y*y)/(225*d) - (x*x*x*x*x)/(3*d) - (2*x*x*x*y*y)/(3*d) + (14*x*x*x)/(45*d) + x
//// var yCurrent = -(82*x*y*y)/(75*d) + (41*y*y)/(75*d) + (x*y)/(5*d) - (7949*y)/(22500*d) - (41*x*x)/(75*d) + 41/(225*d) - (y*y*y*y*y)/(3*d) - (2*x*x*y*y*y)/(3*d) - (14*y*y*y)/(45*d) - (x*x*x*x*y)/(3*d) - (82*x*x*x)/(225*d) + y
//
//var smallNum = 0.0001;
//msv.calcPixel = function (pixel, location, image, colors) {
//    var x = pixel.x * location.delta + location.xStart;
//    var y = pixel.y * location.delta + location.yStart;
//
//    var d1 = x*x - y*y - 7/30;
//    var d2 = 2*x*y + 41/75;
//    var d = d1*d1 + d2*d2;
//    var xCurrent = x - (82*x*x*y)/(75*d) - x*x/(10*d) - (82*x*y)/(75*d) - (7949*x)/(22500*d) + y*y/(10*d) - 6199/(22500*d) - (x*y*y*y*y)/(3*d) - (82*y*y*y)/(225*d) - (x*x*x*x*x)/(3*d) - (2*x*x*x*y*y)/(3*d) + (14*x*x*x)/(45*d);
//    var yCurrent = y - (82*x*y*y)/(75*d) + (41*y*y)/(75*d) + (x*y)/(5*d) - (7949*y)/(22500*d) - (41*x*x)/(75*d) + 41/(225*d) - (y*y*y*y*y)/(3*d) - (2*x*x*y*y*y)/(3*d) - (14*y*y*y)/(45*d) - (x*x*x*x*y)/(3*d) - (82*x*x*x)/(225*d);
//
//    var xL = 9999;
//    var yL = 9999;
//    var escape = (xCurrent - xL) * (xCurrent - xL) + (yCurrent - yL) * (yCurrent - yL) - smallNum;
//    var iter = 0;
//
//    while (escape >= 0 && iter < location.maxIter) {
//        xL = xCurrent;
//        yL = yCurrent;
//
//        d1 = xL*xL - yL*yL - 7/30;
//        d2 = 2*xL*yL + 41/75;
//        d = d1*d1 + d2*d2;
//        xCurrent = xL - (82*xL*xL*yL)/(75*d) - xL*xL/(10*d) - (82*xL*yL)/(75*d) - (7949*xL)/(22500*d) + yL*yL/(10*d) - 6199/(22500*d) - (xL*yL*yL*yL*yL)/(3*d) - (82*yL*yL*yL)/(225*d) - (xL*xL*xL*xL*xL)/(3*d) - (2*xL*xL*xL*yL*yL)/(3*d) + (14*xL*xL*xL)/(45*d);
//        yCurrent = yL - (82*xL*yL*yL)/(75*d) + (41*yL*yL)/(75*d) + (xL*yL)/(5*d) - (7949*yL)/(22500*d) - (41*xL*xL)/(75*d) + 41/(225*d) - (yL*yL*yL*yL*yL)/(3*d) - (2*xL*xL*yL*yL*yL)/(3*d) - (14*yL*yL*yL)/(45*d) - (xL*xL*xL*xL*yL)/(3*d) - (82*xL*xL*xL)/(225*d);
//
//        escape = (xCurrent - xL) * (xCurrent - xL) + (yCurrent - yL) * (yCurrent - yL) - smallNum;
//        iter++;
//    }
//
//    iter = iter * 10;
//    
//    if (!((iter * 3 + 0) in colors)) {
//        var rgb = msv.hToRgb(iter / location.maxIter);
//        colors[iter * 3 + 0] = rgb[0];
//        colors[iter * 3 + 1] = rgb[1];
//        colors[iter * 3 + 2] = rgb[2];
//    }
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 0] = colors[iter * 3 + 0];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 1] = colors[iter * 3 + 1];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 2] = colors[iter * 3 + 2];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 3] = 255;
//};
//

//msv.calcPixel = function (pixel, location, image, colors) {
//    var x = pixel.x * location.delta + location.xStart;
//    var y = pixel.y * location.delta + location.yStart;
//    //var xCurrent = x * x * x - lr2 * x - 3 * x * y * y - li * y + lr + y;
//    //var yCurrent = 3 * x * x * y - y * y * y + lr2 * y + li * x + li + x;
//    var d = 3*(x*x+y*y)*(x*x+y*y);
//    var xCurrent = x+x*x/d-y*y/d-x*y*y*y*y/d-x*x*x*x*x/d-2*x*x*x*y*y/d;
//    var yCurrent = y-2*x*y/d-y*y*y*y*y/d-2*x*x*y*y*y/d-x*x*x*x*y/d;
//    var xL = 9999;
//    var yL = 9999;
//    var escape = (xCurrent - xL) * (xCurrent - xL) + (yCurrent - yL) * (yCurrent - yL) - smallNum;
//    var iter = 0;
//
//    while (escape >= 0 && iter < location.maxIter) {
//        xL = xCurrent;
//        yL = yCurrent;
//        //xCurrent = xLast * xLast * xLast - lr2 * xLast - 3 * xLast * yLast * yLast - li * yLast + lr + y;
//        //yCurrent = 3 * xLast * xLast * yLast - yLast * yLast * yLast + lr2 * yLast + li * xLast + li + x;
//        d = 3*(xL*xL+yL*yL)*(xL*xL+yL*yL);
//        xCurrent = xL+xL*xL/d-yL*yL/d-xL*yL*yL*yL*yL/d-xL*xL*xL*xL*xL/d-2*xL*xL*xL*yL*yL/d;
//        yCurrent = yL-2*xL*yL/d-yL*yL*yL*yL*yL/d-2*xL*xL*yL*yL*yL/d-xL*xL*xL*xL*yL/d;
//        escape = (xCurrent - xL) * (xCurrent - xL) + (yCurrent - yL) * (yCurrent - yL) - smallNum;
//        iter++;
//    }
//
//    iter = iter * 10;
//    
//    if (!((iter * 3 + 0) in colors)) {
//        var rgb = msv.hToRgb(iter / location.maxIter);
//        colors[iter * 3 + 0] = rgb[0];
//        colors[iter * 3 + 1] = rgb[1];
//        colors[iter * 3 + 2] = rgb[2];
//    }
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 0] = colors[iter * 3 + 0];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 1] = colors[iter * 3 + 1];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 2] = colors[iter * 3 + 2];
//    image.data[(pixel.x * 4 + pixel.y * image.fullWidth * 4) + 3] = 255;
//};
