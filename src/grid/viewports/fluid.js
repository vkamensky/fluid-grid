define([
	
    'backbone',
	'grid/mixins/data-options'
	
], function(Backbone, DataOptionsMixin) {
	
	var Viewport = Backbone.View
		.extend(DataOptionsMixin)
		.extend({
			
		className: 'grid-viewport',
		
		options: {
			aspectRatio: null
		},
		
		initialize: function() {
			
			_.bindAll(this);
			
			this
				.parseOptions();
			
			$(window).resize(this.resize);
		},

		getHeight: function() {
			var height = this.$el.height();
			return height;
		},
		
		getWidth: function() {
			var width = this.$el.width();
			return width;
		},
		
		resize: function() {

			this.$el
				.height(this.$el.width() / this.options.aspectRatio);
			
			var parent = this.$el.parent();
			
			var rate = Math.min(parent.width() / this.$el.width(), parent.height() /  this.$el.height());
			
			var width = this.$el.width() * rate;
			console.log(width / this.options.aspectRatio);
			this.$el
				.width(width)
				.height(width / this.options.aspectRatio);
			
			this.trigger('resized');
		},
		
		render: function() {

			this.$el.css({
				'position': 'relative',
				'visibility': 'visible'
			});			
			
			this.resize();
			
			return this;
		}		
		
	});
	
	return Viewport;
});