/**
 * @File: public/js/app.js
 * @author:  Junior Napier
**/

Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Employee', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, 'name', 'phone', 'title', 'address', 
    {name: 'status', type: 'bool'},
    {name: 'updated_at', type: 'date'}
    ]
});

Ext.onReady(function() {

    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'Employee',
        proxy: {
            type: 'rest',
            url: 'employee',
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            writer: {
                type: 'json'
            }
        }
    });

    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        listeners: {
            cancelEdit: function(rowEditing, context) {
                // Canceling editing of a locally added, unsaved record: remove it
                if (context.record.phantom) {
                    store.remove(context.record);
                }
            }
        }
    });

    var grid = Ext.create('Ext.grid.Panel', {
        plugins: [rowEditing],
        frame: true,
        title: 'Employees',
        store: store,
        iconCls: 'icon-user',
        columns: [{
            text: 'ID',
            width: 50,
            sortable: true,
            dataIndex: '_id',
            renderer: function(v, meta, rec) {
                return rec.phantom ? '' : v;
            }
        }, {
            text: 'Name',
            flex: 1,
            sortable: true,
            dataIndex: 'name',
            field: {
                xtype: 'textfield'
            }
        }, {
            header: 'Phone',
            width: 120,
            sortable: true,
            dataIndex: 'phone',
            field: {
                xtype: 'textfield'
            }
        }, {
            text: 'Title',
            width: 120,
            sortable: true,
            dataIndex: 'title',
            field: {
                xtype: 'textfield'
            }
        }, {
            text: 'Address',
            width: 120,
            sortable: true,
            dataIndex: 'address',
            field: {
                xtype: 'textfield'
            }
        }, {
            text: 'Last Updated',
            width: 120,
            sortable: true,
            dataIndex: 'updated_at'
        }],
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                text: 'Add',
                iconCls: 'icon-add',
                tooltip: 'Click to add a new Employee to table.',
                handler: function() {
                    // empty record
                    var employee = new Employee();
                    employee.set('_id', null);
                    store.insert(0, employee);
                    rowEditing.startEdit(0, 0);
                }
            }, '-', {
                itemId: 'delete',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: true,
                tooltip: 'Click to DELETE Employee from table.',
                handler: function() {
                    var selection = grid.getView().getSelectionModel().getSelection()[0];
                    if (selection) {
                        store.remove(selection);
                    }
                }
            }, '-','->',{
                xtype: 'textfield',
                fieldLabel: 'Preshared Secret',
                name: 'sessionSecret',
                listeners: {
                    change: function(cmp, v) {

                        var s = grid.getStore(),
                            p = s.getProxy(),
                            ep = p.getExtraParams() || {};

                        ep.sessionSecret = v;

                        p.setExtraParams( ep );

                        console.log("Changing pre shared secret (%o)", ep);
                        // reload
                        s.reload();
                    }
                }
            }]
        }],
        tools:[{
        	type: 'refresh',
            tooltip: 'Click to refresh Employee table.',
        	handler: function(){
        		var me = this,
        		    grid = me.up('grid');
        		if (grid) {
                    // grid.getStore().removeAll(false);
        			grid.getStore().reload();
        		}
        	}
        }]
    });
    grid.getSelectionModel().on('selectionchange', function(selModel, selections) {
        grid.down('#delete').setDisabled(selections.length === 0);
    });

    var w = Ext.create('Ext.window.Window', {
    	layout: 'fit',

        width: 900,
        height: 330,

        items: [grid]
    });

   Ext.create('Ext.container.Viewport', {
        renderTo: document.body,
        layout: 'auto',
        item: [w]
   });

   w.show();
});