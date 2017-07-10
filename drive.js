const request = require('request')
const useragent = "Cakemix/2.7.153.14.74 (vbox86p JRO03S) Google.Drive/2.7.153.14.74 (OS=Android;OSVer=4.1.1;Manufacturer=Genymotion;Model=API demo) Mozilla/5.0 (Linux; U; Android 4.1.1; en-us; API demo Build/JRO03S) AppleWebKit/525.10+ (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2"
const http = require('follow-redirects').http
const queryString = require('query-string')
const url = require('url')
const moment = require('moment')

let generate = (req,res) => {
    let id = req.params.id
    let options = {
        host : "docs.google.com",
        port : 80,
        path : "/get_video_info?docid=" + id + "&format=ios"
    }
    let requestGoogle = (options) => {
        http.get(options, (resp) => {
            let data = "";
            resp.on('data', (chunk) => {
                data += chunk
            })
            resp.on('end', () => {
                let decode = queryString.parse(data)
                if (decode.status != 'ok') {
                    return res.status(500).send(decode)
                }
                let stream_url = decode.fmt_stream_map.split(",")
                let quality = {
                    '18' : '360',
                    '59' : '480',
                    '22' : '720',
                    '37' : '1080',
                    //3D Non-DASH
                    '82' : '360',
                    '83' : '240',
                    '84' : '720',
                    '85' : '1080'
                }
                let dataOutput = []
                stream_url.forEach((s) => {
                    let url_q = s.split("|")
                    let hostname = url.parse(decodeURIComponent(url_q[1])).hostname
                    let object = {
                        type : quality[url_q[0]],
                        filename : decodeURIComponent(url_q[1].replace(new RegExp(hostname, "gi"), "redirector.googlevideo.com").replace(new RegExp("explorer", "gi"), "storage"))
                    }
                    if (quality[url_q[0]]) {
                        dataOutput.push(object)
                    }
                })
                let result = {
                    status : 200,
                    data : dataOutput
                }
                res.status(404).json(result)
            })
        }).on('error', (e) => {
            console.error(e)
            res.status(500).end(e)
        })
    }
    requestGoogle(options)
}

module.exports = {
    generate : generate
}