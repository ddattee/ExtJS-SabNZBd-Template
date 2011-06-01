function loadConfig(fullload) {

    //Charge l'interface de config
    Ext.getCmp('confPanel').add(confPan);
    Ext.getCmp('confPanel').doLayout();

    //Chargement des données
    Ext.getCmp('apikey').setValue(session);

    if(fullload){
        
        loadConfServers();
        loadConfGeneral();
        loadConfOptions();
        loadConfFolders();
        loadConfPlans();
        loadConfCats();
        loadConfMail();
        
    }

    infos("Configuration loaded");
    Ext.getCmp('config').setIconClass('configIcon');

    $("#loading").hide();
}

function loadConfGeneral(){
    Ext.Ajax.request({
            url: '/config/general/',
            success: function(response){
                var data = Ext.decode(response.responseText);

                Ext.getCmp('sabhost').setValue(data.general.host);
                Ext.getCmp('sabport').setValue(data.general.port);
                Ext.getCmp('sabuser').setValue(data.general.username);
                Ext.getCmp('sabpassw').setValue(data.general.password);
                Ext.getCmp('sabHSport').setValue(data.general.httpsPort);
                Ext.getCmp('sabHScert').setValue(data.general.httpsCert);
                Ext.getCmp('sabHSkey').setValue(data.general.httpsKey);
                Ext.getCmp('sabTcache').setValue(data.general.limitCache);
                Ext.getCmp('sabText').setValue(data.general.cleanext);
                Ext.getCmp('speedlimit').setValue(data.speedLimit);
                
                Ext.getCmp('language').store = new Ext.data.ArrayStore({id:'langStore',fields: ['value','text'],data:data.general.languages});
                Ext.getCmp('language').setValue(data.language);
                
                Ext.getCmp('ifs1').store = new Ext.data.ArrayStore({id:'if1Store',fields: ['value','text'],data:data.general.interfaces1});
                Ext.getCmp('ifs1').setValue(data.if1);
                
                Ext.getCmp('ifs2').store = new Ext.data.ArrayStore({id:'if2Store',fields: ['value','text'],data:data.general.interfaces2});
                Ext.getCmp('ifs2').setValue(data.if2);

                infos("General configuration loaded");
                Ext.getCmp('general').setIconClass('conf-general');
            }
    });
}

function loadConfFolders(){
    Ext.Ajax.request({
            url: '/config/directories/',
            success: function(response){
                var data = Ext.decode(response.responseText);

                Ext.getCmp('complete_dir').setValue(data.user.complete);
                Ext.getCmp('download_dir').setValue(data.user.incomplete);
                Ext.getCmp('dirscan_dir').setValue(data.user.nzbfold);
                Ext.getCmp('download_free').setValue(data.user.spacelimit);
                Ext.getCmp('permissions').setValue(data.user.permissions);
                Ext.getCmp('dirscan_speed').setValue(data.user.scnainterval);
                Ext.getCmp('script_dir').setValue(data.user.script);
                Ext.getCmp('email_dir').setValue(data.user.emailtmpl);

                Ext.getCmp('cache_dir').setValue(data.system.cache);
                Ext.getCmp('log_dir').setValue(data.system.logs);
                Ext.getCmp('nzb_backup_dir').setValue(data.system.backup);

                Ext.getCmp('userBaseURL').setValue('Base URL: ' + data.userpath);
                Ext.getCmp('sysBaseURL').setValue('Base URL: ' + data.rootpath);

                infos("Folders configuration loaded");
                Ext.getCmp('folders').setIconClass('conf-folders');
            }
    });
}

