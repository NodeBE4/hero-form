const { Octokit } = require("@octokit/rest")

require('dotenv').config()

let TOKEN = process.env.TOKEN
let REPOSITORY = process.env.REPOSITORY2

let [owner, repo] = REPOSITORY.split('/')

let forms = [
  {
    "music": "名称",
    "author":"表演者",
    "year":"年代",
    "status":"状态信息"
  },
  {
    "game":"游戏名称",
    "platform":"平台",
    "developer":"制作者",
    "type":"类型",
    "mode":"模式",
    "year":"年代",
    "status":"状态信息"
  },
  {
    "book":"书名",
    "publisher":"出版社",
    "author":"作者",
    "isbn":"ISBN",
    "reason":"推荐理由"
  },
  {
    "talk":"讲座名称",
    "url":"视频 url",
    "author":"讲者",
    "year":"年代",
    "reason":"推荐理由"
  },
  {
    "movie":"影视作品名称",
    "director":"导演",
    "year":"年代",
    "imdb":"IMDB名称",
    "url":"IMDB url"
  }
]

module.exports = async (req, res) => {
  let params = req.body
  console.log(params)
  let category = params['category'].trim()
  let formsel = forms.filter(function (item){
    let keys = Object.keys(item)
    return keys.includes(category)
  })
  let form = formsel[0]
  let keys = Object.keys(form)
  let body = ''
  keys.map(key =>{
    let content = ` `
    if (params[key]){
      content = params[key].replace(/#/g,'').trim()
    }
    let text = `### ${form[key]}
${content}

`
    body = body + text
  })

  let title = `new_${keys[0]}_request`

  let octokit = new Octokit({ auth: TOKEN })
  let response = await octokit.issues.create({
    owner,
    repo,
    title: title,
    body: body
  })

  await new Promise(resolve => setTimeout(resolve, 1000))

  res.setHeader('Location', response.data.html_url)
  res.status(302).send('')
}


function process_url(url){
  let parts = url.split("://")
  let urlbody = parts[1].split('/')
  urlbody[0] = urlbody[0].toLowerCase() 
  if (urlbody[0] == 'zh.wikipedia.org'){
    urlbody[1] = 'wiki'
    newurl = urlbody.join('/')
    newurl = newurl.split("#")[0]
  }else if (urlbody[0] == 'en.wikipedia.org'){
    urlbody[1] = 'wiki'
    newurl = urlbody.join('/')
    newurl = newurl.split("#")[0]
  }else if (urlbody[0] == 'baike.baidu.com'){
    urlbody[1] = 'item'
    newurl = urlbody.join('/')
    newurl = newurl.split("#")[0]
  }else{
    return null
  }
  parts[0] = "https"
  parts[1] = newurl
  fullurl = parts.join("://")
  console.log(fullurl)
  return fullurl
}

