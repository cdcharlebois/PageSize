define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
	"dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
	"dojo/query",
	"dojo/on",
	"dojo/text!PageSize/template/PageSize.html",


], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, dojoQuery, on, widgetTemplate) {
    "use strict";

    return declare("PageSize.widget.PageSize", [ _WidgetBase, _TemplatedMixin ], {
		templateString: widgetTemplate,

        // Internal variables.
        _handles: null,
        _contextObj: null,
		_grid: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
			this._buildOptions();
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

			this._setupGrid();
			if (this._grid) {
				on(this.selectNode, "change", dojoLang.hitch(this, this._optionSelected));
				//set default
				this._setDefault();
			}

            this._updateRendering(callback);
        },

        resize: function (box) {
          logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
        },

		_setupGrid: function () {
			var nodeList = dojoQuery(".mx-name-" + this.targetGridName)
			var gridNode = nodeList ? nodeList[nodeList.length-1]: null;
			if (gridNode) {
				this._grid = dijit.registry.byNode(gridNode);
				if (!this._grid) {
					console.log("Found a DOM node but could not find the grid widget.");
				}
			} else {
				console.log("Could not find the list node.");
			}
		},

		_buildOptions: function () {
			var curItem, tempOpt;
			for (var i=0; i<this.pageSizeOptions.length; i++) {
				curItem = this.pageSizeOptions[i];
				tempOpt = document.createElement("option")
				tempOpt.value = curItem.pageSize;
				tempOpt.innerText = curItem.pageSizeLabel;
				this.selectNode.add(tempOpt);
			}
		},
		_setDefault: function () {
			var grid = this._grid,
				datasource = grid._datasource

			if (!datasource) {
				datasource = grid._dataSource;
			}

			this.selectNode.value = datasource._pageSize;
		},
		_optionSelected: function () {
			var grid = this._grid,
				datasource = grid._datasource

			if (!datasource) {
				datasource = grid._dataSource;
			}
			var newSize = parseInt(this.selectNode.value);
			datasource._pageSize = newSize
			grid.params.config.gridpresentation.rows = newSize;
			if (grid.reload) {
				grid.reload();
			} else {
				grid.refresh();
			}
		},
        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            mendix.lang.nullExec(callback);
        }
    });
});

require(["PageSize/widget/PageSize"]);
