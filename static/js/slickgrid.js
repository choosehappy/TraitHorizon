const DATA_VIEW = new Slick.Data.DataView();
var ORIGINAL_DATASET = [];
let SEARCH_STRING = "";


$(document).ready(function () {
	console.log("[LOG] Document ready.")
	// console.log($("#brushing").attr("fn"))

	//call the /tsv endpoint to get a tsv file
	$.ajax({
		url: "/tsv",
		type: "GET",
		success: function (data) {
			ORIGINAL_DATASET = d3.tsvParse(data)
			renderLines();
		}
	});
	
});


function renderLines() {
	ORIGINAL_DATASET.forEach(function (d, i) { 
		d.id = d.id || i; 
		const url = window.location.origin + "/image/" + d.filename;
		d.img = `<a href=${url}><img src=${url} style='height:100%'></a>`
	});

	const parcoords = initParcoords(ORIGINAL_DATASET);

	const column_keys = d3.keys(ORIGINAL_DATASET[0]);
	
	const { grid, pager } = initSlickGrid(parcoords, column_keys, ORIGINAL_DATASET);


	initDataView(grid);
	updateFilter();

	// fill grid with data
	gridUpdate(ORIGINAL_DATASET);


	// update grid on brush


}

function initDataView(slickgrid) {
	function myFilter(item, args) {
		if (args.searchString != "" && item["patientID"].indexOf(args.searchString) == -1) {
		  	return false;
		}
		return true;
	}

	DATA_VIEW.onRowCountChanged.subscribe(function (e, args) {
		slickgrid.updateRowCount();
		slickgrid.render();

	});

	DATA_VIEW.onRowsChanged.subscribe(function (e, args) {
		slickgrid.invalidateRows(args.rows);
		slickgrid.render();
	});

	DATA_VIEW.setFilter(myFilter)
}

function initParcoords(data) {
	const num_columns = d3.keys(data[0]).length;

	var parcoords = ParCoords()("#example")
	.alpha(0.4)
	.rate(parseInt(1000 / num_columns))
	.mode("queue") // progressive rendering
	// .height(d3.max([document.body.clientHeight / 2, 220]))
	.width(50 * num_columns)
	.margin({
		top: 36,
		left: 0,
		right: 0,
		bottom: 16
	});

	parcoords
		.data(data)
		.hideAxis(["filename", "gid", "img", "patientID"])
		.render()
		.reorderable()
		.brushMode("1D-axes");
	
	parcoords.on("brush", function (d) {
		gridUpdate(d);
	});
	return parcoords;
}

function initSlickGrid(parcoords, column_keys, data) {
	// setting up grid

	var columns = column_keys.map(function (key, i) {
		if (key == "img") {
			return {
				id: key,
				name: key,
				field: key,
				sortable: false,
				// set width
				width: 300,
				formatter: formatter
			}
		}

		return {
			id: key,
			name: key,
			field: key,
			sortable: true
		}
	});

	// Move the img column to the first position
	var imgColumn = columns.find(function (column) {
		return column.field === "img";
	});
	columns.splice(columns.indexOf(imgColumn), 1);
	columns.unshift(imgColumn);

	var options = {
		columnPicker: {
			columnTitle: "Columns",
			hideForceFitButton: false,
			hideSyncResizeButton: false,
			forceFitTitle: "Force fit columns",
			syncResizeTitle: "Synchronous resize",
		},
		enableCellNavigation: true,
		enableColumnReorder: false,
		multiColumnSort: false,
		forceFitColumns: false,
		rowHeight: 100
	};

	var grid = new Slick.Grid("#grid", DATA_VIEW, columns, options);
	var pager = new Slick.Controls.Pager(DATA_VIEW, grid, $("#pager"));
	var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);

	// initialize the search panel
	let topPanel = grid.getTopPanel();
	const topPanelLeftElm = document.querySelector("#inlineFilterPanel");
	topPanel.appendChild(topPanelLeftElm);
	topPanelLeftElm.style.display = 'block';

	// wire up #filter-toggle to toggle the search panel
	$("#filter-toggle").on("click", toggleFilterRow);

	// add event listener to txtSearch
	$("#txtSearch").keyup(function (e) {
		gridUpdate(ORIGINAL_DATASET);
		// clear on Esc
		if (e.which == 27) {
			this.value = "";
			

		}
		SEARCH_STRING = this.value;
		updateFilter();
		updateParcoords(parcoords, DATA_VIEW.getFilteredItems());
	});

	// column sorting
	var sortcol = column_keys[0];
	var sortdir = 1;

	// click header to sort grid column
	grid.onSort.subscribe(function (e, args) {
		sortdir = args.sortAsc ? 1 : -1;
		sortcol = args.sortCol.field;

		if ($.browser.msie && $.browser.version <= 8) {
			DATA_VIEW.fastSort(sortcol, args.sortAsc);
		} else {
			DATA_VIEW.sort(comparer, args.sortAsc);
		}
	});

	// highlight row in chart
	grid.onMouseEnter.subscribe(function (e, args) {
		var grid_row = grid.getCellFromEvent(e).row;

		// Get the id of the item referenced in grid_row
		var item_id = grid.getDataItem(grid_row).id;
		var d = parcoords.brushed() || data;

		// Get the element position of the id in the data object
		elementPos = d.map(function (x) { return x.id; }).indexOf(item_id);

		// Highlight that element in the parallel coordinates graph
		parcoords.highlight([d[elementPos]]);
	});

	grid.onMouseLeave.subscribe(function (e, args) {
		parcoords.unhighlight();
	});


	// helper functions
	function comparer(a, b) {
		var x = a[sortcol], y = b[sortcol];
		return (x == y ? 0 : (x > y ? 1 : -1));
	}

	function formatter(row, cell, value, columnDef, dataContext) {
		return value;
	}

	function toggleFilterRow() {
		grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
	}

	return {grid, pager};
}

function gridUpdate(data) {
	DATA_VIEW.beginUpdate();
	DATA_VIEW.setItems(data);
	DATA_VIEW.endUpdate();
};

function updateFilter() {
	DATA_VIEW.setFilterArgs({
		searchString: SEARCH_STRING
	});
	DATA_VIEW.refresh();
}

function updateParcoords(parcoords, data) {
	parcoords.brushReset();
	parcoords.brushed(false)
	parcoords
		.data(data)
		.render();
}
