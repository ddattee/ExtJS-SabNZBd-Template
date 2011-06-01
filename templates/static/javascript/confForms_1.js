/***************************** General Tab *****************************/

var formGen = new Ext.FormPanel({
    url:'config/general/saveGeneral',
    name: "fullform",
    id:'confGenForm',
    layout:'column',
    timeout:10,
    defaults: {      // defaults applied to items
        layout: 'form',
        border: true
    },
    listeners:{
        afterrender:function(_this){
            //For each accordion zone
            $.each(_this.items.items[0].items.items,function(key,accordionZone){
                //For each fieldset
                $.each(accordionZone.items.items,function(key2,fieldset){
                    //For each field form
                    $.each(fieldset.items.items,function(key2,item){
                        //Add the onChange save action
                        var ev = (item.getXType() == 'checkbox')? 'check' : 'change';
                        item.addListener(ev, function(field, oldvalue, value){
                            saveConf('confGenForm');
                            Ext.getCmp('needRestartTxt').show();
                        });
                    })
                });
            });
        }
    },
    items: [
        {
            region:'center',
            id:'genAccord',
            width:'100%',
            height: 300,
            collapsible: false,
            margins:'35 0 5 5',
            cmargins:'35 5 5 5',
            layout: 'accordion',
            border:false,
            layoutConfig:{
                animate:true
            },
            items: [
                {
                    title:'Web Serveur',
                    autoScroll:true,
                    border:false,
                    collapsed: true,
                    defaults:{
                        autoWidth: false,
                        width: "20%",
                        style:{
                            'float':'left',
                            margin: '5px',
                            marginRight: '2px'
                        }
                    },
                    items:[
                        new Ext.form.FieldSet({
                                columnWidth: 0.5,
                                title: 'SabNZBd Server',
                                id:'fsSabServ',
                                collapsible: false,
                                border: true,
                                height: 100,
                                labelWidth:50,
                                defaultType: 'textfield',
                                items:[
                                        new Ext.form.TextField({
                                            fieldLabel: 'Host',
                                            name: 'host',
                                            allowBlank: false,
                                            id: 'sabhost',
                                            width: 180
                                        }),
                                        new Ext.form.NumberField({
                                            fieldLabel: 'Port',
                                            name: 'port',
                                            allowBlank: false,
                                            id: 'sabport',
                                            width: 35
                                        })
                                ]
                        }),
                        new Ext.form.FieldSet({
                            columnWidth: 0.5,
                            title: 'Authentication',
                            collapsible: false,
                            border: true,
                            labelWidth:120,
                            height: 100,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.TextField({
                                        fieldLabel: 'SabNZBd Username',
                                        name: 'username',
                                        allowBlank: true,
                                        id: 'sabuser'
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'SabNZBd Password',
                                        name: 'password',
                                        allowBlank: true,
                                        id: 'sabpassw'
                                    })
                            ]
                        }),
                        new Ext.form.FieldSet({
                            xtype:'fieldset',
                            columnWidth: 0.5,
                            title: 'Interfaces',
                            collapsible: false,
                            border: true,
                            autoHeight:false,
                            labelWidth:125,
                            height: 100,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.ComboBox({
                                        fieldLabel: 'First Web Interface',
                                        hiddenName: 'web_dir',
                                        id: 'ifs1',
                                        mode: 'local',
                                        triggerAction : 'all',
                                        editable: false,
                                        valueField: 'value',
                                        displayField: 'text',
                                        width: 150
                                    }),
                                    new Ext.form.ComboBox({
                                        fieldLabel: 'Second Web Interface',
                                        hiddenName: 'web_dir2',
                                        triggerAction : 'all',
                                        id: 'ifs2',
                                        mode: 'local',
                                        editable: false,
                                        valueField: 'value',
                                        displayField: 'text',
                                        width: 150
                                    })
                            ]
                        }),
                        new Ext.form.FieldSet({
                            xtype:'fieldset',
                            columnWidth: 0.5,
                            title: 'Others',
                            collapsible: false,
                            border: true,
                            autoHeight:false,
                            labelWidth:60,
                            height: 120,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.ComboBox({
                                        fieldLabel: 'Language',
                                        hiddenName: 'language',
                                        autoLoad: true,
                                        id: 'language',
                                        mode: 'local',
                                        triggerAction : 'all',
                                        editable: false,
                                        valueField: 'value',
                                        displayField: 'text',
                                        width: 100
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'API Key',
                                        allowBlank: true,
                                        id: 'apikey',
                                        width: 250

                                    }),
                                    new Ext.Button({
                                        width: 50,
                                        text: "Generate new API key",
                                        id: 'genApiK',
                                        listeners:{
                                            click: function(){
                                                 Ext.Ajax.request({
                                                    url: 'tapi?mode=config&name=set_apikey&apikey=' + session,
                                                    success: function(response){
                                                        session = response.responseText
                                                        Ext.getCmp('apikey').setValue(session);
                                                    }
                                                 })
                                            }
                                        }
                                    })
                            ]
                        })
                    ]
                },
                {
                    title:'Support HTTPS',
                    border:false,
                    collapsed: true,
                    autoScroll:true,
                    defaults:{
                        autoWidth: false,
                        width: "20%",
                        style:{
                            'float':'left',
                            margin: '5px',
                            marginRight: '2px'
                        }
                    },
                    items:[ 
                        {
                             xtype:'fieldset',
                            columnWidth: 0.5,
                            collapsible: false,
                            border: true,
                            height: 130,
                            labelWidth:100,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.Checkbox({
                                        fieldLabel: 'Enable HTTPS',
                                        name: 'enable_https',
                                        id: 'sabHSenable',
                                        width: 35
                                    }),
                                    new Ext.form.NumberField({
                                        fieldLabel: 'HTTPS Port',
                                        name: 'https_port',
                                        allowBlank: true,
                                        id: 'sabHSport',
                                        width: 35
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'HTTPS Certificate',
                                        name: 'https_cert',
                                        allowBlank: false,
                                        id: 'sabHScert',
                                        width: 180
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'HTTPS Key',
                                        name: 'https_key',
                                        allowBlank: false,
                                        id: 'sabHSkey',
                                        width: 180
                                    })
                            ]
                        }
                    ]
                },
                {
                    title:'Tunning',
                    border:false,
                    collapsed: true,
                    autoScroll:true,
                    defaults:{
                        autoWidth: false,
                        width: "20%",
                        style:{
                            'float':'left',
                            margin: '5px',
                            marginRight: '2px'
                        }
                    },
                    items:[
                        {
                             xtype:'fieldset',
                            columnWidth: 0.5,
                            collapsible: false,
                            border: true,
                            height: 90,
                            labelWidth:120,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.NumberField({
                                        fieldLabel: 'Cache article limit',
                                        name: 'cache_limit',
                                        allowBlank: true,
                                        id: 'sabTcache',
                                        width: 35
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Extention cleaning list',
                                        name: 'cleanup_list',
                                        allowBlank: false,
                                        id: 'sabText',
                                        width: 180
                                    })
                            ]
                        }
                    ]
                },
            ]
        }
    ]
});


