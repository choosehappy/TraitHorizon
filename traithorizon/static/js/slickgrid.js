const DATA_VIEW = new Slick.Data.DataView();
var ORIGINAL_DATASET = [];
let SEARCH_STRING = "";
var PARCOORDS;
var HIDE_AXES = [];
var FILTER_BY = "";


$(document).ready(function () {
	console.log("[LOG] Document ready.")
	// console.log($("#brushing").attr("fn"))

	//call the /tsv endpoint to get a tsv file

	$.ajax({
		url: "./hide_axes",
		type: "GET",
		success: function (data) {
			HIDE_AXES = JSON.parse(data);
			$.ajax({
				url: "./tsv",
				type: "GET",
				success: function (data) {
					ORIGINAL_DATASET = d3.tsvParse(data)
					renderLines();
				}
			});
		}
	})



});


function renderLines() {
	ORIGINAL_DATASET.forEach(function (d, i) {
		d.id = d.id || i;
		const url = "./image/" + d.filename;
		d.img = `<a href=${url}><img src=${url} style='height:100%'></a>`
	});

	initParcoords(ORIGINAL_DATASET);

	const column_keys = d3.keys(ORIGINAL_DATASET[0]);

	const { grid, pager } = initSlickGrid(PARCOORDS, column_keys, ORIGINAL_DATASET);

	/////////////////////// TOOLTIP ///////////////////////
	const parcoordsDimKeys = Object.keys(PARCOORDS.dimensions())
	const toolTipDiv = d3.select("#parcoords-parent").append("div").attr("id", "tooltip").attr("class", "tooltip");
	toolTipDiv.append("div").attr("class", "tooltip-contents");

	d3.select("#example").selectAll(".dimension")
		.attr("id", function (d, i) {
			return parcoordsDimKeys[i]; // This will set IDs like "dimension-0", "dimension-1", etc.
		})
		.call(tooltip.bind(this), toolTipDiv) // will call the tooltip function
		.on("mouseout", () => console.log("mouseout"))

	initDataView(grid);
	updateFilter();

	// fill grid with data
	gridUpdate(ORIGINAL_DATASET);


	// update grid on brush


}

