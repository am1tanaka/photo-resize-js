jest.unmock('../src/photo-resize')
    .unmock('../testdatas/testdata')
    .unmock('../src/plugins/piexif');

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
    it('resize test.', () => {
        const photoResize = new PhotoResize();
        var callback = jest.genMockFunction();
        photoResize.resize(TEST_DATA, 200, 200, callback, false);
        console.log(callback);
        //expect(callback.mock.calls[0]).toBeDefined();
    });
});