/***************************** Folder Tab *****************************/

var formFold = new Ext.FormPanel({
    url:'config/directories/saveDirectories',
    name: "fullform",
    id:'confFoldForm',
    layout:'column',
    listeners:{
        afterrender:function(_this){
            //For each accordion zone
            $.each(_this.items.items[0].items.items,function(key,accordionZone){
                //For each fieldset
                $.each(accordionZone.items.items,function(key2,fieldset){
                    //For each field form
                    $.each(fieldset.items.items,function(key2,item){
                        //Add the onChange save action
                        item.addListener('change', function(field, oldvalue, value){
                            saveConf('confFoldForm');
                        });
                    })
                });
            });
        }
    },
    defaults: {      // defaults applied to items
        layout: 'form',
        border: false
    },
    items: [
        {
            region:'center',
            id:'foldAccord',
            split:true,
            width:'100%',
            height: 300,
            minSize: 175,
            maxSize: 400,
            collapsible: false,
            renderHidden: true,
            margins:'35 0 5 5',
            cmargins:'35 5 5 5',
            layout: 'accordion',
            layoutConfig:{
                animate:true
            },
            items: [
                {
                    title:'User folders',
                    autoScroll:true,
                    collapsed: true,
                    border:false,
                    defaults:{
                        autoWidth: false,
                        width: "20%",
                        style:{
                            'float':'left',
                            margin: '5px',
                            marginRight: '2px'
                        }
                    },
                    items:[ 
                        {
                            xtype:'fieldset',
                            title: 'Download Folders',
                            columnWidth: 0.5,
                            collapsible: false,
                            border: true,
                            height: 120,
                            labelWidth:120,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.TextField({
                                        fieldLabel: 'Complete Folder',
                                        allowBlank: false,
                                        id: 'complete_dir',
                                        width: 250

                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Incomplete Folder',
                                        allowBlank: false,
                                        id: 'download_dir',
                                        width: 250

                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'NZB Folder',
                                        allowBlank: true,
                                        id: 'dirscan_dir',
                                        width: 250

                                    }),
                            ]
                        },
                        {
                            xtype:'fieldset',
                            title: 'Folders parameters',
                            columnWidth: 0.5,
                            collapsible: false,
                            border: true,
                            height: 120,
                            labelWidth:190,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.NumberField({
                                        fieldLabel: 'Stop after disk space is behind',
                                        allowBlank: false,
                                        id: 'download_free',
                                        width: 50

                                    }),
                                    new Ext.form.NumberField({
                                        fieldLabel: 'Complete Download permission',
                                        allowBlank: true,
                                        id: 'permissions',
                                        width: 50

                                    }),
                                    new Ext.form.NumberField({
                                        fieldLabel: 'NZB Fodler Scan Interval (in sec.)',
                                        allowBlank: false,
                                        id: 'dirscan_speed',
                                        width: 50

                                    }),
                            ]
                        },
                        {
                            xtype:'fieldset',
                            title: 'Other Folders',
                            columnWidth: 0.5,
                            collapsible: false,
                            border: true,
                            height: 90,
                            labelWidth:150,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.TextField({
                                        fieldLabel: 'Post-Work Scripts Folder',
                                        allowBlank: true,
                                        id: 'script_dir',
                                        width: 250

                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Emails Template Folder',
                                        allowBlank: true,
                                        id: 'email_dir',
                                        width: 250

                                    }),
                            ]
                        }
                    ],
                    tbar: {
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Base URL: ',
                                id: 'userBaseURL'
                            }
                        ]
                    }
                },
                {
                    title:'System folders',
                    border:false,
                    collapsed: true,
                    autoScroll:true,
                    defaults:{
                        autoWidth: false,
                        width: "20%",
                        style:{
                            'float':'left',
                            margin: '5px',
                            marginRight: '2px'
                        }
                    },
                    items:[
                        {
                            xtype:'fieldset',
                            title: 'Other Folders',
                            columnWidth: 0.5,
                            collapsible: false,
                            border: true,
                            height: 125,
                            labelWidth:120,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.TextField({
                                        fieldLabel: 'Cache Folder',
                                        allowBlank: false,
                                        id: 'cache_dir',
                                        width: 250

                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Logs Folder',
                                        allowBlank: false,
                                        id: 'log_dir',
                                        width: 250

                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Backup NZB Folder',
                                        allowBlank: true,
                                        id: 'nzb_backup_dir',
                                        width: 250

                                    }),
                            ]
                        }
                    ],
                    tbar: {
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: 'Base URL: ',
                                id: 'sysBaseURL'
                            }
                        ]
                    }
                }

            ]
        }
    ]
        
});


