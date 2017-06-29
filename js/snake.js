$(function(){
    for (var i = 1; i <= Snake.size; i++)
        for (var j = 1; j <= Snake.size; j++) 
            $('#box').append('<div class="cell cell' + j + '-' + i + '"></div>');

    Snake.init(5).draw().tiktok();

    // 绑定键盘事件
    $('body').on('keydown', function(event){
        switch (event.which) {
            case 13:
            case 32:
                Snake.togglePause();
                if (Snake.dead()) Snake.init(5).draw();
                break;
            case 37:
                Snake.changeDirection('left');
                break;
            case 38:
                Snake.changeDirection('up');
                break;
            case 39:
                Snake.changeDirection('right');
                break;
            case 40:
                Snake.changeDirection('down');
                break;
            default:
                break;
        }
    })
});

Snake = {
    direction: 'right', 
    body: [], 
    size: 20, 
    timer: NaN, 
    paused: true, 
    speed: 300, 
    apple: {}, 

    // 初始化身体
    init: function (length) {
        this.body = [];
        for (var i = length; i > 0; i--) 
            this.body.push({x: i, y: 1});
        
        return this.tiktok();
    }, 

    tiktok: function () {
        this.timer = setInterval(function(){ 
            if (typeof this.apple.x == 'undefined') 
                this.initApple();

            if (this.isPaused()) return ;

            if (this.dead()) 
                clearInterval(this.timer);
            
            this.draw().move();
        }.bind(this), this.speed);
        return this;
    }, 

    initApple: function () {
        var x = Math.ceil(Math.random() * 20);
        var y = Math.ceil(Math.random() * 20);

        for (i in this.body) 
            if (x == this.body[i].x && y == this.body[i].y) return this.initApple();

        $('#box .cell').removeClass('apple');
        $('#box .cell' + x + '-' + y).addClass('apple');
        Snake.apple = {x: x, y: y};
    }, 

    // 切换暂停状态
    togglePause: function () {
        this.paused = ! this.paused;
    }, 

    // 获取当前暂停状态
    isPaused: function () {
        return this.paused;
    }, 

    // 改变移动方向
    changeDirection: function (direction) {
        if ((this.direction == 'up' && direction != 'down') || 
            (this.direction == 'down' && direction != 'up') || 
            (this.direction == 'left' && direction != 'right') || 
            (this.direction == 'right' && direction != 'left'))
            this.direction = direction;
    }, 

    // 移动
    move: function () {
        if (this.body.length == 0) return;
        var head = this.body[0];
        var x = head.x;
        var y = head.y;
        switch (this.direction) {
            case 'up':
                var y = head.y - 1;
                break;
            case 'down':
                var y = head.y + 1;
                break;
            case 'left':
                var x = head.x - 1;
                break;
            case 'right':
                var x = head.x + 1;
                break;
            default:
                break;
        };

        this.body.unshift({x: x, y: y});

        if (x == this.apple.x && y == this.apple.y) {
            this.apple = {}; // 吃到苹果
        } else {
            this.body.pop(); // 没有吃到苹果
        }

        return this;
    }, 

    // 绘图
    draw: function () {
        if (this.dead()) {
            $('#box .snake').addClass('dead');
            return this;
        };

        $('#box .cell').removeClass('snake').removeClass('dead');
        for (i in this.body) 
            $('#box .cell' + this.body[i].x + '-' + this.body[i].y).addClass('snake');
        
        return this;
    }, 

    dead: function () {
        var head = this.body[0];
        if (head.x <  1 || head.y <  1) return true;
        if (head.x > this.size || head.y > this.size) return true;

        // 检测自身碰撞
        for (var i in this.body) 
            if (i > 0 && this.body[i].x == head.x && this.body[i].y == head.y) return true;

        return false;
    }
}