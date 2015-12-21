Ext.define('CustomApp', {
	extend: 'Rally.app.App',
	componentCls: 'app',

	items: [
	{
		xtype: 'container',
		itemId: 'pulldown-container',
		layout: {
                type: 'hbox',
                align: 'stretch'
        }
    }    
	],

	storyStore: undefined, 
    storyGrid: undefined,
 launch: function() {
 	  var me = this;
 	  console.log('Just the beginning!!');

      me._loadIterations();
    },

	_loadIterations: function(){
			console.log('Now loading the Iterations');

			var me = this;

			var iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
			     itemId: 'iteration-combobox',
			     fieldLabel: 'Iteration',
			     lableAlign: 'right',
			     width: 300,
			     defaultToCurrentTimebox : true,
			     listeners: {
			     	ready: me._loadScheduleState,
			    	select: me._loadData,
			    	scope: me
			     },
			});
			me.down('#pulldown-container').add(iterComboBox);
	},

	_loadScheduleState:function(){
		console.log('Now loading ScheduleState');
		var me = this;

		scheduleStateComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
				itemId: 'schedule-state-combobox',
				model: 'User Story',
				field: 'ScheduleState',
				fieldLabel: 'Schedule State',
				lableAlign: 'right',
			    allQuery: '', 
			    allowNoEntry : true,
				listeners: {
		            ready: me._loadData,
		           	select: me._loadData,
		           	scope: me
	         	}
		});
		me.down('#pulldown-container').add(scheduleStateComboBox);
	},


	_getFilters: function(iterationValue, scheduleStateValue) {

      var iterationFilter = Ext.create('Rally.data.wsapi.Filter', {
              property: 'Iteration',
              operation: '=',
              value: iterationValue
      });

      var scheduleStateFilter = Ext.create('Rally.data.wsapi.Filter', {
              property: 'ScheduleState',
              operation: '=',
              value: scheduleStateValue
      });

      return iterationFilter.and(scheduleStateFilter);

    },

	_loadData: function(){
		var selectedIterRef = this.down('#iteration-combobox').getRecord().get('_ref');
		var selectedScheduleStateValue = this.down('#schedule-state-combobox').getRecord().get('value');   

		var myFilters = this._getFilters(selectedIterRef,selectedScheduleStateValue);

		// var myFilters = [                  
  //           {
  //             property: 'Iteration',
  //             operation: '=',
  //             value: selectedIterRef
  //           },
  //           {
  //             property: 'ScheduleState',
  //             operation: '=',
  //             value: selectedScheduleStateValue
  //           }
  //         ];

      if (this.storyStore) {
      	console.log('Store exist',this.storyStore);
        this.storyStore.setFilter(myFilters);
        this.storyStore.load();

      } else {
		console.log('creating new store');
        this.storyStore = Ext.create('Rally.data.wsapi.Store', {     
          model: 'User Story',
          autoLoad: true,                         
          filters: myFilters,
          listeners: {
              load: function(myStore, myData, success) {
                  if (!this.storyGrid) {    
                  	console.log('creating new Grid');       
                    this._createGrid(myStore);      
                  }
              },
              scope: this                         
          },
          fetch: ['FormattedID', 'Name', 'Owner', 'ScheduleState']   
        });
      }
    },


	_createGrid: function(myStoryStore){
						this.storyGrid = Ext.create('Rally.ui.grid.Grid', {
							store: myStoryStore,
							columnCfgs: [
											'FormattedID', 'Name', 'Owner', 'ScheduleState'
										 ]
						});
						this.add(this.storyGrid);
	}

});
