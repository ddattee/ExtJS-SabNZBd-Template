function infos(msg){
    $('.infos').html(msg);
    clearTimeout('tim');
    var tim = setTimeout(function(){$('.infos').html("");},2000);
}

function createBox(title, text){
    return ['<div class="msg" style="z-index:2000;">',
            '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
            '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', title, '</h3>', text, '</div></div></div>',
            '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
            '</div>'].join('');
}

function inform(title, text){
    var msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
    msgCt.alignTo(document, 't-t');
    var m = Ext.DomHelper.append(msgCt, {html:createBox(title, text)}, true);
    m.slideIn('t');//.pause(4).slideOut("t", {remove:true});
}


function getTimeFormat(timestamp){
    
    var downloadtime0 = timestamp;
    var downloadtimeH = Math.floor(downloadtime0/3600);
    downloadtime0 = downloadtime0 % 3600;
    var downloadtimeM = Math.floor(downloadtime0/60);
    var downloadtimeS = downloadtime0 % 60;
    if (downloadtimeM<10){
            downloadtimeM = '0'+downloadtimeM;
    }
    if (downloadtimeS<10){
            downloadtimeS = '0'+downloadtimeS;
    }
    
    return downloadtime = downloadtimeH+':'+downloadtimeM+':'+downloadtimeS;
}

function queuedelete(nzo_id) {

    var dl = DownloadsList.getAt(DownloadsList.findExact('nzo_id', nzo_id));
    Ext.MessageBox.confirm("Remove Download", "Are you sure you want to remove this download ? <br />Name: <b> '" + dl.data.filename + "<b>'", function(confirm){
        if(confirm == 'yes'){
            Ext.Ajax.request({
                    url: 'tapi?mode=queue&name=delete&value='+nzo_id+'&session=' + session,
                    success: function(response){
                            loadqueue(false);
                            infos("Download '" + nzo_id + "' deleted");
                    }
            });
        }
    });
}

function queuepause(nzo_id) {
    Ext.Ajax.request({
            url: 'tapi?mode=queue&name=pause&value='+nzo_id+'&session=' + session,
            success: function(response){
                    loadqueue(false);
                    infos("Download '" + nzo_id + "' paused");
            }
    });
}

function queueresume(nzo_id) {
    Ext.Ajax.request({
            url: 'tapi?mode=queue&name=resume&value='+nzo_id+'&session=' + session,
            success: function(response){
                    loadqueue(false);
                    infos("Download '" + nzo_id + "' resumed");
            }
    });
}

function queueinfo(nzo_id) {
    FilesList.removeAll();
    SABid = nzo_id;
}

function queuemove(nzo_id,id) {
    Ext.Ajax.request({
            url: 'tapi?mode=switch&value='+nzo_id+'&value2='+id+'&session=' + session,
            success: function(response){
                    infos("Download '" + nzo_id + "' moved to " + (id+1) + " place");
            }
    });
}

function queuepurge() {
    Ext.MessageBox.confirm("Purge Queue", "Are you sure you want to purge the queue?", function(confirm){
        if(confirm == 'yes'){
            Ext.Ajax.request({
                    url: 'queue/purge?session=' + session,
                    success: function(response){
                            infos("Queue purged");
                    }
            });
        }
    });
}

function warnpurge(){
    Ext.Ajax.request({
            url: 'queue/purge?session=' + session,
            success: function(response){
                    infos("Queue purged");
            }
    });
}

function limitspeed(limit) {
    Ext.Ajax.request({
            url: 'tapi?mode=config&name=speedlimit&value='+limit+'&session=' + session,
            success: function(response){
                    limit = (limit == "") ? 0 : limit;
                    infos("Speed limited to " + limit + " KB/s");
            }
    });
}

function setcat(nzo_id,cat) {
    Ext.Ajax.request({
            url: 'tapi?mode=change_cat&value='+nzo_id+'&value2='+cat+'&session=' + session,
            success: function(response){
                    infos("Categorie for download '" + nzo_id + "' set to '" + cat + "'");
            }
    });
}

