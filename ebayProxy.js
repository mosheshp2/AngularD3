var request = require('request'),
    express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express();
var noproxy = process.argv.length > 2 ? process.argv[2] === 'noproxy' : false; 
console.log('running with: ' + (noproxy ? 'noproxy' : 'proxy'));
var params = noproxy ? {proxy : null} : {};

app.get('/home', function (req, res) {
  res.sendFile('ebay.html', {root: __dirname })
});
app.get('/jquery.js', function (req, res) {
  res.sendfile('Glz/jquery-2.1.4.min.js', {root: __dirname })
});


app.get('/search/:keywords', function (req, res) {
    
    var keyword = req.params.keywords || '220v+led+light+10w';
    var cacheFile = path.join(__dirname, 'CACHE', keyword + '.txt');
    if(fs.existsSync(cacheFile)){
        res.status(200).sendFile(cacheFile);
        console.log('sent cache');
        
    }
    else{
        var url = `http://www.ebay.com/sch/i.html?_from=R40&_sacat=0&LH_BIN=1&_sop=15&_nkw=${keyword}`;
        console.log('requesting: ' + url);
        request(url, params , function(error, response, body) {
            if(error){
                console.log(JSON.stringify(error));
                return res.status(500).send("error");
            }
            if(!body){
                console.log('Error: no body');
                return res.status(500).send("empty body");
            }
            var result = '';
            var startInd = body.indexOf('<ul id="ListViewInner"');
            if(startInd > 0){
                var endInd = body.indexOf('</w-root>', startInd);
                result = body.substr(startInd, endInd > 0 ? endInd - startInd : null);
                result = result.substr(0, result.lastIndexOf('</ul>') + 5);
            }
            else result = body;
            fs.exists(cacheFile,function(exists){
                if(!exists){
                    fs.writeFile(cacheFile, result, function(err){
                        if(err){
                            return console.log(err);
                        }
                        console.log('file saved: '+ cacheFile);
                    });
                }
            });
            res.status(response && response.statusCode).send(result);
        });
    }    
});

app.use('/public', express.static('public'));
app.listen(3000, function () {
  console.log('Proxy listening on port 3000!')
});


// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });