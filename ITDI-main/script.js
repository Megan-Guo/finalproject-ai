document.addEventListener("DOMContentLoaded", function () {
    const puzzleContainer = document.getElementById('puzzle-container');
    const checkButton = document.getElementById('check-button');
    const quotesContainer = document.getElementById('quotes-container');

    const positions = [
        { left: 0, top: 0 }, { left: 200, top: 0 }, { left: 400, top: 0 },
        { left: 0, top: 200 }, { left: 200, top: 200 }, { left: 400, top: 200 },
        { left: 0, top: 400 }, { left: 200, top: 400 }, { left: 400, top: 400 },
        { left: 0, top: 600 }, { left: 200, top: 600 }, { left: 400, top: 600 }
    ];


    

    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);

    const pieces = positions.map((pos, index) => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundImage = 'url("2p.jpg")';
        piece.style.backgroundPosition = `${-pos.left}px ${-pos.top}px`;
        piece.style.left = `${shuffledPositions[index].left}px`;
        piece.style.top = `${shuffledPositions[index].top}px`;
        piece.dataset.index = index;
        piece.dataset.correctLeft = pos.left;
        piece.dataset.correctTop = pos.top;
        piece.draggable = true;
        return piece;
    });

    pieces.forEach(piece => puzzleContainer.appendChild(piece));

    let draggedPiece = null;

    pieces.forEach(piece => {
        piece.addEventListener('dragstart', function () {
            draggedPiece = piece;
        });

        piece.addEventListener('dragover', function (event) {
            event.preventDefault();
        });

        piece.addEventListener('drop', function () {
            if (draggedPiece) {
                const draggedIndex = pieces.indexOf(draggedPiece);
                const droppedIndex = pieces.indexOf(piece);

                puzzleContainer.insertBefore(draggedPiece, piece);
                puzzleContainer.insertBefore(piece, puzzleContainer.children[draggedIndex]);

                pieces[draggedIndex] = piece;
                pieces[droppedIndex] = draggedPiece;

                [draggedPiece.style.left, piece.style.left] = [piece.style.left, draggedPiece.style.left];
                [draggedPiece.style.top, piece.style.top] = [piece.style.top, draggedPiece.style.top];

                draggedPiece = null;
            }
        });
    });

    checkButton.addEventListener('click', function () {
        if (isPuzzleSolved()) {
            fetchQuotesFromGPT();
        } else {
            alert('拼圖還沒有完成哦，繼續加油！');
        }
    });

    

    function isPuzzleSolved() {
        return pieces.every(piece => {
            const correctLeft = piece.dataset.correctLeft + 'px';
            const correctTop = piece.dataset.correctTop + 'px';
            return piece.style.left === correctLeft && piece.style.top === correctTop;
        });
    }

    async function fetchQuotesFromGPT() {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ''
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'Generate five quotes based on the following data: "成大合作德國大學 設立亞洲辦公室 台德課程機會 國際企業實習 博世產學合作 機械工程合作 化學工程合作 智慧養殖技術研發 無毒安全草蝦 抗白點病毒草蝦 良種篩選技術 科學化養殖模組 法國水產合作 有機草蝦養殖 馬達加斯加草蝦 CTCI中鼎合作 智慧工程合作 綠色資源技術 資料分析技術 智慧應用領域 國際競爭力提升 人工智慧人才 室內空氣污染研究 空氣品質管理法 氣候變遷改善". 繁體Each quote should be less than ten characters and Please answer in plain text.'
                    }
                ],
                max_tokens: 50,
                n: 3,
                stop: ['\n']
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        if (!data.choices || !Array.isArray(data.choices)) {
            throw new Error('Unexpected API response format');
        }

        // 清理引言的文字
        const quotes = data.choices.map(choice => cleanQuoteText(choice.message.content.trim()));
        console.log('Cleaned quotes:', quotes);

        // 清空先前的引用容器內容
        quotesContainer.innerHTML = '';

        // 获取拼图容器的大小
        const containerRect = puzzleContainer.getBoundingClientRect();

        // 定義固定的位置
        const fixedPositions = [
            { left: '5%', top: '1%' },
            { left: '5%', top: '80%' },
            { left: '4%', top: '85%' }
            
        ];

        // 將引用添加到引用容器中，並固定定位
        quotes.forEach((quote, index) => {
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote');
            quoteElement.textContent = quote;

            // 使用固定位置
            const position = fixedPositions[index % fixedPositions.length];
            quoteElement.style.left = position.left;
            quoteElement.style.top = position.top;

            // 為引言設置樣式
            if (index === 0) { // 第一個引言特大
                quoteElement.classList.add('large');
            
            }
            if (index === 1) { // 
                quoteElement.classList.add('t2');
                
            }

            if (index === 2) { // 
                quoteElement.classList.add('t3');
                
            }

            quotesContainer.appendChild(quoteElement);

            setTimeout(() => {
                quoteElement.style.opacity = '1';
            }, 100); // 延迟100毫秒触发淡入效果，确保元素已被添加到 DOM 中

            
        });
    // 第二个请求
    const response2 = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '' 
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: '生成關於蘇慧貞的介紹，台灣公衛科學家、教育家，出生於臺南市。曾任國立成功大學校長、醫學院工業衛生學科暨環境醫學研究所教授。專長多有關環境、空氣品質，例如環境的永續發展、氣候變遷與公共衛生、室內空氣品質與健康效應、空氣污染與健康效應、環境科學等，獲得過電荷吸引生物氣膠收集裝置的專利。' // 系统提示
                },
                {
                    role: 'user',
                    content: '生成關於蘇慧貞的介紹，少於20個字' // 用户提问
                }
            ],
            max_tokens: 80, // 根据需要调整生成的最大标记数，这里为巴菲特的描述设置更多标记数
            n: 1, // 只生成一段描述
            stop: ['\n']
        })
    });

    if (!response2.ok) {
        throw new Error(`API request failed with status ${response2.status}`);
    }

    const data2 = await response2.json();
    console.log('API response for Buffett:', data2);

    if (!data2.choices || !Array.isArray(data2.choices) || data2.choices.length === 0) {
        throw new Error('Unexpected API response format or empty choices');
    }

    const generatedText2 = cleanGeneratedText(data2.choices[0].message.content.trim());

    // 清空先前的文本容器2内容
    generatedTextContainer2.innerHTML = '';

    

    // 创建文本元素2
    const textElement2 = document.createElement('div');
    textElement2.classList.add('generated-text');
    textElement2.textContent = generatedText2;

    // 将生成的文本2添加到容器2中
    generatedTextContainer2.appendChild(textElement2);

    generatedTextContainer2.style.opacity = '1';

    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// 清理文字函數
function cleanQuoteText(quote) {
    return quote.replace(/^\d+\.\s*/, '').replace(/["]+/g, '');
}

// 清理生成的文本函數
function cleanGeneratedText(text) {
    return text.trim();
}

document.getElementById('check-button').addEventListener('click', generateCube);

function generateCube() {
    const cubeContainer = document.getElementById('cubeContainer');

    // 清除任何现有的色块
    cubeContainer.innerHTML = '';

    // 创建正方体元素
    const cube = document.createElement('div');
    cube.classList.add('cube');

    // 创建圆形元素
    const round = document.createElement('div');
    round.classList.add('round');

    // 将元素添加到容器中
    cubeContainer.appendChild(cube);
    cubeContainer.appendChild(round);

   
}
});

