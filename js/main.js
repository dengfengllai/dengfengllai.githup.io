(function( global ) {
	var init;
	function animate( config ) {
		return new animate.prototype.init( config );
	}
	animate.prototype = {
		constructor: animate,		
		toRadian: function( angle ) {
			return Math.PI * angle / 180;
		},
		// 根据角度和半径，求当前位置坐标
		computedPos: function( angle, radius ) {
			return {
				x: this.canvasWidth / 2 + radius * Math.cos( this.toRadian( angle ) ),
				y: this.canvasHeight / 2 + radius * Math.sin( this.toRadian( angle ) )
			};
		},
		// 根据参数，绘制每个球体
		drawGlobe: function( option ) {
			this.context.beginPath();
			this.context.arc( option.position.x, option.position.y, option.radius, 0, 2 * Math.PI );
			this.context.strokeStyle = option.borderColor;
			this.context.lineWidth = option.border;
			this.context.stroke();
			this.context.fillStyle = option.fillColor;
			this.context.fill();

			this.context.font = option.font +　'px 宋体';
			this.context.fillStyle = '#fff';
			this.context.textAlign = 'center';
			this.context.textBaseline = 'middle';
			this.context.fillText( option.title, option.position.x, option.position.y );
			this.context.closePath();
		},
		draw: function() {
			// 1: 清除画布
			this.context.clearRect( 0, 0, this.canvasWidth, this.canvasHeight );
			// 2: 绘制中心球体
			this.drawGlobe( this.data );
			// 3: 绘制其他旋转球体
			for( var i = 0,l1 = this.data.skills.length; i < l1; i++ ){
				for( var j = 0,l2 = this.data.skills[ i ].child.length; j < l2; j++ ){
					this.drawGlobe( this.data.skills[ i ].child[ j ] );	
				}
			}
		},
		// 根据速度，计算每个球体变化后的圆心坐标位置
		update: function() {
			for( var i = 0,l1 = this.data.skills.length; i < l1; i++ ){
				var radius = this.data.skills[ i ].radius;
				for( var j = 0,l2 = this.data.skills[ i ].child.length; j < l2; j++ ){					
					var globe = this.data.skills[ i ].child[ j ];
					globe.angle += i % 2 ? ( i / 3 + 1 ) * this.speed : -( i / 3 + 1 ) * this.speed;
					globe.position = this.computedPos( globe.angle, radius );
				}
			}
		},
		// 绑定事件
		// 鼠标进入，速度放慢；鼠标离开，恢复原速度。
		bind: function() {
			var self = this;
			this.context.canvas.addEventListener( 'mouseenter', function() {
				self.speed = 0.2;
			} );
			this.context.canvas.addEventListener( 'mouseleave', function() {
				self.speed = self.initSpeed;
			} );
		},
		start:function() {
			var self = this;
			this.isStarting = true;
			global.requestAnimationFrame(function() {
				self.update();
				self.draw();
				global.requestAnimationFrame(arguments.callee);
			});
		},
		render: function() {
			global.document.querySelector( this.target ).appendChild( this.context.canvas );
			if( !this.isStarting ){
				this.bind();
				this.start();
			}
			return this;
		}
	};
	init = animate.prototype.init = function(config) {
		if( !config.target || !config.data ) throw new Error('参数错误。');
		this.target = config.target;						// 创建的canvas，要添加到的容器
		this.data = config.data;	   						// 相关数据
		this.canvasWidth = config.canvasWidth || 600;       // canvas宽度
		this.canvasHeight = config.canvasHeight || 600;		// canvas高度
		this.initSpeed = config.speed || 1;					// 初始旋转速度，单位为角度。默认为1
		this.speed = this.initSpeed;						// 当前速度。当鼠标进入canvas时，速度为.2		
		// this.fps = config.fps || 60;						// 使用setInterval时，设置频率
		var canvas = global.document.createElement('canvas'); // 创建画布
		canvas.width = this.canvasWidth;					  // 设置狂傲
		canvas.height = this.canvasHeight;
		this.context = canvas.getContext('2d');				  // 获取绘图上下文

		this.isStarting = false;							// 标记动画是否开启
	};
	init.prototype = animate.prototype;
	global.animate = animate;
}( window ));