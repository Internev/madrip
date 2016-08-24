//var os = require('os');
var fs = require('fs');

var request = require('request');


$(function() {
    $('button').on('click', function(event) {
        event.preventDefault();

        var mkdirp = require('mkdirp');

        mkdirp('./downloads', function(err) {
            if (err) {
                console.error(err);
            } else {
                $('.result').text('Made directory: downloads');
            }
        });


        $('.result').text('Working...');

        var catNos = $('#catNos').val().split(',').map(function(item) {
            return item.trim();
        });
        var searchUrl = "https://www.madman.com.au/actions/search.do?searchTerms=";
        var pageLink = "";
        var imgLink = "";
        var name = "";

        var repeat = (function() {
            return function repeat(cbWhileNotTrue, period) {
                /// <summary>Continuously repeats callback after a period has passed, until the callback triggers a stop by returning true.  Note each repetition only fires after the callback has completed.  Identifier returned is an object, prematurely stop like `timer = repeat(...); clearTimeout(timer.t);`</summary>

                var timer = {},
                    fn = function() {
                        if (true === cbWhileNotTrue()) {
                            $('.result').text('Finished!');
                            return clearTimeout(timer.t); // no more repeat
                        }
                        timer.t = setTimeout(fn, period || 1000);
                    };
                fn(); // engage
                return timer; // and expose stopper object
            };
        })();

        var looper = 0;
        var interval = repeat(function() {
            request(searchUrl + catNos[looper], function(err, res, html) {
                if (err) {
                    console.log(err);
                }
                var pageLinkArr = html.match('slick-link\" href=\".*?\"');
                pageLink = pageLinkArr[0].slice(18, -1);
                name = pageLink.slice(22);
                var url = 'http://www.madman.com.au' + pageLink;

                request(url, function(err, res, html) {
                    if (err) {
                        console.log(err);
                    }
                    var imgLinkArr = html.match('background-image\:.*?\"');
                    imgLink = imgLinkArr[0].slice(21, -2);

                    //get and save description.
                    var descrArr = html.match('<p>.*?<');
                    var descr = descrArr[0].slice(3, -1);
                    fs.writeFile('./downloads/' + name + '.txt', descr, function(err) {
                        if (err) return console.log(err);
                    });

                    //save image
                    request('http:' + imgLink).pipe(fs.createWriteStream('./downloads/' + name + '.jpg'));
                });
            });
            looper++;
            return (looper >= catNos.length);
        }, 3000);
    });
});
