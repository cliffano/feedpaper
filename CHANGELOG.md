# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Add release-* Makefile targets

### Changed
- Use keep-a-changelog for changelog format
- Replace Travis CI with GH Actions
- Upgrade Lambda runtime to nodejs16.x
- Upgrade Terraform AWS provider to 4.38.0
- Include lock files in clean target
- Auto-approve all TF actions

## 0.0.3

### Changed
- Rewrite server-side to use AWS Lambda and S3, and AE86
- Rewrite client-side to use App.js

## 0.0.2

### Added
- Add command line to start application
- Add logging support
- Add application containerisation support

## 0.0.1

### Added
* Initial version