function loadConfOptions(){
    Ext.Ajax.request({
            url: '/config/switches/',
            success: function(response){
                var data = Ext.decode(response.responseText);

                Ext.getCmp('optsQCenable').setValue(data.options.quickchek);
                Ext.getCmp('optsUnRenable').setValue(data.options.unrar);
                Ext.getCmp('optsUnZenable').setValue(data.options.unzip);
                Ext.getCmp('optsFJenable').setValue(data.options.concat);
                Ext.getCmp('optsFJTenable').setValue(data.options.concatTS);
                Ext.getCmp('optsCPenable').setValue(data.options.cleanPar);
                Ext.getCmp('optsSFailenable').setValue(data.options.onCrcError);
                Ext.getCmp('optsPWPenable').setValue(data.options.onlyParOk);
                Ext.getCmp('optsADDenable').setValue(data.options.noDouble);
                Ext.getCmp('optsDTenable').setValue(data.options.onlyTop);
                Ext.getCmp('optCheckUpdate').setValue(data.options.checkUpdates);
                Ext.getCmp('optOpenBrowser').setValue(data.options.autoOpenBrows);
                Ext.getCmp('optDiscoEmpty').setValue(data.options.autoDisconnect);
                Ext.getCmp('optSendGroup').setValue(data.options.sendGroup);
                Ext.getCmp('optSortByAge').setValue(data.options.autoSort);
                Ext.getCmp('optRepSpace').setValue(data.options.replaceSpaces);
                Ext.getCmp('optRepChar').setValue(data.options.replaceIllegal);
                Ext.getCmp('optPausePostwork').setValue(data.options.pauseOnPostOp);

                Ext.getCmp('optDefPriority').bindStore(new Ext.data.ArrayStore({fields: ['num','text'],data:data.options.priorities}));
                Ext.getCmp('optDefPriority').setValue(data.defScanPriority);

                Ext.getCmp('optDefPostwork').bindStore(new Ext.data.ArrayStore({fields: ['num','text'],data:data.options.postWork}));
                Ext.getCmp('optDefPostwork').setValue(data.defScanOpt);
                
                Ext.getCmp('optDefScript').bindStore(new Ext.data.ArrayStore({fields: ['num','text'],data:data.options.scripts}));
                Ext.getCmp('optDefScript').setValue(data.defScript);

                Ext.getCmp('optIgnSample').bindStore(new Ext.data.ArrayStore({fields: ['num','text'],data:data.options.samples}));
                Ext.getCmp('optIgnSample').setValue(data.defIgnoreSample);

                Ext.getCmp('optSSLType').bindStore(new Ext.data.ArrayStore({fields: ['num','text'],data:data.options.sslTypes}));
                Ext.getCmp('optSSLType').setValue(data.defSslType);

                $('#optAccord fieldset').each(function(key,fieldset){
                    //For each field form
                    $.each(Ext.getCmp(fieldset.id).items.items,function(key,item){
                        //Add the onChange save action
                        var ev = (item.getXType() == 'checkbox')? 'check' : 'change';
                        item.addListener(ev, function(field, oldvalue, value){
                            saveConf('confOptsForm');
                        });
                    });
                });
                
                infos("Options configuration loaded");
                Ext.getCmp('options').setIconClass('conf-options');
            }
    });
}

function loadConfServers(){
    Ext.Ajax.request({
            url: '/config/server/',
            success: function(response){
                var data = Ext.decode(response.responseText).servers;

                //Clear server store
                if(ServersList.getCount() > 0){
                    ServersList.removeAll(true);
                }
                
                $.each(data,function(){
                    
                    var button = '<img style="cursor: pointer;" onclick="delServer(\'' + this.name + '\')" src="../../static/images/delete.png" class="delServ" id="">';
                    
                    this.actions = button;
                    this.server = this.name;
                    this.enable = (this.enable*1) ? 'Enable' : 'Disable';
                    this.ssl = (this.ssl*1) ? 'Enable' : 'Disable';
                    this.optional = (this.optional*1) ? 'Enable' : 'Disable';
                    this.fillserver = (this.fillserver*1) ? 'Enable' : 'Disable';

                    ServersList.add(new Ext.data.Record(this));
                });

                infos("Servers configuration loaded");
                Ext.getCmp('servers').setIconClass('conf-servers');
            },
            failure: function(response){
                infos("ERROR While loading Servers Conf : " + response.status);
                Ext.getCmp('servers').setIconClass('conf-servers');
            }
    });
}

