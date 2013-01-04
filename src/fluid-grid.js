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
			keepAspectRetion: true
		},
		
		columns: {},
		
		items: [],
				
		addItem: function(element) {
			
			var item = new Item({
				el: $(element)
			});
			
			this.items.push(item);
			
			return this;
		},
		
		getColumnsCount: function() {
			return Math.ceil(this.$el.width() / this.options.columnMaxWidth);
		},
		
		getColumnWidth: function() {
			return this.$el.width() / this.getColumnsCount();
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
		
		createColumns: function() {
			
			this.columns = {};
			
			for(var i = 1; i <= this.getColumnsCount(); i++) {
				
				this.columns[i] = {
					sort: i,
					height: 0
				};
			};
		},
		
		getPosition: function(column) {
			
			return {
				top: column.height,
				left: (column.sort - 1) * this.getColumnWidth()
			};
		},
		
		render: function() {
			
			var self = this;
			
			this.$el
				.css('position', 'relative');
			
			this.createColumns();
			
			$.each(this.items, function(i, item) {
				
				var column = self.findSmallestColumn();
				var position = self.getPosition(column);
				
				item
					.render()
					.resize({
						width: self.getColumnWidth() 
					}, self.options.keepAspectRetion)
					.position(position);
				
				column.height += item.$el.height();
			});
			
			return this;
		}		
		
	});
	
	return Grid;
});