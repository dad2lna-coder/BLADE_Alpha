# Windows Folder Structure Mapper and File Organizer (DocuSort / WinFolderSync)
**Technical Architecture and Detailed Software Design Specification**

---

## 1. Executive Summary & Problem Definition

On modern Windows systems, users accumulate thousands of files scattered across desktop directories, downloads folders, external drives, and network shares. Finding, sorting, and consolidating these files into a clean, disciplined folder hierarchy manually is tedious and error-prone.

This specification outlines the architecture, data models, algorithm design, and user experience for a high-performance Windows desktop application designed to:
1. **Map an intended target folder structure** (interactively scan an existing taxonomy or design one via rules and templates).
2. **Scan and discover unorganized files** across drives and subdirectories.
3. **Classify, match, and propose reorganization actions** based on file content, file types, naming patterns, metadata, and retention policies.
4. **Enforce absolute user authority ("Final Say")**: No files are moved, renamed, or modified without explicit user review, inspection, and confirmation.
5. **Route disposable or ambiguous files to a dedicated "Junk" staging directory**.
6. **Preview file contents inline** (documents, text, code, images, audio, video, spreadsheets, and PDFs).
7. **Detect identical content across different dates** (content hash deduplication vs. timestamp variations).
8. **Apply custom date-range retention rules** (e.g., move files older than $N$ months/years, or route specific date windows into archival branches).
9. **Display and leverage file access timestamps** (specifically the "Last Opened / Last Accessed" date alongside creation and modification dates).

---

## 2. Platform Architecture & Tech Stack

The application is engineered natively for Windows 10 and Windows 11 (x64 and ARM64).

```
+---------------------------------------------------------------------------------+
|                       User Interface Layer (Desktop Shell)                     |
|  - Modern Web Frontend: Svelte / React with Fluent UI Windows Styling          |
|  - Virtualized Data Grids (handling 500,000+ scanned files smoothly)           |
|  - Rich File Preview Engine (Monaco Editor, PDF.js, Canvas Media, Sheets)       |
+---------------------------------------------------------------------------------+
                                       |
                       IPC Bridge (Tauri v2 / Rust Core)
                                       |
+---------------------------------------------------------------------------------+
|                         Core Engine (Rust Native Backend)                       |
|  +--------------------+  +--------------------+  +----------------------------+ |
|  | Structure Mapper   |  | Fast Disk Scanner  |  | Smart Classifier & Rules   | |
|  | - Directory Tree   |  | - walkdir / jwalk  |  | - Regex / Glob / Semantics | |
|  | - Node Constraints |  | - Windows USN / MFT|  | - Age / Retention Policy   | |
|  +--------------------+  +--------------------+  +----------------------------+ |
|  +--------------------+  +--------------------+  +----------------------------+ |
|  | Deduplication &    |  | NTFS Timestamp     |  | Safe Execution Engine      | |
|  | Content Compare    |  | & Access Tracker   |  | - Dry Run Simulation       | |
|  | - BLAKE3 / SHA-256 |  | - Win32 FileInfo   |  | - Atomic Moves & Cross-Vol | |
|  | - Byte-level diff  |  | - Shell MRU / LNK  |  | - SQLite Undo / Rollback   | |
|  +--------------------+  +--------------------+  +----------------------------+ |
+---------------------------------------------------------------------------------+
                                       |
                         Windows OS & Storage Layer
  - NTFS / ReFS / FAT32 / exFAT
  - Win32 API (`GetFileInformationByHandleEx`, `MoveFileExW`, Windows Recycle Bin)
```

### 2.1 Backend: Rust Core
- **Performance & Safety**: Low memory footprint, zero garbage collection pauses during multi-gigabyte disk traversals.
- **Tauri v2 Integration**: Native Windows windowing, system tray, native file dialogs, and hardware-accelerated WebView2 rendering.
- **Windows API (`windows-rs` / `winapi`)**: Direct access to Win32 file metadata, extended file attributes, and Volume Shadow Copies / USN Journals when elevated.

### 2.2 Frontend: Modern Virtualized Desktop UI
- **Framework**: Svelte or React (paired with Tailwind CSS / Fluent UI design tokens).
- **Virtualization**: TanStack Virtual or custom virtual scroller supporting up to 1,000,000 items in the queue with instantaneous scroll response.
- **Embedded Previewers**:
  - Documents & Office: PDF.js for `.pdf`, SheetJS for `.xlsx` / `.csv`, mammoth.js for `.docx`.
  - Media: Native HTML5 `<video>`, `<audio>`, and WebP/AVIF/JPEG/PNG rendering via custom file protocol (`asset://`).
  - Code & Text: Monaco Editor (read-only mode) with syntax highlighting and hex/binary fallback.