function loadConfPlans (){
    Ext.Ajax.request({
            url: '/config/scheduling/',
            success: function(response){
                var data = Ext.decode(response.responseText);

                //Clear plan store
                PlansList.removeAll();

                //Load actions in the combobox
                Ext.getCmp('actsPlan').bindStore(new Ext.data.ArrayStore({fields: ['num','text'],data:data.acts}));

                //Load data into the plan store
                if(data.plans.length > 0){

                    $.each(data.plans,function(){
                        var button = '<img style="cursor: pointer;" onclick="delPlan(\'' + this.line + '\')" src="../../static/images/delete.png">';

                        this.actions = button;
                        this.time = ((this.time.h < 10 ? '0' : '')) + this.time.h + ":" + this.time.m;

                        PlansList.add(new Ext.data.Record(this));
                    });
                }

                infos("Scheduling configuration loaded");
                Ext.getCmp('scheduling').setIconClass('conf-plans');
            },
            failure: function(response){
                infos("ERROR While loading Schedule Conf : " + response.status);
                Ext.getCmp('scheduling').setIconClass('conf-plans');
            }
    });
}

function loadLogs(type){

    Ext.getCmp('logs').setIconClass('loading-tab');

    var levels = [
        [0,'Warnings/Errors'],
        [1,'+ Infos'],
        [2,'+ Debugs']
    ];
    var types = [
        ['logs','Logs'],
        ['weblogs','Web Logs'],
    ];
    type = (type != undefined) ? type : ((Ext.getCmp('logType').getValue() != "") ? Ext.getCmp('logType').getValue() : 'logs' );
    var logURL = (type == 'weblogs') ? '/connections/showweb?session=' + session  : '/connections/showlog?session=' + session;
    var currentLogLevel = Ext.getCmp('logLevel').getValue();

    //Display the log level and type
    Ext.getCmp('logType').store = Ext.getCmp('logType').store = new Ext.data.ArrayStore({id:'typeStore',fields: ['value','text'],data:types});
    Ext.getCmp('logLevel').store = Ext.getCmp('logLevel').store = new Ext.data.ArrayStore({id:'levelStore',fields: ['value','text'],data:levels});
    //Select the default LogLevel/LogType
    Ext.getCmp('logType').setValue(type);
    Ext.Ajax.request({
            url: '/connections/',
            success: function(response){
                var connections = Ext.decode(response.responseText);
                currentLogLevel = connections.loglevel;
                Ext.getCmp('logLevel').setValue(connections.loglevel);
            }
    });

    //Display logs with the defined parameters
    Ext.Ajax.request({
            url: logURL,
            success: function(response){
                var logs = [];
                var date = new Date();
                var maxLines = 500;
                var splitter = '';
                var logLines = [];
                var logLine = '';
                var lines = Ext.getCmp('logLines').getValue()*1;
                lines = (lines != undefined && (lines*1 > 0)) ? lines : 10;

                //Clear the Log Store
                LogsList.clearData();
                Ext.getCmp('logView').refresh();

                if(lines > maxLines){
                    infos("The maximum number of lines to display is " + maxLines+ '  ');
                }else{
                
                    //The parsing of log/weblog is not the same
                    switch(type){
                        case 'logs':

                            //Array of the current day logs
                            date = date.format('Y-m-d');
                            logs = response.responseText.split(date);
                            splitter = '::';


                            //Get the last 999 logs of the right level to linghten the memory
                            for (var i = logs.length-1; i > 0; i--){

                                logLine = logs[i].split(splitter);
                                //Check the log level
                                var isLevelValid = false;
                                switch(logLine[1]){
                                    case 'ERROR':
                                    case 'WARNING':
                                        isLevelValid = (currentLogLevel*1 >= 0) ? true : false;
                                        break;
                                    case 'INFO':
                                        isLevelValid = (currentLogLevel*1 >= 1) ? true : false;
                                        break;
                                    case 'DEBUG':
                                        isLevelValid = (currentLogLevel*1 >= 2) ? true : false;
                                        break;
                                    default:
                                        break;
                                }

                                //If level OK : create a record and add it to the store
                                if(isLevelValid){
                                    logLines.push(logs[i]);
                                }
                            }

                            break;
                        case 'weblogs':

                            //Array of the current day logs
                            date = date.format('[d/M/Y');
                            logs = response.responseText.split(date);
                            splitter = ' ';

                            //Get the last 999 logs of the right level to linghten the memory
                            for (i = logs.length-1; i > 0; i--){
                                logLines.push(logs[i]);
                            }

                            break;
                        default:

                            lines = 0;
                            infos('Wrong log type given.');

                            break;
                    }


                    //Unloading the unecessary logs from the memory
                    logs = '';

                    //If the number of line to display is higher than the number of log line
                    if(lines > logLines.length){
                        lines = logLines.length-1;
                    }
                    
                    //Display only the number of logs requested/possible
                    for (var j = 0; j < lines; j++){
                        //Separate the date/the level/the message
                        logLine = logLines[j].split(splitter);
                        var msg = logLine[2];
                        if(logLine.length > 3){
                            for(var k = 3; k < logLine.length; k++){
                                msg += logLine[k];
                            }
                        }
                        var log = {
                            date: date + logLine[0],
                            type: logLine[1],
                            msg: Ext.util.Format.htmlEncode(msg)
                        };

                        LogsList.add(new Ext.data.Record(log));
                    }
                    
                }

                Ext.getCmp('logView').refresh();
                Ext.getCmp('logs').setIconClass('conf-logs');
            }
    });
}

