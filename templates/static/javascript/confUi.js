var confPan = new Ext.TabPanel({
    region: 'center',
    activeTab: 0,
    id: 'confTabs',
    defaults:{
        height: 350
    },
    listeners: {
        tabchange: function(tabPanel, tab){
            var mainTabId = Ext.getCmp('maintabpanel').getActiveTab().id;
            $.address.value(mainTabId + urlDelimiter + tab.id);
        }
    },
    items: [
        {
            xtype: 'panel',
            title: 'Serveurs',
            id:'servers',
            layout: 'border',
            listeners: {
                activate : function(){
                    Ext.getCmp('servers').setIconClass('loading-tab');
                    loadConfServers();
                },
                beforeaction:function(){
                    Ext.getCmp('serverName').enable();
                }
            },
            tbar: {
                    xtype: 'toolbar',
                    items: [
                            {
                                    xtype: 'button',
                                    text: 'Add Server',
                                    icon: '../static/images/server_add.png',
                                    id: 'addServButton'
                            },
                    ]
            },
            items:[
                formServer,
                {
                    xtype: 'grid',
                    width: 0.77,
                    height: 300,
                    region: 'center',
                    border: false,
                    margins: '0 0 10 0',
                    store: 'ServersList',
                    id: 'serversGrid',
                    sm: new Ext.grid.RowSelectionModel({
                        singleSelect: true,
                        listeners: {
                            rowselect: function(sm, row, rec) {
                                //For the checkbox to be checked
                                rec.data.enable = (rec.data.enable == 'Enable')? 1 : 0;
                                rec.data.ssl = (rec.data.ssl == 'Enable')? 1 : 0;
                                rec.data.optional = (rec.data.optional == 'Enable')? 1 : 0;
                                rec.data.fillserver = (rec.data.fillserver == 'Enable')? 1 : 0;
                                
                                Ext.getCmp("servEdit").getForm().loadRecord(rec);
                                Ext.getCmp('serverName').disable();
                                Ext.getCmp("servEdit").expand();
                                Ext.getCmp('serverName').show();
                            }
                        }
                    }),
                    defaults:{
                        editable:false
                    },
                    columns: [
                            {
                                    xtype: 'gridcolumn',
                                    header: '<img src="../static/images/actions.png" alt="Actions" />',
                                    sortable: false,
                                    resizable: false,
                                    align: 'center',
                                    width: 40,
                                    dataIndex: 'actions',
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Name',
                                    sortable: true,
                                    resizable: false,
                                    align: 'center',
                                    width: 200,
                                    css:"font-weight: bold;",
                                    dataIndex: 'server',
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'State',
                                    sortable: false,
                                    resizable: false,
                                    align: 'center',
                                    width: 50,
                                    dataIndex: 'enable',
                                    menuDisabled: true,
                                    renderer:function(value){
                                        if((typeof value) == 'number' || (typeof value) == 'boolean'){
                                            value = (value) ? 'Enable' : 'Disable';
                                        }
                                        return value;
                                    }
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Host',
                                    id: 'servername',
                                    width: 200,
                                    sortable: true,
                                    dataIndex: 'host'
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Port',
                                    resizable: false,
                                    width: 50,
                                    dataIndex: 'port',
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Username',
                                    sortable: false,
                                    width: 100,
                                    dataIndex: 'username',
                                    name: 'username'
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Password',
                                    sortable: false,
                                    width: 100,
                                    dataIndex: 'password'
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Connections',
                                    sortable: false,
                                    resizable: false,
                                    width: 80,
                                    dataIndex: 'connections',
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Timeout',
                                    sortable: false,
                                    resizable: false,
                                    width: 80,
                                    dataIndex: 'timeout',
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'SSL',
                                    sortable: false,
                                    resizable: false,
                                    align: 'center',
                                    width: 50,
                                    dataIndex: 'ssl',
                                    menuDisabled: true,
                                    renderer:function(value){
                                        if((typeof value) == 'number' || (typeof value) == 'boolean'){
                                            value = (value) ? 'Enable' : 'Disable';
                                        }
                                        return value;
                                    }
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Support Server',
                                    sortable: false,
                                    resizable: false,
                                    align: 'center',
                                    width: 100,
                                    dataIndex: 'fillserver',
                                    menuDisabled: true,
                                    renderer:function(value){
                                        if((typeof value) == 'number' || (typeof value) == 'boolean'){
                                            value = (value) ? 'Enable' : 'Disable';
                                        }
                                        return value;
                                    }
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Optional',
                                    sortable: false,
                                    resizable: false,
                                    align: 'center',
                                    width: 60,
                                    dataIndex: 'optional',
                                    menuDisabled: true,
                                    renderer:function(value){
                                        if((typeof value) == 'number' || (typeof value) == 'boolean'){
                                            value = (value) ? 'Enable' : 'Disable';
                                        }
                                        return value;
                                    }
                            }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'General',
            layout: 'fit',
            iconCls: 'conf-general',
            id: 'general',
            listeners: {
                activate : function(){
                    Ext.getCmp('general').setIconClass('loading-tab');
                    loadConfGeneral();
                }
            },
            items:[ formGen ]
        },
        {
            xtype: 'panel',
            title: 'Folders',
            layout: 'fit',
            iconCls: 'conf-folders',
            id: 'folders',
            listeners: {
                activate : function(){
                    Ext.getCmp('folders').setIconClass('loading-tab');
                    loadConfFolders();
                }
            },
            items:[ formFold ]
        },
        {
            xtype: 'panel',
            title: 'Options',
            iconCls: 'conf-options',
            layout: 'fit',
            id: 'options',
            listeners: {
                activate : function(){
                    Ext.getCmp('options').setIconClass('loading-tab');
                    loadConfOptions();
                }
            },
            items:[ formOpts ]
        },
        {
            xtype: 'panel',
            title: 'Planifications',
            layout: 'border',
            iconCls: 'conf-plans',
            id: 'scheduling',
            listeners: {
                activate : function(){
                    Ext.getCmp('scheduling').setIconClass('loading-tab');
                    loadConfPlans();
                }
            },
            items: [
                formPlan,
                {
                    xtype: 'grid',
                    store: 'PlansList',
                    region: 'center',
                    border: false,
                    margins: '0 0 10 0',
                    id: 'plansGrid',
                    defaults:{
                        editable: false
                    },
                    columns: [
                            {
                                    xtype: 'gridcolumn',
                                    header: '<img src="../static/images/actions.png" alt="Actions" />',
                                    sortable: false,
                                    resizable: false,
                                    align: 'center',
                                    dataIndex: 'actions',
                                    width: 40,
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Time',
                                    sortable: true,
                                    resizable: false,
                                    dataIndex: 'time',
                                    width: 40,
                                    menuDisabled: false
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Frequency',
                                    sortable: false,
                                    resizable: false,
                                    dataIndex: 'frequency',
                                    width: 70,
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Action',
                                    sortable: false,
                                    resizable: false,
                                    dataIndex: 'action',
                                    width: 200,
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Arguments',
                                    sortable: false,
                                    resizable: false,
                                    dataIndex: 'args',
                                    width: 200,
                                    menuDisabled: true
                            },
                    ],
                    tbar: {
                            xtype: 'toolbar',
                            items: [
                                    {
                                            xtype: 'button',
                                            text: 'Add Schedule',
                                            icon: '../static/images/plan_add.png',
                                            id: 'addPlan',
                                            listeners:{
                                                click:function(){
                                                    Ext.getCmp('planEdit').expand();
                                                }
                                            }
                                    },
                            ]
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Feeds',
            layout: 'fit',
            iconCls: 'conf-feeds',
            id: 'feeds',
            items:[ formFeeds ]
        },
        {
            xtype: 'panel',
            title: 'Categories',
            layout: 'fit',
            iconCls: 'conf-cat',
            id: 'categories',
            listeners: {
                activate : function(){
                    Ext.getCmp('categories').setIconClass('loading-tab');
                    loadConfCats();
                }
            },
            height:550,
            items: [
                {
                    xtype: 'editorgrid',
                    store: 'CategoriesList',
                    region: 'center',
                    border: false,
                    margins: '0 0 10 0',
                    id: 'catsGrid',
                    columns: [
                            {
                                    xtype: 'gridcolumn',
                                    header: '<img src="../static/images/actions.png" alt="Actions" />',
                                    sortable: false,
                                    align:'center',
                                    dataIndex:'actions',
                                    resizable: false,
                                    editable: false,
                                    width: 40,
                                    menuDisabled: true
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Category',
                                    sortable: false,
                                    resizable: false,
                                    editable: true,
                                    dataIndex: 'name',
                                    width: 140,
                                    menuDisabled: true,
                                    editor: new Ext.form.TextField({
                                        name:'name'
                                    })
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Mode',
                                    sortable: true,
                                    resizable: false,
                                    editable: true,
                                    dataIndex: 'mode',
                                    width: 100,
                                    menuDisabled: false,
                                    editor: new Ext.form.ComboBox({
                                            name: 'pp',
                                            id: 'pp',
                                            mode: 'local',
                                            triggerAction : 'all',
                                            editable: false,
                                            valueField: 'value',
                                            hiddenName: 'value',
                                            displayField: 'text',
                                            width: 150,
                                            cls:'catMode',
                                            store: modeStore
                                    }),
                                    renderer:function(value){
                                            var index = modeStore.find("value",value);
                                            var displayName = modeStore.getAt(index).get("text");
                                            return displayName;
                                    }

                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Priority',
                                    sortable: false,
                                    resizable: false,
                                    editable: true,
                                    dataIndex: 'priority',
                                    width: 100,
                                    menuDisabled: true,
                                    editor: new Ext.form.ComboBox({
                                            name: 'priority',
                                            id: 'priority',
                                            mode: 'local',
                                            triggerAction : 'all',
                                            editable: false,
                                            valueField: 'value',
                                            hiddenName: 'value',
                                            displayField: 'text',
                                            width: 150,
                                            cls:'catPriority',
                                            store: priorityStore
                                    }),
                                    renderer:function(value){
                                            var index = priorityStore.find("value",value);
                                            var displayName = priorityStore.getAt(index).get("text");
                                            return displayName;
                                    }
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Path',
                                    sortable: false,
                                    resizable: false,
                                    editable: true,
                                    dataIndex: 'path',
                                    width: 300,
                                    menuDisabled: true,
                                    editor: new Ext.form.TextField({
                                        name:'dir'
                                    })
                            },
                            {
                                    xtype: 'gridcolumn',
                                    header: 'Groups',
                                    sortable: false,
                                    resizable: false,
                                    editable: true,
                                    dataIndex: 'groups',
                                    width: 300,
                                    menuDisabled: true,
                                    editor: new Ext.form.TextField({
                                        name:'newzbin'
                                    })
                            },
                    ],
                    tbar: {
                            xtype: 'toolbar',
                            items: [
                                    {
                                            xtype: 'button',
                                            text: 'Add category',
                                            icon: '../static/images/cat_add.png',
                                            id: 'addCat'
                                    },
                                    {
                                            xtype: 'button',
                                            text: 'Delete selected categories',
                                            icon: '../static/images/trash.png',
                                            id: 'delCats'
                                    },
                                    {
                                            xtype: 'tbfill'
                                    }
                            ]
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Sorting',
            iconCls: 'conf-sort',
            layout: 'fit',
            id: 'sorting',
            items:[
                {
                    region:'center',
                    id:'sortAccord',
                    split:true,
                    width: 200,
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
                    items: [{
                        title:'General Sorting',
                        autoScroll:true,
                        collapsed: true,
                        border:false
                    },{
                        title:'Sorting by date',
                        border:false,
                        collapsed: true,
                        autoScroll:true
                    },{
                        title:'Series sorting',
                        border:false,
                        collapsed: true,
                        autoScroll:true
                    }]
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'External NZB engine',
            iconCls: 'conf-externalnzb',
            layout: 'fit',
            id: 'nzbengines',
            items:[
                {
                    region:'center',
                    id:'nzbAccord',
                    split:true,
                    width: 200,
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
                    items: [{
                        title:'Newzbin',
                        autoScroll:true,
                        collapsed: true,
                        border:false
                    },{
                        title:'NzbMatrix',
                        border:false,
                        collapsed: true,
                        autoScroll:true
                    }]
                }
            ]
        },
        {
            xtype: 'panel',
            title: 'Logs',
            iconCls: 'conf-logs',
            layout: 'fit',
            id: 'logs',
            height:463,
            listeners:{
                activate : function(){
                    loadLogs();
                }
            },
            items:[
                new Ext.list.ListView({
                    multiSelect: false,
                    region: 'center',
                    id:'logView',
                    store: 'LogsList',
                    height:462,
                    emptyText: 'No logs to display',
                    defaultType: 'lvgridcolumn',
                    columns:[
                        {
                            header: 'Date/Time',
                            width: .11,
                            align: 'center',
                            dataIndex: 'date'
                        },
                        {
                            header: 'Type',
                            width: .04,
                            align: 'center',
                            dataIndex: 'type'
                        },
                        {
                            header: 'Message',
                            width: .85,
                            dataIndex: 'msg'
                        }
                    ]
                })
            ],
            tbar:{
                    xtype: 'toolbar',
                    items: [
                            {
                                    xtype: 'tbtext',
                                    text: 'Number of lines: '
                            },
                            {
                                    xtype: 'textfield',
                                    fieldLabel: 'Number of lines: ',
                                    name: 'logLines',
                                    allowBlank: true,
                                    width: 30,
                                    value: 20,
                                    id: 'logLines',
                                    listeners:{
                                        change: function(){
                                            infos('Loading the last ' + Ext.getCmp('logLines').getValue() + ' logs');
                                            loadLogs();
                                        }
                                    }
                            },
                            {
                                    xtype: 'tbseparator'
                            },
                            {
                                    xtype: 'tbtext',
                                    id: 'logLevelLbl',
                                    text: 'Log level: '
                            },
                            {
                                    xtype: 'combo',
                                    name: 'logLevel',
                                    triggerAction : 'all',
                                    fieldLabel: 'Log level: ',
                                    id: 'logLevel',
                                    mode: 'local',
                                    editable: false,
                                    valueField: 'value',
                                    displayField: 'text',
                                    width: 150,
                                    listeners:{
                                        change: function(){
                                            Ext.Ajax.request({
                                                url:'/connections/change_loglevel?loglevel=' + Ext.getCmp('logLevel').getValue() + '&session=' + session,
                                                success:function(){
                                                    currentLogLevel = Ext.getCmp('logLevel').getValue();
                                                    infos('Log level modified');
                                                    loadLogs();
                                                }
                                            });
                                        }
                                    }
                            },
                            {
                                    xtype: 'tbtext',
                                    text: 'Log type: '
                            },
                            {
                                    xtype: 'combo',
                                    name: 'logType',
                                    triggerAction : 'all',
                                    fieldLabel: 'Log type: ',
                                    id: 'logType',
                                    mode: 'local',
                                    editable: false,
                                    valueField: 'value',
                                    displayField: 'text',
                                    width: 150,
                                    listeners:{
                                        change: function(){
                                            switch(Ext.getCmp('logType').getValue()){
                                                case 'logs':
                                                    Ext.getCmp('logLevelLbl').show();
                                                    Ext.getCmp('logLevel').show();
                                                    break;
                                                case 'weblogs':
                                                    Ext.getCmp('logLevelLbl').hide();
                                                    Ext.getCmp('logLevel').hide();
                                                    break;
                                            }
                                            loadLogs(Ext.getCmp('logType').getValue());
                                        }
                                    }
                            },
                            {
                                    xtype: 'tbfill'
                            }
                    ]
            }
        }
    ]
});