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

msv.calcPixel = function (pixel, location, image, colors) {
    var x = pixel.x * location.delta + location.xStart,
        y = pixel.y * location.delta + location.yStart,
        xc = 0,
        yc = 0,
        xs = xc * xc,
        ys = yc * yc,
        escape = 4 - xs - ys,
        iter = 0;

    while (escape >= 0 && iter < location.maxIter) {
        yc = 2 * xc * yc + y;
        xc = xs - ys + x;
        iter++;
        xs = xc * xc;
        ys = yc * yc;
        escape = 4 - xs - ys;
    }

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