/***************************** Options Tab *****************************/

var formOpts = new Ext.FormPanel({
    url:'config/switches/saveSwitches',
    name: "fullform",
    id:'confOptsForm',
    layout:'column',
    defaults: {      // defaults applied to items
        layout: 'form',
        border: false
    },
    items: [
        {
            region:'center',
            id:'optAccord',
            split:true,
            width:'100%',
            height: 350,
            collapsible: false,
            renderHidden: true,
            margins:'35 0 5 5',
            cmargins:'35 5 5 5',
            layout: 'accordion',
            layoutConfig:{
                animate:true
            },
            defaults:{
              height: '100%'
            },
            items: [{
                title:'Post-work Options',
                autoScroll:true,
                collapsed: true,
                border:false,
                defaults:{
                    autoWidth: false,
                    width: "20%",
                    style:{
                        'float':'left',
                        margin: '5px',
                        marginRight: '2px'
                    }
                },
                items:[
                    {
                        xtype:'fieldset',
                        id: 'fsPostWork',
                        columnWidth: 0.5,
                        collapsible: false,
                        border: true,
                        height: 283,
                        label: "Main Post-work Options",
                        labelWidth:220,
                        defaultType: 'textfield',
                        defaults:{
                          inputValue: 1
                        },
                        items:[
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Activate Quick Check',
                                    name: 'quick_check',
                                    id: 'optsQCenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Activate Unrar',
                                    name: 'enable_unrar',
                                    id: 'optsUnRenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Activate Unzip',
                                    name: 'enable_unzip',
                                    id: 'optsUnZenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Activate file join',
                                    name: 'enable_filejoin',
                                    id: 'optsFJenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Activate file foin TS',
                                    name: 'enable_tsjoin',
                                    id: 'optsFJTenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Clean par2',
                                    name: 'enable_par_cleanup',
                                    id: 'optsCPenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Use support serveur on yEnc fail',
                                    name: 'fail_on_crc',
                                    id: 'optsSFailenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Post-Work only on par2 success',
                                    name: 'safe_postproc',
                                    id: 'optsPWPenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Avoid duplicate download',
                                    name: 'no_dupes',
                                    id: 'optsADDenable'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Download only top of queue Download',
                                    name: 'top_only',
                                    id: 'optsDTenable'
                                })

                        ]
                    },
                    {
                        xtype:'fieldset',
                        id: 'fsOther',
                        columnWidth: 0.5,
                        collapsible: false,
                        border: true,
                        height: 148,
                        label: "Other Options",
                        labelWidth:180,
                        defaultType: 'textfield',
                        items:[
                                new Ext.form.ComboBox({
                                    fieldLabel: 'Default Priority',
                                    hiddenName: 'dirscan_priority',
                                    id: 'optDefPriority',
                                    valueField: 'num',
                                    displayField: 'text',
                                    editable: false,
                                    triggerAction : 'all',
                                    mode: 'local'
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: 'Default Post-work Level',
                                    hiddenName: 'dirscan_opts',
                                    valueField: 'num',
                                    displayField: 'text',
                                    editable: false,
                                    triggerAction : 'all',
                                    mode: 'local',
                                    id: 'optDefPostwork'
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: 'Default User Script',
                                    hiddenName: 'dirscan_script',
                                    valueField: 'num',
                                    triggerAction : 'all',
                                    editable: false,
                                    displayField: 'text',
                                    mode: 'local',
                                    id: 'optDefScript'
                                }),
                                new Ext.form.TextField({
                                    fieldLabel: 'PAR2 Parameters',
                                    name: 'par_option',
                                    allowBlank: true,
                                    id: 'optParParam'
                                }),
                                new Ext.form.TextField({
                                    fieldLabel: 'NICE Parameters',
                                    name: 'nice',
                                    allowBlank: true,
                                    id: 'optNiceParam'
                                })
                        ]
                    }
                ]
            },{
                title:'Other Options',
                border:false,
                collapsed: true,
                autoScroll:true,
                height:320,
                defaults:{
                    autoWidth: false,
                    width: "15%",
                    style:{
                        'float':'left',
                        margin: '5px',
                        marginRight: '2px'
                    }
                },
                items:[ 
                    {
                         xtype:'fieldset',
                        columnWidth: 0.5,
                        collapsible: false,
                        border: true,
                        height: 240,
                        label: "Other Options",
                        labelWidth:180,
                        defaultType: 'textfield',
                        defaults:{
                          inputValue: 1
                        },
                        items:[
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Check SABnzb Update',
                                    name: 'check_new_rel',
                                    id: 'optCheckUpdate'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Open Browser on Start',
                                    name: 'auto_browser',
                                    id: 'optOpenBrowser'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Disconnection on empty queue',
                                    name: 'auto_disconnect',
                                    id: 'optDiscoEmpty'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Send group command',
                                    name: 'send_group',
                                    id: 'optSendGroup'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Sort by Age',
                                    name: 'auto_sort',
                                    id: 'optSortByAge'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Replace spaces by underscore',
                                    name: 'replace_spaces',
                                    id: 'optRepSpace'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Replace folder name illegal Char',
                                    name: 'replace_illegal',
                                    id: 'optRepChar'
                                }),
                                new Ext.form.Checkbox({
                                    fieldLabel: 'Pause Download on Post-Work',
                                    name: 'pause_on_post_processing',
                                    id: 'optPausePostwork'
                                })
                        ]
                    },
                    {
                         xtype:'fieldset',
                        columnWidth: 0.5,
                        collapsible: false,
                        border: true,
                        height: 79,
                        label: "Other Options",
                        labelWidth:200,
                        defaultType: 'textfield',
                        items:[
                                new Ext.form.ComboBox({
                                    fieldLabel: 'Ignore sample',
                                    hiddenName: 'ignore_samples',
                                    valueField: 'num',
                                    triggerAction : 'all',
                                    displayField: 'text',
                                    editable: false,
                                    mode: 'local',
                                    id: 'optIgnSample'
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: 'SSL Type',
                                    hiddenName: 'ssl_type',
                                    triggerAction : 'all',
                                    valueField: 'num',
                                    editable: false,
                                    displayField: 'text',
                                    mode: 'local',
                                    id: 'optSSLType'
                                })

                        ]
                    }
                ]
            }]
        }
    ]
});


