const fs = require('fs');
const path = require('path');

// 同步文件和文件夹到目标目录
function syncSelectedItems(items, targetDir) {
  // 创建目标文件夹（如果不存在）
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`已创建目标文件夹: ${targetDir}`);
  }

  // 遍历要同步的文件或文件夹
  items.forEach((item) => {
    const itemPath = path.resolve(item); // 获取绝对路径
    if (!fs.existsSync(itemPath)) {
      console.error(`错误: ${itemPath} 不存在，已跳过！`);
      return;
    }

    const targetPath = path.join(targetDir, path.basename(itemPath));

    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      // 如果是文件夹，递归复制
      copyFolderRecursive(itemPath, targetPath);
      console.log(`已同步文件夹: ${itemPath} -> ${targetPath}`);
    } else {
      // 如果是文件，直接复制
      fs.copyFileSync(itemPath, targetPath);
      console.log(`已同步文件: ${itemPath} -> ${targetPath}`);
    }
  });

  console.log('同步完成！');
}

// 递归复制文件夹
function copyFolderRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source);
  items.forEach((item) => {
    const sourceItemPath = path.join(source, item);
    const targetItemPath = path.join(target, item);
    const stats = fs.statSync(sourceItemPath);

    if (stats.isDirectory()) {
      copyFolderRecursive(sourceItemPath, targetItemPath);
    } else {
      fs.copyFileSync(sourceItemPath, targetItemPath);
    }
  });
}

// -------------------------------

// 从命令行参数获取目标路径
const targetDirectory = process.argv[2]; // 第 3 个命令行参数

if (!targetDirectory) {
  console.error('错误: 请提供目标文件夹路径作为参数！');
  process.exit(1);
}

// 配置: 要同步的文件/文件夹和目标路径
const itemsToSync = [
  './settings.yaml',            // 当前项目下的 settings.yaml 文件
  './theme.yaml',            // 当前项目下的 theme.yaml 文件
  './templates'           // 当前项目下的 templates 文件夹
];


// 开始同步
syncSelectedItems(itemsToSync, targetDirectory);
