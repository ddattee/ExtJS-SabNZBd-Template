mainUi = Ext.extend(Ext.Viewport, {
	layout: 'border',
	initComponent: function() {
		this.items = [
			{
				xtype: 'tabpanel',
				id: 'maintabpanel',
				region: 'center',
				width: 100,
				border: false,
                                listeners: {
                                    tabchange: function(tabPanel, tab){
                                        $.address.value(tab.id);
                                    }
                                },
				items: [
					{
						xtype: 'panel',
						title: 'Queue',
                                                iconCls: 'queueIcon',
						layout: 'border',
						id: 'queue',
						items: [
							{
								xtype: 'editorgrid',
								store: 'DownloadsList',
								region: 'center',
								autoExpandColumn: 'filename',
								border: false,
								margins: '0 0 10 0',
								id: 'queuegrid',
								enableDragDrop : true,
								ddGroup : 'mygrid-dd',
								ddText : 'Place this row.',
								sm: new Ext.grid.RowSelectionModel({
									singleSelect:true,
									listeners: {
										beforerowselect: function(sm,i,ke,row){
											Ext.getCmp('queuegrid').ddText = row.get('filename');
										},
										rowselect: function(sm,i,ke,row){
											queueinfo(ke.data.nzo_id);
										}

									}
								}),
                                                                listeners:{
                                                                    afterrender: function(grid){
                                                                        var targetEl = grid.getView().scroller.dom;
                                                                        var target = new Ext.dd.DropTarget(targetEl, {
                                                                                ddGroup : 'mygrid-dd',
                                                                                notifyDrop : function(dd, e, data){
                                                                                        var sm = Ext.getCmp('queuegrid').getSelectionModel();
                                                                                        var rows = sm.getSelections();
                                                                                        var cindex = dd.getDragData(e).rowIndex;
                                                                                        if (sm.hasSelection()) {
                                                                                                for (var i = 0; i < rows.length; i++) {
                                                                                                        DownloadsList.remove(DownloadsList.getById(rows[i].id));
                                                                                                        DownloadsList.insert(cindex,rows[i]);
                                                                                                        queuemove(rows[i].get('nzo_id'),cindex);
                                                                                                }
                                                                                                sm.selectRecords(rows);
                                                                                        }
                                                                                        return true;
                                                                                }
                                                                        });
                                                                    }
                                                                },
								columns: [
									{
										xtype: 'gridcolumn',
										header: '<img src="../static/images/actions.png" alt="Actions" />',
										sortable: true,
										resizable: true,
                                                                                align: 'center',
										width: 55,
										dataIndex: 'buttons',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'Category',
										sortable: true,
										resizable: true,
                                                                                align: 'center',
										width: 60,
										dataIndex: 'cat',
										menuDisabled: true,
										editor: {
											xtype: 'combo',
											fieldLabel: 'Label',
											store: 'CatList',
											triggerAction: 'all',
											mode: 'local',
											displayField: 'cat',
											id: 'queuecat'
										}
									},
									{
										xtype: 'gridcolumn',
										header: 'File',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'filename',
										menuDisabled: true,
										id: 'filename',
										editor: {
											xtype: 'textfield',
											fieldLabel: 'Label',
											id: 'queuename'
										}
									},
									{
										xtype: 'gridcolumn',
										header: 'Status',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'status',
										align: 'center',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										sortable: true,
										resizable: true,
										width: 150,
										dataIndex: 'percentage',
										format: '00 %',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'Total size',
										sortable: true,
										resizable: true,
										width: 150,
										dataIndex: 'size',
										align: 'right',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'ETA',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'timeleft',
										align: 'right',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'Age',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'avg_age',
										align: 'right',
										menuDisabled: true
									}
								],
								tbar: {
									xtype: 'toolbar',
									items: [
										{
											xtype: 'button',
											text: 'Add file',
											icon: '../static/images/open.png',
											id: 'addfilebutton'
										},
										{
											xtype: 'button',
											text: 'Add URL',
											icon: '../static/images/url.png',
											id: 'addurlbutton'
										},
										{
											xtype: 'tbseparator'
										},
										{
											xtype: 'button',
											text: 'Pause',
											icon: '../static/images/pause-big.png',
											id: 'pausebutton'
										},
										{
											xtype: 'button',
											text: 'Clear',
											icon: '../static/images/clear.png',
											id: 'clearqueue'
										},
										{
											xtype: 'tbseparator'
										},
										{
											xtype: 'displayfield',
											fieldLabel: 'Label',
											value: '<img src="../static/images/speed.png" width="16px">&nbsp;'
										},
										{
											xtype: 'tbtext',
											text: 'Limit Speed:&nbsp;&nbsp;'
										},
										{
											xtype: 'numberfield',
											fieldLabel: 'Label',
											width: 50,
											id: 'speedlimit'
										},
										{
											xtype: 'tbtext',
											text: 'KB/s'
										},
                                                                                {
											xtype: 'tbseparator'
										},
										{
											xtype: 'tbtext',
											text: 'Auto-refresh :&nbsp;&nbsp;'
										},
										{
											xtype: 'numberfield',
											fieldLabel: 'Label',
											width: 50,
                                                                                        value: 0,
											id: 'speedRefresh'
										},
										{
											xtype: 'tbtext',
											text: 's.'
										},
										{
											xtype: 'tbfill'
										},
										{
											xtype: 'displayfield',
											value: '',
											ctCls: 'infos'
										},
										{
											xtype: 'tbseparator'
										},
										{
											xtype: 'displayfield',
											value: 'Status:&nbsp;'
										},
										{
											xtype: 'displayfield',
											value: '',
											id: 'status'
										},
										{
											xtype: 'tbseparator'
										},
										{
											xtype: 'displayfield',
											fieldLabel: 'Label',
											value: 'Speed:&nbsp;'
										},
										{
											xtype: 'displayfield',
											fieldLabel: 'Label',
											value: 0,
											id: 'speed'
										},
										{
											xtype: 'displayfield',
											fieldLabel: 'Label',
											value: 'KB/s'
										}
									]
								}
							},
							{
								xtype: 'tabpanel',
								activeTab: 0,
								region: 'south',
								width: 100,
								id: 'queuedetails',
								autoHeight: true,
								border: false,
                                                                listeners: {
                                                                    tabchange: function(tabPanel, tab){
                                                                        var queueTabId = Ext.getCmp('maintabpanel').getActiveTab().id;
                                                                        $.address.value(queueTabId + urlDelimiter + tab.id);
                                                                    }
                                                                },
								items: [
									{
										xtype: 'panel',
										title: 'Files',
										layout: 'anchor',
										iconCls: 'file-icon',
										id: 'files',
										items: [
											{
												xtype: 'grid',
												store: 'FilesList',
												height: 200,
												autoExpandColumn: 1,
												border: false,
												disableSelection: true,
												viewConfig: {
													getRowClass: function(record, rowIndex, rp, ds){
														if (record.get('status')=='finished') {
															return 'finishedrow';
														}
														if (record.get('status')=='queued') {
															return 'queuedrow';
														}
                                                                                                                return '';
													}
												},
												columns: [
													{
														xtype: 'gridcolumn',
														header: 'Status',
														sortable: true,
														resizable: true,
														width: 100,
														dataIndex: 'status'
													},
													{
														xtype: 'gridcolumn',
														header: 'Filename',
														sortable: true,
														resizable: true,
														width: 100,
														dataIndex: 'filename'
													},
													{
														xtype: 'gridcolumn',
														header: '',
														sortable: true,
														resizable: true,
														width: 150,
														dataIndex: 'percentage'
													},
													{
														xtype: 'gridcolumn',
														header: 'Size',
														sortable: true,
														resizable: true,
														width: 150,
														dataIndex: 'size',
														align: 'right'
													}
												]
											}
										]
									},
									{
										xtype: 'panel',
										title: 'Connections',
										layout: 'anchor',
										autoHeight: true,
										iconCls: 'conection-icon',
										id: 'connections',
										items: [
											{
												xtype: 'grid',
												store: 'ConnectionsList',
												height: 200,
												border: false,
												autoExpandColumn: 2,
												columns: [
													{
														xtype: 'numbercolumn',
														header: 'Thread',
														sortable: true,
														resizable: true,
														width: 60,
														format: '# 0',
														align: 'right',
														dataIndex: 'thread'
													},
													{
														xtype: 'gridcolumn',
														header: 'Poster',
														sortable: true,
														resizable: true,
														width: 300,
														dataIndex: 'poster'
													},
													{
														xtype: 'gridcolumn',
														header: 'Part',
														sortable: true,
														resizable: true,
														width: 300,
														dataIndex: 'part'
													}
												]
											}
										]
									},
									{
										xtype: 'panel',
										title: 'Warnings',
										layout: 'anchor',
										iconCls: 'warning-icon',
										id: 'warnings',
										items: [
											{
												xtype: 'grid',
												store: 'WarningsDatas',
												height: 200,
												border: false,
												autoExpandColumn: 'warning',
												columns: [
													{
														xtype: 'gridcolumn',
														header: 'Warnings',
														sortable: true,
														resizable: true,
														id: 'warning',
														dataIndex: 'warning'
													}
												],
                                                                                                tbar:
                                                                                                {
                                                                                                        xtype: 'toolbar',
                                                                                                        items: [
                                                                                                            {
                                                                                                                    xtype: 'button',
                                                                                                                    text: 'Clear',
                                                                                                                    icon: '../static/images/clear.png',
                                                                                                                    id: 'clearwarn'
                                                                                                            }
                                                                                                        ]
                                                                                                }
											}
										]
									}
								]
							}
						]
					},
					{
						xtype: 'panel',
						title: 'History',
                                                iconCls: 'historyIcon',
						layout: 'border',
						id: 'history',
						items: [
							{
								xtype: 'grid',
								store: 'HistoryList',
								id: 'HistoryGrid',
								region: 'center',
								autoExpandColumn: 'file',
								border: false,
								margins: '0 0 10 0',
                                                                sm: new Ext.grid.RowSelectionModel({
									singleSelect:false,
									listeners: {
										rowselect: function(sm,i,ke,row){
											loadhistorydetails(i);
										}

									}
								}),
								columns: [
                                                                        {
										xtype: 'gridcolumn',
										header: '<img src="../static/images/actions.png" alt="Actions" />',
										sortable: true,
                                                                                align: 'center',
										resizable: true,
										width: 40,
										dataIndex: 'buttons',
										menuDisabled: true
									},
									{
										xtype: 'gridcolumn',
										header: 'File',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'nzb_name',
										id: 'file'
									},
									{
										xtype: 'gridcolumn',
										header: 'Status',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'status',
										align: 'center'
									},
									{
										xtype: 'gridcolumn',
										header: 'Download time',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'downloadtime',
										align: 'right'
									},
									{
										xtype: 'gridcolumn',
										header: 'Size',
										sortable: true,
										resizable: true,
										width: 100,
										dataIndex: 'size',
										align: 'right'
									}
								],
								tbar: {
									xtype: 'toolbar',
									items: [
										{
											xtype: 'button',
											text: 'Clear all',
											icon: '../static/images/clear.png',
                                                                                        id: 'clearhist'
										},
                                                                                {
											xtype: 'button',
											text: 'Clear selected',
											icon: '../static/images/clear.png',
                                                                                        id: 'clearselected'
										},
										{
											xtype: 'button',
											text: 'Clear failed',
											icon: '../static/images/clear.png',
                                                                                        id: 'clearfailed'
										},
										{
											xtype: 'tbfill'
										},
                                                                                {
											xtype: 'displayfield',
											value: '',
											ctCls: 'infos'
										},
									]
								}
							},
                                                        {
								xtype: 'tabpanel',
								activeTab: 0,
								region: 'south',
								border: false,
								items: [
									{
										xtype: 'panel',
										title: 'Details',
										layout: 'anchor',
										border: false,
										items: [
											{
												xtype: 'propertygrid',
												height: 200,
												autoExpandColumn: 1,
												border: false,
												disableSelection: true,
                                                                                                id: 'detailshistory'
											}
										]
									}
								]
							}
						]
					},
                                        {
						xtype: 'panel',
						title: 'Configuration',
                                                iconCls: 'configIcon',
						layout: 'border',
						id: 'config',
                                                icon: '../static/images/config.png',
						items: [
                                                    {
                                                            xtype: 'panel',
                                                            tabWidth: 130,
                                                            activeTab: 0,
                                                            region: 'center',
                                                            id: 'confPanel',
                                                            autoLoad:{
                                                                url: "/config/",
                                                                scripts: true
                                                            }

                                                        }
                                                    ],
                                                tbar: {
                                                        xtype: 'toolbar',
                                                        id: 'mainConfTb',
                                                        items: [
                                                                {
                                                                        xtype: 'button',
                                                                        text: 'Refresh',
                                                                        icon: '../static/images/refresh.png',
                                                                        id: 'refreshconfbutton'
                                                                },
//                                                                {
//                                                                        xtype: 'button',
//                                                                        text: 'Save',
//                                                                        icon: '../static/images/save.png',
//                                                                        id: 'savebutton'
//                                                                },
                                                                {
                                                                        xtype: 'button',
                                                                        text: 'Shutdown',
                                                                        icon: '../static/images/quit.png',
                                                                        id: 'shutdownbutton'
                                                                },
                                                                {
                                                                        xtype: 'button',
                                                                        text: 'Restart',
                                                                        icon: '../static/images/restart.png',
                                                                        id: 'restartbutton'
                                                                },
                                                                {
                                                                        xtype: 'tbseparator'
                                                                },
                                                                new Ext.form.DisplayField({
                                                                    cls: 'warning',
                                                                    id:'needRestartTxt',
                                                                    value: 'Restart needed to apply last settings saved',
                                                                    hidden: true
                                                                }),
                                                                {
                                                                        xtype: 'tbfill'
                                                                },
                                                                {
                                                                        xtype: 'displayfield',
                                                                        value: '',
                                                                        ctCls: 'infos'
                                                                }
                                                        ]
                                                }

                                        }
						
				],
				bbar: {
					xtype: 'toolbar',
					items: [
						{
							xtype: 'displayfield',
							value: 'SABnzb version:&nbsp',
							id: 'sabVersion'
						},
                                                {
                                                        xtype: 'tbseparator'
                                                },
                                                {
							xtype: 'displayfield',
							value: 'Started since:&nbsp',
							id: 'uptime'
						},
                                                {
                                                        xtype: 'tbseparator'
                                                },
                                                {
							xtype: 'displayfield',
							value: 'ExtJsTmpl Version:&nbsp',
							id: 'tmplVersion'
						},
						{
							xtype: 'tbfill'
						},
						{
							xtype: 'displayfield',
							value: 'Free:&nbsp;'
						},
						{
							xtype: 'displayfield',
							value: '',
							id: 'freespace'
						}
					]
				}
			},
			{
				xtype: 'panel',
				region: 'north',
				height: 100,
				border: false,
                                tbar: {
                                    xtype: 'toolbar',
                                    id:'extraBar',
                                    items: [
                                        {
                                                xtype: 'displayfield',
                                                value: 'While in dev modify SABnzb config',
                                                id: 'modifyConf'
                                        },
                                        {
                                                xtype: 'button',
                                                text: 'here',
                                                id: 'modifyConfbutton'
                                        },
                                        {
                                                xtype: 'displayfield',
                                                value: '(you need to have set the second web-interface)',
                                                id: 'needSecondWif'
                                        }
                                    ]
                                },
				html: '<a href="/"><img src="../static/images/top.png"></a>',
				bodyStyle: 'background-image:url("../static/images/top_bg.png")'
			}
		];
		mainUi.superclass.initComponent.call(this);
	}
});