/***************************** Servers Form *****************************/

var formServer = {
    xtype:'form',
    region: 'west',
    id: 'servEdit',
    iconCls: 'edit',
    url: '/config/server/saveServer',
    method: 'post',
    collapsible: true,
    collapsed: true,
    split: true,
    border: true,
    height: 350,
    width: 318,
    label: "Edit Server",
    labelWidth:100,
    bodyStyle:'padding:5px;',
    items:[
        new Ext.form.Checkbox({
            fieldLabel: 'Enable',
            name: 'enable',
            anchor: '100%',
            inputValue: 1
        }),
        {
                xtype: 'textfield',
                fieldLabel: 'Name',
                name: 'server',
                id: 'serverName',
                hiddenName: 'server',
                disabled: true,
                anchor: '100%'
        },
        {
                xtype: 'textfield',
                fieldLabel: 'Host',
                name: 'host',
                allowBlank: false,
                blankText:"IP or Hostname",
                anchor: '100%'
        },
        {
                xtype: 'numberfield',
                fieldLabel: 'Port',
                blankText:"Server port",
                allowBlank: false,
                name: 'port',
                anchor: '60%'
        },
        {
                xtype: 'textfield',
                fieldLabel: 'Username',
                name: 'username',
                anchor: '100%'
        },
        {
                xtype: 'textfield',
                fieldLabel: 'Password',
                inputType: 'password',
                name: 'password',
                id: 'password',
                anchor: '100%'
        },
        {
                xtype: 'numberfield',
                fieldLabel: 'Connections',
                name: 'connections',
                anchor: '100%'
        },
        {
                xtype: 'numberfield',
                fieldLabel: 'Timeout',
                name: 'timeout',
                anchor: '100%'
        },
        new Ext.form.Checkbox({
            fieldLabel: 'SSL',
            name: 'ssl',
            anchor: '100%',
            inputValue: 1
        }),
        new Ext.form.Checkbox({
            fieldLabel: 'Support Server',
            name: 'fillserver',
            anchor: '100%',
            inputValue: 1
        }),
        new Ext.form.Checkbox({
            fieldLabel: 'Optional',
            name: 'optional',
            anchor: '100%',
            inputValue: 1
        }),
        {
            xtype: 'button',
            id: 'saveServButton',
            text: 'Save server',
            listeners:{
                click:function(){
                    var success = function(){
                        Ext.getCmp('serverName').disable();
                        infos("Configuration saved");
                        loadConfServers();
                    }
                    saveConf('servEdit',success);
                }
            }
        }
    ]

}