function loadConfCats(){
    Ext.Ajax.request({
            url: '/config/categories/',
            success: function(response){
                var data = Ext.decode(response.responseText);

                data.cats.pop();
                data.cats.shift();
                
                CategoriesList.removeAll();
                $.each(data.cats,function(){
                    var buttons = '<img style="cursor: pointer;" onclick="" src="../../static/images/delete.png">';
                        
                    this.actions = buttons;
                    this.mode = (this.mode == "") ? "x" : this.mode;
                    CategoriesList.add(new Ext.data.Record(this));
                });

                Ext.getCmp('categories').setIconClass('conf-cat');
            }
    });


}

function loadConfMail(){
    Ext.Ajax.request({
            url: '/config/email/',
            success: function(response){
                var data = Ext.decode(response.responseText);

                switch(data.options.endjob*1){
                    case 0:
                        Ext.getCmp('aNever').setValue(true);
                        break;
                    case 1:
                        Ext.getCmp('aAlw').setValue(true);
                        break;
                    case 2:
                        Ext.getCmp('aOnE').setValue(true);
                        break;
                }

                Ext.getCmp('mailAlertSL').setValue(data.options.emailfull);
                Ext.getCmp('mailTmpl').setValue(data.options.emaildir);
                Ext.getCmp('mailSmtp').setValue(data.server.stmp);
                Ext.getCmp('mailto').setValue(data.server.mailto);
                Ext.getCmp('mailfrom').setValue(data.server.mailfrom);
                Ext.getCmp('mailLogin').setValue(data.server.login);
                Ext.getCmp('mailPass').setValue(data.server.password);

                $('#mailAccord fieldset').each(function(key,fieldset){
                    //For each field form
                    $.each(Ext.getCmp(fieldset.id).items.items,function(key,item){
                        //Add the onChange save action
                        var ev = (item.getXType() == 'checkbox')? 'check' : 'change';
                        item.addListener(ev, function(field, oldvalue, value){
                            saveConf('confMailForm');
                        });
                    });
                });

                Ext.getCmp('mail').setIconClass('conf-mail');
            }
    });
}

function loadConfFeeds(){
    Ext.Ajax.request({
            url: '/config/rss/',
            success: function(response){
                var data = Ext.decode(response.responseText);

                FeedsList.removeAll();
                FiltersList.removeAll();

                $.each(data.feeds,function(){
                    var feedName = this.name;
                    FeedsList.add(new Ext.data.Record(this));
                    FiltersList.data = this.filters;
                });

                var store = [];
                $.each(data.cats,function(){
                    store.push([this,this]);
                });

                Ext.getCmp('filterCat').bindStore(new Ext.data.ArrayStore({fields: ['value','text'],data:store}));

                Ext.getCmp('rss').setIconClass('conf-feeds');
            }
    });
}