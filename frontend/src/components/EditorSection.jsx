import React, { useRef, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Button, Typography, Space } from 'antd';
import styles from "../styles/CompanyIssue.module.css";
import { ClearOutlined } from '@ant-design/icons';
const { Text } = Typography;

const EditorSection = ({
                           selectedLanguage,
                           code,
                           editorTheme,
                           handleCodeChange,
                           consoleOutput,
                           consoleError,
                           clearConsole,
                           isRunning,
                           editorRef,
                           containerRef,
                           fileLoaded = false // Новый пропс для отслеживания загрузки файла
                       }) => {

    // Обновление элемента через секунду после загрузки файла
    useEffect(() => {
        if (fileLoaded) {
            const timer = setTimeout(() => {
                console.log('File loaded, refreshing Monaco Editor...');
                // Обновляем размер редактора
                if (editorRef?.current) {
                    editorRef.current.layout();
                }
                // Можно также принудительно обновить весь компонент
                // window.location.reload(); // Раскомментировать если нужно полное обновление страницы
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [fileLoaded, editorRef]);

    // Проверка высоты Monaco Editor
    useEffect(() => {
        if (!containerRef?.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.contentRect.height;
                console.log('Monaco Editor height:', height);

                // Если высота меньше 100px, обновляем страницу
                if (height < 100) {
                    console.warn('Monaco Editor height is below 100px, refreshing page...');
                    window.location.reload();
                }
            }
        });

        resizeObserver.observe(containerRef.current);

        // Очистка observer при размонтировании компонента
        return () => {
            resizeObserver.disconnect();
        };
    }, [containerRef]);

    return (
        <>
            <div ref={containerRef} className={styles.monacoContainer}>
                <MonacoEditor
                    className={styles.monacoEditor}
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
                        automaticLayout: false,
                        fontSize: 14,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        formatOnPaste: true,
                        formatOnType: true,
                        tabSize: 2,
                        rulers: [80],
                        bracketPairColorization: { enabled: true },
                        autoIndent: 'full',
                        showFoldingControls: 'always'
                    }}
                />
            </div>

            <div className={styles.consoleContainer}>
                <div className={styles.consoleHeader}>
                    <Text type="secondary" className={styles.text}>Console</Text>
                    <Button
                        size="small"
                        icon={<ClearOutlined />}
                        onClick={clearConsole}
                    >
                        Очистить
                    </Button>
                </div>

                <div className={styles.console}>
                    {consoleOutput.length > 0 ? (
                        consoleOutput.map((log, index) => (
                            <div key={index} className={styles.consoleLine}>
                                <span className={styles.consolePrompt}>&gt;</span> {log}
                            </div>
                        ))
                    ) : consoleError ? (
                        <div className={styles.consoleError}>
                            <strong>Error:</strong> {consoleError}
                        </div>
                    ) : (
                        <div className={styles.consoleEmpty}>
                            The console is empty. Run the code to see the results.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EditorSection;