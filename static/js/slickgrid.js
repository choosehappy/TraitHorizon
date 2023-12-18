$(document).ready(function () {
	console.log("[LOG] Document ready.")
	// console.log($("#brushing").attr("fn"))

	//call the /tsv endpoint to get a tsv file
	$.ajax({
		url: "/tsv",
		type: "GET",
		success: function (data) {			
			renderLines(d3.tsvParse(data));
		}
	});
	
});


function renderLines(lines) {
	var parcoords = ParCoords()("#example")
		.alpha(0.4)
		.mode("queue") // progressive rendering
		// .height(d3.max([document.body.clientHeight / 2, 220]))
		.margin({
			top: 36,
			left: 0,
			right: 0,
			bottom: 16
		});

	const data = lines;
	// slickgrid needs each data element to have an id
	data.forEach(function (d, i) { 
		d.id = d.id || i; 
		const url = window.location.origin + "/image/" + d.filename;
		d.img = `<a href=${url}><img src=${url} style='height:100%'></a>`
	});

	parcoords
		.data(data)
		.hideAxis(["filename", "gid", "img"])
		.render()
		.reorderable()
		.brushMode("1D-axes");
	
	// setting up grid
	var column_keys = d3.keys(data[0]);

	function formatter(row, cell, value, columnDef, dataContext) {
        return value;
    }

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
		enableCellNavigation: true,
		enableColumnReorder: false,
		multiColumnSort: false,
		forceFitColumns: true,
		rowHeight: 100
	};

	var dataView = new Slick.Data.DataView();
	var grid = new Slick.Grid("#grid", dataView, columns, options);
	var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));

	// wire up model events to drive the grid
	dataView.onRowCountChanged.subscribe(function (e, args) {
		grid.updateRowCount();
		grid.render();
	});

	dataView.onRowsChanged.subscribe(function (e, args) {
		grid.invalidateRows(args.rows);
		grid.render();
	});

	// column sorting
	var sortcol = column_keys[0];
	var sortdir = 1;

	function comparer(a, b) {
		var x = a[sortcol], y = b[sortcol];
		return (x == y ? 0 : (x > y ? 1 : -1));
	}

	// click header to sort grid column
	grid.onSort.subscribe(function (e, args) {
		sortdir = args.sortAsc ? 1 : -1;
		sortcol = args.sortCol.field;

		if ($.browser.msie && $.browser.version <= 8) {
			dataView.fastSort(sortcol, args.sortAsc);
		} else {
			dataView.sort(comparer, args.sortAsc);
		}
	});

	// highlight row in chart
	grid.onMouseEnter.subscribe(function (e, args) {
		// Get row number from grid
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

	// fill grid with data
	gridUpdate(data);

	// update grid on brush
	parcoords.on("brush", function (d) {
		gridUpdate(d);
		
		// TODO image gallary update

	});
	

	function gridUpdate(data) {
		dataView.beginUpdate();
		dataView.setItems(data);
		dataView.endUpdate();
	};

}