import React, { useState, useEffect } from 'react';

const TypingEffect = ({
                          text,
                          speed = 100,
                          showCursor = true,
                          cursorChar = '|',
                          onComplete = null
                      }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursorBlink, setShowCursorBlink] = useState(true);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    // Мигание курсора
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursorBlink(prev => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 'bold' }}>
            <span>{displayedText}</span>
            {showCursor && (
                <span
                    style={{
                        opacity: showCursorBlink ? 1 : 0,
                        transition: 'opacity 0.1s'
                    }}
                >
          {cursorChar}
        </span>
            )}
        </div>
    );
};

// Компонент с несколькими заголовками
const MultipleTypingEffect = ({
                                  texts = ["Добро пожаловать!", "Welcome!", "Bienvenue!"],
                                  speed = 80,
                                  showCursor = true,
                                  cursorChar = '|',
                                  pauseBetween = 2000,
                                  loop = true,
                                  onComplete = null
                              }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const handleComplete = () => {
        if (currentTextIndex < texts.length - 1 || loop) {
            setTimeout(() => {
                setCurrentTextIndex(prev => {
                    const nextIndex = (prev + 1) % texts.length;
                    if (nextIndex === 0 && !loop) {
                        setIsComplete(true);
                        if (onComplete) onComplete();
                    }
                    return nextIndex;
                });
            }, pauseBetween);
        } else {
            setIsComplete(true);
            if (onComplete) onComplete();
        }
    };

    return (
        <div style={{
            // padding: '10px',
            textAlign: 'center',
            color: 'var(--accent-color)',
            // minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <TypingEffect
                key={currentTextIndex}
                text={texts[currentTextIndex]}
                speed={speed}
                showCursor={showCursor}
                cursorChar={cursorChar}
                onComplete={handleComplete}
            />
        </div>
    );
};

// Простой пример использования
const SimpleExample = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Пример простого эффекта:</h1>
            <TypingEffect
                text="Привет! Это эффект печатающего текста."
                speed={100}
            />

            <br /><br />

            <h1>Пример без курсора:</h1>
            <TypingEffect
                text="Текст без мигающего курсора"
                speed={80}
                showCursor={false}
            />

            <br /><br />

            <h1>Пример с быстрой печатью:</h1>
            <TypingEffect
                text="Очень быстрая печать текста!"
                speed={50}
                cursorChar="_"
            />
        </div>
    );
};

// Основной компонент для демонстрации
const Demo = () => {
    const [activeDemo, setActiveDemo] = useState('simple');

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{
                padding: '1rem',
                textAlign: 'center',
                backgroundColor: '#333',
                color: 'white'
            }}>
                <button
                    onClick={() => setActiveDemo('simple')}
                    style={{
                        margin: '0 10px',
                        padding: '10px 20px',
                        backgroundColor: activeDemo === 'simple' ? '#667eea' : '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Простые примеры
                </button>
                <button
                    onClick={() => setActiveDemo('multiple')}
                    style={{
                        margin: '0 10px',
                        padding: '10px 20px',
                        backgroundColor: activeDemo === 'multiple' ? '#667eea' : '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Множественные тексты
                </button>
            </div>

            {activeDemo === 'simple' ? <SimpleExample /> : <MultipleTypingEffect />}
        </div>
    );
};

// Экспортируем оба компонента
export default TypingEffect;
export { MultipleTypingEffect, Demo };