package com.cordova.smtp.client;

import java.util.Date;
import java.util.Properties;

import javax.activation.CommandMap;
import javax.activation.MailcapCommandMap;
import javax.mail.BodyPart;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.PreencodedMimeBodyPart;

public class Mail extends javax.mail.Authenticator {
    private String _user;
    private String _pass;

    private String[] _to;
    private String[] _cc;
	private String[] _bcc;
    private String _from;

    private String _port;
    private String _sport;

    private String _host;

    private String _subject;
    private String _body;
    private String _priority;

    private boolean _auth;
    private boolean _ssl;

    private boolean _debuggable;

    private Multipart _multipart;

    public Mail() {
        _host = ""; // default smtp server
        _port = "587"; // default smtp port
        _sport = "587"; // default socketfactory port

        _user = ""; // username
        _pass = ""; // password
        _from = ""; // email sent from
        _subject = ""; // email subject
        _body = ""; // email body
        _priority = "";
        _ssl = false;

        _debuggable = false; // debug mode on or off - default off
        _auth = true; // smtp authentication - default on

        _multipart = new MimeMultipart();

        // There is something wrong with MailCap, javamail can not find a handler for the multipart/mixed part, so this bit needs to be added.
        MailcapCommandMap mc = (MailcapCommandMap) CommandMap.getDefaultCommandMap();
        mc.addMailcap("text/html;; x-java-content-handler=com.sun.mail.handlers.text_html");
        mc.addMailcap("text/xml;; x-java-content-handler=com.sun.mail.handlers.text_xml");
        mc.addMailcap("text/plain;; x-java-content-handler=com.sun.mail.handlers.text_plain");
        mc.addMailcap("multipart/*;; x-java-content-handler=com.sun.mail.handlers.multipart_mixed");
        mc.addMailcap("message/rfc822;; x-java-content-handler=com.sun.mail.handlers.message_rfc822");
        CommandMap.setDefaultCommandMap(mc);
    }

    public Mail(String user, String pass) {
        this();

        _user = user;
        _pass = pass;
    }

    public boolean send() throws Exception {
        Properties props = _setProperties();


        Session session = Session.getInstance(props, this);

        MimeMessage msg = new MimeMessage(session);

        msg.setFrom(new InternetAddress(_from));

        if((_to != null)) {
            InternetAddress[] addressTo = new InternetAddress[_to.length];
            for (int i = 0; i < _to.length; i++) {
                addressTo[i] = new InternetAddress(_to[i]);
            }
            msg.setRecipients(MimeMessage.RecipientType.TO, addressTo);
        }

        if((_cc != null)) {
            InternetAddress[] addressCC = new InternetAddress[_cc.length];
            for (int i = 0; i < _cc.length; i++) {
                addressCC[i] = new InternetAddress(_cc[i]);
            }
            msg.setRecipients(MimeMessage.RecipientType.CC, addressCC);
        }
        if((_bcc != null)) {
            InternetAddress[] addressBCC = new InternetAddress[_bcc.length];
            for (int i = 0; i < _bcc.length; i++) {
                addressBCC[i] = new InternetAddress(_bcc[i]);
            }
            msg.setRecipients(MimeMessage.RecipientType.BCC, addressBCC);
        }
			
        msg.setSubject(_subject);
        msg.setSentDate(new Date());
        //set priority
        if (_priority.equals("low")) {
            msg.setHeader("Priority", "Non-Urgent");
            msg.setHeader("X-Priority", "5 (Lowest)");
            msg.setHeader("X-Msmail-Priority", "Low");
        } else if (_priority.equals("normal")) {
            msg.setHeader("Priority", "Normal");
            msg.setHeader("X-Priority", "3 (Normal)");
            msg.setHeader("X-Msmail-Priority", "Normal");
        } else if (_priority.equals("high")) {
            msg.setHeader("Priority", "Urgent");
            msg.setHeader("X-Priority", "1 (Highest)");
            msg.setHeader("X-Msmail-Priority", "High");
        }

        // setup message body
        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(_body, "text/html; charset=utf-8");
        _multipart.addBodyPart(messageBodyPart);

        // Put parts in message
        //messageBodyPart.setText(_body);
        //msg.setContent(_body,"text/html; charset=utf-8");
        msg.setContent(_multipart);


        // send email
        Transport.send(msg);
        return true;
    }

    public void addAttachment(String filename, String filerole, String filetype, String filedata) throws Exception {
        if (filerole.equals("0") || filerole.equals("2")) {
            BodyPart filePart = new PreencodedMimeBodyPart("base64");
            filePart.setContent(filedata, filetype);
            filePart.setFileName(filename);
            _multipart.addBodyPart(filePart);
        }
        if (filerole.equals("1") || filerole.equals("2")) {
            BodyPart filePart = new PreencodedMimeBodyPart("base64");
            filePart.setContent(filedata, filetype);
            filePart.setFileName(filename);
            filePart.setHeader("Content-ID", "<" + filename + ">");
            _multipart.addBodyPart(filePart);
        }
    }

    public String[] get_to() {
        return _to;
    }

    public void set_to(String[] _to) {
        this._to = _to;
    }

	public String[] get_cc() {
		return _cc;
	}

	public void set_cc(String[] _cc) {
		this._cc = _cc;
	}
	
	public String[] get_bcc() {
		return _bcc;
	}

	public void set_bcc(String[] _bcc) {
		this._bcc = _bcc;
	}

    public void set_ssl(boolean _ssl) {
        this._ssl = _ssl;
    }

    public String get_from() {
        return _from;
    }

    public void set_from(String _from) {
        this._from = _from;
    }

    public void set_auth(boolean _auth) {
        this._auth = _auth;
    }

    public void set_port(int _port) {
        this._port = Integer.toString(_port);
    }

    public void set_sport(int _sport) {
        this._sport = Integer.toString(_sport);
    }

    public void set_host(String _host) {
        this._host = _host;
    }

    public String get_body() {
        return _body;
    }
    public void set_body(String _body) {
        this._body = _body;
    }

    public String get_priority() {
        return _priority;
    }
    public void set_priority(String _priority) {
        this._priority = _priority;
    }

    @Override
    public PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(_user, _pass);
    }

    private Properties _setProperties() {
        Properties props = new Properties();

        props.put("mail.smtp.host", _host);
        props.put("mail.smtp.port", _port);
        if(_auth){
            props.put("mail.smtp.auth", "true");
            if(_ssl){
                props.put("mail.smtp.socketFactory.port", _sport);
                props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            }
            else {
                props.put("mail.smtp.starttls.enable", "true");
            }
        }

        return props;
    }

    public String get_subject() {
        return _subject;
    }

    public void set_subject(String _subject) {
        this._subject = _subject;
    }

    // more of the getters and setters
}