### 2.3 Embedded Storage & Session State
- **SQLite (bundled via `rusqlite`)**:
  - Persists mapped structure profiles, scan histories, rule sets, user decision queues, and audit logs.
  - Enables instant undo and rollback of any executed move operations.

---

## 3. Detailed Component & Feature Design

### 3.1 Target Folder Structure Mapping Engine

The user selects a root folder or creates a template that serves as the "Target Architecture."

#### 3.1.1 Structure Discovery & Representation
1. **Interactive Scanner**: The user clicks "Map Existing Directory" and chooses a folder (e.g., `D:\OrganizedData`). The mapper recursively reads the subfolder tree (e.g., `Finance/2023/Invoices`, `Legal/Contracts`, `Projects/ClientA`).
2. **Metadata & Rule Assignment per Node**:
   - Each target folder node in the tree can be annotated with rules:
     - **File types allowed / expected**: (e.g., `*.pdf; *.docx; *.xlsx`).
     - **Naming patterns**: (e.g., `Invoice_*.pdf`, `*Report*.*`).
     - **Semantic tags**: (e.g., "tax", "statement", "backup").
     - **Date rules**: (e.g., "Files with creation date between Jan 1, 2023 and Dec 31, 2023").
3. **Structure Templates**:
   - Ability to export and import structure profiles as JSON/YAML (e.g., "Personal Finance Hierarchy", "Software Project Archive", "Photo/Media by Year & Month").

```json
{
  "profile_name": "Personal & Business Records",
  "target_root": "D:\\TargetArchive",
  "junk_folder": "D:\\TargetArchive\\_JUNK_STAGING",
  "tree": [
    {
      "relative_path": "Taxes/2023",
      "matching_rules": {
        "patterns": ["*tax*", "*w2*", "*1099*"],
        "date_range": {
          "field": "modified_or_created",
          "start": "2023-01-01T00:00:00Z",
          "end": "2023-12-31T23:59:59Z"
        }
      }
    },
    {
      "relative_path": "Invoices",
      "matching_rules": {
        "extensions": [".pdf", ".xlsx"],
        "patterns": ["*inv*", "*receipt*"]
      }
    }
  ]
}
```

---

### 3.2 Search & Discovery Engine ("Find Files Elsewhere")