addFileUi = Ext.extend(Ext.Window, {
	title: 'Add file',
	width: 400,
	autoHeight: true,
	closable: false,
	modal: true,
	id: 'addFileWin',
	initComponent: function() {
		this.items = [
			{
				xtype: 'form',
				labelWidth: 100,
				labelAlign: 'left',
				layout: 'form',
				fileUpload: true,
				border: false,
				frame: true,
				id: 'addFileForm',
				items: [
					{
						xtype: 'combo',
						fieldLabel: 'Category',
						anchor: '100%',
						store: 'CatList',
						displayField: 'cat',
						mode: 'local',
						triggerAction: 'all',
						id: 'fileaddcat',
						name: 'cat'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Session',
						anchor: '100%',
						name: 'session',
						inputType: 'hidden',
						id: 'session'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'pp',
						anchor: '100%',
						name: 'pp',
						inputType: 'hidden',
						id: 'pp',
						value: '-1'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'mode',
						anchor: '100%',
						name: 'mode',
						inputType: 'hidden',
						id: 'mode',
						value: 'addfile'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'priority',
						anchor: '100%',
						name: 'priority',
						inputType: 'hidden',
						id: 'priority',
						value: '-100'
					},
					{
						xtype: 'fileuploadfield',
						fieldLabel: 'File',
						emptyText: 'Select a file',
						anchor: '95%',
						name: 'nzbfile',
						id: 'nzbfile'
					}
				],
				buttons: [{
					text: 'Add',
					handler: function(){
						if(Ext.getCmp('addFileForm').getForm().isValid()){
							Ext.getCmp('addFileForm').getForm().submit({
								url: 'tapi'
							});
							Ext.getCmp('addFileWin').hide();
						}
					}
				},{
					text: 'Cancel',
					handler: function(){
						Ext.getCmp('addFileWin').hide();
					}
				}]
			}
		];
		addFileUi.superclass.initComponent.call(this);
	}
});

