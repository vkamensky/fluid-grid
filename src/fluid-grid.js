define([
	
    'item',
	'mixins/options',
    'mixins/element'
	
], function(Item, OptionsMixin, ElementMixin) {
	
	var Grid = function(options) {
		
		var self = this;
		
		this
			.setOptions(options)
			.setElement(this.options.el)
			.parseOptions(this.$el, 'fluidGrid');
		
		this.$el
			.find(this.options.itemSelector)
			.each(function(i, element) {
				self.addItem(element);
			});
		
		$(window).resize(function() {
			self.render();
		});
	};
	
	$.extend(Grid.prototype, OptionsMixin, ElementMixin, {
		
		options: {
			itemSelector: '> .item',
			columnMaxWidth: 300,
			columnMinWidth: 200,
			keepAspectRetio: true
		},
		
		columns: {},
		
		items: [],
			
		addItem: function(element) {
			
			var item = new Item({
				el: $(element)
			});
			
			this.items.push(item);
			
			this.$el.append(item.el);
			
			this.$el.trigger('item-added.fluid-grid', [item]);
			
			return this;
		},
				
		getColumnsCount: function() {
			return Math.ceil(this.width / this.options.columnMaxWidth);
		},
		
		getColumnWidth: function() {
			return this.width / this.getColumnsCount();
		},
		
		findSmallestColumn: function() {
			
			var smallest = null;
			
			$.each(this.columns, function(i, column) {
				
				if(!smallest || smallest.height > column.height) {
					smallest = column;
				}
			
			});
			
			return smallest;
		},
		
		findHighestColumn: function() {
			var highest = null;
			
			$.each(this.columns, function(i, column) {
				
				if(!highest || highest.height < column.height) {
					highest = column;
				}
			
			});
			
			return highest;
		},
		
		createColumns: function() {
			
			this.columns = {};
			
			for(var i = 1; i <= this.getColumnsCount(); i++) {
				
				this.columns[i] = {
					sort: i,
					height: 0
				};
			};
		},
		
		render: function() {
			
			var self = this;
			
			this.width = this.$el.width();
			
			this.$el.css({
				'position': 'relative',
				'visibility': 'visible'
			});
			
			this.createColumns();
			
			$.each(this.items, function(i, item) {
				
				var column = self.findSmallestColumn();
				
				item
					.render()
					.resize({
						width: self.getColumnWidth() 
					}, self.options.keepAspectRetio);
				
				item
					.position({
						top: column.height,
						left: (column.sort - 1) * self.getColumnWidth()
					});

				column.height += item.$el.outerHeight(true);
			});
			
			var highestColumn = this.findHighestColumn();
			
			if(highestColumn) {
				this.$el
					.height(highestColumn.height);
			}

			return this;
		}		
		
	});
	
	return Grid;
});
