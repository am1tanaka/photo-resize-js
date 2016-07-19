import PhotoResize from './photo-resize';
import TEST_DATA from '../testdatas/testdata';
import piexif from './plugins/piexif.js';

var photoResize = new PhotoResize();
var exifObj = photoResize.loadExif(TEST_DATA);
var output = photoResize.exifHTML(exifObj);
document.getElementById('exif-result').innerHTML = output;
