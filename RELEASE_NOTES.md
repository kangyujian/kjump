# KJump v1.1.0 Release Notes

[English](#english) | [中文](#中文)

## English

### Overview

KJump v1.1.0 adds smart URL detection and quick link creation to make saving links faster and more consistent.

### Key features

#### Smart URL detection

- Real-time detection of URL-like input in the search bar
- Supports multiple formats: `example.com`, `www.example.com`, `https://example.com`
- Shows a clear create prompt when a URL is detected

#### Quick link creation

- Press `Enter` on a detected URL to start creating a link
- Opens a creation form for confirmation and edits
- Auto-fills the title from the URL host
- Allows editing title, URL, and tags before saving

#### UX improvements

- Better visual feedback for URL detection and creation state
- Auto-focuses the title field when the create dialog opens
- Cleaner state reset and synchronization after creation

### Implementation notes

- Enhanced `SearchBar` with URL validation and `Enter` handling
- Enhanced `CreateLinkForm` with preset values and auto-focus
- Updated `App` to streamline creation flow and state management

### Typical workflows

1. Paste a URL into the search bar
2. Press `Enter` to open the create dialog
3. Adjust title/URL/tags if needed
4. Click "Create" to save

### Downloads

Get the installers from GitHub Releases:

- `https://github.com/kangyujian/kjump/releases/tag/v1.1.0`

## 中文

### 版本概述

KJump v1.1.0 带来了智能 URL 检测和快速链接创建功能，用更少的步骤完成链接收藏。

### 主要功能

#### 智能 URL 检测

- 搜索栏实时识别用户输入的 URL 格式
- 支持多种 URL 格式：`example.com`、`www.example.com`、`https://example.com`
- 检测到 URL 时显示明确的创建提示

#### 快速链接创建

- 输入 URL 后按 `Enter` 触发创建
- 打开创建表单，支持确认与编辑
- 自动从 URL 提取主机名作为标题
- 支持修改标题、URL 和标签

#### 体验优化

- URL 检测与创建提示更清晰
- 弹窗打开时自动聚焦标题输入框
- 预设值清理与状态同步更完善

### 技术实现

- `SearchBar`：新增 URL 校验与回车监听
- `CreateLinkForm`：支持预设值与自动聚焦
- `App`：优化创建流程与状态管理

### 使用说明

1. 在搜索栏输入任意 URL（如 `github.com`）
2. 检测到 URL 后按 `Enter` 打开创建弹窗
3. 编辑标题、URL、标签（可选）
4. 点击「创建」保存链接

### 下载地址

请访问 GitHub Releases 下载：

- `https://github.com/kangyujian/kjump/releases/tag/v1.1.0`
