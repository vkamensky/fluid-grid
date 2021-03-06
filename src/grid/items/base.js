define([
	
	
	'backbone',
	'grid/mixins/data-options'
	
], function(Backbone, DataOptionsMixin) {
	
	var Item = Backbone.View
		.extend(DataOptionsMixin)
		.extend({
			
		className: 'grid-item',
		
		options: {
			preserveAspectRatio: true,
			aspectRatio: null
		},
		
		initialize: function() {
			this.parseOptions();
		},
		
		resize: function(size) {

			this.trigger('resize:before');
			
			var width = size.width - this.getOffset();
			
			this.$el.width(Math.floor(width));
			
			if(this.options.preserveAspectRatio) {
			
				var height = width / this.getAspectRatio();
				
				if(size.height && height > size.height) {
					height = size.height;
				}
				
				this.$el.height(Math.floor(height));
			}
			
			this.trigger('resize:after');
			
			return this;
		},
		
		getOffset: function() {
			
			var offset = this.$el.outerWidth(true) - this.$el.width();
			
			return offset;
		},
		
		getAspectRatio: function() {
			
			var aspectRatio = this.options.aspectRatio;
			
			if(!aspectRatio) {
				aspectRatio = this.options.height / this.options.width;
			}
			
			return aspectRatio;
		},
		
		position: function(position) {
			
			this.$el.css({
				'top': position.top || 0,
				'left': position.left || 0
			});
			
			return this;
		},
		
		render: function() {
			
			this.trigger('render:before');
			
			this.$el
				.css('position', 'absolute');
			
			this.trigger('render:after');
			
			return this;
		}
	});
	
	return Item;	
});
