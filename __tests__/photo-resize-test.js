jest.unmock('../src/photo-resize');
jest.unmock('../testdatas/testdata');
jest.unmock('../src/plugins/piexif');

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
        expect(result).toBeDefined();
    });
});
