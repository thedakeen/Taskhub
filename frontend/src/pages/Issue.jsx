import MonacoEditor from 'react-monaco-editor';
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import IssueSolutions from "../components/IssueSolutions";
import AuthContext from "../contexts/AuthContext";
import styles from "../styles/CompanyIssue.module.css";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import moment from 'moment';
import React, { useContext, useEffect, useState, useRef } from "react";
import { Layout, Typography, Select, Button, Divider, Tabs, Tooltip, Space, message ,Badge,Card, List } from 'antd';
import {
    CodeOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    PlayCircleOutlined,
    FormatPainterOutlined,
    ClearOutlined,
    DownloadOutlined,
    BulbOutlined, CloudUploadOutlined
} from '@ant-design/icons';


const { Content, Sider } = Layout;
const {Text } = Typography;
const { Option } = Select;

const CompanyIssue = () => {
    const { issueId } = useParams();
    const [issue, setIssue] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [issueStatus, setIssueStatus] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    // Code editor state
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [isFullscreenEditor, setIsFullscreenEditor] = useState(false);
    const [editorWidth, setEditorWidth] = useState(60);
    const [consoleOutput, setConsoleOutput] = useState([]);
    const [consoleError, setConsoleError] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [editorTheme, setEditorTheme] = useState('vs-dark'); // Добавлено состояние для темы
    const containerRef = useRef(null);

    // Editor instance ref
    const editorRef = useRef(null);

    // Resizer refs and state
    const resizerRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);
    const resizeTimeoutRef = useRef(null);

    const languageStarters = {
        javascript: `// Write your solution here
function solution(input) {
  // Your code here
  return input;
}

// Test your solution
console.log(solution(5));`,
        python: `# Write your solution here
def solution(input):
    # Your code here
    return input

# Test your solution
print(solution(5))`,
        java: `public class Solution {
    public static void main(String[] args) {
        System.out.println(solution(5));
    }
    
    public static int solution(int input) {
        // Your code here
        return input;
    }
}`,
        cpp: `#include <iostream>
using namespace std;

int solution(int input) {
    // Your code here
    return input;
}

int main() {
    cout << solution(5) << endl;
    return 0;
}`,
    };

    // Добавлены темы редактора
    const editorThemes = [
        { value: 'vs', label: 'Light' },
        { value: 'vs-dark', label: 'Dark' },
        { value: 'hc-black', label: 'High Contrast' }
    ];

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:8082/v1/issues/${issueId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    });
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.status}`);
                }
                const data = await response.json();
                setIssue(data);
                setIssueStatus(data.assignmentStatus);
                setIsSubscribed(data.assignmentStatus === "assigned" || data.assignmentStatus === "in_progress");
                if (data.solutionText) {
                    setCode(data.solutionText);
                } else {
                    setCode(languageStarters.javascript);
                }
            } catch (err) {
                console.error("Ошибка получения issue:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchIssue();
        }
    }, [issueId, user]);



    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const response = await fetch(
                    `http://localhost:8081/v1/api/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    });
                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }
                const data = await response.json();
                console.log(data)
                if(data.role === "company") {
                    setIsSubscribed(false);
                }
                setUserData(data);
            } catch (err) {
                console.error("Ошибка получения профиля:", err);
                setError(err.message);
            }
            // try {
            //     const response = await fetch(`http://localhost:8081/v1/api/me`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //             Authorization: `Bearer ${user?.token}`, // если требуется
            //         },
            //         body: JSON.stringify({}) // если нужно отправить данные
            //     });
            //
            //     if (!response.ok) {
            //         throw new Error(`Ошибка сети: ${response.status}`);
            //     }
            //
            //     const data = await response.json();
            //     console.log(data);
            //     setUserData(data);
            //
            //     if(data.role === "company") {
            //         setIsSubscribed(false);
            //     }
            // } catch (err) {
            //     console.error("Ошибка получения профиля:", err);
            //     setError(err.message);
            // }
        };

        fetchUserData()
    }, [user]); // Перезапуск запроса при изменении ID

    // Handle resizer mouse events
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;

            // Clear any pending updates
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = setTimeout(() => {
                const containerWidth = document.body.clientWidth;
                const newWidth = startWidth + ((e.clientX - startX) / containerWidth * 100);

                // Limit to reasonable bounds (20-80%)
                const boundedWidth = Math.min(Math.max(newWidth, 20), 80);
                setEditorWidth(boundedWidth);
            }, 16); // ~60fps
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';

            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [isResizing, startX, startWidth]);

    useEffect(() => {
        const resizeEditor = () => {
            if (editorRef.current && containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                editorRef.current.layout({ width, height });
            }
        };

        window.addEventListener('resize', resizeEditor);
        // Первоначальная настройка размера
        setTimeout(resizeEditor, 300);

        return () => window.removeEventListener('resize', resizeEditor);
    }, []);



    const startResize = (e) => {
        setIsResizing(true);
        setStartX(e.clientX);
        setStartWidth(editorWidth);
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
    };

    const handleLanguageChange = (value) => {
        setSelectedLanguage(value);
        setCode(languageStarters[value] || '// Write your code here...');
        setConsoleOutput([]);
        setConsoleError(null);
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    const toggleFullscreen = () => {
        setIsFullscreenEditor(!isFullscreenEditor);
    };

    // Добавлена функция для изменения темы
    const toggleEditorTheme = () => {
        setEditorTheme(prevTheme => {
            if (prevTheme === 'vs-dark') return 'vs';
            if (prevTheme === 'vs') return 'hc-black';
            return 'vs-dark';
        });
    };

    const handleSubscribe = async () => {
        try {
            const response = await fetch(
                `http://localhost:8082/v1/issues/${issueId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user?.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка: ${errorText}`);
            }

            setIsSubscribed(true);
            setIssue(prev => ({
                ...prev,
                assignmentStatus: "assigned"
            }));
            message.success("Вы успешно подписались на задание");
            setCode(languageStarters[selectedLanguage]);

        } catch (err) {
            console.error("Ошибка подписки:", err);
            setSubmitError(err.message);
            message.error("Ошибка при подписке на задание");
        }
    };

    const handleSubmitSolution = async () => {
        if (!code.trim()) {
            setSubmitError("Пожалуйста, введите решение");
            message.error("Пожалуйста, введите решение");
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError(null);

            const url = `http://localhost:8082/v1/issues/${issueId}/submit?solutionText=${encodeURIComponent(code)}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }

            setIssue(prev => ({
                ...prev,
                solutionText: code,
                solutionStatus: "submitted"
            }));

            setSubmitSuccess(true);
            message.success("Решение успешно отправлено!");

        } catch (err) {
            console.error("Ошибка:", err);
            setSubmitError(err.message || "Ошибка при отправке решения");
            message.error("Ошибка при отправке решения");
        } finally {
            setSubmitting(false);
        }
    };

    const formatCode = () => {
        if (editorRef.current) {
            // Добавлена проверка на доступность форматирования
            const formatAction = editorRef.current.getAction('editor.action.formatDocument');
            if (formatAction) {
                formatAction.run().then(() => {
                    message.success("Код отформатирован");
                }).catch(err => {
                    console.error("Ошибка форматирования:", err);
                    message.error("Не удалось отформатировать код");
                });
            } else {
                message.warning("Форматирование недоступно для текущего языка");
            }
        }
    };


    const runCode = () => {
        setIsRunning(true);
        setConsoleOutput([]);
        setConsoleError(null);

        setTimeout(() => {
            try {
                const logs = [];
                const originalConsole = window.console;
                const safeConsole = {
                    error: (...args) => {
                        logs.push(`Error: ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))
                        }.join(' ')}`);
                        originalConsole.error(...args);
                    },
                    info: (...args) => {
                        logs.push(`Info: ${args.map(arg =>
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                        ).join(' ')}`);
                        originalConsole.info(...args);
                    },
                    log: (...args) => {
                        logs.push(args.map(arg =>
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                        ).join(' '));
                        originalConsole.log(...args);
                    },
                    warn: (...args) => {
                        logs.push(`Warning: ${args.map(arg =>
                            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))
                        }.join(' ')}`);
                        originalConsole.warn(...args);
                    }
                };

                if (selectedLanguage === 'javascript') {
                    window.console = safeConsole;

                    const wrappedCode = `
                        let __timeout = setTimeout(() => {
                            throw new Error("Execution timed out (maximum 5 seconds)");
                        }, 5000);
                        
                        try {
                            ${code}
                            clearTimeout(__timeout);
                        } catch (e) {
                            clearTimeout(__timeout);
                            throw e;
                        }
                    `;

                    eval(wrappedCode);
                    window.console = originalConsole;

                    if (logs.length === 0) {
                        logs.push("Код выполнен (нет вывода в консоль)");
                    }

                    setConsoleOutput(logs);
                } else {
                    setConsoleOutput([
                        `Выполнение кода на языке ${selectedLanguage}...`,
                        "Примечание: Полноценное выполнение кода на других языках требует серверной части."
                    ]);

                    if (selectedLanguage === 'python') {
                        setConsoleOutput([
                            "5",
                            "(Имитация выполнения Python кода)"
                        ]);
                    } else if (selectedLanguage === 'java') {
                        setConsoleOutput([
                            "5",
                            "(Имитация выполнения Java кода)"
                        ]);
                    } else if (selectedLanguage === 'cpp') {
                        setConsoleOutput([
                            "5",
                            "(Имитация выполнения C++ кода)"
                        ]);
                    }
                }
            } catch (err) {
                console.error("Runtime error:", err);
                setConsoleError(err.message || "Ошибка выполнения");
            } finally {
                setIsRunning(false);
            }
        }, 100);
    };

    const clearConsole = () => {
        setConsoleOutput([]);
        setConsoleError(null);
    };

    const downloadCode = () => {
        const fileExtensions = {
            javascript: 'js',
            python: 'py',
            java: 'java',
            cpp: 'cpp'
        };

        const extension = fileExtensions[selectedLanguage] || 'txt';
        const filename = `solution.${extension}`;

        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
        message.success(`Код сохранен как ${filename}`);
    };

    if (error) {
        return (
            <>
                <Navbar />
                <div className={styles.errorContainer}>
                    <div className={styles.errorCard}>
                        <h2>Произошла ошибка</h2>
                        <p>{error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={() => window.location.reload()}
                        >
                            Попробовать снова
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Загрузка данных...</p>
                </div>
                <Footer />
            </>
        );
    }

    const getStatusBadgeClass = (status) => {
        if (!status) return styles.statusPending;

        switch(status.toLowerCase()) {
            case 'assigned': return styles.statusAssigned;
            case 'solved': return styles.statusSolved;
            case 'in progress': return styles.statusInProgress;
            case 'submitted': return styles.statusSubmitted;
            case 'completed': return styles.statusCompleted; // Add this new case
            default: return styles.statusPending;
        }
    };


    const consoleStyle = {
        backgroundColor: '#1e1e1e',
        color: '#fff',
        fontFamily: 'monospace',
        padding: '10px',
        borderRadius: '4px',
        height: '100%',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        fontSize: '14px'
    };

    return (
        <>
            <Navbar />
            <Layout style={{ minHeight: 'calc(100vh - 50px)', display: 'flex', overflow:'hidden', backgroundColor:'#121212' }}>

                {isSubscribed && (
                    <>
                        {/* Code Editor Section */}
                        <Content
                            style={{
                                width: `${editorWidth}%`,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                // borderRight: isResizing ? '2px solid #1890ff' : '1px solid #f0f0f0',
                                height: '100%',
                                overflow: 'hidden'

                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                backgroundColor:'#121212',
                                // border: '1px solid #f0f0f0'
                            }}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <CodeOutlined style={{fontSize: 18, marginRight: 8,color:"white"}}/>
                                    <Select
                                        style={{width: 150, height: 25}}
                                        value={selectedLanguage}
                                        onChange={handleLanguageChange}
                                    >
                                        <Option value="javascript" style={{border: "none"}}>JavaScript</Option>
                                        <Option value="python" style={{border: "none"}}>Python</Option>
                                        <Option value="java" style={{border: "none"}}>Java</Option>
                                        <Option value="cpp" style={{border: "none"}}>C++</Option>
                                    </Select>
                                </div>
                                <Space>
                                    {submitError && (
                                        <div style={{padding: '0 10px 10px', color: 'red'}}>
                                            {submitError}
                                        </div>
                                    )}
                                    {submitSuccess && (
                                        <div style={{padding: '0 10px 10px', color: 'green'}}>
                                            Решение успешно отправлено!
                                        </div>
                                    )}
                                    <Tooltip title="Форматировать код">
                                        <Button
                                            icon={<FormatPainterOutlined/>}
                                            onClick={formatCode}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Изменить тему">
                                        <Button
                                            icon={<BulbOutlined/>}
                                            onClick={toggleEditorTheme}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Скачать код">
                                        <Button
                                            icon={<DownloadOutlined/>}
                                            onClick={downloadCode}
                                        />
                                    </Tooltip>
                                    <Tooltip
                                        title={isFullscreenEditor ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}>
                                        <Button
                                            icon={isFullscreenEditor ? <FullscreenExitOutlined/> :
                                                <FullscreenOutlined/>}
                                            onClick={toggleFullscreen}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Запустить код">
                                        <Button
                                            type="primary"
                                            icon={<PlayCircleOutlined/>}
                                            onClick={runCode}
                                            loading={isRunning}
                                        >
                                            Run
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Отправить решение">
                                        <Button
                                            type="primary"
                                            icon={<CloudUploadOutlined
                                                style={{color: "white"}}/>} // иконка белая на зелёном фоне
                                            style={{backgroundColor: "green", borderColor: "green"}}
                                            onClick={handleSubmitSolution}
                                            loading={submitting}
                                            variant="filled">
                                            {submitting ? 'Отправка...' : 'Submit'}
                                        </Button>
                                    </Tooltip>
                                </Space>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 'calc(100% - 50px)',
                                    overflow: 'hidden',
                                    padding: '10px',
                                }}
                            >
                                {/* Code Editor */}
                                <div ref={containerRef} style={{
                                    flex: 2, // Take 75% of available space
                                    border: '1px solid #e8e8e8',
                                    position: 'relative',
                                    minHeight: '60vh',
                                    marginBottom: '10px',
                                    overflow: 'hidden',
                                }}>
                                    <MonacoEditor
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            width: '100%',
                                            height: '100%',
                                            zIndex: isFullscreenEditor ? 1000 : 1,
                                        }}
                                        language={selectedLanguage}
                                        theme={editorTheme}
                                        value={code}
                                        onChange={handleCodeChange}
                                        editorDidMount={(editor) => {
                                            editorRef.current = editor;
                                            if (monaco?.languages?.typescript?.javascriptDefaults) {
                                                monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
                                            }
                                        }}
                                        options={{
                                            automaticLayout: true,
                                            fontSize: 14,
                                            minimap: {enabled: true},
                                            scrollBeyondLastLine: false,
                                            wordWrap: 'on',
                                            formatOnPaste: true,
                                            formatOnType: true,
                                            tabSize: 2,
                                            rulers: [80],
                                            bracketPairColorization: {enabled: true},
                                            autoIndent: 'full',
                                            showFoldingControls: 'always'
                                        }}
                                    />
                                </div>

                                {/* Console Output */}
                                <div style={{
                                    flex: 1, // Take 25% of available space
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '20vh',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '5px 10px',
                                        backgroundColor: '#fafafa',
                                        borderBottom: '1px solid #f0f0f0',
                                    }}>
                                        <Text type="secondary">Консоль</Text>
                                        <Button
                                            size="small"
                                            icon={<ClearOutlined/>}
                                            onClick={clearConsole}
                                        >
                                            Очистить
                                        </Button>
                                    </div>

                                    <div style={{
                                        ...consoleStyle,
                                        flex: 1,
                                        padding: '10px',
                                        overflow: 'auto',
                                    }}>
                                        {consoleOutput.length > 0 ? (
                                            consoleOutput.map((log, index) => (
                                                <div key={index} style={{marginBottom: '4px'}}>
                                                    <span style={{color: '#75bfff'}}>&gt;</span> {log}
                                                </div>
                                            ))
                                        ) : consoleError ? (
                                            <div style={{color: '#ff5555'}}>
                                                <strong>Ошибка:</strong> {consoleError}
                                            </div>
                                        ) : (
                                            <div style={{color: '#999'}}>
                                                Консоль пуста. Запустите код, чтобы увидеть результаты.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Content>

                        {/* Draggable resizer */}
                        <div
                            ref={resizerRef}
                            onMouseDown={startResize}
                            style={{
                                width: '10px',
                                backgroundColor: isResizing ? '#1890ff' : 'transparent',
                                cursor: 'ew-resize',
                                position: 'relative',
                                zIndex: 100,
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '4px',
                                    height: '30px',
                                    backgroundColor: '#d9d9d9',
                                    borderRadius: '2px',
                                }}
                            />
                        </div>
                    </>
                )}

                {/* Task Description Section */}
                <Sider
                    width={isSubscribed ? `calc(100% - ${editorWidth}% - 10px)` : '100%'}
                    theme="light"
                    style={{
                        padding: '20px',
                        overflow: 'auto',
                        backgroundColor: '#121212',
                        display: isFullscreenEditor ? 'none' : 'block'
                    }}
                >
                    <div className={styles.issueHeader}>
                        <h1 className={styles.issueTitle}>{issue.title}</h1>
                        <div className={styles.issueInfo}>
                            {/*<span className={styles.issueId}>ID: {issue.issueId}</span>*/}

                            <span className={`${styles.statusBadge} ${getStatusBadgeClass(issue.assignmentStatus)}`}>
                                Status: {issue.assignmentStatus || "Ожидает обработки"}
                            </span>
                        </div>
                    </div>
                    <Divider/>

                    {
                        !userData ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <div className={styles.loadingSpinner}></div>
                                <p>Loading user data...</p>
                            </div>
                        ) : userData.role === "company" ? (
                            <IssueSolutions issueId={issueId}/>
                        ) : (
                            <div   style={{ backgroundColor: "white", padding: "20px" }}>
                                <Tabs
                                    defaultActiveKey="description"
                                    items={[
                                        {
                                            key: 'description',
                                            label: 'Описание',
                                            children: (
                                                <div >
                                                    <p>{issue.body}</p>
                                                </div>
                                            )
                                        },
                                        {
                                            key: 'requirements',
                                            label: 'Требования',
                                            children: (
                                                <div >
                                                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                                                        <li style={{ marginBottom: "8px" }}>Реализуйте решение, которое соответствует описанию задачи</li>
                                                        <li style={{ marginBottom: "8px" }}>Обработайте все возможные краевые случаи</li>
                                                        <li style={{ marginBottom: "8px" }}>Оптимизируйте решение по времени и памяти</li>
                                                        <li style={{ marginBottom: "8px" }}>Используйте понятные имена переменных и функций</li>
                                                        <li style={{ marginBottom: "8px" }}>Добавьте комментарии, поясняющие ключевые моменты решения</li>
                                                    </ul>
                                                </div>
                                            )
                                        },
                                        {
                                            key: 'examples',
                                            label: 'Примеры',
                                            children: (
                                                <div >
                                                    <div style={{
                                                        backgroundColor: '#c6c6c6',
                                                        padding: '10px',
                                                        borderRadius: '4px',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <div><strong>Ввод:</strong> 5</div>
                                                        <div><strong>Ожидаемый вывод:</strong> Решение для входных данных 5</div>
                                                    </div>
                                                    <div style={{
                                                        backgroundColor: '#c6c6c6',
                                                        padding: '10px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        <div><strong>Ввод:</strong> 10</div>
                                                        <div><strong>Ожидаемый вывод:</strong> Решение для входных данных 10</div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    ]}
                                    styles={{
                                        tabBar: {
                                            color: 'white',
                                        },
                                        inkBar: {
                                            backgroundColor: 'white',
                                        }
                                    }}
                                />

                                <Divider />

                            {!isSubscribed && issue.assignmentStatus !== "completed" ? (
                                <Button
                                    type="primary"
                                    onClick={handleSubscribe}
                                    style={{ width: '30%', display: 'block', margin: '0 auto' }}
                                >
                                    Подписаться на задание
                                </Button>
                            ) : issue.assignmentStatus === "completed" ? (
                                <div className={styles.completedMessage}>
                                    <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px', marginBottom: '10px' }}>
                                        <Text strong style={{ color: '#52c41a' }}>Задание уже выполнено</Text>
                                    </div>
                                </div>
                            ) : null}
                            </div>
                        )
                    }
                </Sider>
            </Layout>
        </>
    );
};

export default CompanyIssue;