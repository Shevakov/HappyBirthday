// Звёзды
var canvas;
var context;
var screenH;
var screenW;
var stars = [];
var fps = 30;
var numStars = 100;

$('document').ready(function() {
    // Инициализация канваса
    screenH = $(window).height();
    screenW = $(window).width();
    
    canvas = $('#space');
    
    canvas.attr('height', screenH);
    canvas.attr('width', screenW);
    context = canvas[0].getContext('2d');
    
    // Создание звёзд
    for(var i = 0; i < numStars; i++) {
        var x = Math.round(Math.random() * screenW);
        var y = Math.round(Math.random() * screenH);
        var length = 1 + Math.random() * 1.5;
        var opacity = Math.random() * 0.5 + 0.2;
        
        var star = new Star(x, y, length, opacity);
        stars.push(star);
    }
    
    setInterval(animate, 1000 / fps);

    // Обработка изменения размера окна
    $(window).resize(function() {
        screenH = $(window).height();
        screenW = $(window).width();
        canvas.attr('height', screenH);
        canvas.attr('width', screenW);
    });

    // Управление музыкой
    const playButton = document.getElementById('playButton');
    const audio = document.getElementById('birthdaySong');

    playButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playButton.classList.add('playing');
        } else {
            audio.pause();
            playButton.classList.remove('playing');
        }
    });

    // Функция обратного отсчёта
    function updateCountdown() {
        const targetDate = new Date('2025-05-23T16:00:00');
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Обновляем таймер каждую секунду
    setInterval(updateCountdown, 1000);
    // Запускаем сразу при загрузке страницы
    updateCountdown();
});

function animate() {
    context.clearRect(0, 0, screenW, screenH);
    $.each(stars, function() {
        this.draw(context);
    });
}

function Star(x, y, length, opacity) {
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.length = parseInt(length);
    this.opacity = opacity;
    this.factor = 1;
    this.increment = Math.random() * .02;
}

Star.prototype.draw = function() {
    context.save();
    
    context.translate(this.x, this.y);
    
    if(this.opacity > 0.7) {
        this.factor = -1;
    }
    else if(this.opacity <= 0.2) {
        this.factor = 1;
        
        this.x = Math.round(Math.random() * screenW);
        this.y = Math.round(Math.random() * screenH);
    }
        
    this.opacity += this.increment * this.factor;
    
    context.beginPath();
    context.arc(0, 0, this.length, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 255, 200, ${this.opacity})`;
    context.shadowBlur = 3;
    context.shadowColor = '#ffff33';
    context.fill();
    
    context.restore();
}; 