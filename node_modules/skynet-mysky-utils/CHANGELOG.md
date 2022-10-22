# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Types of changes:

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Removed` for now removed features.
- `Deprecated` for soon-to-be removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

## [0.3.1]

### Fixed

- Fixed `ensureUrl` to work well with http:// input.

## [0.3.0]

### Changed

- **[Breaking change]** Path functions return paths as lowercase.
- **[Breaking change]** Path functions return `null` for cases that were previously allowed.

### Removed

- **[Breaking change]** Removed deprecated 'CustomUserIDOptions'.

## [0.2.3]

### Added

- `removeAdjacentChars` function.

## [0.2.2]

### Added

- `CustomUserIDOptions` type.

## [0.2.0]

### Added

- Path helpers: `getPathDomain`, `getParentPath`, `sanitizePath`
- String helper: `trimSuffix`
- Permissions helpers: `permCategoryToString`, `permTypeToString`

### Removed

- Storage listener helpers

## [0.1.2]

### Fixed

- Fixed `createFullScreenIframe` and `monitorWindowError`

## [0.1.1]

### Added

- `CheckPermissionResponse` type

## [0.1.0]

### Added

- First release
