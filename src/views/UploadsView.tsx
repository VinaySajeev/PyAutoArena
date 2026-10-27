import React, { useState } from 'react';
import { UploadedFileRecord } from '../types';
import { Inspectable } from '../components/Inspectable';
import {
  Upload,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Table,
} from 'lucide-react';

export const UploadsView: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileRecord[]>([
    {
      id: 'doc-pre-01',
      name: 'selenium_test_suite_results.csv',
      size: 42100,
      type: 'text/csv',
      uploadedAt: '2026-10-27 10:15',
      parsedRowCount: 120,
      dataSummary: '120 Automated test cases (118 Passed, 2 Failed)',
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  // File change handler (works with native file inputs for Selenium/Playwright)
  const handleFileSelection = (file: File) => {
    // 5MB limit check
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB maximum limit.');
      return;
    }

    setUploadProgress(10);
    setUploadStatus(`Uploading ${file.name}...`);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 95) {
          clearInterval(interval);
          finalizeUpload(file);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const finalizeUpload = (file: File) => {
    setTimeout(() => {
      let rowCount: number | undefined;
      let summary = `${(file.size / 1024).toFixed(1)} KB`;

      if (file.name.endsWith('.csv')) {
        rowCount = Math.floor(Math.random() * 80) + 20;
        summary = `Parsed CSV: ${rowCount} test records identified`;
      } else if (file.type.startsWith('image/')) {
        summary = `Image verified (${file.type})`;
      }

      const newRecord: UploadedFileRecord = {
        id: `upl-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        parsedRowCount: rowCount,
        dataSummary: summary,
      };

      setUploadedFiles((prev) => [newRecord, ...prev]);
      setUploadProgress(null);
      setUploadStatus(`Uploaded & processed ${file.name} successfully!`);
    }, 300);
  };

  const handleNativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const deleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Test Download Generators
  const triggerDownloadReport = () => {
    const csvContent =
      'TestID,TestName,Framework,DurationSeconds,Status\n' +
      'TC-001,test_valid_login,Playwright,1.24,PASSED\n' +
      'TC-002,test_locked_user,Playwright,0.85,PASSED\n' +
      'TC-003,test_crud_create,Selenium,2.41,PASSED\n' +
      'TC-004,test_stale_element,Selenium,3.10,PASSED\n' +
      'TC-005,test_shadow_dom,Playwright,1.05,PASSED\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'automation_run_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerDownloadJSON = () => {
    const jsonData = {
      testRunId: 'RUN-9921',
      environment: 'Staging-v2.4',
      timestamp: new Date().toISOString(),
      totalExecuted: 15,
      passed: 15,
      failed: 0,
      frameworks: ['Selenium-4.18', 'Playwright-1.42'],
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'test_audit_manifest.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          File Uploads, Document Processing &amp; Downloads
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Automate file uploads without OS dialogs via <code className="font-mono text-emerald-400">send_keys()</code> in Selenium or <code className="font-mono text-emerald-400">set_input_files()</code> in Playwright, and intercept downloads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload Target & Dragzone */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              Upload Files for Test Verification
            </h2>

            {/* Native Input & Drag Drop Area */}
            <Inspectable
              strategy={{
                elementLabel: 'Native File Input',
                id: 'file-upload',
                testId: 'native-file-upload',
                css: '#file-upload',
                xpath: "//input[@id='file-upload']",
                playwrightRecommended: `page.get_by_test_id("native-file-upload").set_input_files("sample_test.csv")`,
                seleniumRecommended: `driver.find_element(By.ID, "file-upload").send_keys("/abs/path/sample_test.csv")`,
                note: 'Always provide an absolute file path when automating file inputs.'
              }}
            >
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                data-testid="upload-dropzone"
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Click to choose a file
                    </label>
                    <span className="text-xs text-slate-400"> or drag and drop here</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Supported: CSV, JSON, PNG, JPG, PDF (Max 5MB)
                  </p>

                  {/* The standard native HTML file input */}
                  <input
                    type="file"
                    id="file-upload"
                    data-testid="native-file-upload"
                    onChange={handleNativeInputChange}
                    className="sr-only"
                    accept=".csv,.json,.png,.jpg,.jpeg,.pdf,.txt"
                  />
                </div>
              </div>
            </Inspectable>

            {/* Progress Bar Simulation */}
            {uploadProgress !== null && (
              <div className="space-y-1.5 p-3 bg-slate-950 rounded-lg border border-slate-800" data-testid="upload-progress-container">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>{uploadStatus}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Notification Message */}
            {uploadStatus && uploadProgress === null && (
              <div
                id="upload-status-banner"
                data-testid="upload-status-text"
                role="status"
                className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* List of Uploaded Files */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Uploaded Document Records ({uploadedFiles.length})
            </h3>

            {uploadedFiles.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No files uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    id={`file-item-${file.id}`}
                    data-testid="upload-result-card"
                    className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {file.name.endsWith('.csv') ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-200 font-mono">{file.name}</div>
                        <div className="text-[11px] text-slate-400">{file.dataSummary} · {file.uploadedAt}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteFile(file.id)}
                      data-testid={`delete-file-${file.id}`}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Automated Download Interception Lab */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" />
              Download Automation Interception Lab
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify how your test framework intercepts browser file downloads, reads contents, or sets download paths.
            </p>

            <div className="space-y-3 pt-2">
              <Inspectable
                strategy={{
                  elementLabel: 'Download CSV Report Button',
                  id: 'btn-download-csv',
                  testId: 'download-csv-btn',
                  css: '#btn-download-csv',
                  xpath: "//button[@id='btn-download-csv']",
                  playwrightRecommended: `with page.expect_download() as d_info:\n    page.get_by_test_id("download-csv-btn").click()\ndownload = d_info.value\ndownload.save_as("report.csv")`,
                  seleniumRecommended: `# Configure Chrome Options download.default_directory\ndriver.find_element(By.ID, "btn-download-csv").click()`,
                  note: 'Playwright handles downloads cleanly with expect_download context manager.'
                }}
              >
                <button
                  type="button"
                  id="btn-download-csv"
                  data-testid="download-csv-btn"
                  onClick={triggerDownloadReport}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Test Report (CSV)</span>
                </button>
              </Inspectable>

              <Inspectable
                strategy={{
                  elementLabel: 'Download Audit JSON Button',
                  id: 'btn-download-json',
                  testId: 'download-json-btn',
                  css: '#btn-download-json',
                  xpath: "//button[@id='btn-download-json']",
                  playwrightRecommended: `with page.expect_download() as d_info:\n    page.get_by_test_id("download-json-btn").click()\npath = d_info.value.path()`,
                  seleniumRecommended: `driver.find_element(By.ID, "btn-download-json").click()`,
                  note: 'Intercepts JSON manifest file download.'
                }}
              >
                <button
                  type="button"
                  id="btn-download-json"
                  data-testid="download-json-btn"
                  onClick={triggerDownloadJSON}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download Audit Manifest (JSON)</span>
                </button>
              </Inspectable>
            </div>

            {/* Document Inspection / Table Extraction Preview */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Sample Test Specification Document (Extractable)
              </span>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="text-emerald-400 font-semibold">// SPEC-DOC-2026.TXT</div>
                <div>PROJECT: PyAutoArena Core</div>
                <div>AUTHOR: Lead SDET Team</div>
                <div>COVERAGE_TARGET: &gt;= 95%</div>
                <div>CONCURRENCY: 4 Workers (pytest -n 4)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
