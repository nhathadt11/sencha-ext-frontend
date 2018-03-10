// Configs
Ext.define('Configs', {
  singleton: true,
  baseUrl: 'http://localhost:8080/sencha-crud-backend/'
});

// Define Data Store

Ext.define('Books', {
  extend: 'Ext.data.Store',
  alias: 'store.books',

  proxy: {
    type: 'ajax',
    url: Configs.baseUrl + 'Books'
  }
});

Ext.define('BookListViewController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.listview',

  onPopupForm: function (view, index, item, record) {
    Ext.Viewport.add({
      xtype: 'popupform',
      width: 400,
      record: record,
      viewModel: {
        data: {
          book: record
        }
      }
    });
  }
});

// Popup
Ext.define('PopupForm', {
  extend: 'Ext.form.Panel',
  xtype: 'popupform',
  controller: 'popupform',

  title: 'Update Record',

  width: 300,
  floating: true,
  centered: true,
  modal: true,

  items: [{
    xtype: 'numberfield',
    name: 'id',
    label: 'Id',
    bind: '{book.id}'
  }, {
    xtype: 'textfield',
    name: 'title',
    label: 'Title',
    bind: '{book.title}'
  }, {
    xtype: 'textfield',
    name: 'author',
    label: 'Author',
    bind: '{book.author}'

  }, {
    xtype: 'textfield',
    name: 'publisher',
    label: 'Publisher',
    bind: '{book.publisher}'

  }, {
    xtype: 'textfield',
    name: 'description',
    label: 'Description',
    bind: '{book.description}'

  }, {
    xtype: 'checkboxfield',
    name: 'available',
    label: 'Available',
    bind: '{book.available}'

  }, {
    xtype: 'numberfield',
    name: 'quantity',
    label: 'Quantity',
    bind: '{book.quantity}'

  }, {
    xtype: 'selectfield',
    name: 'genre',
    label: 'Genre',
    bind: '{book.genre}',
    options: [{
      text: "Drama",
      value: 'Drama'
    }, {
      text: "Action",
      value: 'Action'
    }, {
      text: "Cartoon",
      value: 'Cartoon'
    }],
    defaultTabletPickerConfig: {
      height: 200
    }
  }, {
    xtype: 'toolbar',
    docked: 'bottom',
    items: ['->', {
      xtype: 'button',
      text: 'Submit',
      iconCls: 'x-fa fa-check',
      handler: 'submitUpdate'
    }, {
        xtype: 'button',
        text: 'Cancel',
        iconCls: 'x-fa fa-close',
        handler: 'cancelUpdate'
      }]
  }]
});

Ext.define('PopupFormController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.popupform',

  cancelUpdate: function () {
    var view = this.getView(),
      record = view.getRecord();

    view.destroy();
    record.reject();
  },

  submitUpdate: function (me) {
    var view = this.getView(),
        record = view.getRecord();

        success = function(msg) {
          view.destroy();
          record.commit();
          Ext.Msg.alert('Status', 'Updated successfully!');
        }

        failure = function() {
          Ext.Msg.alert('Status', 'Could not update!');
        }

    this.handleSubmit(record.data, success, failure);
  },

  handleSubmit: function(params, success, failure) {
    Ext.Ajax.request({
      url: Configs.baseUrl + 'Books',
      method: 'PUT',
      params: params,

      success: function(response, opts) {
        if (typeof success === 'function') success();
      },
 
      failure: function(response, opts) {
        if (typeof failure === 'function') failure();
      }
  });
  }
});


/*
 * This call registers your application to be launched when the browser is ready.
 */
Ext.application({
  name: 'ExtApp',

  launch: function () {
    this.getConfigs = function () {
      return Object.assign({}, this.configs);
    }

    Ext.Viewport.add({
      xtype: 'tabpanel',
      controller: 'listview',

      items: [{
        title: 'Book Directory',
        xtype: 'grid',
        iconCls: 'x-fa fa-users',
        grouped: true,
        listeners: {
          itemtap: 'onPopupForm'
        },
        store: {
          type: 'books',
          autoLoad: true,
          sorters: ['id', 'title', 'author', 'publisher', 'description', 'avalable', 'quantity', 'genre'],
        },
        columns: [{
          text: 'ID',
          dataIndex: 'id',
          flex: 1
        }, {
          text: 'Title',
          dataIndex: 'title',
          flex: 1
        }, {
          text: 'Publisher',
          dataIndex: 'publisher',
          flex: 1
        }, {
          text: 'Description',
          dataIndex: 'description',
          flex: 1
        }, {
          text: 'Available',
          dataIndex: 'available',
          flex: 1
        }, {
          text: 'Quantity',
          dataIndex: 'quantity',
          flex: 1
        }, {
          text: 'Genre',
          dataIndex: 'genre',
          flex: 1
        }]
      }, {
        title: 'About Sencha',
        padding: 20,
        iconCls: 'x-fa fa-info-circle',
        html: '<h1>About Sencha</h1><br/>More than 10,000 customers and 60% of the Fortune 100 rely on Sencha solutions to deliver innovative applications that drive their businesses. With a longstanding commitment to web technologies, Sencha dramatically reduces the cost and complexity of developing and delivering enterprise applications across multiple device types.<br/><br/><h2>Create feature-rich HTML5 applications using JavaScript</h2><br/>Sencha Ext JS is the most comprehensive MVC/MVVM JavaScript framework for building feature-rich, cross-platform web applications targeting desktops, tablets, and smartphones. Ext JS leverages HTML5 features on modern browsers while maintaining compatibility and functionality for legacy browsers.<br/><br/>Ext JS features hundreds of high-performance UI widgets that are meticulously designed to fit the needs of the simplest as well as the most complex web applications. Ext JS templates and layout manager give you full control over your display irrespective of devices and screen sizes. An advanced charting package allows you to visualize large quantities of data. The framework includes a robust data package that can consume data from any backend data source. Ext JS also offers several out-of-the-box themes, and complete theming support that lets you build applications that reflect your brand. It also includes an accessibility package (ARIA) to help with Section 508 compliance.'
      }]
    });
  }
});
