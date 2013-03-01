importScripts("RegionCalculator.js");

self.onmessage = function (e) {
    var location = e.data.location;
    var image = e.data.image;

    msv.calculateRegion(location, image);

    self.postMessage({ result: image.data, index: image.index });
};