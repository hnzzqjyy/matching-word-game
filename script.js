const words = [
    { english: "Apple", chinese: "苹果" },
    { english: "Banana", chinese: "香蕉" },
    { english: "Cat", chinese: "猫" },
    { english: "Dog", chinese: "狗" },
    { english: "Elephant", chinese: "大象" },
    { english: "Fish", chinese: "鱼" },
    { english: "duck", chinese: "鸭子" },
    { english: "book", chinese: "书" },

];

let selectedCards = [];
let matchedPairs = 0;
let startTime;
let timerInterval;

// 加载最高分
function loadHighScore() {
    const highScore = localStorage.getItem('highScore') || '无';
    document.getElementById('high-score').textContent = `最高分: ${highScore}`;
}

// 保存最高分
function saveHighScore(time) {
    const highScore = localStorage.getItem('highScore') || Infinity;
    if (time < highScore) {
        localStorage.setItem('highScore', time);
        document.getElementById('high-score').textContent = `最高分: ${time}`;
        alert(`新纪录！你的最高分是: ${time} 秒`);
    }
}

// 打乱数组顺序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 播放音效
function playSound(sound) {
    const audio = new Audio(sound);
    audio.play();
}

// 创建游戏板
function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    const chineseWords = words.map(w => w.chinese);
    const englishWords = words.map(w => w.english);
    shuffleArray(chineseWords);
    shuffleArray(englishWords);

    // 添加中文单词到左侧
    const leftContainer = document.createElement('div');
    leftContainer.classList.add('column');
    chineseWords.forEach(word => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = word;
        card.dataset.language = 'chinese'; // 标记为中文
        card.addEventListener('click', () => selectCard(card));
        leftContainer.appendChild(card);
    });
    gameBoard.appendChild(leftContainer);

    // 添加英文单词到右侧
    const rightContainer = document.createElement('div');
    rightContainer.classList.add('column');
    englishWords.forEach(word => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = word;
        card.dataset.language = 'english'; // 标记为英文
        card.addEventListener('click', () => selectCard(card));
        rightContainer.appendChild(card);
    });
    gameBoard.appendChild(rightContainer);
}

// 选择卡片
function selectCard(card) {
    if (card.classList.contains('selected') || card.classList.contains('matched')) return;

    card.classList.add('selected');
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        checkMatch();
    }
}

// 检查是否匹配
function checkMatch() {
    const [card1, card2] = selectedCards;
    const word1 = card1.textContent;
    const word2 = card2.textContent;

// 确保一张是中文，一张是英文
    if (card1.dataset.language === card2.dataset.language) {
        alert('请选择一张中文和一张英文卡片！');
        card1.classList.remove('selected');
        card2.classList.remove('selected');
        selectedCards = [];
        return;
    }

    const isMatch = words.some(w => 
        (w.english === word1 && w.chinese === word2) || 
        (w.english === word2 && w.chinese === word1)
    );

    if (isMatch) {
        playSound('match-sound.mp3'); // 匹配成功的音效
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
           if (matchedPairs === words.length) {
        stopTimer();
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

        saveHighScore(elapsedTime);
        alert(`恭喜你，全部配对成功！用时: ${elapsedTime} 秒`);
    }
    } else {
        playSound('mismatch-sound.mp3'); // 匹配失败的音效
        setTimeout(() => {
            card1.classList.remove('selected');
            card2.classList.remove('selected');
        }, 1000);
    }

    selectedCards = [];
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const timerElement = document.getElementById('timer');
      if (timerElement) {
      timerElement.textContent = `时间: ${elapsedTime} 秒`;
       } else {
       console.error('未找到ID为"timer"的元素');
                     }
}

function stopTimer() {
    clearInterval(timerInterval);
}

// 初始化游戏
window.onload = () => {
    loadHighScore();
    createGameBoard();
    startTimer();

// 背景音乐控制
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const volumeControl = document.getElementById('volume-control');

    // 自动播放背景音乐
    backgroundMusic.play();

    // 暂停/播放按钮
    musicToggle.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.textContent = '暂停音乐';
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = '播放音乐';
        }
    });

    // 音量调节
    volumeControl.addEventListener('input', () => {
        backgroundMusic.volume = volumeControl.value;
    });
};