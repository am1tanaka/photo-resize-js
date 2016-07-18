jest.unmock('../src/photo-resize');

import PhotoResize from '../src/photo-resize';

describe('instantiate', function() {
    it('photo-resize instantiate', function() {
        var photoResize = new PhotoResize();
        expect(photoResize).toBeDefined();
    });
});