/***************************** Plans Form *****************************/

var formPlan = {
    xtype:'form',
    region: 'west',
    id: 'planEdit',
    iconCls: 'edit',
    url: '/config/scheduling/addSchedule',
    method: 'post',
    collapsible: true,
    collapsed: true,
    split: true,
    border: true,
    height: 350,
    width: 318,
    label: "Edit Planification",
    labelWidth:100,
    bodyStyle:'padding:5px;',
    items:[
            new Ext.form.TimeField({
                name:'time',
                id:'planTime',
                submitValue:false,
                fieldLabel:'Time',
                allowBlank: false,
                increment: 5,
                format: 'H:i'
            }),
            new Ext.form.NumberField({
                name: 'hour',
                id: 'planHour',
                hidden:true,
                fieldLabel:'Arguments'
            }),
            new Ext.form.NumberField({
                name: 'minute',
                id: 'planMinute',
                hidden:true,
                fieldLabel:'Arguments'
            }),
            new Ext.form.ComboBox({
                hiddenName:'dayofweek',
                fieldLabel:'Frequency',
                allowBlank: false,
                valueField: 'num',
                displayField: 'text',
                triggerAction: 'all',
                mode: 'local',
                store:new Ext.data.ArrayStore({
                    fields: ['num','text'],
                    data:[
                        ['*','Daily'],
                        ['1','Monday'],
                        ['2','Tuesday'],
                        ['3','Wednesday'],
                        ['4','Thursday'],
                        ['5','Friday'],
                        ['6','Saturday'],
                        ['7','Sunday']
                    ]
                })
            }),
            new Ext.form.ComboBox({
                hiddenName:'action',
                id:'actsPlan',
                fieldLabel:'Action',
                mode:'local',
                valueField: 'num',
                displayField: 'text',
                triggerAction: 'all',
                allowBlank: false
            }),
            new Ext.form.TextField({
                name: 'arguments',
                fieldLabel:'Arguments'
            }),
            new Ext.Button({
                text: 'Add schedule',
                listeners:{
                    click:function(){
                        if(Ext.getCmp('planEdit').getForm().isValid()){

                            var time = Ext.getCmp('planTime').getValue().split(':');
                            Ext.getCmp('planHour').setValue(time[0]*1);
                            Ext.getCmp('planMinute').setValue(time[1]*1);

                            var success = function(){
                                Ext.getCmp('planEdit').collapse();
                                Ext.getCmp('planEdit').getForm().reset();
                                infos("Configuration saved");
                                loadConfPlans();
                            }
                            
                            saveConf('planEdit',success);
                        }
                    }
                }
            })
    ]
}

