import PhotoResize from '../src/photo-resize';
import TEST_DATA from '../testdatas/testdata';
import piexif from '../src/plugins/piexif';

describe('instantiate', function() {
    it('photo-resize instantiate', () => {
        const photoResize = new PhotoResize();
        expect(photoResize).toBeDefined();
    });
});

describe('exif test', function() {
    it('exif load', () => {
        const photoResize = new PhotoResize();
        const result = photoResize.loadExif(TEST_DATA);
        //console.log(photoResize.exifHTML());
        expect(result).toBeDefined();
    });
    it('get orientation test.', () =>{
        const photoResize = new PhotoResize();
        const result = photoResize.loadExif(TEST_DATA);
        expect(photoResize.getOrientation()).toBe(1);

    });
    it('get image size.', () =>{
        const photoResize = new PhotoResize();
        photoResize.loadExif(TEST_DATA);
        const result = photoResize.getImageSize();
        expect(result[0]).toBe(320);
        expect(result[1]).toBe(240);
    });
});

describe('resize test.', () => {
    var resizeddata = "";
    const photoResize = new PhotoResize();
    beforeEach((done) => {
        var callback = (data) => {
            resizeddata = data;
            done();
        }
        photoResize.resize(TEST_DATA, 200, 200, callback, false);
    });

    it('resize test.', () => {
        var exif;
        expect(resizeddata.length).toBeLessThan(TEST_DATA.length);
        exif = piexif.load(resizeddata);
        expect(exif['0th'][piexif.ImageIFD.ImageWidth]).toBe(200);
        expect(exif['0th'][piexif.ImageIFD.ImageLength]).toBe(150);
        expect(exif['Exif'][piexif.ExifIFD.PixelXDimension]).toBe(200);
        expect(exif['Exif'][piexif.ExifIFD.PixelYDimension]).toBe(150);
    });
});

function dispSize (prefix, data) {
    var exifObj = piexif.load(data);
    console.log("----"+prefix);
    console.log("imagesize="+exifObj['0th'][piexif.ImageIFD.ImageWidth]+","+exifObj['0th'][piexif.ImageIFD.ImageLength]);
    console.log("exifsize="+exifObj['Exif'][piexif.ExifIFD.PixelXDimension]+","+exifObj['Exif'][piexif.ExifIFD.PixelYDimension]);
}

describe('resize test2.', () => {
    var resizeddata = "";
    const photoResize = new PhotoResize();
    beforeEach((done) => {
        var callback = (data) => {
            resizeddata = data;
            done();
        }
        photoResize.resize(TEST_DATA, 2000, 2000, callback, false);
    });

    it('cancel sizeup.', () => {
        var exif;
        expect(resizeddata.length).toBe(TEST_DATA.length);
        exif = piexif.load(resizeddata);
        expect(exif['Exif'][piexif.ExifIFD.PixelXDimension]).toBe(320);
        expect(exif['Exif'][piexif.ExifIFD.PixelYDimension]).toBe(240);
    });
});

describe('resize test3.', () => {
    var resizeddata = "";
    const photoResize = new PhotoResize();
    beforeEach((done) => {
        var callback = (data) => {
            resizeddata = data;
            done();
        }
        photoResize.resize(TEST_DATA, 600, 600, callback, true);
    });

    it('sizeup test.', () => {
        var exif;
        expect(resizeddata.length).toBeGreaterThan(TEST_DATA.length);
        exif = piexif.load(resizeddata);
        expect(exif['0th'][piexif.ImageIFD.ImageWidth]).toBe(600);
        expect(exif['0th'][piexif.ImageIFD.ImageLength]).toBe(600*240/320);
        expect(exif['Exif'][piexif.ExifIFD.PixelXDimension]).toBe(600);
        expect(exif['Exif'][piexif.ExifIFD.PixelYDimension]).toBe(600*240/320);
    });
});

describe('exif test.', () => {

});

describe('rotation test.', () => {

});
