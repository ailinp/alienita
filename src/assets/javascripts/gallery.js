$(document).ready(function() {
    var galleryMainImage        = $('.js-galleryMainImage > img'),
        galleryThumbContainer   = $('.js-thumbnails'),
        galleryThumbnail        = $('.js-galleryItem'),
        galleryColorTest        = $('.js-galleryItemTest'),
        galleryTitle            = $('.js-galleryItemTitle'),
        galleryCallToAction     = $('.js-galleryCallToAction'),
        activeClass             = 'is-active';

    galleryThumbnail.on('click', function(event) {

        event.preventDefault();
        var slug  = $(this).data('slug'),
            title = $(this).data('title'),
            url   = $(this).attr('href');
            //utmProduct = $(this).data('utmproduct'),
            //src   = galleryMainImage.attr('src'),
            //testSrc = galleryColorTest.attr('src'),
            //mainImageName = 'nails-main-'+ slug +'.jpg',
            //colorTestName = 'nails-test-'+ slug +'.png';
            //newMain, newTest;

        galleryThumbContainer.find('.'+ activeClass).removeClass(activeClass);
        $(this).addClass(activeClass);

        //newMain = src.replace(src.substring(src.lastIndexOf('/')+1), mainImageName);
        //newTest = testSrc.replace(testSrc.substring(testSrc.lastIndexOf('/')+1), colorTestName);

        galleryMainImage.hide();
        galleryColorTest.hide();
        $('#js-mainImage-'+ slug).show();
        $('#js-testImage-'+ slug).show();
        galleryCallToAction.attr('href', url);
        galleryTitle.text(title);
    });

});