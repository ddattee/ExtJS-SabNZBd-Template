var DownloadsList = new Ext.data.Store({
	storeId: 'DownloadsList'
});

var HistoryList = new Ext.data.Store({
	storeId: 'HistoryList'
});

var ConnectionsList = new Ext.data.Store({
	storeId: 'ConnectionsList'
});

var FilesList = new Ext.data.Store({
	storeId: 'FilesList'
});

var CatList = new Ext.data.Store({
	storeId: 'CatList'
});

var WarningsDatas = new Ext.data.Store({
	storeId: 'WarningsDatas'
});

var HystoryDetailsList = new Ext.data.Store({
	storeId: 'HystoryDetailsList'
});

var ServersList = new Ext.data.Store({
	storeId: 'ServersList'
});

var PlansList = new Ext.data.Store({
	storeId: 'PlansList'
});

var LogsList = new Ext.data.Store({
	storeId: 'LogsList'
});

var CategoriesList = new Ext.data.Store({
	storeId: 'CategoriesList'
});

var FeedsList = new Ext.data.Store({
	storeId: 'FeedsList'
});

var FiltersList = new Ext.data.ArrayStore({
	storeId: 'FiltersList',
        fields:[
            'cat',
            'pp',
            'script',
            'type',
            'text'
        ]
});

/*********** Combos Store ***********/

var modeStore = new Ext.data.ArrayStore({
        id:'catM',
        fields: ['value','text'],
        data:[
            ["x",'Default'],
            [0,'Download'],
            [1,'+ Repair'],
            [2,'+ Unpack'],
            [3,'+ Delete']
        ]
});
var priorityStore = new Ext.data.ArrayStore({
        id:'catM',
        fields: ['value','text'],
        data:[
            [-100,'Default'],
            [-1,'Low'],
            [0,'Normal'],
            [1,'High'],
            [2,'Force']
        ]
});
