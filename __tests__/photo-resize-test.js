import TEST_DATA from '../testdatas/testdata';
var USE_WORKER = false;

describe('instantiate', function() {
    it('photo-resize instantiate', () => {
        const photoResize = new PhotoResize(USE_WORKER);
        expect(photoResize).toBeDefined();
    });
});

describe('exif test', function() {
    it('exif load', () => {
        const photoResize = new PhotoResize(USE_WORKER);
        const result = photoResize._loadExif(TEST_DATA);
        //console.log(photoResize.exifHTML());
        expect(result).toBeDefined();
    });
    it('get orientation test.', () =>{
        const photoResize = new PhotoResize(USE_WORKER);
        const result = photoResize._loadExif(TEST_DATA);
        expect(photoResize.getOrientation()).toBe(1);

    });
});

describe('resize test.', () => {
    var resizeddata = "";
    var photoResize;
    beforeEach((done) => {
        photoResize = new PhotoResize(USE_WORKER);
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

describe('resize test2.', () => {
    var resizeddata = "";
    var photoResize;
    beforeEach((done) => {
        photoResize = new PhotoResize(USE_WORKER);
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
    var photoResize;
    beforeEach((done) => {
        photoResize = new PhotoResize(USE_WORKER);
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

describe('dataURL decode test.', () => {
    it('dataURL decode test.', () => {
        var data = PhotoResize.convDataURL2Binary(TEST_DATA);
        expect(data.length).toBe(29006);
    });
});

describe('orientation test.', () => {
    var resizeddata = "";
    var photoResize;
    beforeEach((done) => {
        photoResize = new PhotoResize(USE_WORKER);
        // 右に90度回転
        var exif = piexif.load(TEST_DATA);
        exif['0th'][piexif.ImageIFD.Orientation] = 6;
        var exifStr = piexif.dump(exif);
        var changed = piexif.insert(exifStr, TEST_DATA);

        var callback = (data) => {
            resizeddata = data;
            done();
        }
        photoResize.resize(changed, 200, 160, callback, true);
    });

    it('orientation test.', () => {
        // チェック
        photoResize._loadExif(resizeddata);
        var size = photoResize.getImageSize();
        expect(size[0]).toBe(120);
        expect(size[1]).toBe(160);
    });
});

function dispSize (prefix, data) {
    var exifObj = piexif.load(data);
    console.log("----"+prefix);
    console.log("imagesize="+exifObj['0th'][piexif.ImageIFD.ImageWidth]+","+exifObj['0th'][piexif.ImageIFD.ImageLength]);
    console.log("exifsize="+exifObj['Exif'][piexif.ExifIFD.PixelXDimension]+","+exifObj['Exif'][piexif.ExifIFD.PixelYDimension]);
}
