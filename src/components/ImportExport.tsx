import React, { useRef, useState } from 'react';
import { downloadBackup, importData, ExportData } from '../utils/storage';

interface ImportExportProps {
    onImportComplete: () => void;
}

const ImportExport: React.FC<ImportExportProps> = ({ onImportComplete }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleExport = () => {
        try {
            downloadBackup();
            setMessage({ type: 'success', text: '✅ Backup downloaded successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Failed to create backup' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string) as ExportData;
                const result = importData(data);

                if (result.success) {
                    setMessage({ type: 'success', text: '✅ Backup restored successfully!' });
                    setTimeout(() => {
                        setMessage(null);
                        onImportComplete();
                    }, 1500);
                } else {
                    setMessage({ type: 'error', text: `❌ ${result.error}` });
                    setTimeout(() => setMessage(null), 4000);
                }
            } catch (error) {
                setMessage({ type: 'error', text: '❌ Invalid backup file' });
                setTimeout(() => setMessage(null), 4000);
            }
        };
        reader.readAsText(file);

        // Reset input so the same file can be selected again
        event.target.value = '';
    };

    return (
        <div className="import-export-section">
            <h2>💾 Backup & Restore</h2>
            <p className="section-description">
                Export your data to create a backup file, or import a previously saved backup to restore your materials and recipes.
            </p>
            <div className="import-export-actions">
                <button onClick={handleExport} className="btn-export">
                    📥 Export Backup
                </button>
                <button onClick={handleImport} className="btn-import">
                    📤 Import Backup
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default ImportExport;