/***************************** Mails Form *****************************/
var formMail = new Ext.FormPanel({
    url:'config/email/saveEmail',
    name: "fullform",
    id:'confMailForm',
    layout:'column',
    defaults: {      // defaults applied to items
        layout: 'form',
        border: false
    },
    items: [
        {
            region:'center',
            id:'mailAccord',
            width:'100%',
            height: 300,
            collapsible: false,
            margins:'35 0 5 5',
            cmargins:'35 5 5 5',
            layout: 'accordion',
            border:false,
            layoutConfig:{
                animate:true
            },
            items: [
                {
                    title:'Mail Alerts',
                    autoScroll:true,
                    border:false,
                    collapsed: false,
                    defaults:{
                        autoWidth: false,
                        width: "20%",
                        style:{
                            'float':'left',
                            margin: '5px',
                            marginRight: '2px'
                        }
                    },
                    items:[
                        {
                            xtype:'fieldset',
                            columnWidth: 0.5,
                            collapsible: false,
                            border: true,
                            height: 150,
                            id: 'mailConf',
                            label: "Account Parameters",
                            labelWidth:200,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.TextField({
                                        fieldLabel: 'SMTP Server',
                                        name: 'email_server',
                                        id: 'mailSmtp'
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Email To',
                                        vtype: 'email',
                                        name: 'email_to',
                                        id: 'mailto'
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Email From',
                                        vtype: 'email',
                                        name: 'email_from',
                                        id: 'mailfrom'
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Login:(optional)',
                                        name: 'email_account',
                                        id: 'mailLogin'
                                    }),
                                    new Ext.form.TextField({
                                        inputType: 'password',
                                        fieldLabel: 'Password:(optional)',
                                        name: 'email_pwd',
                                        id: 'mailPass'
                                    }),
                            ]
                        },
                        {
                             xtype:'fieldset',
                            columnWidth: 0.5,
                            collapsible: false,
                            border: true,
                            height: 140,
                            label: "Email Options",
                            id: 'mailOpt',
                            labelWidth:250,
                            defaultType: 'textfield',
                            items:[
                                    new Ext.form.RadioGroup({
                                        fieldLabel: 'Email notification when download end',
                                        name: 'email_endjob',
                                        id: 'mailAlertDE',
                                        columns: 1,
                                        items:[
                                            new Ext.form.Radio({
                                                boxLabel: 'Never',
                                                id: 'aNever',
                                                name: 'email_endjob',
                                                inputValue: 0
                                            }),
                                            new Ext.form.Radio({
                                                boxLabel: 'Always',
                                                name: 'email_endjob',
                                                id: 'aAlw',
                                                inputValue: 1
                                            }),
                                            new Ext.form.Radio({
                                                boxLabel: 'Only Errors',
                                                name: 'email_endjob',
                                                id: 'aOnE',
                                                inputValue: 2
                                            })
                                        ]
                                    }),
                                    new Ext.form.Checkbox({
                                        fieldLabel: 'Email notification on disk space limit reached',
                                        name: 'email_full',
                                        id: 'mailAlertSL',
                                        inputValue: 1
                                    }),
                                    new Ext.form.TextField({
                                        fieldLabel: 'Email template folder',
                                        name: 'email_dir',
                                        id: 'mailTmpl'
                                    })

                            ]
                        }
                    ]
                }
            ]
        }
    ]
});