function setname(nzo_id,name) {
    Ext.Ajax.request({
            url: 'tapi?mode=queue&name=rename&value='+nzo_id+'&value2='+name+'&session=' + session,
            success: function(response){
                    infos("Download '" + nzo_id + "' renamed to '" + name + "'");
            }
    });
}

function pauseall() {
    if (Ext.getCmp('pausebutton').getText() == 'Pause') {
            Ext.Ajax.request({
                    url: 'tapi?mode=pause&session=' + session,
                    success: function(response){
                            Ext.getCmp('pausebutton').setText('Resume');
                            Ext.getCmp('pausebutton').setIcon('../static/images/play-big.png');
                            infos("All downloads paused");
                    }
            });
    } else {
            Ext.Ajax.request({
                    url: 'tapi?mode=resume&session=' + session,
                    success: function(response){
                            Ext.getCmp('pausebutton').setText('Pause');
                            Ext.getCmp('pausebutton').setIcon('../static/images/pause-big.png');
                            infos("All downloads resumed");
                    }
            });
    }
}

function shutdown() {
    Ext.MessageBox.confirm("Restart", "Are you sure you want to shutdown SABnzbd?", function(confirm){
        if(confirm == 'yes'){
            Ext.Ajax.request({
                    url: 'tapi?mode=shutdown&session=' + session,
                    success: function(response){
                            infos("Shutting down...");
                    }
            });
        }
    });
}

function restart() {
    Ext.MessageBox.confirm("Restart", "Are you sure you want to restart SABnzbd?", function(confirm){
        if(confirm == 'yes'){
            var waiting = Ext.MessageBox.show({
               msg: 'Waiting for SABnzbd to shutdown...',
               progress:true,
               width:300,
               wait:true,
               waitConfig: {
                   interval:300,
                   increment:30,
                   animate:true,
                   text:'Restarting SABnzbd...'
               },
               icon:'wait-reload',
               id:'restartWindWait'
            });

            function check(){
                    return $.ajax({url:'/',async:false}).responseText;
            }

            function reload() {
                var i = 5;
                setInterval(function(){
                    waiting.updateText('Reloading page in <span id="restart-timer">' + i + '"</span> sec.');
                    i--;
                },1000);
                setTimeout(function(){
                    window.location.reload();
                }, 5000);
            }

            var loop2;
            var resp;
            //Check for the server shutdown
            var loop = setInterval(function(){
                    resp = check();
                    if(resp == ""){
                            //When it has shutdown check for the restart
                            loop2 = setInterval(function(){
                                            clearInterval(loop);
                                            resp = check();
                                            if(resp != ""){
                                                    //Clear interval and reload the page
                                                    waiting.setIcon('restarted');
                                                    waiting.updateText('SABnzbd Restarted');
                                                    reload();
                                                    clearInterval(loop2);
                                            }
                            },3000);
                            waiting.updateText('Waiting for SABnzbd to start...');
                    }
            }, 500);

            Ext.Ajax.request({
                    url: 'tapi?mode=restart&session=' + session,
                    success: function(response){

                    }
            });
        }
    });
}



function historydelete(nzo_id) {
    var hi = HistoryList.getAt(HistoryList.findExact('id',nzo_id));
    Ext.MessageBox.confirm("History Delete", "Are you sure you want to delete the history?<br />Name: <b>"+hi.data.nzb_name+"</b>", function(confirm){
        if(confirm == 'yes'){
            Ext.Ajax.request({
                    url: 'tapi?mode=history&name=delete&value='+nzo_id+'&session=' + session,
                    success: function(response){
                            loadhistory(false);
                            infos("History '" + nzo_id + "' deleted");
                    }
            });
        }
    });
}

function historypurge() {
    Ext.MessageBox.confirm("Purge history", "Are you sure you want to purge the history?", function(confirm){
        if(confirm == 'yes'){
            Ext.Ajax.request({
                    url: 'tapi?mode=history&name=delete&value=all&session=' + session,
                    success: function(response){
                            loadhistory(false);
                            infos("History purged");
                    }
            });
        }
    });
}

