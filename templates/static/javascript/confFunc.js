/**
 * Submit the given conf form
 *
 * @param formId ID of the form to submit (action, method are defined in the form)
 * @param success callback function on success
 * @param failure callback function on failure
 */
function saveConf(formId,success,failure){
    try {
        success = (typeof success == "function")? success : function(form, action) {infos("Configuration saved");};
        failure = (typeof failure == "function")? failure : function(form, action) {infos("Error while saving");};

        Ext.getCmp(formId).getForm().submit({
            params: "session=" + session,
            waitMsg: 'Saving...',
            waitTitle: 'Wait',
            success: success,
            failure: failure
        });
    } catch (e) {

    }
}

/**
 * Delete a given server
 *
 * @param serverName Name of the server to delete
 */
function delServer(serverName){

    Ext.MessageBox.confirm("Server delete", "Are you sure you want to delete the server '" + serverName + "'?", function(confirm){
        if(confirm == 'yes'){
            Ext.getCmp('servers').getForm().submit({
                url: '/config/server/delServer',
                params: {
                    session: session,
                    server: serverName
                },
                success:function(){
                    loadConfServers();
                }
            });
            Ext.getCmp('serverName').disable();
        }

    });

}

/**
 * Delete a given plan
 *
 * @param plan Name of the plan to delete
 */
function delPlan(plan){
    Ext.Ajax.request({
            url: '/config/scheduling/delSchedule',
            params: {
                session: session,
                line: plan
            },
            success: function(response){
                infos('Plan deleted');
                loadConfPlans();
            },
            failure: function(response){
                loadConfPlans();
            }
    });
}