import React from 'react';
import {Button, Tooltip, Space, Select} from 'antd';
import {
    CodeOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    PlayCircleOutlined,
    FormatPainterOutlined,
    DownloadOutlined,
    BulbOutlined,
    CloudUploadOutlined
} from '@ant-design/icons';
import styles from "../styles/CompanyIssue.module.css";
const { Option } = Select;


const ControlsSection = ({
                             selectedLanguage,
                             handleLanguageChange,
                             formatCode,
                             toggleEditorTheme,
                             downloadCode,
                             isFullscreenEditor,
                             toggleFullscreen,
                             runCode,
                             isRunning,
                             handleSubmitSolution,
                             submitting,
                             submitError,
                             submitSuccess
                         }) => {
    return (
        <div className={styles.editorHeader}>
            <div className={styles.languageSelector}>
                <CodeOutlined className={styles.codeIcon}/>
                <Select
                    className={styles.languageSelect}
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                >
                    <Option value="javascript">JavaScript</Option>
                    <Option value="python">Python</Option>
                    <Option value="java">Java</Option>
                    <Option value="cpp">C++</Option>
                </Select>
            </div>
            <Space>
                {submitError && (
                    <div className={styles.errorMessage}>
                        {submitError}
                    </div>
                )}
                {submitSuccess && (
                    <div className={styles.successMessage}>
                        Solution submitted successfully.
                    </div>
                )}
                <Tooltip title="Formate code">
                    <Button
                        icon={<FormatPainterOutlined/>}
                        onClick={formatCode}
                    />
                </Tooltip>
                <Tooltip title="Change theme">
                    <Button
                        icon={<BulbOutlined/>}
                        onClick={toggleEditorTheme}
                    />
                </Tooltip>
                <Tooltip title="Download code">
                    <Button
                        icon={<DownloadOutlined/>}
                        onClick={downloadCode}
                    />
                </Tooltip>
                <Tooltip title={isFullscreenEditor ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}>
                    <Button
                        icon={isFullscreenEditor ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
                        onClick={toggleFullscreen}
                    />
                </Tooltip>
                <Tooltip title="Run code">
                    <Button
                        type="primary"
                        icon={<PlayCircleOutlined/>}
                        onClick={runCode}
                        loading={isRunning}
                    >
                        Run
                    </Button>
                </Tooltip>
                <Tooltip title="Subbmit solution">
                    <Button
                        type="primary"
                        icon={<CloudUploadOutlined/>}
                        className="submit-button"
                        onClick={handleSubmitSolution}
                        loading={submitting}
                    >
                        {submitting ? 'Отправка...' : 'Submit'}
                    </Button>
                </Tooltip>
            </Space>
        </div>
    );
};

export default ControlsSection;