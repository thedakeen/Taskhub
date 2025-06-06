import React, {useRef, useEffect, useContext} from 'react';
import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Button, Typography, Space } from 'antd';
import styles from "../styles/CompanyIssue.module.css";
import { ClearOutlined } from '@ant-design/icons';
import {I18nContext} from "../contexts/i18nContext";
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
                           fileLoaded = false 
                       }) => {

    const { t } = useContext(I18nContext);

    useEffect(() => {
        if (fileLoaded) {
            const timer = setTimeout(() => {
                console.log('File loaded, refreshing Monaco Editor...');
                
                if (editorRef?.current) {
                    editorRef.current.layout();
                }
                
                
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [fileLoaded, editorRef]);

    
    useEffect(() => {
        if (!containerRef?.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.contentRect.height;
                console.log('Monaco Editor height:', height);

                
                if (height < 100) {
                    console.warn('Monaco Editor height is below 100px, refreshing page...');
                    window.location.reload();
                }
            }
        });

        resizeObserver.observe(containerRef.current);

        
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
                        {t('clear')}
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
                            <strong>{t('error')}</strong> {consoleError}
                        </div>
                    ) : (
                        <div className={styles.consoleEmpty}> {t('empty_console')}</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EditorSection;