function historypurgefailed() {
    
    if(HistoryList.data.items.length > 1){
        var todelete = "";
        var count = 0;
        $.each(HistoryList.data.items,function(){
            if(this.data.status.match(/failed/i)){
                todelete += this.data.id + ",";
                count += 1;
            }
        });
        Ext.Ajax.request({
                url: 'tapi?mode=history&name=delete&value=' + todelete + '&session=' + session,
                success: function(response){
                        loadhistory(false);
                        infos(count + " history items purged");
                }
        });
    }

}

function historypurgeselected(){

    if(HistoryList.data.items.length > 0){
        var selected = Ext.getCmp('HistoryGrid').getSelectionModel().getSelections();
        var todelete = "";
        $.each(selected,function(){
                todelete += this.data.id + ",";
        });
        Ext.MessageBox.confirm("Delete Histories", "Are you sure you want to delete those " + selected.length + " hystory items?", function(confirm){
            if(confirm == 'yes'){
                Ext.Ajax.request({
                        url: 'tapi',
                        params:{
                            mode: 'history',
                            name: 'delete',
                            value: todelete,
                            session: session
                        },
                        success: function(response){
                                loadhistory(false);
                                Ext.getCmp('HistoryGrid').getSelectionModel().clearSelections()
                                infos(selected.length + " history items purged");
                        }
                });
                
            }
        })
    }
    
}

/*-----------------------------------------Load functions for all stores.----------------------------------------------*/
function loadqueue(reload) {
    Ext.Ajax.request({
            url: 'tapi?mode=queue&start=START&limit=LIMIT&output=json&session='  + session,
            success: function(response){
                    var o = Ext.decode(response.responseText);
                    Ext.getCmp('warnings').setTitle('Warnings('+o.queue.have_warnings+')');
                    DownloadsList.removeAll(true);
                    
                    for (count=DownloadsList.getCount();count<o.queue.slots.length;count++){
                            DownloadsList.add(new Ext.data.Record());
                    }
                    for (count=0;count<o.queue.slots.length;count++){
                            if (o.queue.slots[count].status == 'Paused'){
                                    buttons = '<img style="cursor: pointer;" onclick="queueresume(\''+o.queue.slots[count].nzo_id+'\')" src="../static/images/play.png">';
                            } else {
                                    buttons = '<img style="cursor: pointer;" onclick="queuepause(\''+o.queue.slots[count].nzo_id+'\')" src="../static/images/pause.png">';
                            }
                            buttons += ' ';
                            buttons += '<img style="cursor: pointer;" onclick="queuedelete(\''+o.queue.slots[count].nzo_id+'\')" src="../static/images/delete.png">';
                            buttons += ' ';
                            //buttons += '<img style="cursor: pointer;" onclick="queueinfo(\''+o.queue.slots[count].nzo_id+'\')" src="../static/images/info.png">';
                            DownloadsList.getAt(count).set('buttons',buttons);
                            DownloadsList.getAt(count).set('nzo_id',o.queue.slots[count].nzo_id);
                            DownloadsList.getAt(count).set('filename',o.queue.slots[count].filename);
                            DownloadsList.getAt(count).set('timeleft',o.queue.slots[count].timeleft);
                            DownloadsList.getAt(count).set('size',o.queue.slots[count].sizeleft.substring(0,o.queue.slots[count].sizeleft.length-3)+'/'+o.queue.slots[count].size+' ('+o.queue.slots[count].percentage+' %)');
                            DownloadsList.getAt(count).set('percentage','<div style="height:11px;border:1px solid #666666"><div style="height:11px;font-size:9px;background:#666666;width:'+o.queue.slots[count].percentage+'%"></div></div>');
                            DownloadsList.getAt(count).set('avg_age',o.queue.slots[count].avg_age);
                            DownloadsList.getAt(count).set('cat',o.queue.slots[count].cat);
                            DownloadsList.getAt(count).set('status','<div class="'+o.queue.slots[count].status+'">'+o.queue.slots[count].status+'</div>');

                    }
                    Ext.getCmp('speed').setValue(o.queue.kbpersec);
                    Ext.getCmp('status').setValue('<div class="'+o.queue.status+'">'+o.queue.status+'</div>');
                    Ext.getCmp('freespace').setValue(o.queue.diskspace1+'/'+o.queue.diskspacetotal1+' GB');

                    Ext.getCmp('queue').setIconClass('queueIcon');
                    $('title').text("SABnzbd+ (" + DownloadsList.getCount() + ")");
                    if (reload) {
                            if (maintab == 'history') {
                                    setTimeout('loadhistory(true)',queueRefresh*1000);
                            }
                            if (maintab == 'queue') {
                                    if (queue == 'files') {
                                            if (SABid != '') {
                                                    loadfiles(true);
                                            } else {
                                                    Ext.getCmp(queue).setIconClass('file-icon');
                                                    setTimeout('loadqueue(true)',1500);
                                            }
                                    }
                                    if (queue == 'connections') {
                                            loadconnections(true);
                                    }
                                    if (queue == 'warnings') {
                                            loadwarnings(true);
                                    }
                            }
                    }
                    $("#loading").hide();
            }
    });
}

