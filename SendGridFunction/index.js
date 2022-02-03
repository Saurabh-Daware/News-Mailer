var util = require('util');
const fs = require('fs');
const NewsAPI = require('newsapi');
const dotnet = require('dotenv').config();
const newsapi = new NewsAPI(process.env.API_KEY);

// The 'From' and 'To' fields are automatically populated with the values specified by the binding settings.
//
// You can also optionally configure the default From/To addresses globally via host.config, e.g.:
//
// {
//   "sendGrid": {
//      "to": "user@host.com",
//      "from": "Azure Functions <samples@functions.com>"
//   }
// }
module.exports = async function (context, order) {

    var content = `<html >
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        visibility: hidden;
      }
    </style>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
  </head>
  <body>
  <h1>Today's top articles for you</h1>
    <div class="news-section">`;

    await newsapi.v2.topHeadlines({
        language: 'en',
        country: 'in'
    }).then(response => {

        var articles = response.articles;

        articles.slice(10).forEach(element => {
            content = content + `<div class="news-article">
        <a href="${element.url}">
        <img src="${element.urlToImage}" width="264" height="195"></img>
        <h1 class="title">${element.title}</h1>
        </a>
        </div>
        `;
        });
    });

    context.log('JavaScript queue trigger function processed order', order.orderId);


    content = content + `</body></html>`;

    let userlist = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

    const data = {
        "content": [
            {
                "type": "text/html",
                "value": content
            }
        ],
        "from": {
            "email": "example@mail.com",
            "name": "News Mailer"
        },
        "personalizations": [
            {
                "subject": `News ${new Date().toLocaleDateString()}`,
                "to": [
                    {
                        "email": "user@mail.com",
                        "name": "Saurabh Daware"
                    }
                ],
                "bcc": userlist.users
            }
        ],
        "reply_to": {
            "email": "example@mail.com",
            "name": "News Mailer -Dev"
        },
        "subject": `News ${new Date().toLocaleDateString()}`
    };

    context.bindings.message = data;

    // {
    //     subject: `News ${new Date().toLocaleDateString()}`,
    //     content: [{
    //         type: 'text/plain',
    //         value: data
    //     }]
    // };
}