1. **Flexible Source Targets**:
   - The user selects one or more source locations to scan: `C:\Users\<User>\Downloads`, `C:\Users\<User>\Desktop`, external hard drives (`E:\`), or network drives.
   - Exclusion filters: System folders (`C:\Windows`, `Program Files`, `.git`, `node_modules`, `$Recycle.Bin`) are skipped by default.
2. **High-Speed Multithreaded Scanning**:
   - Uses Rust's parallel traversal (`jwalk` or Rayon-backed directory walk) to index 100,000 files in under 3 seconds on modern NVMe drives.
3. **Extraction of Comprehensive File Attributes**:
   - Path, filename, extension, file size (bytes).
   - Timestamp Triple + Access Tracker:
     - `CreatedTime` (File creation).
     - `LastWriteTime` (Last modified).
     - `LastAccessTime` (Last opened / accessed).
   - Fast partial hash (first 64 KB + last 64 KB) for rapid candidate duplicate clustering.

---

### 3.3 Smart Matching & Classification Pipeline

Every candidate file is evaluated through a multi-stage scoring pipeline:

```
[ Candidate File ]
       |
       v
1. Junk Filter ---------------------> Flag as Junk -> Propose Move to Junk Folder
       | (No)
       v
2. Duplicate / Version Checker -----> Match Existing Target -> Compare Hash & Dates
       | (No duplicate or version update)
       v
3. Date Range & Retention Check ----> Match Age Threshold -> Route to Archive / Purge
       | (Active date)
       v
4. Target Structure Rule Match -----> Compute Confidence Score (0% - 100%)
       |
       v
[ Staged Action in Proposal Queue: Target Path, Reason, Confidence, Preview ]
```

- **Confidence Score Formulation**:
  - Exact regex/glob match on folder rule: +50 points.
  - Extension match: +20 points.
  - Date within folder date window: +20 points.
  - Content keyword match: +10 points.
  - If score $\ge 70$, strong match; if $40-69$, probable match; if $< 40$, marked as unclassified or suggested for review.

---

### 3.4 User "Final Say" Staging & Approval Workflow

**Core Tenet: The system never moves or touches a file without explicit confirmation.**

1. **The Staging Grid (Action Proposal Board)**:
   - Displays all suggested actions in an interactive, virtualized table:
     - Checkbox: [X] Approve for Move.
     - Source Path: `C:\Users\John\Downloads\Invoice_March2023.pdf`
     - Proposed Destination: `D:\TargetArchive\Invoices\2023\Invoice_March2023.pdf`
     - Action Type: `MOVE`, `COPY`, `RENAME`, `ROUTE_TO_JUNK`, `SKIP`
     - Match Reason: `"Matches rule: *Invoice* + Date: Mar 2023"`
     - Dates: Created, Modified, Last Opened (`2024-02-15 14:30`)
     - Size: 1.4 MB
     - Status: `Pending`, `Approved`, `Rejected`, `Modified Destination`
2. **Batch Controls & Bulk Decisions**:
   - "Approve All High Confidence ($\ge 90\%$)", "Approve Selected", "Reject All", "Invert Selection".
   - Destination Override: Right-click or drag any item to re-assign it to any other target folder, or directly to "Junk".
3. **Dry-Run Mode & Impact Analysis**:
   - Before applying changes, user can run "Simulate / Dry Run":
     - Validates destination paths, checks for naming collisions, verifies available disk space on target drives.
4. **Execution & Rollback Log**:
   - Actions are executed sequentially or in parallel batches.
   - Every file movement is logged to an atomic SQLite transaction table.
   - An **"Undo Last Batch"** button allows complete reversal of operations if the user changes their mind.

---

### 3.5 "Junk" Folder Management & Quarantine Rules

The user explicitly requires the ability to place items into a designated "Junk" folder.

1. **Junk Designation**:
   - The user configures a dedicated Junk folder (e.g., `D:\TargetArchive\_Junk` or `C:\CleanUp_Junk`).
2. **One-Click Manual Routing**:
   - In the staging grid or the file previewer, pressing `Delete` or clicking the "Move to Junk" button immediately assigns the target destination to the Junk staging area.
3. **Automated Junk Heuristics (Proposals Only)**:
   - Zero-byte files (`size == 0`).
   - Broken shortcuts (`.lnk` files pointing to non-existent targets).
   - Temporary and cache files (`*.tmp`, `*.~*`, `Thumbs.db`, `.DS_Store`).
   - Old installers (`setup.exe`, `installer.msi` older than $N$ months).
   - Duplicate downloads (e.g., `Document (1).pdf`, `report (copy).docx` where original exists).
4. **Junk Quarantine Options**:
   - **Soft Junk (Staged Move)**: Moves files to the user's Junk folder for review before eventual deletion.
   - **Send to Windows Recycle Bin**: Option to move directly to Windows Recycle Bin using Win32 `SHFileOperationW` or `IFileOperation`, preserving OS-native restore capabilities.

---

### 3.6 In-App Content Previewer

Users need to inspect file contents before deciding whether to move, junk, or keep a file.

1. **Multi-Format Preview Panels**:
   - **Text & Code**: Plain text, Markdown, JSON, XML, CSV, Python, Rust, JavaScript, config files. Rendered with Monaco Editor with line numbers and syntax coloring.
   - **Office & Documents**:
     - PDFs: Rendered natively via PDF.js with page navigation, zoom, and text search.
     - Word (`.docx`): Extracted and rendered as formatted HTML.
     - Excel (`.xlsx`, `.xls`): Formatted spreadsheet grid showing sheets, rows, and columns.
   - **Images & Visuals**: JPEG, PNG, GIF, BMP, SVG, TIFF, WebP, ICO. Includes zoom, rotation, and EXIF metadata panel (camera model, capture date, resolution).
   - **Audio & Video**: MP4, WebM, MP3, WAV with lightweight playback controls.
   - **Binary / Unknown**: Hex viewer displaying byte offsets, hex representation, and ASCII interpretation.
2. **Split-Screen & Side-by-Side Comparison**:
   - When reviewing duplicate candidates or version conflicts, the UI opens a dual-pane viewer showing **Source File** on the left and **Target File** on the right, highlighting differences in size, dates, and contents.

---

### 3.7 Duplicate and Multi-Date Version Comparison Engine

A critical requirement is detecting whether two files are identical in content even if they possess different dates, or conversely, if they are different revisions of the same document.

#### 3.7.1 Comparison Pipeline
1. **Tier 1 - Size Match Filter**: Files of different byte lengths cannot be byte-for-byte identical.
2. **Tier 2 - Sparse Chunk Hashing (Fast Pre-check)**:
   - Hashes first 4KB, middle 4KB, and last 4KB with BLAKE3. If sparse hashes differ, files are distinct.
3. **Tier 3 - Full Content Hashing**:
   - Full BLAKE3 / SHA-256 hash computed using memory-mapped I/O (`memmap2` crate in Rust) for multi-gigabyte throughput.
4. **Classification Scenarios**:
   - **Exact Content Match, Different Dates**:
     - *Scenario*: File in Downloads has modified date `2024-01-10`; file in Target Archive has modified date `2022-05-14`, but hashes match 100%.
     - *Proposal*: Flag as "Duplicate Copy". Offer choices:
       - Keep existing target version and junk the new copy.
       - Update existing target version's timestamps.
       - Replace target with newest copy.
   - **Same Name & Path, Different Content & Different Dates (Revisions)**:
     - *Scenario*: `Budget_2024.xlsx` exists in both places, but hashes differ.
     - *Proposal*: Offer Side-by-Side Diff, Auto-versioning (e.g., `Budget_2024_v20240110.xlsx`), or Replace after user confirmation.
   - **Fuzzy / Near-Duplicate Detection (Images & Text)**:
     - Perceptual hashing (pHash) for images (identifies resized or re-compressed photos).
     - Levenshtein or MinHash for text documents.

---

### 3.8 Retention Policies & Date-Range Rule Engine

Some items can be categorized or moved purely based on age or specific historical intervals.

#### 3.8.1 Configurable Retention Rules
- **Age-Based Thresholds**:
  - "Move all files with `LastWriteTime` > 3 years old to `D:\Archive\LongTerm`."
  - "Move all downloads not opened in the last 6 months to `Junk`."
- **Date Range Bucketing (Year / Quarter / Month Routing)**:
  - Automatically create target subfolders based on file dates:
    - Example template: `D:\Archive\{YYYY}\{MM}-{MonthName}\`
    - A file modified on `2021-08-15` is automatically routed to `D:\Archive\2021\08-August\`.
- **Date Source Selection**:
  - The rule engine allows specifying which date field determines retention:
    - `Creation Date` (when file was originally recorded/created).
    - `Last Modified Date` (when content was last altered).
    - `Last Opened / Accessed Date` (when user last interacted with it).

---

### 3.9 "Last Opened / Last Accessed" Tracking on Windows

The user specifically requested the ability to see the last time the item was opened.

#### 3.9.1 Windows NTFS `LastAccessTime` Deep Dive
1. **NTFS Behavior & Caveats**:
   - By default in Windows 10 & 11, NTFS access timestamps can be throttled or disabled via system registry settings (`NtfsDisableLastAccessUpdate` in `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`) to improve SSD I/O performance.
   - When enabled or partially enabled, NTFS updates `LastAccessTime` when a file is opened, read, or executed.
2. **Multi-Source Access Time Resolver**:
   To provide the most accurate "Last Opened" date on Windows, the program employs a 3-layer resolver:
   - **Layer 1: Win32 File Attribute Inspection**:
     - Calls `GetFileInformationByHandleEx` with `FileBasicInfo` to extract `FILE_BASIC_INFO.LastAccessTime`.
   - **Layer 2: Windows Shell Recent Documents (MRU Parsing)**:
     - Reads `%APPDATA%\Microsoft\Windows\Recent\` (parsing `.lnk` shortcut files) and `AutomaticDestinations-ms` Jump Lists.
     - Correlates file paths with shell recent records to find the exact human timestamp when the user clicked or opened the file in Windows Explorer or associated applications.
   - **Layer 3: Windows Search Index & USN Journal Query**:
     - Optional lookup against the Windows Indexer (`OleDB` query to `SystemIndex`) which stores `System.DateAccessed`.
3. **UI Presentation**:
   - The UI displays a dedicated column: **"Last Opened"** with relative and absolute timestamps (e.g., `Yesterday at 4:12 PM (2024-03-24 16:12)`).
   - If `LastAccessTime` matches `CreationTime` and no MRU record exists, it is marked with an indicator: `Never opened since download/creation`.

---

## 4. User Interface & Interaction Flow

### 4.1 Step-by-Step User Journey

```
+-----------------------------------------------------------------------------------------+
| [1] MAP TARGET STRUCTURE    [2] SCAN SOURCES    [3] REVIEW & DECIDE    [4] EXECUTE/UNDO |
+-----------------------------------------------------------------------------------------+
```

1. **Step 1: Map Target Structure**:
   - User picks root directory (e.g. `D:\MyOrganizedFiles`).
   - App renders interactive tree view of folders.
   - User clicks any folder to set matching rules, date ranges, or tags.
   - User sets the dedicated `Junk Folder` path.
2. **Step 2: Scan Sources**:
   - User checks source paths (`C:\Downloads`, `C:\Desktop`, `E:\OldDisk`).
   - Clicks **"Start Scan"**.
   - Live progress indicator displays scan rate (e.g., `35,000 files scanned... 142 duplicates found...`).
3. **Step 3: Review & Final Say (The Command Center)**:
   - Tab 1: **Matched Proposals** (files mapped to target folders with confidence score).
   - Tab 2: **Duplicates & Conflicts** (files identical in content or matching names with different dates; side-by-side diff).
   - Tab 3: **Junk Proposals** (files flagged for Junk based on age, broken state, or temp extensions).
   - Tab 4: **Age / Retention Batches** (files grouped by age rules).
   - User reviews, toggles checkboxes, changes destinations, previews contents.
4. **Step 4: Execute & Verification**:
   - User clicks **"Execute Approved Moves (482 files)"**.
   - Modal shows: `Move 350 files to Target Structure`, `Move 132 files to Junk Folder`.
   - Progress bar with cancel/pause capability.
   - Success summary with one-click **"Undo Everything"** option.

---

## 5. File System Safety, Atomicity, and Windows Specifics

1. **Cross-Volume Safety (`MoveFileExW`)**:
   - On the same volume (e.g., `C:` to `C:`), file moves are instant pointer renames (`MOVEFILE_COPY_ALLOWED | MOVEFILE_WRITE_THROUGH`).
   - Across different volumes (e.g., `C:` to `D:`), the engine implements a **Copy-Verify-Delete** pattern:
     1. Copy source stream to target temporary filename (`target.tmp`).
     2. Validate SHA-256 hash of target against source.
     3. Rename `target.tmp` to final destination name.
     4. Delete source file only after hash validation succeeds.
2. **Collision Prevention Policies**:
   - If target file already exists and content is different:
     - User selectable default: Prompt, Auto-rename (`filename (2).ext`), or Version Tag (`filename_2024-03-24.ext`).
3. **Locked File Detection**:
   - Uses `CreateFileW` with `FILE_SHARE_READ` to test if files are open by another process (e.g., Word, Excel).
   - Flags locked files in UI with "File in use by process: [ProcessName]" without aborting the entire batch.
4. **Long Path Support**:
   - Windows 260-character path limit (`MAX_PATH`) is bypassed using Unicode extended-length prefixes (`\\?\D:\very\long\path...`).

---

## 6. Implementation Roadmap & Technical Milestones

- **Phase 1: Core Engine & Data Layer**
  - Implement Rust filesystem scanner (`walkdir`/`jwalk`), metadata reader (`GetFileInformationByHandleEx`), and BLAKE3 hasher.
  - Implement SQLite state database for session tracking, rule persistence, and undo logging.
- **Phase 2: Target Mapping & Matching Engine**
  - Folder tree parser, JSON template exporter/importer.
  - Multi-condition rule evaluator (glob, extension, regex, date range, retention brackets).
- **Phase 3: Windows Shell & Last Accessed Integration**
  - Win32 file access time extractor + Windows Shell Recent (`.lnk`) MRU parser.
- **Phase 4: Frontend UI & Preview Panel**
  - Virtualized table grid, folder tree navigator, filter and sorting controls.
  - Monaco code/text viewer, PDF.js document viewer, media viewer, binary hex viewer.
  - Side-by-side comparison modal for duplicate and multi-date version diffing.
- **Phase 5: Execution Engine, Junk Handling & Rollback**
  - Safe transaction-based file mover with cross-volume checksum verification.
  - One-click undo / reversal manager.
  - Junk staging folder manager & optional Recycle Bin integration.

---

## 7. Conclusion

This design meets every user requirement directly:
- **Windows-native design**: Leverages Win32 APIs, NTFS timestamps, Shell MRU, and Tauri/WebView2.
- **Folder structure mapping**: Ingests user-defined structures or scans existing hierarchies to create matching templates.
- **Discovery**: Fast multi-threaded search across any drive.
- **User Final Say**: Comprehensive staging queue with dry-run, approval toggles, and undo.
- **Junk staging**: Dedicated Junk folder routing with smart quarantine heuristics.
- **In-app preview**: Multi-format document, code, media, and hex previewers.
- **Duplicate & Date comparison**: BLAKE3 hashing to verify identical content across differing dates.
- **Retention & Date ranges**: Flexible time-window and age-based routing.
- **Last Opened tracking**: Multi-source resolution combining NTFS access times and Windows Recent MRU data.