addUrlUi = Ext.extend(Ext.Window, {
	title: 'Add URL',
	width: 400,
	autoHeight: true,
	closable: false,
	modal: true,
	id: 'addUrlWin',
	initComponent: function() {
		this.items = [
			{
				xtype: 'form',
				labelWidth: 100,
				labelAlign: 'left',
				layout: 'form',
				border: false,
				frame: true,
				id: 'addUrlForm',
				items: [
					{
						xtype: 'textfield',
						fieldLabel: 'Label',
						anchor: '100%',
						inputType: 'hidden',
						name: 'mode',
						value: 'addurl'
					},
                                        {
						xtype: 'textfield',
						fieldLabel: 'Label',
						anchor: '100%',
						inputType: 'hidden',
						name: 'session',
						id: 'urlsession'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'URL',
						name: 'id',
						anchor: '100%'
					}
				],
				buttons: [{
					text: 'Add',
					handler: function(){
						if(Ext.getCmp('addUrlForm').getForm().isValid()){
							Ext.getCmp('addUrlForm').getForm().submit({
								url: 'addID',
								method: 'GET'
							});
							Ext.getCmp('addUrlWin').hide();
						}
					}
				},{
					text: 'Cancel',
					handler: function(){
						Ext.getCmp('addUrlWin').hide();
					}
				}]
			}
		];
		addUrlUi.superclass.initComponent.call(this);
	}
});
