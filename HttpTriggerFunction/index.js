const fs = require('fs');
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    //const name = (req.query.name || (req.body && req.body.name));
    const email = (req.query.email || (req.body && req.body.email));
    const responseMsg = email
        ? writeMail(email)
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    function pushData(email) {
        var value;

        let content = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

        if (content.users.filter(i => email.includes(i.email)).length > 0) {
            value = false;
        }
        else {
            content.users.push({ email: email });
            value = true;
        }

        fs.writeFileSync('./users.json', JSON.stringify(content));

        return value;
    }

    function writeMail(email) {

        var message ;

        if(pushData(email)){
            message = `Welcome to News Mailer ${email}, You will get your email at 8 AM everyday :)`
        }
        else{
            message = "You've already registered to this service"
        }
        context.log('Page loaded');

        return message;
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMsg
    };
}