function loadhistory(reload) {
    Ext.Ajax.request({
            url: 'tapi?mode=history&output=json&session=' + session,
            success: function(response){
                    var o = Ext.decode(response.responseText);
                    for (count=HistoryList.getCount();count<o.history.slots.length;count++){
                            var MyRecord = new Ext.data.Record();
                            HistoryList.add(MyRecord);
                    }
                    for (count=o.history.slots.length;count<HistoryList.getCount();count++){
                            HistoryList.removeAt(count);
                    }
                    for (count=0;count<o.history.slots.length;count++){
//                            var buttons = "<input type='checkbox' class='gridCheck' id='" + o.history.slots[count].nzo_id + "'>&nbsp;&nbsp;";
                            var buttons = '<img style="cursor: pointer;" onclick="historydelete(\''+o.history.slots[count].nzo_id+'\')" src="../static/images/delete.png">';

                            HistoryList.getAt(count).set('buttons',buttons);
                            HistoryList.getAt(count).set('nzb_name',o.history.slots[count].nzb_name);
                            HistoryList.getAt(count).set('size',o.history.slots[count].size);
                            HistoryList.getAt(count).set('downloadtime',getTimeFormat(o.history.slots[count].download_time));
                            HistoryList.getAt(count).set('status',o.history.slots[count].status);
                            HistoryList.getAt(count).set('id',o.history.slots[count].nzo_id);

                    }
                    

                    Ext.getCmp('history').setIconClass('historyIcon');
                    if (reload) {
                            if (maintab == 'history') {
                                    setTimeout('loadhistory(true)',60000);
                            }
                            if (maintab == 'queue') {
                                    setTimeout('loadqueue(true)',1000);
                            }
                    }
                    $("#loading").hide();
            }
    });
}

function loadhistorydetails(ind,reload) {
    Ext.Ajax.request({
            url: 'tapi?mode=history&output=json&session=' + session,
            success: function(response){
                    var o = Ext.decode(response.responseText).history.slots[ind];

                    var out = {
                        NZB_File: o.nzb_name,
                        Size: o.size,
                        Download_Time: getTimeFormat(o.download_time),
                        Post_Work_Time: getTimeFormat(o.postproc_time),
                        Status: o.status,
                        Download_Relative_Path: o.path,
                        Download_Full_Path: o.storage,
                        Script: o.script,
                        Script_Line: o.script_line,
                        Script_Log: o.script_log,
                        Url: o.url
                        
                    };
                    
                    Ext.getCmp('detailshistory').setSource(out);

                    if (reload) setTimeout('loadhistory(true)',1000);
            }
    });
}

