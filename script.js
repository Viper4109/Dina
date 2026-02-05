// спавн сердец
function spawnHeart(size, speed, picture, index) {
    const img = document.createElement('img');
    img.src = picture; // URL изображения
    img.alt = 'сердечко'; // Атрибут alt (опционально)
    img.classList.add('heart');
    img.style.width = size; 
    img.style.height = size;
    img.style.position = 'fixed';
    img.style.left = (Math.random() * 100) + '%';
    // img.style.top = '-5%'
    img.style.setProperty('--fall-speed', speed);
    img.style.setProperty('--size', size);
    img.style.setProperty('--index', index);

    //присваивание сердец в "backs" в html
    document.getElementsByClassName('backs')[0].appendChild(img);
}

const maxHearts = 40
const sizes = ['clamp(5px, 4vw, 75px)', 
               'clamp(10px, 5vw, 102px)', 
               'clamp(20px, 6vw, 128px)', 
               'clamp(30px, 7vw, 155px)'];
const fallspeed = ['10s', '8s', '6s', '4s'];
const imgs = ['files/heart.png', 'files/heart.png', 'files/flower.png'];
const ind = [1, 2, 4];

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    for (let i = 1; i <= maxHearts; i++) {  // количесто сердец раз
        const randomDelay = Math.random() * 1000; // задержка перед появлением нового сердца console.log('Жду', randomDelay, 'мс');

        await delay(randomDelay); // ⏳ ВСЕ ЖДУТ
        // console.log(i)

        // определяем скорость и размер сердца
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        const speed = fallspeed[Math.floor(Math.random() * fallspeed.length)];
        const picture = imgs[Math.floor(Math.random() * imgs.length)];
        const localind = ind[Math.floor(Math.random() * ind.length)];

        //ставит готовые характеристики
        spawnHeart(randomSize, speed, picture, localind);
    }
}

run();

function beat() {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    
    document.getElementsByClassName('beat')[0].appendChild(circle);
}
