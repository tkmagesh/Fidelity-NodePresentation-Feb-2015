var http = require("http"),
	fs = require('fs'),
	url = require('url'),
	path = require("path"),
	calculator = require("./calculator.js");


var extns = [".html", ".js", ".css", ".png", ".ico", ".xml", ".txt"];
function isStaticResource(resourcePath){
	var extn = path.extname(resourcePath);
	return extns.indexOf(extn) != -1;
}

http.createServer(function(req,res){
	var urlObj = url.parse(req.url, true);
	var resourcePath = path.join(__dirname, urlObj.pathname);
	if (isStaticResource(urlObj.pathname)){
		if (fs.existsSync(resourcePath)){
			fs.createReadStream(resourcePath, {encoding :"utf8"}).pipe(res);
		} else {
			res.statusCode = 404;
			res.end();
		}
	} else {
		if (urlObj.pathname === "/calculate"){
			console.log(urlObj);
			var qry = urlObj.query;
			var n1 = parseInt(qry.n1,10),
				n2 = parseInt(qry.n2,10),
				result = calculator[qry.operation](n1,n2);
			res.write(result.toString());
			res.end();
		}
	}
}).listen(8080);
console.log("Server running on port 8080!!");