# lins-compose

一个简单的 lints 组合工具：

- eslint(typescript)
- prettier
- stylelint
- commentlint
- commentizen
- lint-staged
- editorconfig

## 命令

- create 安装以上工具以及初始化配置文件
- reset 移除以上配置和配置文件

## 使用 pnpm 管理

目前 pnpm 包关联工具下使用

```sh
git clone

npm link # 本地使用

pnpm lints-compose create # 创建 link 配置文件 + 安装 npm 包
pnpm lints-compose reset # 移除配置文件
```