function initDataView(slickgrid) {
	function myFilter(item, args) {
		if (args.searchString != "" && item[FILTER_BY].toString().indexOf(args.searchString) == -1) {
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
	const max_key_length = d3.max(d3.keys(data[0]).map(function (d) { return d.length; }));
	const num_columns = d3.keys(data[0]).length;

	PARCOORDS = ParCoords()("#example")
		.alpha(0.2)
		.color("#426fbd")
		.alphaOnBrushed(0.5)
		.brushedColor("#a13f57")
		.rate(parseInt(1000 / num_columns))
		.mode("queue") // progressive rendering
		// .height(d3.max([document.body.clientHeight / 2, 220]))
		.width(50 * num_columns)
		.margin({
			top: max_key_length * 3,
			left: 15,
			right: 15,
			bottom: 16
		});

	$("#example").css("width", 50 * num_columns + 30 + "px");

	PARCOORDS
		.data(data)
		.hideAxis(HIDE_AXES)
		.render()
		.reorderable()
		.brushMode("1D-axes");

	PARCOORDS.on("brush", function (d) {
		gridUpdate(d);
	});

	rotateLabels(PARCOORDS);
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

		if (key == "url") {
			return {
				id: key,
				name: key,
				field: key,
				sortable: false,
				formatter: urlFormatter
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
	const filterSelect = d3.select("#filter-select");
	FILTER_BY = column_keys[0];
	for (let key of column_keys) {
		filterSelect.append("option").attr("value", key).text(key);
	}

	filterSelect.on("change", function () {
		FILTER_BY = this.value;
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

	function urlFormatter(row, cell, value, columnDef, dataContext) {
		return "<a href='" + value + "' target='_blank'>" + value + "</a>";
	}

	function toggleFilterRow() {
		grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
	}

	return { grid, pager };
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

function rotateLabels(parcoords) {
	parcoords.svg
		.selectAll('text.label')
		.attr(
			'transform',
			'translate(0,-10) rotate(-15)'
		)
		.attr("text-anchor", "start");
}

function tooltip(selectionGroup, tooltipDiv) {
	const mousePosOffset = 30;
	const margin = ({ top: 10, right: 10, bottom: 10, left: 10 })
	const tooltip_height = 500
	const tooltip_width = 400

	selectionGroup.each(function () {
		d3.select(this)
			.on("mouseover.tooltip", () => handleMouseover(this.id))
			.on("mousemove.tooltip", handleMousemove)
			.on("mouseleave.tooltip", handleMouseleave);
	});

	function handleMouseover(id) {
		// show/reveal the tooltip, set its contents,
		// style the element being hovered on
		var color;
		if (Object.keys(PARCOORDS.brushExtents()).length > 0) {
			color = "#a13f57";
		} else {
			color = "#426fbd";
		}
		showTooltip();
		renderViolinPlotHist(tooltipDiv, DATA_VIEW.items, id, [`${id}_distribution`], tooltip_width, tooltip_height - 50, color);
		renderAxisMetrics(tooltipDiv, DATA_VIEW.items, id);
	}

	function handleMousemove(event) {
		// update the tooltip's position
		const [mouseX, mouseY] = d3.mouse(this.parentNode.parentNode.parentNode.parentNode) // d3.pointer(event, this); // for d3 v6
		// add the left & top margin values to account for the SVG g element transform
		setPosition(mouseX + margin.left, mouseY + margin.top);
	}

	function handleMouseleave() {
		hideTooltip();
	}

	function showTooltip() {
		tooltipDiv.style("display", "block");
	}

	function hideTooltip() {
		tooltipDiv.style("display", "none");
	}

	function setPosition(mouseX, mouseY) {
		const thresh = 2 * window.innerWidth / 3;
		// const xOffset = mouseX > thresh ? -1 * mousePosOffset - tooltip_width : mousePosOffset;

		tooltipDiv
			.style("top", `${mouseY + mousePosOffset}px`)
			.style("left", `${mouseX + mousePosOffset}px`)
			.style("height", `${tooltip_height}px`)
			.style("width", `${tooltip_width}px`);
	}

	function renderViolinPlotHist(selectedContainer, data, yDomainLabel, xDomainLabels, width, height, color = "#a13f57") {

		/** Render the violin plot using the histogram method.
		 * https://d3-graph-gallery.com/graph/violin_basicHist.html
		 * @param {d3.Selection} selectedContainer - The container to render the plot in.
		 * @param {Array} data - A 1d array of points to plot.
		 * @param {Array} yDomainLabel - The domain of the y axis (quantitative)
		 * @param {Array} xDomainLabels - The domain of the x axis (qualitative). Each value corresponds to a violin.
		 * @param {Number} width - The width of the plot.
		 * @param {Number} height - The height of the plot.
		 * @returns {undefined}
		 */

		selectedContainer.html('')
		// append the svg object to the body of the page

		var margin = { top: 10, right: 30, bottom: 30, left: 60 },
			width = width - margin.left - margin.right,
			height = height - margin.top - margin.bottom;

		var svg = selectedContainer
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");


		// Build and Show the Y scale
		var y = d3.scaleLinear()
			.domain(d3.extent(data, d => d[yDomainLabel])).nice()
			.range([height, 0])
		svg.append("g").call(d3.axisLeft(y))

		// Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
		var x = d3.scaleBand()
			.range([0, width])
			.domain(xDomainLabels)
			.padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x))

		// Features of the histogram
		var histogram = d3.histogram()
			.domain(y.domain())
			.thresholds(y.ticks(100))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
			.value(d => d)

		// Compute the binning for each group of the dataset
		var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
			.key(function (d) { return xDomainLabels[0]; })
			.rollup(function (d) {   // For each key..
				input = d.map(g => g[yDomainLabel])    // Keep the variable called Sepal_Length
				bins = histogram(input)   // And compute the binning on it.
				return (bins)
			})
			.entries(data)

		// What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
		var maxNum = 0
		for (i in sumstat) {
			allBins = sumstat[i].value
			lengths = allBins.map(function (a) { return a.length; })
			longuest = d3.max(lengths)
			if (longuest > maxNum) { maxNum = longuest }
		}

		// The maximum width of a violin must be x.bandwidth = the width dedicated to a group
		var xNum = d3.scaleLinear()
			.range([0, x.bandwidth()])
			.domain([-maxNum, maxNum])

		// Add the shape to this svg!
		svg
			.selectAll("myViolin")
			.data(sumstat)
			.enter()        // So now we are working group per group
			.append("g")
			.attr("transform", function (d) { return ("translate(" + x(d.key) + " ,0)") }) // Translation on the right to be at the group position
			.append("path")
			.datum(function (d) { return (d.value) })     // So now we are working bin per bin
			.style("stroke", "black")
			.style("fill", color)
			.attr("d", d3.area()
				.x0(function (d) { return (xNum(-d.length)) })
				.x1(function (d) { return (xNum(d.length)) })
				.y(function (d) { return (y(d.x0)) })
				.curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
			)
	}

	function renderViolinPlotKDE(selectedContainer, data, yDomainLabel, xDomainLabels, width, height) {

		/** Render the violin plot using the KDE method.
		 * https://observablehq.com/@ssiegmund/violin-plot-playground
		 * @param {d3.Selection} selectedContainer - The container to render the plot in.
		 * @param {Array} data - A 1d array of points to plot.
		 * @param {Array} yDomainLabel - The domain of the y axis (quantitative)
		 * @param {Array} xDomainLabels - The domain of the x axis (qualitative). Each value corresponds to a violin.
		 * @param {Number} width - The width of the plot.
		 * @param {Number} height - The height of the plot.
		 * @returns {undefined}
		 */

		const margin = ({ left: 40, bottom: 40, right: 20, top: 20 })

		selectedContainer.html('')
		const svg = selectedContainer.append('svg')
			.attr('height', height)
			.attr('width', width)
			.style('font-family', 'sans-serif')
			.style('font-size', 12)

		const x = d3.scaleBand()
			.domain(xDomainLabels)
			.range([margin.left, width - margin.right])
			.padding(0.05)

		const y = d3.scaleLinear()
			.domain(d3.extent(data, d => d[yDomainLabel])).nice()
			.range([height - margin.bottom, margin.top])

		const xAxis = g => g
			.attr('transform', `translate(0, ${height - margin.bottom})`)
			.call(d3.axisBottom(x).tickSizeOuter(0))

		const yAxis = g => g
			.attr('transform', `translate(${margin.left}, 0)`)
			.call(d3.axisLeft(y))
			.call(g => g.select('.domain').remove())

		function kde(kernel, thds) {
			return V => thds.map(t => [t, d3.mean(V, d => kernel(t - d))])
		}

		function epanechnikov(bandwidth) {
			return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
		}

		const bandwidth = 0.3;
		const thds = y.ticks(200)
		const density = kde(epanechnikov(bandwidth), thds)

		const violins = d3.nest()  // nest function allows to group the calculation per level of a factor
			.key(d => xDomainLabels[0])
			.rollup(function (d) {   // For each key..
				input = d.map(g => g[yDomainLabel])    // Keep the variable called Sepal_Length
				return density(input)   // And compute the binning on it.
			})
			.entries(data)

		// allNum is populated with all the valu
		var allNum = [];
		// [...violins.values()].forEach((d, i) => {
		// 	allNum = allNum.concat([...violins.values()][i].values.map(d => d[1]))
		// })

		violins.forEach((d, i) => {
			d.value.forEach((d, i) => {
				allNum.push(d[1])
			})
		})

		const xNum = d3.scaleLinear()
			.domain([-d3.max(allNum), d3.max(allNum)])
			.range([0, x.bandwidth()])

		const area = d3.area()
			.x0(d => {
				return xNum(-d[1])
			})
			.x1(d => {
				return xNum(d[1])
			})
			.y(d => {
				return y(d[0])
			})
			.curve(d3.curveNatural)

		svg.append('g')
			.call(xAxis)

		svg.append('g')
			.call(yAxis)

		svg.append('g')
			.selectAll('g')
			.data([...violins])
			.join('g')
			.attr('transform', d => `translate(${x(d.key)}, 0)`)
			.append('path')
			.datum(d => {
				return d.value
			})
			.attr('d', area)
			.style('stroke', 'aliceblue')
			.style('fill', '#69b3a2')

	}

	function renderAxisMetrics(selectedContainer, data, yDomainLabel, height) {
		const rowHeight = 10;
		const numbers = data.map(d => d[yDomainLabel])

		const metrics = [
			{ label: 'Count', value: data.length },
			{ label: 'Mean', value: d3.mean(numbers).toFixed(3) },
			{ label: 'Std', value: d3.deviation(numbers).toFixed(3) },
			{ label: 'Min', value: d3.min(numbers) },
			{ label: 'Max', value: d3.max(numbers) },
		]

		var htmlContent = ""
		metrics.forEach((d, i) => {
			htmlContent += `<b>${d.label}:</b> ${d.value} `;
		})

		selectedContainer
			.append('p')
			.html(htmlContent)


	}

}