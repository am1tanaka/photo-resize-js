import PhotoResize from '../src/photo-resize';
import TEST_DATA from '../testdatas/testdata';

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
    beforeEach((done) => {
        var callback = (data) => {
            resizeddata = data;
            done();
        }
        const photoResize = new PhotoResize();
        photoResize.resize(TEST_DATA, 200, 200, callback, false);
    });

    it('resize test.', () => {
        expect(resizeddata.length).toBeLessThan(TEST_DATA.length);
        console.log(resizeddata.length+"<"+TEST_DATA.length);
    });

});
