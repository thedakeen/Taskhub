import React, { useState, useEffect } from 'react';

const AnimatedLoader = () => {
    const [currentStep, setCurrentStep] = useState(0);

    // Массив кружков с их координатами и идентификаторами
    const circles = [
        { id: 'top', cx: 170.782, cy: 40.2393, r: 40 },
        { id: 'topRight', cx: 301.782, cy: 115.239, r: 40 },
        { id: 'bottomRight', cx: 301.782, cy: 266.239, r: 40 },
        { id: 'bottom', cx: 170.782, cy: 340.239, r: 40 },
        { id: 'bottomLeft', cx: 40.7813, cy: 266.239, r: 40 },
        { id: 'topLeft', cx: 40.7813, cy: 115.239, r: 40 },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % circles.length);
        }, 300);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const getCircleOpacity = (index) => {
        // Создаем волновой эффект - текущий круг яркий, соседние тусклые
        const distance = Math.min(
            Math.abs(index - currentStep),
            circles.length - Math.abs(index - currentStep)
        );

        if (distance === 0) return 1;
        if (distance === 1) return 0.6;
        if (distance === 2) return 0.3;
        return 0.1;
    };

    const getCircleScale = (index) => {
        const distance = Math.min(
            Math.abs(index - currentStep),
            circles.length - Math.abs(index - currentStep)
        );

        if (distance === 0) return 1.2;
        if (distance === 1) return 1.05;
        return 1;
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center", // центр по горизонтали
            alignItems: "center",     // центр по вертикали
        }}>            {/* Основной контейнер */}
            <div style={{margin: "auto"}}>
                {/* Заголовок */}
                <div>
                    <div>
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                style={{animationDelay: `${i * 0.2}s`}}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* SVG с анимацией */}
                <div style={{width: 300, height: 350}}>
                    <svg
                        width="300"
                        height="350"
                        viewBox="-20 -20 382 421"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        {circles.map((circle, index) => (
                            <circle
                                key={circle.id}
                                cx={circle.cx}
                                cy={circle.cy}
                                r={circle.r}
                                fill="#4A90E2"
                                opacity={getCircleOpacity(index)}
                                transform={`scale(${getCircleScale(index)})`}
                                style={{
                                    transformOrigin: `${circle.cx}px ${circle.cy}px`,
                                    transition: 'all 0.3s ease-in-out',
                                    filter: index === currentStep ? 'drop-shadow(0 0 20px #4A90E2)' : 'none'
                                }}
                            />
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default AnimatedLoader;