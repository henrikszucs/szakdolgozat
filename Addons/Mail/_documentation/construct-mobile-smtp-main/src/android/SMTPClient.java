package com.cordova.smtp.client;

import android.os.StrictMode;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

public class SMTPClient extends CordovaPlugin {
    public final String ACTION_SEND_EMAIL = "cordovaSendMail";

    @Override
    public boolean execute(String action, JSONArray arg1, CallbackContext callbackContext) {
        if (action.equals(ACTION_SEND_EMAIL)) {
            if (android.os.Build.VERSION.SDK_INT > 9) {
                StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
                StrictMode.setThreadPolicy(policy);
            }
            this.cordova.getThreadPool().execute (new Runnable() {
                public void run() {
                    try {
                        JSONObject json = new JSONObject(arg1.getString(0));
                        sendEmailViaGmail(json);
                        callbackContext.success();
                    } catch (JSONException ex) {
                        ex.printStackTrace();
                        callbackContext.error(ex.getMessage());
                    } catch (Exception e) {
                        e.printStackTrace();
                        callbackContext.error(e.getMessage());
                    }
                }
            });
        };
        return true;
    }

    private boolean sendEmailViaGmail(JSONObject json) throws Exception {
        Mail m = new Mail(json.getString("smtpUserName"), json.getString("smtpPassword"));
        m.set_host(json.getString("smtp"));
        m.set_from(json.getString("emailFrom"));
        String emailTo = json.optString("emailTo");
        String[] toArr = (emailTo.isEmpty()) ? null : emailTo.split(",");
        String emailCC = json.optString("emailCC");
        String[] ccArr = (emailCC.isEmpty()) ? null : emailCC.split(",");
        String emailBCC = json.optString("emailBCC");
        String[] bccArr = (emailBCC.isEmpty()) ? null : emailBCC.split(",");
        m.set_to(toArr);
        m.set_cc(ccArr);
        m.set_bcc(bccArr);
        m.set_subject(json.getString("subject"));
        m.set_body(json.getString("textBody"));
        m.set_priority(json.getString("priority"));

        JSONArray attachmentsName = json.getJSONArray("attachmentsName");
        JSONArray attachmentsRole = json.getJSONArray("attachmentsRole");
        JSONArray attachmentsType = json.getJSONArray("attachmentsType");
        JSONArray attachmentsBase64 = json.getJSONArray("attachmentsBase64");
        if(attachmentsName != null){
            for(int i=0; i < attachmentsName.length(); i++){
                String attachmentsNameString = attachmentsName.getString(i);
                String attachmentsRoleString = attachmentsRole.getString(i);
                String attachmentsTypeString = attachmentsType.getString(i);
                String attachmentsBase64String = attachmentsBase64.getString(i);
                m.addAttachment(attachmentsNameString, attachmentsRoleString, attachmentsTypeString, attachmentsBase64String);
            }
        }
        return m.send();
    }

}