/***************************** Feeds Form *****************************/
//var formFeeds = new Ext.Panel({
//    layout:'border',
//    id: 'feedsEdit',
//    defaults: {      // defaults applied to items
//    },
//    items: [
//        {
//            xtype: 'grid',
//            region:'center',
//            id:'feedGrid',
//            split:true,
//            width: '100%',
//            layout: 'column',
//            layoutConfig:{
//                animate:true,
//                width: '100%'
//            },
//            items: [
//                {
//                    title:'Import from RSS feeds',
//                    autoScroll:true,
//                    collapsed: true,
//                    border:false,
//                    height:300,
//                    items:[
//                        new Ext.list.ListView({
//                            columns: [
//                                {
//                                        header: '<img src="../static/images/actions.png" alt="Actions" />',
//                                        sortable: false,
//                                        resizable: false,
//                                        editable: false,
//                                        dataIndex: 'actions',
//                                        width: 40,
//                                        menuDisabled: true
//                                },
//                                {
//                                        header: 'Name',
//                                        sortable: true,
//                                        resizable: false,
//                                        dataIndex: 'name',
//                                        width: 40,
//                                        menuDisabled: false
//                                },
//                                {
//                                        header: 'Adresse',
//                                        sortable: true,
//                                        resizable: false,
//                                        dataIndex: 'address',
//                                        width: 40,
//                                        menuDisabled: false
//                                }
//                            ]
//                        }),
//                        new Ext.list.ListView({
//                            columns: [
//                                {
//                                        header: '<img src="../static/images/actions.png" alt="Actions" />',
//                                        sortable: false,
//                                        resizable: false,
//                                        editable: false,
//                                        dataIndex: 'actions',
//                                        width: 40,
//                                        menuDisabled: true
//                                },
//                                {
//                                        header: 'Order',
//                                        sortable: true,
//                                        resizable: false,
//                                        dataIndex: 'type',
//                                        width: 40,
//                                        menuDisabled: false
//                                },
//                                {
//                                        header: 'Type',
//                                        sortable: true,
//                                        resizable: false,
//                                        dataIndex: 'type',
//                                        width: 40,
//                                        menuDisabled: false
//                                },
//                                {
//                                        header: 'Filter',
//                                        sortable: true,
//                                        resizable: false,
//                                        dataIndex: 'filtre',
//                                        width: 40,
//                                        menuDisabled: false
//                                },
//                                {
//                                        header: 'Category',
//                                        sortable: true,
//                                        resizable: false,
//                                        dataIndex: 'category',
//                                        width: 40,
//                                        menuDisabled: false
//                                },
//                                {
//                                        header: 'Treatement',
//                                        sortable: true,
//                                        resizable: false,
//                                        dataIndex: 'treatement',
//                                        width: 40,
//                                        menuDisabled: false
//                                }
//                            ]
//                        })
//                    ]
//                }
//            ]
//        }
//    ]
//});