define("grid/mixins/data-options",[],function(){return{optionsPrefix:"grid",parseOptions:function(){var e=this,t=this.$el.data()||{},n=new RegExp("^"+this.optionsPrefix+"([a-zA-Z]+)");return $.each(t,function(r,i){t.hasOwnProperty(r)&&n.test(r)&&(shortName=r.match(n)[1].replace(/[A-Z]/,function(e){return(e||"").toLowerCase()}),e.options[shortName]=i)}),this}}}),define("grid/viewports/fluid",["backbone","grid/mixins/data-options"],function(e,t){var n=e.View.extend(t).extend({className:"grid-viewport",options:{aspectRatio:null,align:"left",verticalAlign:"top"},initialize:function(){_.bindAll(this),this.parseOptions(),$(window).resize(this.resize)},getHeight:function(){var e=this.$el.height();return e},getWidth:function(){var e=this.$el.width();return e},resize:function(){this.$el.height(this.$el.width()/this.options.aspectRatio);var e=this.$el.parent(),t=Math.min(e.width()/this.$el.width(),e.height()/this.$el.height()),n=this.$el.width()*t;this.$el.width(n).height(n/this.options.aspectRatio),this.align(),this.trigger("resized")},align:function(){if(this.options.align=="center"){var e=this.$el.parent().width()/2-this.getWidth()/2;this.$el.css("left",e)}else if(this.options.align=="right"){var e=this.$el.parent().width()-this.getWidth();this.$el.css("left",e)}if(this.options.verticalAlign=="center"){var t=this.$el.parent().height()/2-this.getHeight()/2;this.$el.css("top",t)}else if(this.options.verticalAlign=="bottom"){var t=this.$el.parent().height()-this.getHeight();this.$el.css("top",t)}},render:function(){return this.$el.css({position:"relative",visibility:"visible"}),this.resize(),this}});return n}),define("grid/layouts/fluid",["backbone","grid/mixins/data-options"],function(e,t){var n=e.View.extend(t).extend({className:"grid-layout",options:{itemMaxWidth:null,itemMaxHeight:null,columnsCount:null,columnWidth:null,align:"left",verticalAlign:"top"},initialize:function(){_.bindAll(this),this.viewport=null,this.columns={},this.items=[],this.parseOptions(),this.viewport=this.options.viewport,this.viewport.on("resized",this.position)},getColumnWidth:function(){var e=0;return _.isNull(this.options.columnWidth)?(e=this.viewport.getWidth()/this.getColumnsCount(),this.options.itemMaxWidth&&e>this.options.itemMaxWidth&&(e=this.options.itemMaxWidth)):_.isFunction(this.options.columnWidth)?e=this.options.columnWidth.apply(this):e=this.options.columnWidth,e},getColumnsCount:function(){var e=0;return this.options.columnsCount?e=this.options.columnsCount:e=Math.ceil(this.viewport.getWidth()/this.getColumnWidth()),e>this.items.length&&(e=this.items.length),e},createColumns:function(){this.columns={};for(var e=1;e<=this.getColumnsCount();e++)this.columns[e]={sort:e,height:0}},findSmallestColumn:function(){var e=null;return $.each(this.columns,function(t,n){if(!e||e.height>n.height)e=n}),e},findHighestColumn:function(){var e=null;return $.each(this.columns,function(t,n){if(!e||e.height<n.height)e=n}),e},getWidth:function(){var e=this.getColumnsCount()*this.getColumnWidth();return e},getHeight:function(){var e=0,t=this.findHighestColumn();return t&&(e=t.height),e},position:function(){var e=this;this.createColumns(),$.each(this.items,function(t,n){var r=e.findSmallestColumn();n.resize({width:e.getColumnWidth(),height:e.options.itemMaxHeight}),n.position({top:r.height,left:(r.sort-1)*e.getColumnWidth()}),r.height+=n.$el.outerHeight(!0)}),this.$el.width(this.getWidth()).height(this.getHeight()),this.align()},align:function(){if(this.options.align=="center"){var e=this.viewport.getWidth()/2-this.getWidth()/2;this.$el.css("left",e)}else if(this.options.align=="right"){var e=this.viewport.getWidth()-this.getWidth();this.$el.css("left",e)}if(this.options.verticalAlign=="center"){var t=this.viewport.getHeight()/2-this.getHeight()/2;this.$el.css("top",t)}else if(this.options.verticalAlign=="bottom"){var t=this.viewport.getHeight()-this.getHeight();this.$el.css("top",t)}},add:function(e){return this.$el.append(e.el),this.items.push(e),e},render:function(){return this.$el.css({position:"absolute",visibility:"visible"}),this}});return n}),define("grid/items/base",["backbone","grid/mixins/data-options"],function(e,t){var n=e.View.extend(t).extend({className:"grid-item",options:{preserveAspectRatio:!0,aspectRatio:null},initialize:function(){this.parseOptions()},resize:function(e){var t=e.width-this.getOffset();this.$el.width(Math.floor(t));if(this.options.preserveAspectRatio){var n=t/this.getAspectRatio();e.height&&n>e.height&&(n=e.height),this.$el.height(Math.floor(n))}return this.$el.trigger("resized.grid"),this},getOffset:function(){var e=this.$el.outerWidth(!0)-this.$el.width();return e},getAspectRatio:function(){var e=this.options.aspectRatio;return e||(e=this.options.height/this.options.width),e},position:function(e){return this.$el.css({top:e.top||0,left:e.left||0}),this},render:function(){return this.$el.css("position","absolute"),this.$el.trigger("rendered.grid"),this}});return n}),define("grid",["backbone","grid/mixins/data-options","grid/viewports/fluid","grid/layouts/fluid","grid/items/base"],function(e,t){var n=e.View.extend(t).extend({options:{itemSelector:"> .grid-item",layoutSelector:"> .grid-layout",viewport:"fluid",item:"base",layout:"fluid"},initialize:function(){_.bindAll(this),this.parseOptions()},setLayout:function(e){var t="grid/layouts/"+e,n=require(t),r=this.$(this.options.layoutSelector),i={viewport:this.viewport};return r.length&&(i.el=r),this.options.columnWidth&&(i.columnWidth=this.options.columnWidth),this.layout=new n(i),r.length||this.$el.append(this.layout.el),this},setViewport:function(e){var t="grid/viewports/"+e,n=require(t);return this.viewport=new n({el:this.$el}),this},addItem:function(e){var t="grid/items/"+this.options.item,n=require(t);return this.layout.add(new n({el:$(e)})).render()},render:function(){var e=this;return this.setViewport(this.options.viewport).setLayout(this.options.layout),this.$(this.options.itemSelector).each(function(t,n){e.addItem(n)}),this.viewport.render(),this.layout.render(),this}});return n});