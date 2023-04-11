# Cordova SMTP Client

Basic SMTP client cordova plugin for editing and sending email messages.

## Installation

Install iOS and/or Android platform

    cordova platform add ios
    cordova platform add android

Install the plugin using any plugman compatible cli

    $ cordova plugin add construct-mobile-smtp

## Usage

On Javascript, use code that is similar to the following.

	let mailSettings = {
	    "smtp": "smtp-mail.domain.com",
	    "smtpUserName": "authuser@domain.com",
	    "smtpPassword": "password",
	    "emailFrom": "emailFrom@domain.com",
	    "emailTo": "emailTo@domain.com",
	    "emailCC": "emailTo@domain.com",
	    "emailBCC": "emailTo@domain.com",
	    "subject": "email subject",
	    "textBody": "write something within the body<b>Hello world?<img src=\"cid:image.png\"></b> of the email",
	    "priority": "normal"
	    "attachmentsName": ["image.png"],
	    "attachmentsRole": ["2"],
	    "attachmentsType": ["image/png"],
	    "attachmentsBase64": ["iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAARSURBVDhPYxgFo2AUQAEDAwADEAABuGyTOQAAAABJRU5ErkJggg=="]
	};
	let success = function(message) {
		alert("OK")
	}

	let failure = function(message) {
		alert("Error sending the email");
	}			
			
	window.smtpClient.sendMail(mailSettings, success, failure);

### Attachments
    priority: "low" or "normal" or "high"

    The attachments has 4 array.

    Name, Role, Type, Base64
    
	attachmentsName: file name with extension
	attachmentsRole: in string format "0" or "1" or "2"
		"0" is normal attachment
		"1" attachment only available email (useful for pictures) in cid link (Content-ID header) e.g. <img src=\"cid:image.png\">
		"2" attachment behave normal and available as cid link
	attachmentsType: MIME type in string
	attachmentsBase64: content in Base64 string

### Return type
	
Method result call failed or success callback function.

## Copyright

The library was originally written by albernazf ([cordova-smtp-client](https://github.com/albernazf/cordova-smtp-client)) and later modified by Nelson Medina Humberto ([cordova-smtp-client](https://github.com/nelsonhumberto/cordova-smtp-client/)).

On iOS it makes use of the skpsmtpmessage library, which was originally written by Ian Baird. A recent fork can be found on ([skpsmtpmessage](https://github.com/jetseven/skpsmtpmessage)).
