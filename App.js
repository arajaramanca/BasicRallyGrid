Ext.define('CustomApp', {
	extend: 'Rally.app.App',
	componentCls: 'app',

	storyStore: undefined, 
    storyGrid: undefined,
 launch: function() {

 	  console.log('Just the beginning!!');

      this.pulldownContainer = Ext.create('Ext.container.Container', {    
        id: 'pulldown-container-id',
        layout: {
                type: 'hbox',
                align: 'stretch'
            }
      });

      this.add(this.pulldownContainer);

      this._loadIterations();
    },

	_loadIterations: function(){
			console.log('Now loading the Iterations');
			this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
			     fieldLabel: 'Iteration',
			     lableAlign: 'right',
			     width: 300,
			     defaultToCurrentTimebox : true,
			     listeners: {
			     	ready: function(combobox){
			     		this._loadScheduleState();
			     	},
			     // 	scope : this
			     // },
			     select: function(combobox,records) {
			     	this._loadData();
			     },
			     scope : this
			 }
			});
			this.pulldownContainer.add(this.iterComboBox);
	},

	_loadScheduleState:function(){
		console.log('Now loading ScheduleState');
		this.scheduleStateComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
				model: 'User Story',
				field: 'ScheduleState',
				fieldLabel: 'Schedule State',
				lableAlign: 'right',
			    allQuery: '', 
			    allowNoEntry : true,
				listeners: {
	            ready: function(combobox) {             
	                 this._loadData();
	           	},
	            select: function(combobox, records) {
	                 this._loadData();
	           	},
	           	scope: this
	         	}
		});
		this.pulldownContainer.add(this.scheduleStateComboBox);
	},

	_loadData: function(){
		var selectedIterRef = this.iterComboBox.getRecord().get('_ref');
		var selectedScheduleStateValue = this.scheduleStateComboBox.getRecord().get('value');   

		var myFilters = [                  
            {
              property: 'Iteration',
              operation: '=',
              value: selectedIterRef
            },
            {
              property: 'ScheduleState',
              operation: '=',
              value: selectedScheduleStateValue
            }
          ];

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
