const words = [
    { english: "Apple", chinese: "苹果" },
    { english: "Banana", chinese: "香蕉" },
    { english: "Cat", chinese: "猫" },
    { english: "Dog", chinese: "狗" },
    { english: "Elephant", chinese: "大象" },
    { english: "Fish", chinese: "鱼" }
];

let selectedCards = [];
let matchedPairs = 0;

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
    const allWords = [...words.map(w => w.english), ...words.map(w => w.chinese)];
    shuffleArray(allWords);

    allWords.forEach(word => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = word;
        card.addEventListener('click', () => selectCard(card));
        gameBoard.appendChild(card);
    });
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
            setTimeout(() => alert('恭喜你，全部配对成功！'), 500);
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

// 初始化游戏
window.onload = createGameBoard;