function loadfiles(reload) {
    if(SABid != undefined && SABid != ""){
        Ext.Ajax.request({
                url: 'tapi?mode=get_files&output=json&value='+SABid+'&session=' + session,
                success: function(response){
                        var o = Ext.decode(response.responseText);
                        Ext.getCmp('files').setTitle('Files('+o.files.length+')');
                        for (count=FilesList.getCount();count<o.files.length;count++){
                                percentage = Math.round(100-o.files[count].mbleft/o.files[count].mb*100);
                                mbtogo = Math.round((o.files[count].mb-o.files[count].mbleft)*100)/100;
                                var MyRecord = new FileRecord(
                                        {
                                                status: o.files[count].status,
                                                filename: o.files[count].filename,
                                                percentage: '<div style="height:11px;border:1px solid #666666"><div style="height:11px;font-size:9px;text-align:center;background:#666666;width:'+percentage+'%"></div></div>',
                                                size: mbtogo+'/'+o.files[count].mb+' MB'+' ('+percentage+' %)'
                                         }
                                );
                                FilesList.add(MyRecord);
                        }
                        for (count=0;count<o.files.length;count++){
                                percentage = Math.round(100-o.files[count].mbleft/o.files[count].mb*100);
                                mbtogo = Math.round((o.files[count].mb-o.files[count].mbleft)*100)/100;
                                FilesList.getAt(count).set('status',o.files[count].status);
                                FilesList.getAt(count).set('filename',o.files[count].filename);
                                FilesList.getAt(count).set('percentage','<div style="height:11px;border:1px solid #666666"><div style="height:11px;font-size:9px;text-align:center;background:#666666;width:'+percentage+'%"></div></div>');
                                FilesList.getAt(count).set('size',mbtogo+'/'+o.files[count].mb+' MB'+' ('+percentage+' %)');
                        }

                        Ext.getCmp('files').setIconClass('file-icon');
                        if (reload) setTimeout('loadqueue(true)',1000);
                }
        });
    }else{
        Ext.getCmp('files').setIconClass('file-icon');
    }
}

function loadconnections(reload) {
    Ext.Ajax.request({
            url: 'connections/',
            success: function(response){
                    var data = Ext.decode(response.responseText);

                    //Clear the store
                    ConnectionsList.removeAll();
                    if(data.connections != undefined && data.connections[0].threads.length > 0){
                        //Add a new recorde for each thread for each server
                        $.each(data.connections,function(){
                            $.each(this.threads,function(){
                                ConnectionsList.add(new Ext.data.Record(this));
                            });
                        });
                    }
                        
                    Ext.getCmp('connections').setIconClass('conection-icon');
                    if (reload) setTimeout('loadqueue(true)',1000);
            }
    });
}

function loadwarnings(reload) {
    Ext.Ajax.request({
            url: 'tapi?mode=warnings&output=json&session=' + session,
            success: function(response){
                    var data = Ext.decode(response.responseText);

                    //Clear the store
                    ConnectionsList.removeAll();
                    if(data.warnings.length > 0){
                        //Add the warnings to the store
                        $.each(data.warnings,function(){
                            WarningsDatas.add(new Ext.data.Record({warning:this}));
                        });
                    }

                    Ext.getCmp('warnings').setIconClass('warning-icon');
                    if (reload) setTimeout('loadqueue(true)',1000);
            }
    });
}


/*-----------------------------------------Load function. Loads all data into the GUI.----------------------------------*/
function firstload() {
    Ext.Ajax.request({
            url: 'tapi?mode=queue&start=START&limit=LIMIT&output=json&session=' + session,
            success: function(response){
                    var o = Ext.decode(response.responseText);
                    Ext.getCmp('speed').setValue(o.queue.kbpersec);
                    Ext.getCmp('speedlimit').setValue(o.queue.speedlimit);
                    if (o.queue.status == 'Paused'){
                            Ext.getCmp('pausebutton').setText('Resume');
                            Ext.getCmp('pausebutton').setIcon('../static/images/play-big.png');
                    }

                    for (count=CatList.getCount();count<o.queue.categories.length;count++){
                            var MyRecord = new Ext.data.Record();
                            CatList.add(MyRecord);
                    }
                    for (count=0;count<o.queue.categories.length;count++){
                            CatList.getAt(count).set('id',count);
                            CatList.getAt(count).set('cat',o.queue.categories[count]);
                    }
            }
    });
    
}